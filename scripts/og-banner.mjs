// Measures and renders the Open Graph banners of every alegauss project.
//
// Why this exists: the banners are hand-authored SVG whose text is set in DejaVu Sans.
// Nobody editing a headline can tell where the line will actually end, and DejaVu is not
// installed on Windows — so a local preview renders in a narrower fallback face and looks
// fine while the CI build, which has the real font, pushes the line off the card. Four of
// the nine banners shipped that way; one was clipped mid-word.
//
// So: never eyeball a banner. Measure it.
//
//   node scripts/og-banner.mjs --check                    every banner in MANIFEST
//   node scripts/og-banner.mjs --check <a.svg> <b.svg>    just these
//   node scripts/og-banner.mjs --render <in.svg> <out.png>
//   node scripts/og-banner.mjs --measure 26 "a line"      how wide would this be?
//   node scripts/og-banner.mjs --measure 66 --bold "..."
//
// --check exits 1 on any violation, so it can gate a commit.
//
// Two dependencies this repo deliberately does not vendor:
//   @resvg/resvg-js — the same rasteriser the project sites build with, so what is
//     measured here is byte-identical to what ships. Resolved from a sibling project's
//     site/node_modules; run `npm i @resvg/resvg-js` in one of them if it is missing.
//   the DejaVu TTFs — matplotlib ships the whole family, which is why the search list
//     below starts there. Override with OG_DEJAVU_DIR.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const here = dirname(fileURLToPath(import.meta.url))
const gitRoot = resolve(here, "..", "..")   // the directory holding all the repos

/* Where each project's banner source lives. The paths differ because the projects do:
   the five with a Vite site keep the SVG in site/public and rasterise it during the
   build, so their og.png is never committed; the three Python repos serve docs/ straight
   to Pages, so theirs has to be. */
const MANIFEST = [
  { slug: "pportal",               svg: "pportal/site/public/og.svg" },
  { slug: "freewilly",             svg: "freewilly/site/public/og.svg" },
  { slug: "claude-tray",           svg: "claude-tray/site/public/og.svg" },
  { slug: "winwright",             svg: "winwright/site/public/og.svg" },
  { slug: "mini-gpt",              svg: "mini-gpt/site/public/og.svg" },
  { slug: "roadkeep",              svg: "roadkeep/docs/assets/og.svg",   png: "roadkeep/docs/assets/og.png" },
  { slug: "commitclerk",           svg: "ai-commit/docs/og.svg",         png: "ai-commit/docs/og.png" },
  { slug: "claude-code-time-study", svg: "development-time/docs/og.svg", png: "development-time/docs/og.png" },
]

export const W = 1200, H = 630
/* The frame every card is laid out on: 90px gutters, so 1020px of usable width, and the
   URL line is right-anchored at 1110. The left bound is checked at 80 rather than 90
   because two marks are optically aligned instead of boxed — PPortal's ring reaches 81,
   mini-gpt's mark 88, both deliberate. */
const GUTTER_L = 80, GUTTER_R = 1110, SLACK = 3
export const FRAME = GUTTER_R - 90

const DEJAVU_DIRS = [
  process.env.OG_DEJAVU_DIR,
  "D:/Dev/python/Lib/site-packages/matplotlib/mpl-data/fonts/ttf",
  "/usr/share/fonts/truetype/dejavu",
  "/usr/share/fonts/dejavu",
].filter(Boolean)

function fontFiles() {
  const want = /^DejaVuSans(-Bold|-Oblique|Mono|Mono-Bold)?\.ttf$/
  for (const dir of DEJAVU_DIRS) {
    if (!existsSync(dir)) continue
    const found = readdirSync(dir).filter(f => want.test(f)).map(f => join(dir, f))
    if (found.some(f => f.endsWith("DejaVuSans.ttf"))) return found
  }
  throw new Error(
    "DejaVu Sans not found. The banners name it explicitly, and rendering without it\n" +
    "measures a different font than the one that ships. Set OG_DEJAVU_DIR to a folder\n" +
    "holding DejaVuSans.ttf (matplotlib bundles them under mpl-data/fonts/ttf).\n" +
    "Looked in:\n  " + DEJAVU_DIRS.join("\n  ")
  )
}

function loadResvg() {
  const req = createRequire(import.meta.url)
  const candidates = ["winwright", "pportal", "claude-tray", "freewilly", "mini-gpt"]
    .map(p => join(gitRoot, p, "site", "node_modules", "@resvg", "resvg-js", "index.js"))
  for (const c of candidates) {
    if (existsSync(c)) return req(c).Resvg
  }
  try { return req("@resvg/resvg-js").Resvg } catch { /* fall through to the message */ }
  throw new Error(
    "@resvg/resvg-js not found. It is the rasteriser the project sites build with, so\n" +
    "measuring with anything else measures the wrong thing. Install it in any sibling\n" +
    "site (e.g. cd ../winwright/site && npm i) or in this repo."
  )
}

const Resvg = loadResvg()
const FONTS = fontFiles()

export function render(svg) {
  const img = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    // loadSystemFonts:false is the whole point — a stray system face would put this
    // back to rendering something other than what the build renders
    font: { loadSystemFonts: false, fontFiles: FONTS, defaultFontFamily: "DejaVu Sans" },
  }).render()
  return { w: img.width, h: img.height, px: img.pixels, png: () => img.asPng() }
}

const lum = (p, i) => 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]
const INK = 105

/* How wide is one line, really? Drawn on a wide throwaway canvas and measured back. */
export function measure(text, { size, bold = false, mono = false } = {}) {
  const PAD = 20, SCALE = 2.5
  const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const probe =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 3000 300">` +
    `<rect width="3000" height="300" fill="#000"/>` +
    `<text x="${PAD}" y="200" fill="#fff" font-size="${size}"` +
    ` font-family="DejaVu Sans${mono ? " Mono" : ""}"${bold ? ` font-weight="bold"` : ""}>` +
    `${esc(text)}</text></svg>`
  const { w, h, px } = render(probe)
  let last = -1
  for (let y = 0; y < h; y++) {
    for (let x = w - 1; x > last; x--) {
      if (lum(px, (y * w + x) * 4) > 60) { last = x; break }
    }
  }
  return Math.round((last + 1) * SCALE - PAD)
}

export function check(file) {
  const { w, h, px } = render(readFileSync(file, "utf8"))
  const bad = []
  if (w !== W || h !== H) bad.push(`size ${w}x${h}, expected ${W}x${H}`)

  const rows = []
  for (let y = 0; y < h; y++) {
    let first = -1, last = -1
    for (let x = 0; x < w; x++) {
      if (lum(px, (y * w + x) * 4) > INK) { if (first < 0) first = x; last = x }
    }
    rows.push({ y, first, last })
  }

  /* A row whose ink spans the whole width is a full-bleed band — the 8px accent rule at
     the top, a wave at the bottom. Those are meant to touch the edge, so the gutter rule
     applies only to rows that are actually setting type. */
  const type = rows.filter(r => r.last >= 0 && !(r.first <= 2 && r.last >= w - 3))

  const over = type.filter(r => r.last > GUTTER_R + SLACK)
  over.reduce((acc, r) => {
    const prev = acc[acc.length - 1]
    if (prev && r.y - prev.y2 <= 4) { prev.y2 = r.y; prev.max = Math.max(prev.max, r.last) }
    else acc.push({ y1: r.y, y2: r.y, max: r.last })
    return acc
  }, []).forEach(b => bad.push(
    `type y=${b.y1}..${b.y2} reaches x=${b.max}, ${b.max - GUTTER_R}px past the gutter` +
    (b.max >= w - 2 ? "  <- CLIPPED by the canvas edge" : "")))

  const left = type.filter(r => r.first >= 0 && r.first < GUTTER_L - SLACK)
  if (left.length) bad.push(`${left.length} rows start before x=${GUTTER_L}`)

  /* A decorative band built from a whole number of periods stops short of 1200 and the
     close cuts straight down mid-canvas, leaving the corner bare. A real wave edge is a
     diagonal touching many columns; a truncated fill is one column repeated down many
     rows, and a gradient never steps at all. */
  const seam = {}
  for (let y = h - 60; y < h - 1; y++) {
    for (let x = 1; x < w; x++) {
      const a = (y * w + x - 1) * 4, b = (y * w + x) * 4
      if (Math.abs(px[a] - px[b]) + Math.abs(px[a + 1] - px[b + 1]) + Math.abs(px[a + 2] - px[b + 2]) > 26) {
        seam[x] = (seam[x] ?? 0) + 1
      }
    }
  }
  Object.entries(seam).filter(([, n]) => n > 25).forEach(([x, n]) => bad.push(
    `vertical seam at x=${x} across ${n}px of the bottom band — decoration stops before ${w}`))

  const inkL = Math.min(...type.filter(r => r.first >= 0).map(r => r.first))
  const inkR = Math.max(...type.map(r => r.last))
  return { bad, inkL, inkR }
}

/* ---------------------------------- CLI ---------------------------------- */
const argv = process.argv.slice(2)
const mode = argv[0]

if (mode === "--render") {
  const [, src, out] = argv
  if (!src || !out) { console.error("usage: --render <in.svg> <out.png>"); process.exit(2) }
  const r = render(readFileSync(src, "utf8"))
  writeFileSync(out, r.png())
  console.log(`wrote ${out}  ${r.w}x${r.h}`)

} else if (mode === "--measure") {
  const size = Number(argv[1])
  const bold = argv.includes("--bold"), mono = argv.includes("--mono")
  const lines = argv.slice(2).filter(a => !a.startsWith("--"))
  for (const t of lines) {
    const px = measure(t, { size, bold, mono })
    const slack = FRAME - px
    console.log(`${slack < 0 ? "OVERFLOWS" : "fits     "} ${String(px).padStart(4)}px  ` +
                `${slack < 0 ? `+${-slack} over` : `${slack} spare`}  ${t}`)
  }

} else if (mode === "--check") {
  const explicit = argv.slice(1).filter(a => !a.startsWith("--"))
  const targets = explicit.length
    ? explicit.map(f => ({ slug: f, path: f }))
    : MANIFEST.map(m => ({ slug: m.slug, path: join(gitRoot, m.svg) }))

  let failed = 0, missing = 0
  for (const t of targets) {
    if (!existsSync(t.path)) { console.log(`SKIP   ${t.slug} — no such file: ${t.path}`); missing++; continue }
    /* A banner that will not parse is the worst failure of the set — the build writes
       nothing and the card silently stays whatever shipped last. Reported as a finding
       rather than thrown, so one broken file does not hide the other seven.
       The trap that earned this: a double hyphen is illegal inside an XML comment, so
       writing a command-line flag into a note about how to regenerate the file breaks it. */
    let result
    try { result = check(t.path) }
    catch (err) {
      console.log(`FAIL   ${t.slug}`)
      console.log(`        does not parse as SVG: ${err.message.replace(/\s+/g, " ").trim()}`)
      failed++
      continue
    }
    const { bad, inkL, inkR } = result
    console.log(`${bad.length ? "FAIL  " : "ok    "} ${t.slug}`)
    console.log(`        type x ${inkL}..${inkR}   (gutters ${GUTTER_L}..${GUTTER_R})`)
    bad.forEach(m => console.log(`        ${m}`))
    if (bad.length) failed++
  }
  console.log(`\n${failed ? `${failed} banner(s) outside the frame` : "all banners inside the frame"}` +
              `${missing ? `, ${missing} skipped` : ""}`)
  process.exit(failed ? 1 : 0)

} else {
  console.log(readFileSync(fileURLToPath(import.meta.url), "utf8")
    .split("\n").filter(l => l.startsWith("//")).map(l => l.slice(3)).join("\n"))
  process.exit(mode ? 2 : 0)
}
