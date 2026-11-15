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

### §AG33 Apply the latest consent choice on the current page

The AG30 browser check reproduced an existing consent-state bug: allow analytics, reopen
settings, decline, reopen settings and allow again. The stored choice becomes granted,
but window['ga-disable-' + SITE.analytics] stays true because loadAnalytics returns
immediately once its loaded flag is set. The visitor's latest choice is therefore not
applied until a full page navigation.

Clear the measurement-specific disable flag whenever analytics is explicitly enabled,
before the already-loaded guard. Preserve script deduplication, no request before
consent, stored refusal, and revocation. Add a maintained browser regression that
exercises the real built site and the full grant/revoke/grant sequence, intercepting the
analytics script rather than sending tracking data. Include refusal across a reload and
reopening settings. Keep this functional correction separate from the compact banner
layout.
