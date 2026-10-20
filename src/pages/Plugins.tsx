import { Island } from "../islands.tsx"
import { PROJECTS } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { MARKETPLACE, marketplaceAdd, pluginInstall } from "../data/plugins.ts"
import { ProjectTile, accentStyle } from "../components/ProjectTile.tsx"

export function Plugins() {
  return (
    <>
      <header className="vg-site-wrap max-w-[820px]! pt-16! pb-10! text-center">
        <div className="vg-site-eyebrow">Claude Code plugins</div>
        <h1 className="m-0 mb-4 text-5xl font-black tracking-tight">Every plugin, one command.</h1>
        <p className="m-0 mb-8 text-lg leading-relaxed text-muted-foreground">
          Add the marketplace once, then install any plugin from it by name. This page is built from the same manifest the
          marketplace serves.
        </p>
        <div className="hub-code text-left text-base">
          <pre>{marketplaceAdd}</pre>
          <Island name="copy" props={{ text: marketplaceAdd, label: "Copy the marketplace command" }} />
        </div>
      </header>
      <section className="vg-site-wrap grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),1fr))] gap-4 pb-16!">
        {MARKETPLACE.plugins.map((plugin) => {
          const p = PROJECTS.find((x) => x.id === plugin.name)
          return (
            <article key={plugin.name} className="hub-card hub-accent" style={p ? accentStyle(p) : undefined}>
              <div className="flex items-center gap-3">
                {p ? <ProjectTile project={p} /> : null}
                <div>
                  {p ? <div className="hub-kind">{p.kind}</div> : null}
                  <h2 className="m-0 text-lg font-extrabold">{p?.name ?? plugin.name}</h2>
                </div>
              </div>
              <p className="m-0 text-[0.93rem] leading-relaxed text-muted-foreground">{plugin.description}</p>
              <div className="hub-code">
                <pre>{pluginInstall(plugin.name)}</pre>
                <Island name="copy" props={{ text: pluginInstall(plugin.name), label: `Copy the ${plugin.name} install command` }} />
              </div>
              {p ? (
                <a className="mt-auto font-semibold" style={{ color: "var(--a-fg)" }} href={productPath(p)}>
                  Product page →
                </a>
              ) : null}
            </article>
          )
        })}
      </section>
    </>
  )
}
