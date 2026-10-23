# Shipped Ledger

## Block A — A catalogue crawlers can read

- ✅ **AG1** **Google Analytics loads on every page without consent while the hero badge says no tracking** — Google Analytics now loads only after the visitor allows it, from a consent banner the footer reopens, and the hero badge says analytics waits for consent instead of no tracking.
- ✅ **AG2** **The hub is one inline-styled page, off the stack and design system its product sites share** — The hub runs Vite, React and Tailwind v4 on the design system's warm tone, ./site chrome and prerender; the deploy publishes dist/ and verify.mjs refuses a colour of its own.
- ✅ **AG3** **The project grid and footer are built by JavaScript, so crawlers and LLMs read an empty catalogue** — Every card, the flagship and the footer index render at build from src/data, so the HTML holds each name, blurb and link, and projects.json is generated from the same list.
- ✅ **AG4** **Projects are grouped by format, which says nothing about whom each one is for** — The catalogue sorts into Agent Workbench, Windows Native and Lab with a page each under /lines/, and the home page leads with the flagship that SITE.flagship names.
- ✅ **AG5** **No page on the hub describes a single product, so each one exists only as a card** — Each project has /products/<id>/ with pitch, lines, licence, install, links and a SoftwareApplication JSON-LD block, linking its product site rather than copying it.
- ✅ **AG6** **The sitemap is written by hand and there is no llms.txt, so new pages wait to be found** — The sitemap, robots.txt, llms.txt, a Markdown twin per page and an OG card per route are written at build from the route table, so a new project lands in each.
- ✅ **AG7** **sync-sponsor.mjs writes markup into every site, and each one styles the sponsor block again** — The hub renders the sponsor with the design system's SiteSponsor and no CSS of its own; sync-sponsor.mjs serves only the plain pages and can emit that same markup.
- ✅ **AG15** **Nothing on the hub says the author of every product is one person who also builds Viglet and Cursarei** — The home page carries a Person with the author's six profiles, Viglet and Japode in its JSON-LD, every product author points at it by @id, and About and index.md name Viglet and Cursarei.

## Block B — Proof from the projects' own records

- ✅ **AG8** **Nothing shows what the projects shipped, though each one keeps a roadkeep changelog** — /changelog/ reads every product's roadkeep ledger from its public repository at a resolved commit, dates each entry by the commit that wrote it, and ships an Atom feed.
- ✅ **AG9** **A product page cannot say what comes next, though each roadmap already holds it** — Each product page lists its roadmap's open blocks and lines at the commit the build read, and says so when nothing is open rather than hiding the section.
- ✅ **AG10** **Product pages show no public numbers: stars, latest release, downloads** — A build step reads stars, the latest release and its downloads, and PyPI downloads, from public endpoints only; pages show them with an as-of date and a daily rebuild.
- ✅ **AG11** **No page explains the method the Agent Workbench tools add up to** — /method/ walks the workflow one Workbench tool per step and quotes five Lab figures, each with the sentence it comes from and a link to it.

## Block C — A vendor's reach

- ✅ **AG13** **Claude Code plugins are installed one repository at a time, with no place listing them** — The manifest lives in this repository's .claude-plugin/, so one command adds it and roadkeep, winwright, polyweave and Piano install from it; /plugins/ reads the same file.
- ✅ **AG14 (the header search)** **The site has no search, and the sponsor's search product is not shown working** — The header search on @viglet/turing-sdk is built and credits Turing; it switches on once a Turing site indexes the hub and allows its origin, which SITE.search.site then names.
