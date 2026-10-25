import assert from "node:assert/strict"
import {readFileSync} from "node:fs"
import {join} from "node:path"
import {pathToFileURL} from "node:url"
import test from "node:test"
import {patchActivity, patchAchievements} from "./patch-plugins.mjs"

const root = process.env.METRICS_SOURCE_ROOT ?? "/metrics"
const source = path => readFileSync(join(root, "source/plugins", path), "utf8")
const load = async text => (await import(`data:text/javascript,${encodeURIComponent(text)}`)).default
const activitySource = source("activity/index.mjs")
const activity = await load(patchActivity(activitySource))
const querySource = source("achievements/queries/achievements.graphql")
const query = patchAchievements(querySource)
const usersPath = pathToFileURL(join(root, "source/plugins/achievements/list/users.mjs")).href
const achievements = await load(source("achievements/index.mjs").replace(
  'import * as compute from "./list/index.mjs"',
  `import user from ${JSON.stringify(usersPath)}; const compute = {user}`,
))

const event = (type, payload) => ({
  type, payload, actor: {login: "owner"}, repo: {name: "owner/site"},
  created_at: "2026-10-25T10:00:00Z", public: true,
})
const push = commits => event("PushEvent", {ref: "refs/heads/main", commits})
const issue = event("IssuesEvent", {action: "opened", issue: {
  user: {login: "owner"}, title: "A real issue", number: 12, body: "Issue body",
}})

async function runActivity(events, filter = ["issue"], plugin = activity) {
  return plugin({
    login: "owner", q: {activity: true}, account: "user",
    data: {shared: {"repositories.skipped": [], "users.ignored": []}},
    rest: {activity: {listEventsForAuthenticatedUser: async () => ({data: events})}},
    imports: {
      metadata: {plugins: {activity: {
        enabled: () => true,
        inputs: () => ({limit: 5, load: 100, days: 0, filter,
          visibility: "public", timestamps: true, skipped: [], ignored: []}),
      }}},
      filters: {repo: () => true, text: () => true},
      markdown: async text => text, format: {error: error => error},
    },
  })
}

test("reproduce Activity failure before the patch", async () => {
  await assert.rejects(runActivity([push(undefined), issue], ["issue"],
    await load(activitySource)), TypeError)
})

test("missing or null push commits do not hide configured activity", async () => {
  const result = await runActivity([push(undefined), push(null), issue])
  assert.equal(result.events.length, 1)
  assert.equal(result.events[0].title, "A real issue")
  assert.equal(result.events[0].type, "issue")
})

test("legacy push events still retain real commit messages", async () => {
  const result = await runActivity([push([{
    author: {email: "owner@example.com"}, sha: "1234567890", message: "Real commit",
  }])], ["all"])
  assert.deepEqual(result.events[0].commits, [{sha: "1234567", message: "Real commit"}])
})

test("empty activity remains a valid empty result", async () => {
  assert.deepEqual((await runActivity([])).events, [])
})

async function runAchievements(projectQuery) {
  const connection = (count = 0) => ({totalCount: count, nodes: []})
  const user = Object.fromEntries([
    "forks", "pullRequests", "packages", "gists", "organizations", "starredRepositories",
    "following", "followers", "sponsorshipsAsSponsor", "discussionsStarted",
    "discussionsComments", "discussionAnswers",
  ].map(key => [key, connection()]))
  Object.assign(user, {
    repositories: connection(2), projects: connection(3), popular: {nodes: []},
    contributionsCollection: {pullRequestReviewContributions: connection()},
  })
  const achievementsQuery = Object.assign(() => projectQuery, {
    total: () => "total", ranking: () => "ranking", metrics: () => "metrics", octocat: () => "octocat",
  })
  return achievements({
    login: "owner", q: {achievements: true}, account: "user",
    data: {user: {repositories: {nodes: [{forkCount: 0, languages: {edges: [
      {node: {name: "Python"}}, {node: {name: "Java"}},
    ]}}]}}},
    computed: {registered: {years: 6}, repositories: {deployments: 1}},
    queries: {achievements: achievementsQuery},
    graphql: async text => {
      if (text === "total") return {users: {count: 100}, repositories: {count: 100}}
      if (text === "ranking") return {
        created_rank: {userCount: 5}, user_rank: {userCount: 5},
        repo_rank: {repositoryCount: 5}, forks_rank: {repositoryCount: 5},
      }
      if (text === "metrics") return {repository: {viewerHasStarred: false}, viewer: {login: "owner"}}
      if (text === "octocat") return {user: {viewerIsFollowing: false}, viewer: {login: "owner"}}
      if (/\bprojects\s*\(/.test(text)) throw new Error("Projects (classic) is no longer supported")
      assert.match(text, /projects: projectsV2\(/)
      return {user}
    },
    rest: {packages: {listPackagesForUser: async () => ({data: []})}},
    imports: {
      metadata: {plugins: {achievements: {
        enabled: () => true,
        inputs: () => ({threshold: "X", secrets: false,
          only: ["developer", "manager", "polyglot"], ignored: [], limit: 0, display: "compact"}),
      }}},
      puppeteer: {launch: async () => { throw new Error("Browser fallback not available") }},
      axios: {get: async () => ({data: "This user hasn't uploaded any GPG keys; doesn’t have any starred topics yet"})},
      filters: {text: () => true}, s: count => count === 1 ? "" : "s",
      format: {error: error => error, date: date => new Date(date).toISOString()},
    },
  })
}

test("reproduce Achievements failure on removed Projects Classic field", async () => {
  await assert.rejects(runAchievements(querySource), /Projects \(classic\)/)
})

test("Projects V2 alias preserves native achievement counts and rendering data", async () => {
  const result = await runAchievements(query)
  assert.equal(result.display, "compact")
  const counts = Object.fromEntries(result.list.map(({title, value}) => [title, value]))
  assert.deepEqual(counts, {Manager: 3, Developer: 2, Polyglot: 2})
  assert.ok(result.list.every(({icon}) => icon.includes("<g") && !icon.includes("#primary")))
})

test("unexpected upstream changes require patch review", () => {
  for (const patch of [patchActivity, patchAchievements])
    assert.throws(() => patch("unrelated source"), /source changed/)
})
