// Reads each product's public numbers into src/generated/numbers.json (AG10).
//
//   node scripts/fetch-numbers.mjs
//
// Stars, the latest release and its asset downloads from the GitHub REST API, and the
// last month's downloads from pypistats.org where the product is a PyPI package. Only
// endpoints anyone can call: the private traffic visibility collects (views, clones,
// GA4, Search Console) is never requested, so the site cannot publish one by accident.
//
// GITHUB_TOKEN, when set (the Actions token is), raises the rate limit and nothing else.
// A number that cannot be read is left out of the page, not shown as zero: a failed
// request is no evidence that nobody starred the project. `asOf` is the day of the read.

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { PROJECTS } from "../src/data/projects.ts"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(REPO, "src", "generated", "numbers.json")

const headers = { accept: "application/vnd.github+json", "user-agent": "alegauss-hub-build" }
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function json(url, opts = {}) {
  const res = await fetch(url, opts)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res.json()
}

const products = {}
let failures = 0

for (const p of PROJECTS) {
  const out = {}
  const api = `https://api.github.com/repos/alegauss/${p.source.repo}`
  try {
    const repo = await json(api, { headers })
    if (repo) out.stars = repo.stargazers_count
    const release = await json(`${api}/releases/latest`, { headers })
    if (release) {
      out.release = {
        tag: release.tag_name,
        date: release.published_at?.slice(0, 10) ?? null,
        url: release.html_url,
        downloads: release.assets.reduce((n, a) => n + a.download_count, 0),
      }
    }
  } catch (err) {
    failures++
    console.warn(`numbers: ${p.id}: ${err.message}`)
  }
  if (p.pypi) {
    try {
      const stats = await json(`https://pypistats.org/api/packages/${p.pypi}/recent`, { headers: { "user-agent": headers["user-agent"] } })
      if (stats) out.pypiLastMonth = stats.data.last_month
    } catch (err) {
      failures++
      console.warn(`numbers: ${p.id} (PyPI): ${err.message}`)
    }
  }
  products[p.id] = out
}

const asOf = new Date().toISOString().slice(0, 10)
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify({ asOf, products }, null, 1) + "\n")
console.log(`numbers: as of ${asOf}, ${failures} request(s) failed`)
