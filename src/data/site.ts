/* Site-wide settings. Each one is a single edit: the flagship, the origin a
   domain change (AG12) would move, and the search the header offers (AG14). */

export const SITE = {
  name: "alegauss",
  /** The origin every canonical URL, the sitemap and llms.txt are written under. */
  origin: "https://alegauss.github.io",
  /** The project the home page leads with (visibility's rule: one at a time). */
  flagship: "claude-tray",
  title: "alegauss — software that shows its work",
  description:
    "Open-source tools for working with coding agents, native Windows apps and measured write-ups by Alexandre Oliveira — the small thing the platform should have shipped, plus numbers taken from records rather than guessed at.",
  github: "https://github.com/alegauss",
  author: "Alexandre Oliveira",
  /** GA4 measurement id, loaded only after the visitor allows it (AG1). */
  analytics: "G-6HG45Q9BHP",
  /** The theme choice is stored under this key, as every product site names its own. */
  themeKey: "alegauss-theme",
  /**
   * Header search on Viglet Turing (AG14). `site` is the Turing site that indexes
   * this hub; while it is null the header offers no search, rather than a box
   * that answers nothing.
   */
  search: { api: "https://turing-demo.viglet.org/api", site: null as string | null, locale: "en_US" },
  /** The Claude Code plugin marketplace this repository serves (AG13). */
  marketplace: { repo: "alegauss/alegauss.github.io" },
} as const
