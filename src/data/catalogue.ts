export type PlatformId = "windows" | "macos" | "linux" | "browser"
export const PLATFORMS: Record<PlatformId, string> = { windows: "Windows", macos: "macOS", linux: "Linux", browser: "Browser" }
export interface CatalogueEntry { lines: string[]; platforms: string[]; maturity: string }
export interface CatalogueSelection { purpose: string; platform: string; maturity: string }
export const matchesCatalogue = (entry: CatalogueEntry, selection: CatalogueSelection) =>
  (!selection.purpose || entry.lines.includes(selection.purpose)) &&
  (!selection.platform || entry.platforms.includes(selection.platform)) &&
  (!selection.maturity || entry.maturity === selection.maturity)
