import { SiteSectionHead } from "@viglet/viglet-design-system/site"
import { projectById } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { LAB_FIGURES } from "../data/lab.ts"
import { ProjectTile, accentStyle } from "../components/ProjectTile.tsx"

/* AG11: the workflow the Agent Workbench tools add up to. Three tracks, one per kind of
   project, each adding its own tools to a core every track shares. Each line says only
   what the tool does today; the figures below are quoted from the Lab. */

export const METHOD_TRACKS = [
  {
    title: "Windows apps",
    promise: "The product is a window, so the evidence is the window.",
    tools: [{ id: "winwright", role: "Drives the app from a test and reports four verdicts, so a check that could not run never reads as passed." }],
  },
  {
    title: "Services and infrastructure",
    promise: "The code runs somewhere other than the desktop, so the work is reaching it.",
    tools: [
      { id: "freeharbor", role: "Runs the containers on upstream Moby in WSL2, on the pipe the docker tools already look for." },
      { id: "quickshell", role: "Opens the SSH sessions, SFTP and port forwards to the machines it is deployed on." },
    ],
  },
  {
    title: "Games",
    promise: "The asset is the hard part, so the agent needs a target it can check.",
    tools: [
      { id: "polyweave", role: "Declares what a 3D asset must satisfy and searches for the parameters that do, asserting every render." },
      { id: "modelado", role: "Turns a photo into a mesh or a relief on the local GPU." },
      { id: "revelei", role: "Upscales and cleans up the source photo first, also on the local GPU." },
    ],
  },
]

export const METHOD_STEPS = [
  {
    title: "Keep the backlog a schema",
    text: "roadkeep owns the writes to the roadmap, the changelog and the rationale. An agent files and ships work through a command that checks the line's shape at insertion, and the Claude Code plugin refuses the hand-edit, so the backlog cannot drift when someone is in a hurry.",
    tools: ["roadkeep"],
  },
  {
    title: "See what every project owes",
    text: "roadkeep's desktop app finds every governed checkout on the machine and shows what each has shipped and still owes. It files or ships a line through the roadkeep command, and hands a task to Claude Code as a session it starts, claims and shows while it works.",
    tools: ["roadkeep"],
  },
  {
    title: "Let the diff write the commit",
    text: "commitclerk reads the staged diff, asks an LLM for a Conventional Commits message, shows it to you and commits only once you agree.",
    tools: ["commitclerk"],
  },
  {
    title: "Keep the usage in view",
    text: "Claude Code Tray puts the rate-limit percentage in the tray, read from the session files already on disk.",
    tools: ["claude-tray"],
  },
]

/** The tools of the shared core, once each, in step order. */
export const METHOD_CORE = [...new Set(METHOD_STEPS.flatMap((s) => s.tools))]

function ToolLinks({ tools }: Readonly<{ tools: string[] }>) {
  return (
    <div className="hub-above flex flex-[1_1_220px] flex-col gap-2">
      {tools.map((id) => {
        const p = projectById(id)
        return (
          <a key={id} href={productPath(p)} className="hub-accent flex items-center gap-3 rounded-[var(--vg-radius-control)] border border-border bg-card p-3 hover:border-[var(--vg-brand-light)]" style={accentStyle(p)}>
            <ProjectTile project={p} />
            <span>
              <b className="block">{p.name}</b>
              <small className="text-muted-foreground">Product page →</small>
            </span>
          </a>
        )
      })}
    </div>
  )
}

export function Method() {
  return (
    <>
      <header className="vg-site-wrap pt-16! pb-6! text-center">
        <div className="vg-site-eyebrow">The method</div>
        <h1 className="m-0 mx-auto mb-4 max-w-[20ch] text-5xl font-black tracking-tight">Work with coding agents and keep the record straight.</h1>
        <p className="m-0 mx-auto max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          Pick the track for what you are building. Each one adds its own tools to a core that every track shares. Each tool
          does only what it does today, and the numbers at the end come from the Lab write-ups, not from this page.
        </p>
      </header>

      <section className="vg-site-section" aria-labelledby="tracks">
        <div className="vg-site-wrap">
          <SiteSectionHead eyebrow="Three tracks" title={<span id="tracks">What are you building?</span>}>
            A Windows app, a service and a game are checked against different things, so each track brings its own tools.
          </SiteSectionHead>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4 p-0">
            {METHOD_TRACKS.map((t, i) => (
              <li key={t.title} className="hub-card">
                <div className="font-mono text-sm text-muted-foreground">Track {i + 1}</div>
                <h3 className="m-0 text-2xl font-extrabold tracking-tight">{t.title}</h3>
                <p className="m-0 leading-relaxed text-muted-foreground">{t.promise}</p>

                <div className="mt-2 text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase">Adds</div>
                <ul className="hub-above m-0 flex list-none flex-col gap-2 p-0">
                  {t.tools.map(({ id, role }) => {
                    const p = projectById(id)
                    return (
                      <li key={id}>
                        <a href={productPath(p)} className="hub-accent flex items-start gap-3 rounded-[var(--vg-radius-control)] border border-border bg-card p-3 hover:border-[var(--vg-brand-light)]" style={accentStyle(p)}>
                          <ProjectTile project={p} />
                          <span className="min-w-0">
                            <b className="block">{p.name}</b>
                            <small className="block leading-snug text-muted-foreground">{role}</small>
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-auto border-t border-dashed border-border pt-3">
                  <a href="#every-project" className="hub-above mb-2 block text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase hover:text-foreground">
                    Plus the shared core ↓
                  </a>
                  <ul className="hub-above m-0 flex list-none flex-wrap gap-2 p-0">
                    {METHOD_CORE.map((id) => {
                      const p = projectById(id)
                      return (
                        <li key={id}>
                          <a href={productPath(p)} className="hub-accent flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 text-sm hover:border-[var(--vg-brand-light)] [&_.hub-tile]:size-6 [&_.hub-tile]:rounded-full" style={accentStyle(p)}>
                            <ProjectTile project={p} />
                            {p.name}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="vg-site-section" aria-labelledby="every-project">
        <div className="vg-site-wrap">
          <SiteSectionHead eyebrow="Every track" title={<span id="every-project">The shared core</span>}>
            The backlog, the commit and the usage work the same whatever is being built.
          </SiteSectionHead>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            {METHOD_STEPS.map((s, i) => (
              <li key={s.title} className="hub-card flex-row flex-wrap items-start gap-x-8 gap-y-4">
                <div className="w-14 flex-none font-mono text-3xl text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
                <div className="min-w-0 flex-[999_1_420px]">
                  <h3 className="m-0 mb-2 text-2xl font-extrabold tracking-tight">{s.title}</h3>
                  <p className="m-0 leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
                <ToolLinks tools={s.tools} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="vg-site-section" aria-labelledby="measured">
        <div className="vg-site-wrap">
          <SiteSectionHead eyebrow="Measured, not claimed" title={<span id="measured">What the records say</span>}>
            One developer's sessions, attributed from transcripts and git history. Each figure links the sentence it is quoted from.
          </SiteSectionHead>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
            {LAB_FIGURES.map((f) => {
              const p = projectById(f.project)
              return (
                <figure key={f.value} className="hub-card hub-accent m-0" style={accentStyle(p)}>
                  <div className="hub-kind">{p.name}</div>
                  <div className="text-4xl font-black tracking-tight">{f.value}</div>
                  <p className="m-0 text-muted-foreground">{f.label}</p>
                  <figcaption className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
                    “{f.quote}” —{" "}
                    <a className="underline underline-offset-2" href={f.url}>
                      source
                    </a>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
