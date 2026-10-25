import {readFileSync, writeFileSync} from "node:fs"
import {pathToFileURL} from "node:url"

export function patchHabits(source) {
  const original = ".flatMap(({payload}) => payload.commits)"
  const fixed = ".flatMap(({payload}) => payload?.commits ?? []).filter(Boolean)"
  if (source.split(original).length !== 2)
    throw new Error("Metrics Habits source changed; review the compatibility patch")
  return source.replace(original, fixed)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2]
  writeFileSync(path, patchHabits(readFileSync(path, "utf8")))
  console.log("Applied GitHub PushEvent compatibility patch to Metrics Habits")
}
