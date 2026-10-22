import type { JournalPost } from './journal-data';

export const POSTS_PART52: JournalPost[] = [
  {
    slug: 'when-unsent-letter-archives-lose-your-words',
    title: "What Happens to an Unsent Letter in an Online Archive?",
    excerpt: "Online archives have different review, display, retention, and removal policies. Check those terms before submitting; do not assume that a public post is permanent, private, or self-service editable.",
    date: 'July 2026',
    related: ['why-unsent-letter-submissions-disappear', 'navigating-the-unsent-messages-archive'],
    faq: [
      {
            "question": "Will an online archive keep my message forever?",
            "answer": "Not necessarily. Retention depends on the platform’s policy and technical operation. Read the privacy and terms pages before submitting."
      },
      {
            "question": "Can I remove a message from Honey, If Only?",
            "answer": "There is no self-service deletion option. Contact the site with the message URL for a removal review. Approved messages may remain in the archive under the stated retention policy."
      }
],
    references: [] ,
    content: `A public archive can change. A message may be hidden, removed under a platform’s rules, affected by a technical issue, or retained for a period described in the service’s policies. The disappearance of a post does not by itself prove that a platform intentionally deleted it or that the writer did something wrong.

## Check the policy before sharing

Look for clear information about how submissions are reviewed, whether names or handles can appear, how long approved posts may remain, and how to request a correction or removal. If these details are missing, ask the service before sharing something sensitive. Keep a private copy only if doing so is safe for you; do not use an online archive as your only copy.

At Honey, If Only, approved letters may remain in the public archive indefinitely, while moderation records may be retained for operational reasons as described in the [Privacy Policy](/privacy). There is no self-service edit or delete feature; contact the site if you want a letter reviewed for removal. The site cannot promise uninterrupted access to an online archive.

A short public post is not the same as a private journal. Remove names, contact details, and distinctive personal stories that you do not want to be visible. You can also choose not to submit.`
  }
];
