import type { JournalPost } from './journal-data';

export const POSTS_PART9: JournalPost[] = [
  {
    slug: 'navigating-the-unsent-messages-archive',
    title: "Navigating the Unsent Message Archive: Search, Browse, and Submit",
    excerpt: "Use the archive to browse recent letters, search by recipient name, view site color labels, or submit a new letter. Search results are user submissions, not verified messages about a specific person.",
    date: 'May 2026',
        related: ['the-2am-echo-missing-ex', 'does-writing-an-unsent-letter-actually-help-you-heal', 'the-psychology-of-closure-why-we-dont-need-an-apology-to-move-on'],
    faq: [
      {
            "question": "How do I search for a name in the archive?",
            "answer": "Use the search controls on the Letters or Archive page and enter the spelling you want to find. A name match does not identify the intended recipient."
      },
      {
            "question": "What should I know before submitting a letter?",
            "answer": "New form submissions are reviewed before publication. The optional sender name may be shown publicly if supplied, and approved letters may remain in the archive; read the Privacy Policy before sharing personal details."
      }
],
    references: [],
    content: `Honey, If Only has several ways to browse and submit. The [Letters page](/letters) shows recent messages and offers archive search. The [Archive page](/archive) provides name-based browsing. The [Colors page](/colors) explains the palette used by this site.

## Search with the limits in mind

Enter a recipient name or a likely spelling. Results show posts that match the search in this archive; a shared first name does not prove that a message is about you or someone you know. A missing result only means the current archive did not return a match for that query.

## Submit a new letter

Use the [Write page](/write) to enter the recipient name, message, and color. New submissions through the current form are reviewed before publication. The optional sender-name field may appear with an approved letter, and older archive material may have a different publication history. Review the [Privacy Policy](/privacy) and [Moderation Policy](/moderation) before sharing anything identifying.

An archive is a public collection, not a private inbox or a verified account of events. Do not use name search as a way to contact someone, infer their feelings, or bypass a block. If you see content that appears to violate current site rules, use the [Contact page](/contact) to request review.`
  }
];
