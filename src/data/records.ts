/* What the build read from each product's own records (AG8–AG10): the roadkeep ledger
   and roadmap at a resolved commit, and the public numbers. Both files are written by
   scripts/fetch-records.mjs and scripts/fetch-numbers.mjs before the site is built. */

import records from "../generated/records.json"
import numbers from "../generated/numbers.json"
import { PROJECTS, type Project } from "./projects.ts"

export interface Ship {
  id: string
  block: string
  symptom: string
  why: string
  commit: string | null
  date: string | null
}

export interface OpenLine {
  id: string
  status: string
  symptom: string
}

export interface Block {
  label: string
  title: string
  open: OpenLine[]
}

export interface ProductRecords {
  repo: string
  ref: string
  sha: string
  ledgerFile: string
  roadmapFile: string
  ledger: Ship[]
  blocks: Block[]
}

export interface ProductNumbers {
  stars?: number
  release?: { tag: string; date: string | null; url: string; downloads?: number }
  pypiLastMonth?: number
}

/** Stars and downloads show only above this; the release tag always shows. */
export const NUMBERS_MIN = 100
const shown = (n: number | undefined) => (n !== undefined && n > NUMBERS_MIN ? n : undefined)

const RECORDS = records.products as Record<string, ProductRecords>
const NUMBERS = numbers.products as Record<string, ProductNumbers>
export const NUMBERS_AS_OF: string = numbers.asOf

export const recordsOf = (p: Project): ProductRecords => {
  const r = RECORDS[p.id]
  if (!r) throw new Error(`no records for "${p.id}": run scripts/fetch-records.mjs`)
  return r
}

export const numbersOf = (p: Project): ProductNumbers => {
  const n = NUMBERS[p.id] ?? {}
  return {
    stars: shown(n.stars),
    release: n.release ? { ...n.release, downloads: shown(n.release.downloads) } : undefined,
    pypiLastMonth: shown(n.pypiLastMonth),
  }
}

export interface DatedShip extends Ship {
  project: Project
}

/** Newest first. An entry the history could not date sorts after every dated one. */
const byDate = (a: DatedShip, b: DatedShip) =>
  (b.date ?? "").localeCompare(a.date ?? "") || b.id.localeCompare(a.id, "en", { numeric: true })

export function shipsOf(projects: Project[] = PROJECTS): DatedShip[] {
  return projects.flatMap((p) => recordsOf(p).ledger.map((s) => ({ ...s, project: p }))).sort(byDate)
}

/** The ledger entry's headline: its symptom, or the whole line where the ledger keeps one slot. */
export const shipTitle = (s: Ship) => s.symptom || s.why
export const shipBody = (s: Ship) => (s.symptom ? s.why : "")

export const commitUrl = (p: Project, hash: string) => `${p.repo}/commit/${hash}`
export const fileUrl = (p: Project, file: string) => `${p.repo}/blob/${recordsOf(p).sha}/${file}`
