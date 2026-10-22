import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About the Editor — ${SITE_NAME}`,
  description: `Learn how ${SITE_NAME} is run, how submissions are moderated, and how editorial content is prepared.`,
  alternates: { canonical: `${SITE_URL}/author` },
};

export default function AuthorPage() {
  return (
    <TrustPage
      eyebrow="Founder & Editor"
      title="The editor behind the archive"
      subtitle={`An independent project operated by one editor, with clear moderation and editorial responsibilities.`}
      highlights={[
        { label: 'Role', value: 'Founder & sole editor', detail: 'Runs current submission moderation, journal content, and site maintenance.' },
        { label: 'Editorial scope', value: 'Moderation & publishing', detail: 'Responsible for submissions, moderation, journal content, and site maintenance.' },
        { label: 'Contact', value: 'ifonlyisentthis@gmail.com', detail: 'For corrections, removals, questions, or collaboration.' },
      ]}
      sections={[
        {
          title: 'Who I am',
          eyebrow: 'Background',
          children: (
            <>
              <p>
                {SITE_NAME} is an independent project operated by one editor. This page describes the editor&apos;s
                responsibilities without publishing personal identifiers or unrelated personal projects.
              </p>
              <p>
                {SITE_NAME} started as a personal project for people who want to put unsent words into a short
                written form. The 25-word limit is a format choice, not a measure of how honest or meaningful a
                message is. No account is required, but approved submissions are public; the optional sender name
                may be displayed. New submissions are reviewed under the current rules, but review is not identity
                verification, and older archive entries may have a different publication history.
              </p>
            </>
          ),
        },
        {
          title: 'What I do on this site',
          eyebrow: 'My role',
          children: (
            <>
              <p>
                I am the only person who runs {SITE_NAME}. There is no editorial board, no review committee, and
                no team. New letters submitted through the current form pass through the moderation queue before
                publication. This describes the current process; older archive material may have a different publication history.
              </p>
              <p>
                The editor writes the journal essays. These are personal, research informed pieces about grief,
                heartbreak, closure, and the psychology of unspoken words. They draw on publicly available
                research and widely discussed psychological frameworks, not clinical expertise. Practical
                guides about the site and writing formats may also appear under the Honey, If Only byline.
                I am not a licensed therapist or psychologist, and the journal does not offer clinical advice.
              </p>
            </>
          ),
        },
        {
          title: 'Editorial standards',
          eyebrow: 'How I work',
          children: (
            <>
              <p>
                Journal essays may draw on published studies, established psychology literature, and
                credible reporting, with sources identified where relevant. Site guides may be published
                under the Honey, If Only byline. No article on this site has been reviewed by a licensed
                mental health professional unless explicitly stated on the article itself.
              </p>
              <p>
                If an article contains a factual error, report it through the{' '}
                <Link href="/contact">contact page</Link> with the article URL and the correction. The editor
                reviews correction requests and adds a note when a published article needs correction.
              </p>
            </>
          ),
        },
        {
          title: 'Why this matters',
          eyebrow: 'Philosophy',
          children: (
            <p>
              {SITE_NAME} gives people a place to write words they do not plan to send. Its focus is a simple
              one: some feelings are too heavy for a conversation but too important to disappear.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/methodology', label: 'Methodology', description: 'How letters are screened and articles are written.' },
        { href: '/journal', label: 'Journal', description: 'Essays on heartbreak, grief, and the words left unsaid.' },
        { href: '/contact', label: 'Contact', description: 'Reach the site editor for corrections, removals, or questions.' },
      ]}
    />
  );
}
