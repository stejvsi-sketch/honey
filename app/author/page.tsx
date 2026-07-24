import type { Metadata } from 'next';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL, EDITOR_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${EDITOR_NAME} — Founder & Editor`,
  description: `About ${EDITOR_NAME}, computer science engineer, songwriter, and the founder and sole editor of ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/author` },
};

export default function AuthorPage() {
  return (
    <TrustPage
      eyebrow="Founder & Editor"
      title={EDITOR_NAME}
      subtitle={`Independent creator, computer science engineer, and the sole editor behind ${SITE_NAME}.`}
      highlights={[
        { label: 'Role', value: 'Founder & sole editor', detail: 'Built the archive from scratch and reviews every submission personally.' },
        { label: 'Background', value: 'CS engineer & songwriter', detail: 'B.Tech in Computer Science. Released music on Spotify, Apple Music, and other platforms.' },
        { label: 'Contact', value: 'ifonlyisentthis@gmail.com', detail: 'For corrections, removals, questions, or collaboration.' },
      ]}
      sections={[
        {
          title: 'Who I am',
          eyebrow: 'Background',
          children: (
            <>
              <p>
                I&apos;m <strong>Tejasvi Sharma</strong>, a computer science engineer (B.Tech, CS) who writes
                songs and builds things on the internet. My released tracks include <em>Blurred Lines of Longing</em>,{' '}
                <em>Diwali Night</em>, and <em>I Wish I Could Hate You</em>, available on Spotify and Apple Music.
                I also built <em>Afterword</em>, a digital vault app for encrypted messages and legacy delivery.
              </p>
              <p>
                {SITE_NAME} started as a personal project. I wanted to build a space where people could write the
                words they never sent and have them exist somewhere real, not as a draft in their notes app, but
                as part of something bigger. The 25 word constraint forces honesty. The anonymity removes fear.
                The human review keeps it safe.
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
                no team. Every letter submitted to the archive passes through my moderation queue before it
                appears publicly. I read each one.
              </p>
              <p>
                I write all of the journal essays. These are personal, research informed pieces about grief,
                heartbreak, closure, and the psychology of unspoken words. They draw on publicly available
                research and widely discussed psychological frameworks, not clinical expertise. I am not a
                licensed therapist or psychologist, and the journal does not offer clinical advice.
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
                Journal articles go through a straightforward process. I research the topic using published
                studies, established psychology literature, and credible reporting. I write the essay, review
                it for accuracy, and publish it. No article on this site has been reviewed by a licensed
                mental health professional unless explicitly stated on the article itself.
              </p>
              <p>
                If an article contains a factual error, I want to know about it. Email me at{' '}
                <a href="mailto:ifonlyisentthis@gmail.com">ifonlyisentthis@gmail.com</a> with the article
                URL and the correction. I will fix it within 48 hours and add a correction note at the
                bottom of the article.
              </p>
            </>
          ),
        },
        {
          title: 'Why this matters',
          eyebrow: 'Philosophy',
          children: (
            <p>
              Most of the apps I build sit at the intersection of technology and emotion. Afterword stores
              the things you want delivered after you&apos;re gone. My songs explore longing and memory.{' '}
              {SITE_NAME} holds the words people couldn&apos;t say while they were still in the room with
              the person who needed to hear them. The common thread is the same: some feelings are too
              heavy for a conversation but too important to disappear.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/methodology', label: 'Methodology', description: 'How letters are screened and articles are written.' },
        { href: '/journal', label: 'Journal', description: 'Essays on heartbreak, grief, and the words left unsaid.' },
        { href: '/contact', label: 'Contact', description: 'Reach me for corrections, removals, or questions.' },
      ]}
    />
  );
}
