import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL, EDITOR_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Methodology',
  description: `How ${SITE_NAME} screens letters, writes journal articles, handles corrections, and manages removal requests. Full transparency on the editorial process.`,
  alternates: { canonical: `${SITE_URL}/methodology` },
};

export default function MethodologyPage() {
  return (
    <TrustPage
      eyebrow="Methodology"
      title="How everything on this site gets made, reviewed, and published."
      subtitle={`${SITE_NAME} is a one person operation. This page explains exactly how letters are screened, how journal articles are written, who makes the decisions, and how to request corrections or removals.`}
      updated="July 2026"
      highlights={[
        { label: 'Moderation', value: 'One person, every letter', detail: `${EDITOR_NAME} personally reviews every submission before publication.` },
        { label: 'Clinical review', value: 'None', detail: 'Journal articles are research informed, not clinically reviewed. This is stated on every article.' },
        { label: 'Corrections', value: 'Within 48 hours', detail: 'Email a correction and it will be fixed within 48 hours with a public note.' },
      ]}
      sections={[
        {
          title: 'How letters are screened',
          eyebrow: 'Letter moderation',
          children: (
            <>
              <p>
                Every letter submitted through the <Link href="/write">Write a Letter</Link> page goes through
                two layers of review before it appears publicly.
              </p>
              <p>
                <strong>Automated filtering</strong> runs first. The system checks for profanity, enforces the
                25 word limit, validates character limits on names, applies rate limiting (maximum 6 submissions
                per day per device), and uses browser fingerprinting to prevent automated spam. Letters that fail
                automated checks are rejected immediately with an error message.
              </p>
              <p>
                <strong>Human review</strong> happens next. {EDITOR_NAME} reads every submission that passes
                automated filtering. He checks for targeted harassment, threats, sexually explicit content,
                personal information (full names, addresses, phone numbers, social handles), impersonation, and
                anything that could endanger the person named in the letter. Letters that pass are approved and
                appear in the archive. Letters that don&apos;t are rejected and never published.
              </p>
              <p>
                There is no algorithm that decides what gets published. There is no editorial team that votes.
                One person reads every letter and makes the call.
              </p>
            </>
          ),
        },
        {
          title: 'When a letter is rejected',
          eyebrow: 'Rejection criteria',
          children: (
            <>
              <p>A letter is rejected if it contains any of the following:</p>
              <ul>
                <li>Threats of violence, self harm encouragement, or suicide goading</li>
                <li>Sexually explicit or pornographic language</li>
                <li>Racial slurs, homophobic slurs, or derogatory language targeting identity</li>
                <li>Full names, addresses, phone numbers, or social media handles</li>
                <li>Spam, advertising, promotional content, or links</li>
                <li>AI generated or machine produced submissions</li>
                <li>Impersonation of real people with intent to deceive</li>
                <li>Content that is clearly gibberish or nonsensical</li>
              </ul>
              <p>
                Mild profanity is allowed when it serves the emotional honesty of the message. Anger is
                allowed. Grief is allowed. The line is drawn at content that could cause real harm to someone.
              </p>
            </>
          ),
        },
        {
          title: 'How journal articles are written',
          eyebrow: 'Editorial process',
          children: (
            <>
              <p>
                {EDITOR_NAME} writes all journal articles. The process is straightforward: he picks a topic
                (usually related to heartbreak, grief, closure, or the psychology of communication), reads
                published research and established psychology literature on that topic, and writes a long form
                essay exploring it through the lens of unsent letters and unspoken words.
              </p>
              <p>
                The articles are <strong>research informed personal essays</strong>. They reference publicly
                available studies and widely discussed psychological concepts, but they are not peer reviewed,
                clinically supervised, or written by a licensed mental health professional. Every article that
                touches on psychological topics carries a disclaimer stating this explicitly.
              </p>
              <p>
                No article on this site has been reviewed by a licensed therapist, psychologist, or counselor
                unless explicitly stated in the article&apos;s byline. The journal does not provide clinical advice,
                diagnoses, or treatment recommendations.
              </p>
            </>
          ),
        },
        {
          title: 'Who makes the decisions',
          eyebrow: 'Decision authority',
          children: (
            <p>
              All decisions on {SITE_NAME} are made by <strong>{EDITOR_NAME}</strong>, the site&apos;s founder and
              sole editor. This includes which letters get published, what journal topics are covered, how the
              site is designed, and how removal requests are handled. There is no editorial board, advisory
              panel, or review committee. This is an independent project run by one person.
            </p>
          ),
        },
        {
          title: 'Corrections and errors',
          eyebrow: 'Correction policy',
          children: (
            <>
              <p>
                If you find a factual error in any journal article, email{' '}
                <a href="mailto:ifonlyisentthis@gmail.com">ifonlyisentthis@gmail.com</a> with the article URL
                and the specific error. Corrections are made within 48 hours. A correction note is added to the
                bottom of the article explaining what was changed and when.
              </p>
              <p>
                Opinions, framing choices, and editorial perspectives are not treated as factual errors. If you
                disagree with an interpretation, you are welcome to reach out, but disagreement alone does not
                trigger a correction.
              </p>
            </>
          ),
        },
        {
          title: 'How removal requests work',
          eyebrow: 'Removals',
          children: (
            <>
              <p>
                If a letter references you, contains your personal information, or makes you feel unsafe,
                email <a href="mailto:ifonlyisentthis@gmail.com">ifonlyisentthis@gmail.com</a> with the
                letter URL. {EDITOR_NAME} reviews every removal request personally.
              </p>
              <p>
                Removal requests are handled within 48 hours. If the letter violates moderation standards, it
                is removed immediately. If it does not technically violate any rules but you still feel
                uncomfortable, the request is still taken seriously and evaluated on a case by case basis.
                Safety and privacy take priority over keeping content published.
              </p>
            </>
          ),
        },
        {
          title: 'Ad placement and content separation',
          eyebrow: 'Advertising',
          children: (
            <>
              <p>
                Advertisements are never displayed alongside unreviewed or pending content. Ads only appear on
                pages where all visible content has been reviewed and approved. Ads do not appear on legal pages,
                the submission form, or any content flagged for re-review.
              </p>
              <p>
                Ad revenue supports the cost of hosting, domain registration, and the time spent moderating
                submissions and writing journal content. Advertising does not influence which letters are
                published, which journal topics are covered, or how moderation decisions are made.
              </p>
            </>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/author', label: 'About the Editor', description: `Who ${EDITOR_NAME} is and why he built this site.` },
        { href: '/moderation', label: 'Moderation Policy', description: 'The full moderation standards and blocked content categories.' },
        { href: '/contact', label: 'Contact', description: 'Report errors, request removals, or ask questions.' },
      ]}
    />
  );
}
