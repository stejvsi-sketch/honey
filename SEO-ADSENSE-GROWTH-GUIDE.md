# SEO, AdSense, and Organic Growth Guide

This guide records what the code audit could establish, what was changed locally, and what still requires account-level evidence. It does not change ad code or placements, archived submissions, or the two protected comparison articles and their related comparison FAQs.

## Findings that affect the next AdSense decision

### What the code can establish

- The local `robots.txt` rules allow Googlebot and `Mediapartners-Google` (the AdSense crawler) across public routes while excluding API and admin paths. There is no blanket Google Search or AdSense crawler block in the application rules.
- `Google-Extended` and several other AI-training crawlers are explicitly disallowed. Google says `Google-Extended` does not affect inclusion or ranking in Google Search. It controls whether Google may use crawled material for some Gemini training and grounding uses. This does not control AI Overviews; those use Google Search crawling and indexing.
- Some utility/archive routes deliberately carry `noindex`; recipient pages are indexable only when the existing name/count threshold is met. These rules were left intact because changing index coverage without Search Console evidence could expose thin or sensitive archive pages.
- The old-domain redirect code now maps known legacy paths to relevant current pages and returns `410` for unrecognized legacy paths instead of sending every URL to the archive. The code only takes effect if the legacy domain is attached to this deployment and its traffic reaches this application.
- The application source does not reveal the reason for any of the past AdSense rejections. Google directs publishers to the AdSense site status and rejection email for the site-specific reason. Common categories include insufficient content, content quality, policy issues, navigation, traffic sources, and supported language.

### What remains an AdSense risk

The legacy archive contains substantial user-submitted content, including older entries with names or handles and records that did not pass through the current workflow. Google holds the publisher responsible for user-generated content on pages where Google ads appear, even when a user supplied it. The archive records were not edited, removed, or reclassified in this work.

The long entry with self-harm material and unattributed text, and the record whose recipient is `seed`, need a human safety, consent, and rights review. Their appearance alone is not enough to conclude that either is test data or safe to remove. Until evidence is available, treat this as an unresolved policy and rights risk rather than assuming that the article improvements resolve it.

### Before another application

1. Read the exact AdSense rejection email and the site-specific status in AdSense. Save the wording and date; do not infer the reason from the fact that the site has many articles.
2. In Search Console, inspect representative URLs for the home page, a journal article, the new topic hub, a collection, and an indexable recipient page. Check the selected canonical, rendered HTML, indexing status, and crawl error. Check the live URL as well as the Google-selected version.
3. Confirm in the AdSense crawler/access report that `Mediapartners-Google` can fetch the live site, and check any CDN, WAF, Cloudflare, or hosting rules. The local robots file is permissive for that crawler, but a live firewall or domain configuration can still block it.
4. Review the site’s AdSense policy status and its ad experience report. Keep all existing AdSense and Monetag code and placements in their current positions.
5. Keep a documented moderation and rights-review process for content that may appear beside ads. Review the flagged legacy records using evidence and appropriate consent/rights checks; do not treat automated scanning as a substitute for the requested human review.
6. Reapply only after the account’s named issues have been addressed and the crawler can fetch the live pages. Reapplication timing or article count alone cannot guarantee approval.

## Search visibility work completed

- Added a topic hub so journal readers can browse related subjects.
- Added a separate privacy-first article about choosing an unsent-letter format. The existing two comparison articles and their comparison FAQs remain untouched.
- Added headings and clearer structure to the non-protected journal articles; reduced generic repeated FAQ copy and removed weak or misleading claims about universal psychological effects.
- Replaced Wikipedia and unsupported institutional references in the reviewed article references with direct research, publisher, or institutional sources where a source was warranted. Claims that the available evidence does not support were narrowed or removed.
- Made internal navigation and submission/privacy copy more accurate, including the optional public sender name and the different history of the older archive.
- Clarified the homepage and recipient-page headings and introductions so they describe the actual public archive and avoid repetitive keyword-stuffed copy.
- Removed misleading sitemap `lastModified` values where the source data did not contain a verified edit date.
- Added page-specific old-domain redirects in application code. The old domain’s DNS/domain attachment and any Vercel-level redirects still need to be checked in the hosting account.
- Removed only code confirmed unused or invalid: the unused `GoogleAnalytics` component, unused `collections-grid.css`, and the unrelated `supabase-js` security-placeholder package. The active `@supabase/supabase-js` dependency remains.

No AdSense or Monetag implementation, ad placement, `ads.txt`, legacy submission record, or protected comparison article was changed.

## Sustainable SEO plan

### 1. Establish a baseline before making more indexing changes

In Search Console, use the Web performance report and compare the last 3 months with the previous 3 months, then review a 16-month view for seasonality. Export queries, pages, countries, impressions, clicks, click-through rate, and average position. Compare the United States, United Kingdom, Canada, Australia, Ireland, and New Zealand separately; these are measurement segments, not separate geo-targeted pages to create. Search Console supports filtering by query, page, date, and country.

Use URL Inspection on a representative sample from each page type. Keep a list of canonical URL, Google-selected canonical, index status, last crawl, and any page experience or enhancement issue. Do not bulk-index recipient pages or remove `noindex` based only on a sitemap count. Confirm whether each page offers distinct value and whether it is appropriate to expose its user-submitted material.

### 2. Grow around useful topic clusters, not article volume

Build on the hub and group future material around a small set of reader needs: breakup reflection and boundaries; grief and remembrance; drafting or deciding whether to send a message; archive navigation and privacy; and the history or culture of unsent letters. Each new page should answer a distinct question, contain original practical value, and link to the relevant hub, related articles, and site policy pages. Update an existing article when it can answer a query better than a new near-duplicate page.

Avoid mass-producing near-identical pages for recipient names, countries, colors, or keyword variations. Google’s people-first guidance discourages pages created mainly to attract search traffic, and its spam policy identifies large volumes of low-value pages as scaled content abuse. There is no useful “AI SEO hack” that substitutes for a page worth citing.

### 3. Improve pages using actual query evidence

For each page with meaningful impressions, compare the query to the title, opening answer, headings, source quality, and internal links. Improve pages that have high impressions but low clicks with a clearer title and accurate description; improve pages with clicks but weak engagement by answering the query earlier and making next steps useful. Add citations for specific research or policy claims, explain study limits, and do not use psychological language as a diagnosis. Do not add fake “last reviewed” dates or claim clinical review that did not happen.

Keep one clear H1 per article, use descriptive H2/H3 headings, write unique metadata, and link with natural descriptive text. Structured data should describe what a reader can actually see. The site’s FAQ markup is not a shortcut to rankings; keep answers useful and consistent with the visible page.

### 4. Build reputation through evidence and transparency

Keep the role-based editor page, methodology, moderation, privacy, contact, and correction paths easy to find. Add author or reviewer credentials only when real, cite the primary source where a factual claim depends on it, and correct errors with a visible note when appropriate. Seek genuine references from relevant publications, educators, writers, or support organizations by offering useful resources; do not buy links, trade keyword-stuffed guest posts, or create a private backlink network.

The founder page now avoids publishing personal identifiers. The protected comparison pages were left as requested; if their preserved byline exposes the founder’s full name, that exposure remains until you authorize a change to those pages.

### 5. Measure Google AI visibility without guessing

Google says AI Overviews and AI Mode use the same basic Search eligibility and people-first SEO practices; there is no special schema or separate page format required. Check the Search Console generative-AI performance report if it is available for the property. Do not assume that `Google-Extended` controls AI Overviews: it does not. It can affect whether public content is used for Gemini Apps grounding/training, so keep the current disallow rule unless you deliberately decide that this use is appropriate for the archive, including legacy submissions.

## A realistic traffic goal

There is no traffic baseline or Search Console export here, so a responsible forecast for daily visits is not possible. A 100× increase is an ambitious target, not a promise. As arithmetic only, doubling every six months reaches 128× after seven doublings (42 months); sustaining that pace is uncommon and depends on audience demand, useful pages, links, competition, and technical performance. Track monthly organic clicks, qualified sessions, top landing pages, country share, and return visits. Prioritize improvements that lift several relevant pages over adding content for its own sake.

## Sources

- [AdSense: Your account wasn't approved](https://support.google.com/adsense/answer/81904)
- [AdSense: Make sure your site's pages are ready](https://support.google.com/adsense/answer/7299563)
- [AdSense: Fix crawler issues](https://support.google.com/adsense/answer/2381908)
- [AdSense: User-generated content responsibilities](https://support.google.com/adsense/answer/1355699)
- [AdSense: Publisher policies and restrictions](https://support.google.com/adsense/answer/10008391)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Search Console performance reports](https://support.google.com/webmasters/answer/10268906)
- [Google Search AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)
- [Google's explanation of the Google-Extended token](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [Google Search site migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
