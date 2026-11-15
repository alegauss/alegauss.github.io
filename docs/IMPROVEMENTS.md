# Improvements

## Block A — A catalogue crawlers can read

## Block B — Proof from the projects' own records

## Block C — A vendor's reach

### §AG12 A domain of its own

A CNAME on `alegauss.github.io` makes GitHub serve the project sites under the same
domain (`<domain>/<repo>/`) and redirect the old addresses. The cost is a Search Console
property, GA4 hostnames and visibility's `products.json` hosts updated in one move,
which is cheaper while the sites have little ranking to lose.

Choosing the domain is the owner's decision and comes first.

Done when every page answers on the new domain, every old github.io address redirects,
and visibility collects under the new hosts.

### §AG14 Site search on Turing

Once there are product, line, changelog and method pages, a visitor needs search. The
sponsor's product does that, and viglet.org already uses it on itself
(`src/lib/site-search.ts`, `@viglet/turing-sdk`).

The change is the same: index the built pages in a Turing site and search them from the
header. Anything Turing cannot do here is filed in Turing's roadmap, not worked around
on the hub.

Done when the header search returns product and changelog pages, and the page states
that search runs on Viglet Turing.

## Block D — Independent AI products, built with our own tools

## Block E — Visual hierarchy and first-visit confidence

### §AG29 Evidence available at the right reading level

AG19, AG22, AG23 and AG25 added reviewed availability, documented development
relationships and authentic examples. These facts are credibility assets; this task
changes their visual presentation without weakening or deleting them.

On Product.tsx, Availability.tsx, ProductRelations.tsx and the relevant Method sections,
establish a clear reading order: benefit and outcome, authentic example, appropriate
next action, then supporting evidence. Consolidate repeated review dates and source
labels where that helps scanning. Consider native details/summary or another accessible
secondary treatment for lengthy provenance and build-method explanations. Keep labels
such as repository evidence and owner-confirmed practice attached to the claims they
qualify, including inside any disclosure.

Do not hide information needed to decide whether to install, such as maturity, essential
platform requirements, relevant warnings or licence restrictions. Preserve sources,
dates, photo credits and image provenance. Expanded evidence must remain reachable by
keyboard, usable without JavaScript and present in the prerendered HTML and Markdown
twin.

Verify default and expanded presentations on mobile and desktop, including focus,
heading structure and both colour themes. Preserve product links and avoid presenting
development tools as runtime requirements.

### §AG30 Compact mobile analytics consent

The mobile capture in this conversation showed the consent panel covering a substantial
portion of the product-discovery screen. Consent.tsx currently combines the analytics
choice with a separate claim about product telemetry and uses the standard large button
treatment. AG1 already prevents Google Analytics from loading before consent; preserve
that behaviour.

Keep the initial notice focused on the actual decision: optional Google Analytics is off
until allowed. Move supplementary explanation to an accessible details treatment or the
existing settings path when useful. Reduce padding and excess text on narrow screens
while keeping decline and allow choices equally legible and easy to reach. Do not reduce
text to an unreadable size, favour acceptance through visual hierarchy, auto-dismiss the
panel or load tracking before a decision.

Preserve the stored preference, the footer's Analytics settings entry point and the
ability to change the choice. Reuse design-system tokens and shared button conventions
where compatible with a compact layout.

Compare banner height at the same 360- and 390-pixel widths before and after. Verify
320-pixel width, text zoom and keyboard access without clipping or horizontal overflow.
Keep touch targets at least 44 CSS pixels, and confirm no analytics request before
consent or after a stored refusal.
