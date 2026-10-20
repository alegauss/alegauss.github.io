import { SITE } from "./site.ts"
import type { Project } from "./projects.ts"
import { LINES, type LineId } from "./lines.ts"

/** A catalogue path ("claude-tray/") made absolute; a full URL passes through. */
export const asset = (path: string): string => (/^https?:/.test(path) ? path : `/${path.replace(/^\//, "")}`)

export const productPath = (p: Project | string) => `/products/${typeof p === "string" ? p : p.id}/`
export const linePath = (id: LineId) => `/lines/${LINES.find((l) => l.id === id)!.slug}/`
export const absolute = (path: string) => `${SITE.origin}${path}`

/** The product's own site, unless the catalogue points at GitHub instead. */
export const productSite = (p: Project): string | null => (p.site.startsWith("https://github.com/") ? null : asset(p.site))
