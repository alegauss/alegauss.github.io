# Improvements

## Block A — A catalogue crawlers can read

### §AG1 Consent before the tag

The hero badge reads "Open source · free · no tracking", and since `0fc6105` every page
loads `gtag.js` (G-6HG45Q9BHP) before the visitor has said anything. The About card
"Nothing is collected or phoned home" is about the tools and stays true; the badge is
about the page and is not.

Two ways out, and the first is the one to take: load the tag only after consent, as
viglet.org does with `ConsentBanner` and `src/lib/analytics.ts`, and keep the badge's
promise for anyone who declines. The other is to drop "no tracking" from the badge.

The product sites load the same property (`558870541`, per visibility VS2), so each
subsite's design-system task carries the same consent flow.

Done when no request to googletagmanager.com leaves a page before consent, and the badge
says only what the page does.

### §AG2 The hub on the product sites' stack

`index.html` is 33 KB with its own tokens (`--clay`, `--bg`, `--panel`) and components,
and it cannot grow past one page without copying them. Eight of its product sites
already run one stack: Vite, React and Tailwind v4, prerendered by SSR.

The change puts the hub on that same stack rather than a third one, with
`@viglet/viglet-design-system`: `data-tone="warm"` (VDS213) with the clay accent, the
`./site` components (VDS214) and the prerender helper (VDS215). Typed data lives in
`src/data/`. Each project keeps its colour as an accent on its own card and page. The
deploy uploads the build output instead of the repository root, which also stops `docs/`
and `scripts/` being served.

Every URL the site answers today keeps answering: `/`, `projects.json`, `sponsor.json`
and the `viglet/` logos, since the product sites and `sync-sponsor.mjs` read them.

Done when the built site matches today's content, the deploy publishes only the build
output, and no colour or radius in the hub is declared outside the design system.

### §AG3 The catalogue in the HTML

The cards and the footer index come from `projects.json` at runtime. A crawler that does
not run the script sees a `<noscript>` list of names and nothing else. The sponsor block
was made static markup for exactly this reason (see the `$comment` in `sponsor.json`),
and the projects, which are the site's whole point, did not get the same rule.

With AG2 the catalogue renders at build time from typed data, so every name, blurb,
pitch and link is in the HTML. `projects.json` stays published as a generated file,
because other sites read it.

Done when the built `index.html` carries every project's name, blurb and link with
JavaScript disabled, and `projects.json` is generated from the same source as the cards.

### §AG4 Product lines and a flagship

The tracks are apps, cli and measured: something to install, to type, to read. That is a
format, and a visitor arrives with a problem, not a format.

The catalogue sorts into:

- **Agent Workbench**: tools for working with coding agents without losing track of
  them. roadkeep, roadkeep-gui, commitclerk, winwright, polyweave, Piano, Claude Code
  Tray.
- **Windows Native**: the app the platform should have shipped. FreeWilly, PPortal,
  Quickshell, Claude Code Tray.
- **Lab**: write-ups with measured numbers. Mini GPT, the Usage Simulator, the Time Study.

A project can sit in two lines. The home page leads with one flagship rather than an
even grid, which is visibility's rule against promoting everything at once; the flagship
is a field in the data, not a position in the list.

Done when each line has its own page at `/lines/<id>/`, the home page shows the flagship
first, and changing the flagship is a one-field edit.

### §AG5 A page per product

Each product today is a card that links out to its own site, or to GitHub where there is
no site. The hub has nothing to rank for a product name.

The change is `/products/<id>/`, built from the same data: the pitch, the line, the
licence, install commands, screenshots, and links to the product site, docs and source.
It is a summary, not a copy. The product site stays the canonical page for its own
content, so the hub page links to it and does not duplicate it. Piano and roadkeep-gui,
which have no site, get their fullest page here.

Done when every project has a page, each carries a `SoftwareApplication` JSON-LD block,
and no hub page repeats a paragraph its product site already publishes.

### §AG6 Sitemap and llms.txt from the data

`sitemap.xml` and `robots.txt` are static files. With product and line pages the sitemap
would be out of date on the first addition.

The change follows viglet.org (`src/app/sitemap.ts`, `src/lib/llms.ts`): the sitemap,
`llms.txt` and per-page OG images are generated at build from the same data as the
pages. The sitemap also lists the product sites, which visibility (VS33) tracks as not
yet indexed.

Done when adding a project to the data adds it to the sitemap, `llms.txt` and an OG
image without another edit.

### §AG7 The sponsor block from the design system

`scripts/sync-sponsor.mjs` writes the same sponsor markup into every product site, and
each site styles `.sponsor`, `.sponsor-product` and the rest itself.

With VDS214 the React sites render the sponsor slot from `./site`, fed `sponsor.json` at
build. The prerendered HTML still carries it, which is the reason the block was made
static in the first place. The script then serves only the three plain pages, emitting
the `site.css` markup (VDS216). Sites that have not migrated keep their current markup
until their own task lands.

Done when every migrated site renders the sponsor with no sponsor CSS of its own,
`sponsor.json` remains the single source, and `sync-sponsor.mjs --check` still fails on
drift for the pages it serves.

## Block B — Proof from the projects' own records

### §AG8 One changelog across products

Most of the projects are governed by roadkeep, so each has a `CHANGELOG.md` whose
entries have a fixed shape. Nothing reads them together.

The change is `/changelog/`: at build, the entries from every product's ledger, newest
first, filterable by product and line, with an RSS/Atom feed. Entries are linked to the
product page and to the commit where the ledger records one. The build reads the files
from each public repository at a pinned ref, not from a local checkout.

Done when a ship in any governed product appears on `/changelog/` and in the feed after
the next build, with no edit to the hub.

### §AG9 What comes next, per product

Each governed product's `ROADMAP.md` lists its open work by block. A visitor deciding
whether to adopt a tool cannot see that it is moving or where.

The change is a "What comes next" section on each product page, built from that
product's roadmap: the open blocks and their lines' symptoms, with the status markers.
It shows what roadkeep already publishes in the repository and adds no editorial layer.

Done when each governed product's page lists its open blocks from its roadmap at build,
and a product with an empty roadmap says so rather than hiding the section.

### §AG10 Public numbers at build time

visibility collects stars, releases and release downloads daily, together with private
traffic from GitHub, GA4 and Search Console. Only the first group is public.

The change is a build step that reads stars, the latest release and its downloads (and
PyPI downloads where there is a package) from the public APIs, plus a scheduled daily
rebuild. It does not read visibility's export, so the site depends on nothing private
and cannot publish a traffic figure by accident.

Done when each product page shows its public numbers with an "as of" date, and the build
never requests an owner-only endpoint.

### §AG11 A page for the method

roadkeep governs the backlog, roadkeep-gui reads every backlog, commitclerk writes the
commit, winwright reports four verdicts, and the friction skills file what an agent ran
into. Together they are a way of working with coding agents, and the site presents them
one card at a time.

The change is `/method/`: the workflow end to end, one step per tool, with the Time
Study and the Usage Simulator as measured evidence. It claims only what the tools do
today.

Done when the page links every Workbench product at the step where it is used, and every
figure on it comes from a Lab write-up.

## Block C — A vendor's reach

### §AG12 A domain of its own

A CNAME on `alegauss.github.io` makes GitHub serve the project sites under the same
domain (`<domain>/<repo>/`) and redirect the old addresses. The cost is a Search Console
property, GA4 hostnames and visibility's `products.json` hosts updated in one move,
which is cheaper while the sites have little ranking to lose.

Choosing the domain is the owner's decision and comes first.

Done when every page answers on the new domain, every old github.io address redirects,
and visibility collects under the new hosts.

### §AG13 A plugin marketplace and its page

Several products ship as Claude Code plugins, and each is installed from its own
repository. A marketplace manifest would make them installable as one catalogue with a
single command, and the hub is where it would be announced.

The change is the manifest, in a repository of its own, listing every plugin, plus a
`/plugins/` page on the hub that shows the command and each plugin's page.

Done when one command adds the marketplace, every listed plugin installs from it, and
the page is built from the same manifest.

### §AG14 Site search on Turing

Once there are product, line, changelog and method pages, a visitor needs search. The
sponsor's product does that, and viglet.org already uses it on itself
(`src/lib/site-search.ts`, `@viglet/turing-sdk`).

The change is the same: index the built pages in a Turing site and search them from the
header. Anything Turing cannot do here is filed in Turing's roadmap, not worked around
on the hub.

Done when the header search returns product and changelog pages, and the page states
that search runs on Viglet Turing.
