import {readFileSync, writeFileSync} from "node:fs"
import {join} from "node:path"
import {pathToFileURL} from "node:url"
import {patchHabits} from "./patch-habits.mjs"

function replaceOnce(source, original, fixed, plugin) {
  if (source.split(original).length !== 2)
    throw new Error(`Metrics ${plugin} source changed; review the compatibility patch`)
  return source.replace(original, fixed)
}

export function patchActivity(source) {
  return replaceOnce(source,
    "commits = commits.filter(",
    "commits = (commits ?? []).filter(",
    "Activity",
  )
}

export function patchAchievements(source) {
  // Preserve the response key consumed by Metrics' existing Manager achievement.
  return replaceOnce(source,
    "projects(first: 1, orderBy: {field: CREATED_AT, direction: ASC})",
    "projects: projectsV2(first: 1, orderBy: {field: CREATED_AT, direction: ASC})",
    "Achievements",
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2]
  for (const [path, patch] of [
    ["habits/index.mjs", patchHabits],
    ["activity/index.mjs", patchActivity],
    ["achievements/queries/achievements.graphql", patchAchievements],
  ]) {
    const target = join(root, "source/plugins", path)
    writeFileSync(target, patch(readFileSync(target, "utf8")))
    console.log(`Applied GitHub API compatibility patch to Metrics ${path}`)
  }
}
