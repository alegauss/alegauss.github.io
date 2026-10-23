import { SiteButton, SiteFeatureIndex, SiteHero, SiteSectionHead } from "@viglet/viglet-design-system/site"
import { SITE } from "../data/site.ts"
import { LINES } from "../data/lines.ts"
import { PROJECTS, projectById } from "../data/projects.ts"
import { asset, linePath, productPath, productSite } from "../data/links.ts"
import { NUMBERS_AS_OF, numbersOf, shipsOf } from "../data/records.ts"
import { marketplaceAdd, MARKETPLACE } from "../data/plugins.ts"
import { ProjectCard } from "../components/ProjectCard.tsx"
import { ProjectTile, accentStyle } from "../components/ProjectTile.tsx"
import { ShipList } from "../components/ShipList.tsx"
import { NumberLine } from "../components/Numbers.tsx"

/** schema.org for the author (AG15): the Person every product page's `author` points at by @id. */
export function personJsonLd() {
  const { viglet, japode } = SITE.orgs
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.origin}/#person`,
    name: SITE.author,
    alternateName: ["alegauss", "Alê Oliveira"],
    url: `${SITE.origin}/`,
    nationality: { "@type": "Country", name: "Brazil" },
    jobTitle: "Software developer",
    worksFor: { "@type": "Organization", name: viglet.name, url: viglet.url, sameAs: [viglet.github] },
    affiliation: [{ "@type": "Organization", name: japode.name, url: japode.url, sameAs: [japode.github] }],
    sameAs: SITE.profiles,
    knowsAbout: ["Enterprise search", "Content management systems", "Claude Code", "Coding agents", "Windows desktop apps"],
  }
}

export function Home() {
  const flagship = projectById(SITE.flagship)
  const flagshipLines = LINES.filter((l) => flagship.lines.includes(l.id))
  const site = productSite(flagship)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }} />
      <SiteHero
        icon={{ src: "/logo.svg", alt: "Alegauss logo" }}
        badge="Open source · free · analytics only with your consent"
        title="Software that shows you"
        titleAccent="what it's actually doing."
        sub="Tools for working with coding agents without losing track of them, the Windows apps the platform should have shipped, and write-ups where the numbers come from records rather than recollection."
        actions={
          <>
            <SiteButton href="#lines">See the product lines</SiteButton>
            <SiteButton href="/method/" variant="ghost">
              How the tools fit together
            </SiteButton>
          </>
        }
      />

      {/* the flagship is a field in site.ts, not a position in the list (AG4) */}
      <section className="vg-site-section pt-0!" aria-labelledby="flagship">
        <div className="vg-site-wrap">
          <article
            className="hub-accent grid items-center gap-9 rounded-[var(--vg-radius-panel)] border p-6 md:grid-cols-2 md:p-10"
            style={{ ...accentStyle(flagship), borderColor: "color-mix(in oklab, var(--a) 36%, transparent)", background: "var(--vg-card)" }}
          >
            <div className="min-w-0">
              <div className="hub-kind mb-5">Flagship · {flagshipLines.map((l) => l.name).join(" · ")}</div>
              <div className="mb-4 flex items-center gap-4">
                <ProjectTile project={flagship} large />
                <div>
                  <div className="hub-kind">{flagship.kind}</div>
                  <h2 id="flagship" className="m-0 text-3xl font-black tracking-tight">
                    {flagship.name}
                  </h2>
                </div>
              </div>
              <p className="m-0 mb-4 leading-relaxed text-muted-foreground">{flagship.pitch}</p>
              <NumberLine numbers={numbersOf(flagship)} asOf={NUMBERS_AS_OF} tags={flagship.tags} />
              <div className="mt-6 flex flex-wrap gap-3">
                <SiteButton href={productPath(flagship)}>Open the product page</SiteButton>
                {site ? (
                  <SiteButton href={site} variant="ghost">
                    Product site
                  </SiteButton>
                ) : null}
              </div>
            </div>
            <div className="hub-shot">
              {flagship.shot ? <img src={asset(flagship.shot)} alt="" width={1200} height={630} loading="lazy" decoding="async" /> : null}
            </div>
          </article>
        </div>
      </section>

      <section className="vg-site-section" id="lines">
        <div className="vg-site-wrap">
          <SiteFeatureIndex
            eyebrow="Product lines"
            title="Start from the problem you have."
            description="Two product lines and a lab. A tool can sit in two of them."
            goLabel="See the line →"
            items={LINES.map((l) => ({
              href: linePath(l.id),
              heading: `${l.name} · ${PROJECTS.filter((p) => p.lines.includes(l.id)).length}`,
              description: l.promise,
            }))}
          />
        </div>
      </section>

      <section className="vg-site-section" id="products">
        <div className="vg-site-wrap">
          <div className="hub-band">
            <h2>Every product</h2>
            <span>Each has a page here, and most a site of its own with the full documentation.</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(330px,100%),1fr))] gap-4">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="vg-site-section">
        <div className="vg-site-wrap">
          <div className="hub-band">
            <h2>Recently shipped</h2>
            <span>
              <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="/changelog/">
                Every product's changelog →
              </a>
            </span>
          </div>
          <ShipList ships={shipsOf().slice(0, 6)} />
        </div>
      </section>

      <section className="vg-site-section">
        <div className="vg-site-wrap grid gap-4 md:grid-cols-2">
          <a href="/method/" className="hub-card">
            <div className="vg-site-eyebrow m-0">The method</div>
            <h3 className="m-0 text-2xl font-extrabold tracking-tight">One way of working with coding agents, one tool per step.</h3>
            <p className="m-0 text-muted-foreground">
              roadkeep governs the backlog and its desktop app reads every one, commitclerk writes the commit and winwright
              reports what a test observed.
            </p>
            <span className="mt-auto font-semibold" style={{ color: "var(--vg-brand)" }}>
              Read the method →
            </span>
          </a>
          <a href="/plugins/" className="hub-card">
            <div className="vg-site-eyebrow m-0">Claude Code plugins</div>
            <h3 className="m-0 text-2xl font-extrabold tracking-tight">Every plugin from one marketplace.</h3>
            <code className="hub-code block">{marketplaceAdd}</code>
            <p className="m-0 text-muted-foreground">{MARKETPLACE.plugins.map((p) => p.name).join(", ")}.</p>
            <span className="mt-auto font-semibold" style={{ color: "var(--vg-brand)" }}>
              See the plugins →
            </span>
          </a>
        </div>
      </section>

      <section className="vg-site-section" id="about">
        <div className="vg-site-wrap">
          <SiteSectionHead eyebrow="About" title="How these are built" />
          <p className="m-0 mb-6 max-w-3xl leading-relaxed text-muted-foreground">
            Every product here is made by Alexandre Oliveira (alegauss), a software developer in Brazil. He also builds{" "}
            <a className="font-semibold text-foreground underline-offset-2 hover:underline" href={SITE.orgs.viglet.url}>
              Viglet
            </a>
            , open-source enterprise search and content tools (Viglet Turing, Viglet Shio and Viglet Dumont),{" "}
            <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="https://cursarei.com.br/">
              Cursarei
            </a>
            , an independent directory of Brazilian courses, and the{" "}
            <a className="font-semibold text-foreground underline-offset-2 hover:underline" href={SITE.orgs.japode.url}>
              Japode
            </a>{" "}
            apps.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
            {[
              ["One job each", "No dashboards, no accounts, no background services you didn't ask for. A tool should do the one thing its name promises."],
              ["Your machine, your data", "The tools collect nothing and phone nothing home. What runs locally stays local — the only network call is the one you configure yourself."],
              ["Assumptions on screen", "Where there are numbers, the inputs are yours to change and the method is written down. A model you can argue with beats a figure you have to trust."],
            ].map(([h, t]) => (
              <div key={h} className="hub-card">
                <h3 className="m-0 text-lg font-bold">{h}</h3>
                <p className="m-0 text-[0.93rem] leading-relaxed text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
