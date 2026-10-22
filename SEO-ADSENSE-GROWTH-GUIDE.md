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
- Added a concise homepage explanation of unsent letters, the public nature and limits of the archive, and links to the practical writing guide and trust pages. This responds to Search Console data showing the home page earns substantial impressions for the broad “unsent letters” query while its average position weakened in the latest comparable period.
- Expanded the non-comparison archive-navigation article with accurate instructions for the name-only archive search, the A-to-Z directory, color labels, safe submissions, and interpreting search matches; added a contextual link from the homepage after Search Console showed the article ranking around position 12 for “unsent messages.”
- Updated the site-wide description and write-page title, description, and H1 around the Search Console demand for unsent and anonymous-letter searches. The copy states that submissions are public, sender names are optional, and details may identify a writer; the write page also links to moderation and privacy information.
- Clarified the homepage and recipient-page headings and introductions so they describe the actual public archive and avoid repetitive keyword-stuffed copy.
- Removed misleading sitemap `lastModified` values where the source data did not contain a verified edit date.
- Added page-specific old-domain redirects in application code. The old domain’s DNS/domain attachment and any Vercel-level redirects still need to be checked in the hosting account.
- Removed only code confirmed unused or invalid: the unused `GoogleAnalytics` component, unused `collections-grid.css`, and the unrelated `supabase-js` security-placeholder package. The active `@supabase/supabase-js` dependency remains.

No AdSense or Monetag implementation, ad placement, `ads.txt`, legacy submission record, or protected comparison article was changed.

## Sustainable SEO plan

### 1. Use the connected Search Console baseline and inspect page types

The connected `sc-domain:honeyifonly.com` Search Console property returned data through October 19, 2026. For October 1–19 it recorded 4,235 Google Search clicks and 37,486 impressions. These are search clicks, not total site sessions or unique visitors. For a like-for-like 19-day comparison, September 1–19 had 5,134 clicks and 34,025 impressions; the October window had fewer clicks despite more impressions. This is a monitoring signal, not proof that a specific site edit caused a change.

The largest query opportunity is still the broad “unsent letters” search. It recorded 251 clicks from 4,100 impressions at an average position of 5.83 in October 1–19, compared with 336 clicks, 4,834 impressions, and position 4.92 in September 1–19. The home page is the principal landing page for this query. “Anonymous letter website” recorded 37 clicks and 803 impressions at position 5.85 in October 1–19; the home page is also its primary landing page. These results support making the existing home page more useful and clearer, rather than publishing a near-duplicate landing page.

The comparison searches remain strong. For October 1–19, “the unsent project alternative” averaged position 2.07, “unsent project alternative” averaged 2.17, and “websites like the unsent project” averaged 2.39. In the September 1–19 comparison, those terms averaged 2.20, 2.09, and 1.97, respectively. Across the three query variants, clicks fell from 539 to 437 and impressions from 1,771 to 1,690; combined CTR fell from about 30.4% to 25.9%, while average positions stayed around 2.1–2.4. Watch this trend, but do not use a short comparison window as a reason to alter the two protected comparison pages or their FAQs. The separate privacy-first supporting guide had no recorded impressions in October 1–19; that does not by itself establish whether Google has indexed it.

The United States, United Kingdom, Canada, Australia, New Zealand, and Ireland produced 2,874 clicks and 23,439 impressions in October 1–19—about 68% of reported clicks and 63% of impressions. Keep monitoring those markets as segments; do not create country pages without a distinct reader need.

### Fresh query evidence and competitor research limits (September 24–October 21)

The latest 28-day Search Console pull shows several concrete opportunities:

- “Unsent letters” brought the home page 379 clicks from 5,842 impressions at average position 5.46. Keep that phrase prominent; the query already has visibility, so track changes to snippet and page experience rather than adding a duplicate page.
- “Anonymous letter website” produced 47 clicks / 1,065 impressions at position 6.13; “anonymous letters website” produced 20 / 225 at position 5.30; and “anonymous letters to names” produced 14 / 135 at position 5.07. The home page is the main landing page for these intents. The write page now explains that submissions require no account, sender names are optional, approved submissions are public, and text can still identify someone; its title and H1 now say “Write an Unsent Letter Online,” with links to the privacy and moderation information.
- “Unsent messages” produced 44 clicks / 1,501 impressions at position 7.81, while “The Unsent Project” produced 38 / 6,081 at position 6.64. These are possible content and snippet opportunities, but they are not enough evidence to publish near-duplicate pages or edit the protected comparison content.
- The protected comparison queries remain strong: “the unsent project alternative” recorded 238 clicks / 765 impressions at position 1.98; “unsent project alternative” 208 / 790 at position 2.07; and “websites like the unsent project” 241 / 835 at position 2.25. Preserve their pages and related FAQs as instructed.

The [official Unsent Project About page](https://theunsentproject.com/about) describes an archive searchable by name, messages associated with a first love and a chosen color, and a submission/moderation process. Those are product themes, not independent evidence about the competitor's rankings.

The public [Similarweb profile for theunsentproject.com](https://www.similarweb.com/website/theunsentproject.com/) (September 2026) estimates that organic search supplied 49.22% of its desktop visits last month. Its visible top-keyword sample is dominated by navigational brand variants—“unsent project,” “the unsent project,” “unsentproject,” “unsent project archive,” and “theunsentproject”—and it reports 194 total keywords. The profile also estimates the US as 62.75% of desktop traffic, Canada 4.49%, and the UK 4.01%. Similarweb labels these as estimates; treat them as directional competitor context, not measured traffic or a promise of available demand.

The Ahrefs and Similarweb plugins show as enabled in the app, but their analytics functions are not exposed to this Codex task. The available Windsor.ai connector reports no Ahrefs or Similarweb accounts configured, so I could not query their authenticated keyword-gap reports here. The public Similarweb profile above is the available competitor evidence; the Search Console numbers below are first-party measurements for Honey, If Only. Do not build a new page around a competitor's brand terms alone. Prioritize unbranded intent that the site can serve distinctly, and keep the two protected comparison articles and their FAQs untouched.

For September 24–October 21, the US, UK, Canada, Australia, and New Zealand together generated 4,028 impressions and 261 clicks for “unsent letters” (average position 5.45). In those same markets, “the unsent project” had 3,120 impressions / 23 clicks at position 6.89; “unsent project” had 2,613 / 52 at position 7.24; and “unsent messages” had 1,111 / 38 at position 7.23. The protected comparison cluster remains considerably stronger: “websites like the unsent project” had 708 impressions / 197 clicks at position 2.40; “unsent project alternative” had 641 / 162 at 2.20; and “the unsent project alternative” had 564 / 181 at 2.02. These query-level patterns favor preserving the comparison pages and improving distinct, broader archive-navigation content instead of creating a competing branded page.

Within that same five-country filter, the existing [archive-navigation article](https://www.honeyifonly.com/journal/navigating-the-unsent-messages-archive) received 69 impressions / 2 clicks at position 12.12 for “unsent messages.” Its body has now been expanded with accurate steps for the name-only search, the A-to-Z directory, color labels, safe submission, and how to interpret matches; a contextual homepage link points readers to it. This is a focused improvement to an existing page, not evidence that rankings will rise.

In the Search Console page-dimension export, `/letters`, `/unsent`, and `/write` each appeared with identical 1,565 impressions and average position 5.71 for “unsent letters,” although the local metadata marks `/letters` and `/unsent` `noindex`. Treat those rows as a verification flag, not proof that the pages are currently indexed. Use Search Console URL Inspection and a live rendered-page check before changing index directives or archive routes.

Search Console reported successful sitemap downloads with zero errors and warnings for the `www` and bare-host sitemap records, each showing 1,161 submitted URLs. The Search Console `indexed` sitemap metric is deprecated and must not be interpreted as a current index count. Inspect representative URLs with URL Inspection to verify the canonical, live rendered page, crawl/index status, and last crawl. Sitemaps and performance data do not replace URL Inspection. Do not bulk-index recipient pages or remove `noindex` based only on sitemap counts; confirm that each page offers distinct value and that exposing its user-submitted material is appropriate.

Keep a monthly export of queries, pages, countries, impressions, clicks, CTR, and average position. Compare equal date windows and annotate major releases; Search Console data usually trails today, and average positions can vary by query, device, country, and result layout.

### 2. Grow around useful topic clusters, not article volume

Build on the hub and group future material around a small set of reader needs: breakup reflection and boundaries; grief and remembrance; drafting or deciding whether to send a message; archive navigation and privacy; and the history or culture of unsent letters. Each new page should answer a distinct question, contain original practical value, and link to the relevant hub, related articles, and site policy pages. Update an existing article when it can answer a query better than a new near-duplicate page.

Avoid mass-producing near-identical pages for recipient names, countries, colors, or keyword variations. Google’s people-first guidance discourages pages created mainly to attract search traffic, and its spam policy identifies large volumes of low-value pages as scaled content abuse. There is no useful “AI SEO hack” that substitutes for a page worth citing.

### 3. Improve pages using actual query evidence

For each page with meaningful impressions, compare the query to the title, opening answer, headings, source quality, and internal links. The next practical measurement is whether the homepage explainer improves impressions, position, and clicks for “unsent letters” and related terms; compare equal periods after it has had time to be crawled. Improve pages that have high impressions but low clicks only when the current title/snippet fails to meet the actual query. Improve pages with clicks but weak engagement by answering the query earlier and making next steps useful. Add citations for specific research or policy claims, explain study limits, and do not use psychological language as a diagnosis. Do not add fake “last reviewed” dates or claim clinical review that did not happen.

Keep one clear H1 per article, use descriptive H2/H3 headings, write unique metadata, and link with natural descriptive text. Structured data should describe what a reader can actually see. The site’s FAQ markup is not a shortcut to rankings; keep answers useful and consistent with the visible page.

### 4. Build reputation through evidence and transparency

Keep the role-based editor page, methodology, moderation, privacy, contact, and correction paths easy to find. Add author or reviewer credentials only when real, cite the primary source where a factual claim depends on it, and correct errors with a visible note when appropriate. Seek genuine references from relevant publications, educators, writers, or support organizations by offering useful resources; do not buy links, trade keyword-stuffed guest posts, or create a private backlink network.

The founder page now avoids publishing personal identifiers. The protected comparison pages were left as requested; if their preserved byline exposes the founder’s full name, that exposure remains until you authorize a change to those pages.

### 5. Measure Google AI visibility without guessing

Google says AI Overviews and AI Mode use the same basic Search eligibility and people-first SEO practices; there is no special schema or separate page format required. Check the Search Console generative-AI performance report if it is available for the property. Do not assume that `Google-Extended` controls AI Overviews: it does not. It can affect whether public content is used for Gemini Apps grounding/training, so keep the current disallow rule unless you deliberately decide that this use is appropriate for the archive, including legacy submissions.

## A realistic traffic goal

The October 1–19 baseline averages about 223 Google Search clicks per day; clicks are not the same as unique visitors. A 100× increase would mean roughly 22,300 daily Search clicks, an exceptionally ambitious target with no guarantee. As arithmetic only, doubling every six months reaches 128× after seven doublings (42 months); sustaining that pace is uncommon and depends on audience demand, genuinely useful pages, independent references, competition, and technical performance. Track monthly organic clicks, qualified sessions, top landing pages, country share, and return visits. Reassess the new homepage copy and the recently added topic guide after Google has had time to crawl them. Prioritize changes that lift relevant pages over adding content for its own sake.

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
