/* Site-wide settings. Each one is a single edit: the flagship, the origin a
   domain change (AG12) would move, and the search the header offers (AG14). */

export const SITE = {
  name: "Alegauss",
  /** The origin every canonical URL, the sitemap and llms.txt are written under. */
  origin: "https://alegauss.com",
  /** Optional dedicated highlight; null leaves the AI result showcase as the opening. */
  flagship: null as string | null,
  title: "Alegauss — independent AI software and agent development tools",
  headline: "We build with the tools we build.",
  heroTitle: "AI applications.",
  heroAccent: "Tools for coding agents.",
  positioning: "Turn photos into 3D models, improve images on your PC, and plan, test and maintain software with agents.",
  method: "We use roadkeep to manage our roadmaps, coding agents to implement changes, winwright to test Windows projects and commitclerk to support our commit workflow. The applications are independent; what they share is how we build them.",
  description:
    "AI applications and tools for coding agents by Alexandre Oliveira. Create 3D models, improve photos locally, and manage roadmaps, Windows tests and commits with our own tools.",
  github: "https://github.com/alegauss",
  author: "Alexandre Oliveira",
  /**
   * The author's other profiles, in the home page's Person `sameAs` (AG15): what tells a search
   * engine that every "alegauss" is the one person who also builds Viglet and Cursarei.
   */
  profiles: [
    "https://github.com/alegauss",
    "https://www.linkedin.com/in/alegauss/",
    "https://stackoverflow.com/users/2497985/alegauss",
    "https://huggingface.co/alegauss",
    "https://dev.to/alegauss",
    "https://x.com/alegauss",
    "https://bsky.app/profile/alegauss.bsky.social",
  ],
  /** The organisations the author builds under, linked from the Person (AG15). */
  orgs: {
    viglet: { name: "Viglet", url: "https://www.viglet.org", github: "https://github.com/openviglet" },
    japode: { name: "Japode", url: "https://japode.com", github: "https://github.com/Japode" },
  },
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
