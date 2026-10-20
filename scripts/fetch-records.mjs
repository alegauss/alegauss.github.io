// Reads every governed product's roadkeep files into src/generated/records.json (AG8, AG9).
//
// Each product's ledger and roadmap are read from its PUBLIC repository at a resolved
// commit, never from a sibling checkout on someone's disk: a build that read local files
// would publish whatever happened to be checked out, uncommitted edits included.
//
//   node scripts/fetch-records.mjs
//
// Per product: a bare clone (cached under .cache/repos), the ref from src/data/projects.ts
// resolved to a commit, the governed Markdown exported at that commit, and roadkeep — the
// tool that wrote those files — asked to parse them, so this script holds no copy of the
// grammar. A ledger entry carries no date, so each one is dated by the commit that first
// wrote its id into the ledger: one `git log -p` over the file, not one lookup per entry.
//
// Needs git and roadkeep on PATH. The output is stamped with commits, not with the clock,
// so a rebuild against the same commits writes the same bytes.

import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { PROJECTS } from "../src/data/projects.ts"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const CACHE = join(REPO, ".cache", "repos")
const OUT = join(REPO, "src", "generated", "records.json")

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, ...opts })

/** roadkeep's JSON answer. A refusal (exit 1) still answers in JSON, naming why. */
function roadkeep(dir, args) {
  try {
    return JSON.parse(run("roadkeep", ["-C", dir, ...args, "--json"]))
  } catch (err) {
    if (err.status === 1 && err.stdout?.trim().startsWith("{")) return JSON.parse(err.stdout)
    throw err
  }
}

/** `[reads] list` bounds an answer an agent's transport has to carry; a build reading the
 *  ledger whole carries it to disk, so the exported copy (never the repository) lifts it. */
function unbudget(toml) {
  const BIG = "list = 1000000000"
  let text = readFileSync(toml, "utf8")
  if (/^\[reads\]\s*$/m.test(text)) {
    const at = text.search(/^\[reads\]\s*$/m)
    const next = text.slice(at + 1).search(/^\[/m)
    const end = next === -1 ? text.length : at + 1 + next
    const table = text.slice(at, end)
    const patched = /^list\s*=.*$/m.test(table) ? table.replace(/^list\s*=.*$/m, BIG) : table.replace(/^\[reads\]\s*$/m, `[reads]\n${BIG}`)
    text = text.slice(0, at) + patched + text.slice(end)
  } else {
    text += `\n[reads]\n${BIG}\n`
  }
  writeFileSync(toml, text)
}

/** Every line of one governed file. roadkeep refuses a listing over its read budget and
 *  names the blocks it would answer one at a time, so a large ledger is read per block. */
function listAll(dir, args) {
  const whole = roadkeep(dir, ["list", ...args])
  if (whole.tasks) return whole.tasks
  return whole.over.blocks.flatMap((b) => {
    const part = roadkeep(dir, ["list", ...args, "--block", b.label])
    if (!part.tasks) throw new Error(`${dir}: block ${b.label} is over roadkeep's read budget on its own`)
    return part.tasks
  })
}

function mirror(repo) {
  const dir = join(CACHE, `${repo}.git`)
  const url = `https://github.com/alegauss/${repo}.git`
  if (existsSync(dir)) run("git", ["--git-dir", dir, "fetch", "--quiet", "--prune", url, "+refs/heads/*:refs/heads/*", "+HEAD:refs/remotes/origin/HEAD"])
  else run("git", ["clone", "--quiet", "--bare", url, dir])
  return dir
}

/** The commit that first wrote each id into the ledger, oldest first. */
function shipDates(gitDir, sha, file) {
  const log = run("git", ["--git-dir", gitDir, "log", "--reverse", "--no-renames", "--format=@@C %H %cs", "-p", "--unified=0", sha, "--", file])
  const seen = new Map()
  let commit = null
  for (const line of log.split("\n")) {
    if (line.startsWith("@@C ")) {
      const [, hash, date] = line.split(" ")
      commit = { hash, date }
    } else if (commit && line.startsWith("+") && !line.startsWith("+++")) {
      for (const m of line.matchAll(/\*\*([A-Z]+[0-9]+[a-z]?)\*\*/g)) {
        if (!seen.has(m[1])) seen.set(m[1], commit)
      }
    }
  }
  return seen
}

const products = {}
mkdirSync(CACHE, { recursive: true })

for (const p of PROJECTS) {
  const { repo, ref } = p.source
  const gitDir = mirror(repo)
  const sha = run("git", ["--git-dir", gitDir, "rev-parse", `${ref}^{commit}`]).trim()

  const work = mkdtempSync(join(tmpdir(), `records-${repo}-`))
  try {
    const tar = run("git", ["--git-dir", gitDir, "archive", "--format=tar", sha, "--", "roadkeep.toml", ":(glob)**/*.md"], { encoding: "buffer" })
    run("tar", ["-x", "-C", work], { input: tar })
    unbudget(join(work, "roadkeep.toml"))

    const config = roadkeep(work, ["config"])
    const ledgerFile = config.files.changelog
    const roadmapFile = config.files.roadmap
    const dates = shipDates(gitDir, sha, ledgerFile)

    const ledger = listAll(work, ["--role", "changelog"])
      .filter((t) => t.status === "✅")
      .map((t) => {
        const c = dates.get(t.id)
        return { id: t.id, block: t.block, symptom: t.symptom, why: t.why, commit: c?.hash ?? null, date: c?.date ?? null }
      })

    const open = listAll(work, [])
    const blocks = roadkeep(work, ["block", "list"]).blocks
      .filter((b) => b.state === "live")
      .map((b) => ({
        label: b.block,
        title: b.title,
        open: open.filter((t) => t.block === b.block).map((t) => ({ id: t.id, status: t.status, symptom: t.symptom || t.why })),
      }))

    products[p.id] = { repo, ref, sha, ledgerFile, roadmapFile, ledger, blocks }
    console.log(`records: ${p.id.padEnd(24)} ${sha.slice(0, 7)}  ${ledger.length} shipped, ${blocks.reduce((n, b) => n + b.open.length, 0)} open`)
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify({ products }, null, 1) + "\n")
