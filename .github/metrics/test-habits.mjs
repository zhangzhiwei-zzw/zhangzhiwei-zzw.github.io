import assert from "node:assert/strict"
import {readFileSync} from "node:fs"
import test from "node:test"
import {patchHabits} from "./patch-habits.mjs"

// Run Metrics' own plugin with API fixtures, including the current payload shape.
const path = process.env.METRICS_HABITS_SOURCE ?? "/metrics/source/plugins/habits/index.mjs"
const source = readFileSync(path, "utf8")
const patched = patchHabits(source).replace(
  /^import .*recent_analyzer.*$/m,
  'const recent_analyzer = () => { throw new Error("Unexpected language analysis") }',
)
const {default: habits} = await import(`data:text/javascript,${encodeURIComponent(patched)}`)

async function run(payloads) {
  const events = payloads.map((payload, index) => ({
    type: "PushEvent", actor: {login: "owner"}, repo: {name: "owner/site"},
    created_at: new Date(Date.now() - (index + 1) * 60000).toISOString(), payload,
  }))
  const requested = []
  const plugin = {
    enabled: () => true,
    inputs: () => ({from: 100, days: 14, facts: false, charts: true,
      "charts.type": "classic", "languages.threshold": "0%"}),
    extras: () => true,
  }
  const result = await habits({
    login: "owner", account: "user", q: {habits: true},
    data: {config: {timezone: {offset: 0}},
      shared: {"repositories.skipped": [], "commits.authoring": ["owner"]}},
    rest: {
      activity: {listEventsForAuthenticatedUser: async () => ({data: events})},
      request: async commit => { requested.push(commit); return {data: {files: []}} },
    },
    imports: {metadata: {plugins: {habits: plugin}}, filters: {repo: () => true},
      paths: {}, format: {error: error => error}},
  })
  return {result, requested}
}

test("current PushEvents without commits still produce hour and weekday charts", async () => {
  const {result, requested} = await run([{head: "abc", ref: "refs/heads/main"}, {}])
  assert.equal(result.commits.fetched, 2)
  const total = values => Object.entries(values)
    .filter(([key]) => key !== "max").reduce((sum, [, count]) => sum + count, 0)
  assert.equal(total(result.commits.hours), 2)
  assert.equal(total(result.commits.days), 2)
  assert.equal(result.linguist.available, false)
  assert.deepEqual(requested, [])
})

test("legacy events still load commits and tolerate null entries", async () => {
  const commit = {author: {name: "owner"}, url: "https://api.github.com/repos/owner/site/commits/abc"}
  const {requested} = await run([{commits: [null, commit]}])
  assert.deepEqual(requested, [commit])
})

test("empty activity does not throw", async () => {
  const {result} = await run([])
  assert.equal(result.commits.fetched, 0)
})

test("unexpected upstream changes require explicit patch review", () => {
  assert.throws(() => patchHabits("unrelated source"), /source changed/)
})
