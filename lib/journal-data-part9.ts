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
    content: `Honey, If Only is a public archive of short messages people chose not to send. You can read recent entries, search the current collection, browse recipient-name listings, or submit a letter of your own. The archive is public; it is not a private journal, inbox, or verified record about the people named in a submission.

## Search the current letters

Open the [Letters page](/letters) and use its search field to look for a recipient name. This search checks the recipient-name field, not the text of a letter. If you do not find a match, try a spelling variation or browse the [A-to-Z Name Archive](/archive). A blank result only means that the current letters archive did not return a matching name; it does not show that no one wrote a letter or reveal anything about a particular person's feelings.

## Browse the name directory and color labels

The [Name Archive](/archive) is an A-to-Z way to browse recipient-name listings. A name is a search label, not proof that a submission refers to one identifiable person. Many people share names, and the site cannot verify the writer's identity or the truth of a message.

The [Colors page](/colors) explains this site's color labels. They are a way to browse the archive, not a universal code for what a writer or recipient feels.

## Write and submit a message

Use the [Write a Letter page](/write) to submit a short message. New submissions made through the current form are reviewed before publication. Approved letters are public, and an optional sender name may appear if you provide one. Before submitting, read the [Privacy Policy](/privacy) and [Moderation Policy](/moderation); avoid information that could identify or endanger you or someone else.

## Read results with care

An entry is user-submitted writing, not a verified account of an event or a message from a person you recognize. Do not use archive search to identify someone, contact them, infer their private thoughts, or get around a boundary such as a block or a request for no contact. If an entry raises a privacy, rights, or safety concern, send its URL and details through the [Contact page](/contact) so it can be reviewed.`
  }
];
