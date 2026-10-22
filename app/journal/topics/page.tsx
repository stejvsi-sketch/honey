import type { Metadata } from 'next';
import Link from 'next/link';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Journal Topics',
  description: 'Browse Honey, If Only journal articles by topic: unsent-letter writing, breakup recovery, friendship grief, and archive privacy.',
  alternates: { canonical: `${SITE_URL}/journal/topics` },
};

const TOPICS = [
  {
    title: 'Writing an unsent letter',
    description: 'Guides and reflections on drafting a message, deciding whether to send it, and choosing a private or public place to write.',
    slugs: [
      'finding-closure-without-apology',
      'does-writing-an-unsent-letter-actually-help-you-heal',
      'psychology-unsent-text-messages',
      'what-to-write-for-closure',
      'how-to-choose-an-unsent-project-alternative',
      'the-illusion-of-the-perfect-response-why-sending-the-draft-rarely-helps',
    ],
  },
  {
    title: 'Breakup recovery and closure',
    description: 'Articles about missing an ex, adjusting after a breakup, and finding ways forward without relying on a particular response.',
    slugs: [
      'how-long-does-it-take-to-get-over-a-breakup-timeline',
      'signs-you-are-healing-from-heartbreak-recovery-milestones',
      'why-do-i-miss-my-ex-suddenly-psychology-of-emotional-triggers',
      'the-psychology-of-closure-why-we-dont-need-an-apology-to-move-on',
      'how-to-forgive-yourself-after-breakup-self-blame-guilt',
      'how-to-manifest-them-back',
      'how-to-get-unblocked-by-them',
    ],
  },
  {
    title: 'Friendship and bereavement',
    description: 'Writing and reflection for the loss of a friendship or someone who has died, with those experiences kept distinct.',
    slugs: [
      'missing-friend-no-longer-speak-to',
      'quiet-grief-of-outgrowing-a-friendship',
      'grieving-the-dead-unsaid-words',
      'grieving-relationship-didnt-happen',
      'surviving-holidays-birthdays-after-heartbreak',
    ],
  },
  {
    title: 'Online archives, privacy, and moderation',
    description: 'What to consider before sharing a message publicly and how archives, moderation, and privacy expectations differ.',
    slugs: [
      'navigating-the-unsent-messages-archive',
      'are-unsent-letters-online-real-or-fake',
      'the-trust-contract-between-writers-and-archives',
      'why-unsent-letter-submissions-disappear',
      'when-unsent-letter-archives-lose-your-words',
      'how-to-choose-an-unsent-project-alternative',
    ],
  },
];

export default function JournalTopicsPage() {
  const sections = TOPICS.map(topic => ({
    ...topic,
    posts: topic.slugs
      .map(slug => JOURNAL_POSTS.find(post => post.slug === slug))
      .filter((post): post is (typeof JOURNAL_POSTS)[number] => Boolean(post)),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Journal Topics',
    description: metadata.description,
    url: `${SITE_URL}/journal/topics`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="page page--narrow">
        <div className="page__header">
          <Link href="/journal" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Back to Journal</Link>
          <h1 className="page__title" style={{ marginTop: '20px' }}>Browse the journal by topic</h1>
          <p className="page__subtitle">
            Start with the subject that fits what you are looking for. Each group links to a focused set of articles;
            the topics are a reading guide, not clinical categories.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '48px', marginTop: '48px' }}>
          {sections.map(section => (
            <section key={section.title} aria-labelledby={`topic-${section.title}`}>
              <h2 id={`topic-${section.title}`} style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--text)' }}>
                {section.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.description}</p>
              <ul style={{ display: 'grid', gap: '18px', listStyle: 'none', padding: 0 }}>
                {section.posts.map(post => (
                  <li key={post.slug} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '18px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0 0 8px' }}>
                      <Link href={`/journal/${post.slug}`} style={{ color: 'var(--text)' }}>{post.title}</Link>
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
