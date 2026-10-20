import { useEffect, useRef, useState } from "react"
import { createTuringClient, fetchSearch } from "@viglet/turing-sdk"
import { SITE } from "../data/site.ts"

/* AG14: the header search, answered by Viglet Turing — the sponsor's own product,
   searching the built pages of this hub. It renders only when SITE.search.site
   names the Turing site that indexes them. */

interface Hit {
  title: string
  url: string
  text: string
}

const field = (v: unknown): string => (Array.isArray(v) ? String(v[0] ?? "") : v == null ? "" : String(v))

export function SearchButton() {
  const site = SITE.search.site
  const dialog = useRef<HTMLDialogElement>(null)
  const [q, setQ] = useState("")
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (e.key === "/" && !(t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName)))) {
        e.preventDefault()
        dialog.current?.showModal()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!site || q.trim().length < 2) {
      setHits(null)
      return
    }
    const ctl = setTimeout(async () => {
      try {
        const client = createTuringClient({ baseURL: SITE.search.api, credentials: "omit" })
        const res = await fetchSearch(client, site, { q, rows: "8", _setlocale: SITE.search.locale })
        setFailed(false)
        setHits(
          (res.results?.document ?? []).map((d) => ({
            title: field(d.fields.title),
            url: field(d.fields.url),
            text: field(d.fields.description || d.fields.text).slice(0, 160),
          })),
        )
      } catch {
        setFailed(true)
        setHits([])
      }
    }, 200)
    return () => clearTimeout(ctl)
  }, [q, site])

  if (!site) return null
  return (
    <>
      <button type="button" className="hub-search-btn" onClick={() => dialog.current?.showModal()} aria-label="Search this site">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span>Search</span>
        <kbd className="rounded border border-border px-1.5 text-xs">/</kbd>
      </button>
      <dialog ref={dialog} className="hub-dialog" aria-label="Search this site" onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <form method="dialog" className="flex items-center gap-3 border-b border-border px-5" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="hub-q" className="sr-only">
            Search
          </label>
          <input
            id="hub-q"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, changelog, method…"
            className="h-14 flex-1 bg-transparent text-lg outline-none"
          />
        </form>
        <div className="max-h-[440px] overflow-y-auto py-2" aria-live="polite">
          {failed ? <p className="px-5 py-3 text-sm text-muted-foreground">Search did not answer. Try again in a moment.</p> : null}
          {hits?.length === 0 && !failed ? <p className="px-5 py-3 text-sm text-muted-foreground">Nothing matches “{q}”.</p> : null}
          {hits?.map((h) => (
            <a key={h.url} href={h.url} className="block px-5 py-3 hover:bg-muted">
              <b className="block">{h.title}</b>
              <small className="text-muted-foreground">{h.text}</small>
            </a>
          ))}
        </div>
        <p className="m-0 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Search runs on{" "}
          <a className="text-xs underline underline-offset-2" href="https://turing.viglet.org">
            Viglet Turing
          </a>
          .
        </p>
      </dialog>
    </>
  )
}
