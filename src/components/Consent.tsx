import { useEffect, useState } from "react"
import { SITE } from "../data/site.ts"

/* AG1: Google Analytics loads only after the visitor allows it. Nothing reaches
   googletagmanager.com before a choice: the tag is not in the HTML, and this
   component adds it only for "granted". A refusal is remembered as firmly as a
   consent, and the footer's "Analytics settings" asks again. */

const KEY = "alegauss-consent"
const ASK = "alegauss:consent-ask"
type Choice = "granted" | "denied"

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === "granted" || v === "denied" ? v : null
  } catch {
    return null
  }
}

let loaded = false
function loadAnalytics() {
  if (loaded) return
  loaded = true
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // gtag.js reads the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  w.gtag("js", new Date())
  w.gtag("config", SITE.analytics)
  const s = document.createElement("script")
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.analytics}`
  document.head.appendChild(s)
}

/** Opens the banner again; the footer's settings button calls it. */
export const askConsent = () => window.dispatchEvent(new Event(ASK))

export function ConsentBanner() {
  // null until mounted: the prerendered page carries no banner and no tag
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const choice = readChoice()
    if (choice === "granted") loadAnalytics()
    if (choice === null) setOpen(true)
    const ask = () => setOpen(true)
    window.addEventListener(ASK, ask)
    return () => window.removeEventListener(ASK, ask)
  }, [])

  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(KEY, choice)
    } catch {
      /* private mode: the choice lasts this page */
    }
    if (choice === "granted") loadAnalytics()
    else if (loaded) {
      // the tag cannot be unloaded from a running page; the next one will not load it
      ;(window as unknown as { [k: string]: boolean })[`ga-disable-${SITE.analytics}`] = true
    }
    setOpen(false)
  }

  if (!open) return null
  return (
    <section className="hub-consent" aria-label="Analytics consent">
      <p className="m-0 text-sm leading-relaxed">
        This site counts visits with Google Analytics only if you allow it. Nothing is loaded until you choose, and the
        tools themselves collect nothing either way.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="vg-site-btn vg-site-btn-ghost" onClick={() => choose("denied")}>
          Decline
        </button>
        <button type="button" className="vg-site-btn vg-site-btn-primary" onClick={() => choose("granted")}>
          Allow analytics
        </button>
      </div>
    </section>
  )
}
