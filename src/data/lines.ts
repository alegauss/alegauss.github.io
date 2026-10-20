/* The product lines (AG4): grouped by whom a project is for, not by its format.
   A project names its lines in projects.ts; this file only says what each line is. */

export type LineId = "workbench" | "windows" | "lab"

export interface Line {
  id: LineId
  /** The slug of /lines/<slug>/. */
  slug: string
  name: string
  /** The one sentence a card and the page lead with. */
  promise: string
  /** The longer lead on the line's own page. */
  lead: string
}

export const LINES: Line[] = [
  {
    id: "workbench",
    slug: "agent-workbench",
    name: "Agent Workbench",
    promise: "Tools for working with coding agents without losing track of them.",
    lead: "The backlog stays a schema, the commit says what changed, the test says what it actually observed, and the usage stays on screen. Each tool does one of those, and the method page shows how they fit.",
  },
  {
    id: "windows",
    slug: "windows-native",
    name: "Windows Native",
    promise: "The app the platform should have shipped.",
    lead: "Native Windows apps that replace a suite, a subscription or an afterthought with one window: no background service you did not ask for, and nothing to sign in to.",
  },
  {
    id: "lab",
    slug: "lab",
    name: "Lab",
    promise: "Write-ups with measured numbers.",
    lead: "Numbers taken from records rather than recollection, and a black box taken apart on screen. Every input is shown, so a figure is something to check rather than to trust.",
  },
]

export const lineById = (id: LineId): Line => LINES.find((l) => l.id === id)!
