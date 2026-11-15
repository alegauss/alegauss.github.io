import type { Project } from "../data/projects.ts"
import { MATURITY_LABELS, CHANNEL_LABELS, availabilityStale } from "../data/availability.ts"

export const availabilityAction = (p: Project) => ({
  href: p.availability.href,
  label: p.availability.state === "beta" ? "Try the preview" : p.availability.state === "development" ? "Follow development" : CHANNEL_LABELS[p.availability.channel],
})

export function AvailabilityBadge({ project }: { project: Project }) {
  const a = project.availability
  return <span className="hub-chip" title={a.evidence}>{MATURITY_LABELS[a.state]} · {a.channel === "source" ? "Source build" : a.channel === "package" ? "Package" : a.channel === "download" ? "Download" : "Online"}</span>
}

export function AvailabilityEvidence({ project }: { project: Project }) {
  const a = project.availability
  return (
    <p className="my-4 text-sm leading-relaxed text-muted-foreground">
      {a.evidence} <a className="underline underline-offset-2" href={a.source}>Availability source</a> · reviewed <time dateTime={a.reviewed}>{a.reviewed}</time>.
      {availabilityStale(a) ? " Availability needs a fresh review; confirm the current instructions before installing." : null}
    </p>
  )
}
