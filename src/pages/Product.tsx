import { SiteButton } from "@viglet/viglet-design-system/site"
import { Island } from "../islands.tsx"
import type { Project } from "../data/projects.ts"
import { SITE } from "../data/site.ts"
import { LINES } from "../data/lines.ts"
import { asset, absolute, linePath, productPath, productSite } from "../data/links.ts"
import { NUMBERS_AS_OF, fileUrl, numbersOf, recordsOf, shipsOf } from "../data/records.ts"
import { marketplaceAdd, pluginFor, pluginInstall } from "../data/plugins.ts"
import { ProjectTile, accentStyle } from "../components/ProjectTile.tsx"
import { ShipList } from "../components/ShipList.tsx"
import { NumberStats } from "../components/Numbers.tsx"
import { Inline } from "../components/Inline.tsx"

/** schema.org for the product (AG5): what a search engine needs to rank the page for its name. */
export function productJsonLd(p: Project) {
  const n = numbersOf(p)
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.blurb,
    url: absolute(productPath(p)),
    applicationCategory: p.lines.includes("lab") ? "ReferenceApplication" : "DeveloperApplication",
    operatingSystem: p.platform,
    license: `https://spdx.org/licenses/${p.licence}.html`,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(n.release ? { softwareVersion: n.release.tag } : {}),
    ...(p.download ? { downloadUrl: p.download } : {}),
    sameAs: [p.repo, ...(productSite(p) ? [absolute(productSite(p)!)] : [])],
    author: { "@type": "Person", "@id": `${SITE.origin}/#person`, name: SITE.author, url: SITE.github },
  }
}

const STATUS: Record<string, string> = { "📋": "Designed", "💭": "Idea", "⏳": "Partial", "🛠": "In progress" }

function Install({ project }: { project: Project }) {
  const plugin = pluginFor(project.id)
  const steps = [
    ...(plugin ? [{ label: "Claude Code plugin", command: `${marketplaceAdd}\n${pluginInstall(plugin.name)}` }] : []),
    ...project.install,
  ]
  if (!steps.length && !project.download) return null
  return (
    <section className="mb-14" aria-labelledby="install">
      <div className="hub-band">
        <h2 id="install">Install</h2>
      </div>
      <div className="flex flex-col gap-4">
        {steps.map((s) => (
          <div key={s.label}>
            <div className="mb-2 text-sm font-semibold">{s.label}</div>
            <div className="hub-code">
              <pre>{s.command}</pre>
              <Island name="copy" props={{ text: s.command, label: `Copy the ${s.label} command` }} />
            </div>
          </div>
        ))}
        {project.download ? (
          <p className="m-0">
            <a className="font-semibold underline underline-offset-2" href={project.download}>
              Download the latest release →
            </a>
          </p>
        ) : null}
      </div>
    </section>
  )
}

function WhatComesNext({ project }: { project: Project }) {
  const r = recordsOf(project)
  const open = r.blocks.filter((b) => b.open.length)
  return (
    <section className="mb-14" aria-labelledby="next">
      <div className="hub-band">
        <h2 id="next">What comes next</h2>
        <p>
          From the product's own{" "}
          <a className="underline underline-offset-2" href={fileUrl(project, r.roadmapFile)}>
            {r.roadmapFile}
          </a>{" "}
          at <code className="font-mono">{r.sha.slice(0, 7)}</code>.
        </p>
      </div>
      {open.length === 0 ? (
        <p className="m-0 text-muted-foreground">Nothing is open on this product's roadmap right now.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
          {open.map((b) => (
            <div key={b.label} className="hub-card">
              <div className="vg-site-eyebrow m-0">Block {b.label}</div>
              <h3 className="m-0 text-lg font-bold">
                <Inline text={b.title} />
              </h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0 text-sm">
                {b.open.map((l) => (
                  <li key={l.id} className="hub-entry flex items-baseline gap-3">
                    <span className="hub-chip flex-none text-xs" title={l.id}>
                      {STATUS[l.status] ?? l.status}
                    </span>
                    <span className="text-muted-foreground">
                      <Inline text={l.symptom} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function Product({ project }: { project: Project }) {
  const site = productSite(project)
  const lines = LINES.filter((l) => project.lines.includes(l.id))
  const ships = shipsOf([project])
  const r = recordsOf(project)

  return (
    <div className="hub-accent" style={accentStyle(project)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(project)).replace(/</g, "\\u003c") }} />
      <div className="vg-site-wrap pt-6!">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="/">
            Home
          </a>
          <span aria-hidden="true">/</span>
          <a className="hover:text-foreground" href={linePath(lines[0].id)}>
            {lines[0].name}
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-foreground" aria-current="page">
            {project.name}
          </span>
        </nav>
      </div>

      <header className="vg-site-wrap grid items-center gap-10 py-10! md:grid-cols-[1.05fr_.95fr]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap gap-2">
            {project.id === SITE.flagship ? <span className="hub-chip" aria-pressed="true">Flagship</span> : null}
            {lines.map((l) => (
              <a key={l.id} className="hub-chip" href={linePath(l.id)}>
                {l.name}
              </a>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-4">
            <ProjectTile project={project} large />
            <div>
              <div className="hub-kind">{project.kind}</div>
              <h1 className="m-0 text-4xl font-black tracking-tight md:text-5xl">{project.name}</h1>
            </div>
          </div>
          <p className="m-0 mb-6 text-lg leading-relaxed text-muted-foreground">{project.pitch}</p>
          <div className="flex flex-wrap gap-3">
            {site ? <SiteButton href={site}>{project.cta ?? "Open the product site"}</SiteButton> : null}
            {!site && project.download ? <SiteButton href={project.download}>Download the app</SiteButton> : null}
            {project.docs ? (
              <SiteButton href={asset(project.docs)} variant="ghost">
                Docs
              </SiteButton>
            ) : null}
            <SiteButton href={project.repo} variant="ghost">
              Source
            </SiteButton>
          </div>
        </div>
        <div className="hub-shot">
          {project.shot ? (
            <img src={asset(project.shot)} alt="" width={1200} height={630} decoding="async" />
          ) : (
            <span className="block w-1/4">
              <ProjectTile project={project} large />
            </span>
          )}
        </div>
      </header>

      <div className="vg-site-wrap pb-10!">
        <NumberStats numbers={numbersOf(project)} asOf={NUMBERS_AS_OF} />

        <div className="flex flex-wrap gap-8">
          <div className="min-w-0 flex-[999_1_560px]">
            <Install project={project} />
            <WhatComesNext project={project} />
          </div>
          <aside className="min-w-0 flex-[1_1_260px]">
            <dl className="hub-card m-0 gap-3 text-sm">
              {[
                ["Platform", project.platform],
                ["Licence", project.licence],
                ["Lines", lines.map((l) => l.name).join(", ")],
                ["Shipped", `${r.ledger.length} ledger entries`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="m-0 text-right">{v}</dd>
                </div>
              ))}
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                {site ? <a href={site}>Product site →</a> : null}
                {project.docs ? <a href={asset(project.docs)}>Documentation →</a> : null}
                <a href={project.repo}>Source on GitHub →</a>
              </div>
            </dl>
            <p className="mx-1 mt-3 text-xs leading-relaxed text-muted-foreground">
              A summary. {site ? "The product site stays the canonical page for its own content." : "This is the product's fullest page."}
            </p>
          </aside>
        </div>

        <section aria-labelledby="shipped">
          <div className="hub-band">
            <h2 id="shipped">Recently shipped</h2>
            <span>
              <a className="font-semibold text-foreground hover:underline" href={`/changelog/${project.id}/`}>
                All {ships.length} entries →
              </a>
            </span>
          </div>
          {ships.length ? (
            <ShipList ships={ships.slice(0, 8)} showProduct={false} />
          ) : (
            <p className="m-0 text-muted-foreground">Nothing has shipped through this product's ledger yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
