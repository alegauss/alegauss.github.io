import type { ReactNode } from "react"
import { SiteButton, SiteFooter, SiteNav, SiteSponsor, type SponsorDeclaration } from "@viglet/viglet-design-system/site"
import sponsor from "../../sponsor.json"
import { SITE } from "../data/site.ts"
import { LINES } from "../data/lines.ts"
import { PROJECTS } from "../data/projects.ts"
import { linePath, productPath } from "../data/links.ts"
import { Island } from "../islands.tsx"

const NAV = [
  { href: "/#lines", label: "Lines" },
  { href: "/#products", label: "Products" },
  { href: "/method/", label: "Method" },
  { href: "/changelog/", label: "Changelog" },
  { href: "/plugins/", label: "Plugins" },
]

const FOOT = [
  { href: "/method/", label: "Method" },
  { href: "/changelog/", label: "Changelog" },
  { href: "/plugins/", label: "Plugins" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: SITE.github, label: "GitHub" },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="hub-skip" href="#main">
        Skip to content
      </a>
      <SiteNav
        brand={{ href: "/", name: SITE.name, logo: "/logo.svg" }}
        links={NAV}
        actions={
          <>
            {SITE.search.site ? <Island name="search" /> : null}
            <Island name="theme-toggle" />
            <SiteButton href={SITE.github}>GitHub</SiteButton>
          </>
        }
      />
      <main id="main">{children}</main>
      <SiteFooter
        brand={{ href: "/", name: SITE.name, logo: "/logo.svg" }}
        links={FOOT}
        sponsor={<SiteSponsor declaration={sponsor as SponsorDeclaration} assetBase="/" moreLabel="More at" />}
        disclaimer={
          <>
            Personal / community projects — not affiliated with, endorsed by, or sponsored by Anthropic or OpenAI.
            “Claude” and “Claude Code” are trademarks of Anthropic. © 2026 {SITE.author}.{" "}
            <Island name="consent-settings" />
          </>
        }
      >
        {/* the full site index, by line: every product page is one click from any page */}
        <nav aria-label="All products" className="vg-site-wrap grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-7 pb-8! mb-8! border-b border-border text-sm">
          {LINES.map((line) => (
            <div key={line.id} className="flex flex-col gap-2">
              <a href={linePath(line.id)} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                {line.name}
              </a>
              {PROJECTS.filter((p) => p.lines.includes(line.id)).map((p) => (
                <a key={p.id} href={productPath(p)} className="text-muted-foreground hover:text-foreground">
                  {p.name}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </SiteFooter>
    </>
  )
}
