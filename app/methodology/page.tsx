import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL, EDITOR_BYLINE } from '@/lib/constants';

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
      updated="October 2026"
      highlights={[
        { label: 'Moderation', value: 'Current submissions', detail: 'The site editor reviews submissions made through the current form before publication.' },
        { label: 'Clinical review', value: 'None', detail: 'Journal articles are research informed, not clinically reviewed. This is stated on every article.' },
        { label: 'Corrections', value: 'Reviewed by editor', detail: 'Send the article URL and the specific factual concern; response time can vary.' },
      ]}
      sections={[
        {
          title: 'How letters are screened',
          eyebrow: 'Letter moderation',
          children: (
            <>
              <p>
                New letters submitted through the <Link href="/write">Write a Letter</Link> page go through
                automated checks and editor review before publication. Older archive entries may have a different
                publication history.
              </p>
              <p>
                <strong>Automated filtering</strong> runs first. The system checks for profanity, enforces the
                25 word limit, validates character limits on names, applies rate limiting (maximum 6 submissions
                per day per device), and uses browser fingerprinting to prevent automated spam. Letters that fail
                automated checks are rejected immediately with an error message.
              </p>
              <p>
                <strong>Human review</strong> happens next. The site editor reads submissions that pass
                automated filtering. The editor checks for targeted harassment, threats, sexually explicit content,
                personal information (full names, addresses, phone numbers, social handles), impersonation, and
                anything that could endanger the person named in the letter. Current submissions that pass are
                approved for publication; those that fail are rejected. This describes the current workflow and
                does not establish the publication history of older archive material.
              </p>
              <p>
                Automated checks help screen current submissions, but the editor makes the publication decision.
                There is no editorial team that votes.
              </p>
            </>
          ),
        },
        {
          title: 'When a letter is rejected',
          eyebrow: 'Rejection criteria',
          children: (
            <>
              <p>A current submission may be rejected if it contains any of the following:</p>
              <ul>
                <li>Submissions not written in English</li>
                <li>Threats of violence, self harm encouragement, or suicide goading</li>
                <li>Explicit profanity, sexually explicit or pornographic language</li>
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
                The editor publishing under {EDITOR_BYLINE} writes the journal essays. The process is straightforward: the editor picks a topic
                (usually related to heartbreak, grief, closure, or the psychology of communication), reads
                published research and established psychology literature on that topic, and writes a long form
                essay exploring it through the lens of unsent letters and unspoken words.
              </p>
              <p>
                These essays are <strong>research informed personal essays</strong>. Separate practical guides
                may be published under the Honey, If Only site byline. The essays reference publicly
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
              All decisions on {SITE_NAME} are made by <strong>the site editor</strong>, the project&apos;s founder and
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
                and the specific error. The editor reviews correction requests and may add a note to the article
                when a factual correction is made. Response time can vary.
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
                letter URL. The site editor reviews every removal request personally.
              </p>
              <p>
                Requests are reviewed under the current moderation and privacy rules. Response time can vary, and
                contacting the site does not guarantee removal. If you are concerned about private information or
                safety, include those details so the editor can assess the request.
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
                Advertising eligibility and placement can depend on vendor settings and automated systems. The current submission review process does not establish the publication history of older archive material or guarantee where an ad may appear.
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
        { href: '/author', label: 'About the Editor', description: `How ${SITE_NAME} is run and how editorial decisions are made.` },
        { href: '/moderation', label: 'Moderation Policy', description: 'The full moderation standards and blocked content categories.' },
        { href: '/contact', label: 'Contact', description: 'Report errors, request removals, or ask questions.' },
      ]}
    />
  );
}
