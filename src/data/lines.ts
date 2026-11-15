/* The product lines (AG4): grouped by whom a project is for, not by its format.
   A project names its lines in projects.ts; this file only says what each line is. */

export type LineId = "workbench" | "applications" | "utilities" | "lab"

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
    name: "Agent Development Tools",
    promise: "Plan, implement, test and maintain software with coding agents.",
    lead: "The backlog stays a schema, the commit says what changed, the test says what it actually observed, and the usage stays on screen. Each tool does one of those, and the method page shows how they fit.",
  },
  {
    id: "applications",
    slug: "ai-applications",
    name: "AI-Powered Applications",
    promise: "Create models, improve photos and practise music with AI assistance.",
    lead: "Independent applications for creative work: Modelado turns photos into 3D models, Revelei improves images locally, and Piano lets a coding agent write scores and guide practice. Each app has its own purpose and requirements.",
  },
  {
    id: "utilities",
    // Preserve the existing URL; the family is now defined by purpose.
    slug: "windows-native",
    name: "Developer Utilities",
    promise: "Tools for infrastructure, productivity and AI visibility.",
    lead: "Run containers, connect to remote machines, switch between computers or measure how AI assistants describe your product. Platform support is listed on each product.",
  },
  {
    id: "lab",
    slug: "lab",
    name: "Research & Labs",
    promise: "Write-ups with measured numbers.",
    lead: "Numbers taken from records rather than recollection, and a black box taken apart on screen. Every input is shown, so a figure is something to check rather than to trust.",
  },
]

export const lineById = (id: LineId): Line => LINES.find((l) => l.id === id)!
