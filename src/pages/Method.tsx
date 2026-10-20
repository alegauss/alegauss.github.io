import { SiteSectionHead } from "@viglet/viglet-design-system/site"
import { projectById } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { LAB_FIGURES } from "../data/lab.ts"
import { ProjectTile, accentStyle } from "../components/ProjectTile.tsx"

/* AG11: the workflow the Agent Workbench tools add up to, one step per tool. Each step
   says only what the tool does today; the figures below are quoted from the Lab. */

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
    title: "Test what was observed",
    text: "winwright drives the Windows app from a test and reports four verdicts, so a check that could not run is never filed as one that passed.",
    tools: ["winwright"],
  },
  {
    title: "Give the agent a domain it can check",
    text: "polyweave declares what a 3D asset must satisfy and searches for parameters that do, asserting every render; Piano's plugin writes, checks and keeps scores before the app plays them. Same discipline: a declared target, checked, recorded.",
    tools: ["polyweave", "piano"],
  },
  {
    title: "Keep the usage in view",
    text: "Claude Code Tray puts the rate-limit percentage in the tray, read from the session files already on disk.",
    tools: ["claude-tray"],
  },
]

export function Method() {
  return (
    <>
      <header className="vg-site-wrap pt-16! pb-6! text-center">
        <div className="vg-site-eyebrow">The method</div>
        <h1 className="m-0 mx-auto mb-4 max-w-[20ch] text-5xl font-black tracking-tight">Work with coding agents and keep the record straight.</h1>
        <p className="m-0 mx-auto max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          Each step is a tool from the Agent Workbench, and each tool does only what it does today. The numbers at the end
          come from the Lab write-ups, not from this page.
        </p>
      </header>

      <section className="vg-site-section">
        <ol className="vg-site-wrap m-0 flex list-none flex-col gap-4">
          {METHOD_STEPS.map((s, i) => (
            <li key={s.title} className="hub-card flex-row flex-wrap items-start gap-x-8 gap-y-4">
              <div className="w-14 flex-none font-mono text-3xl text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
              <div className="min-w-0 flex-[999_1_420px]">
                <h2 className="m-0 mb-2 text-2xl font-extrabold tracking-tight">{s.title}</h2>
                <p className="m-0 leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
              <div className="hub-above flex flex-[1_1_220px] flex-col gap-2">
                {s.tools.map((id) => {
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
            </li>
          ))}
        </ol>
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
