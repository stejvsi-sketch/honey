import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export const revalidate = 18000;

interface JournalPost {
  title: string;
  content: string;
  excerpt: string;
  date: string;
}

const PLACEHOLDER_POSTS: Record<string, JournalPost> = {
  'why-we-dont-say-it': {
    title: "Why We Don't Say It",
    excerpt: 'The psychology behind the words we swallow — and why the hardest things to say are often the most important.',
    content: `There's a reason we hold back. It's not cowardice, not really — it's something deeper. A fear that the words, once released, will change everything. And maybe they would.

We rehearse conversations in the shower. We type messages and delete them. We open our mouths and close them again, swallowing syllables like stones.

Psychologists call it "expressive suppression." We call it surviving.

The truth is, vulnerability is terrifying. To say "I love you" or "I'm sorry" or "I miss you" is to hand someone a piece of yourself and hope they hold it gently. Most of us have been burned before.

But here's what they don't tell you about unsaid words: they don't disappear. They settle into your bones. They become the weight you carry without knowing why you're tired.

Some people write letters they never send. Some people whisper their confessions to empty rooms. Some people carry entire libraries of unspoken thoughts, each one a book that will never be opened.

Maybe that's why places like this exist — because the words have to go somewhere. Even if they never reach the person they were meant for, the act of writing them down is its own kind of release.

So say it. Write it. Let it exist somewhere outside your chest.

Honey, if only you knew what I never told you.`,
    date: 'May 2026',
  },
  'the-weight-of-unsent-letters': {
    title: 'The Weight of Unsent Letters',
    excerpt: 'Every unspoken word carries weight. Some people carry entire libraries of things they never said.',
    content: `Every unspoken word carries weight. Not in grams or pounds — in the heaviness of 3 AM thoughts, in the ache of seeing someone's name on your phone and not calling.

Unsent letters are peculiar things. They exist in the space between feeling and expression, caught like moths against a window — desperate to reach the light but forever separated by glass.

We write them in our heads constantly. In the line at the grocery store. During work meetings. In the quiet moments before sleep when the noise of the day fades and all that's left is the echo of what we should have said.

"I forgive you." "I don't forgive you." "I still think about Tuesdays." "You were the best thing that happened to me, and I ruined it."

The weight of these words is cumulative. One unsaid thing is manageable. A hundred is exhausting. A lifetime's worth is the kind of heavy that makes your chest tight for no reason the doctor can find.

There's a Japanese concept called "mono no aware" — the bittersweet awareness of impermanence. Every unsent letter is an exercise in mono no aware. We feel the weight of what could have been, what should have been, and what will never be.

But there's beauty in the weight, too. It means the feelings were real. The person mattered. The moment existed, even if the words didn't.

So carry your unsent letters gently. And when they get too heavy, put them down somewhere safe.

That's what this place is for.`,
    date: 'May 2026',
  },
};

async function getJournalPost(slug: string): Promise<JournalPost | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!error && data) {
        return {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        };
      }
    } catch {
      // Fall through to placeholders
    }
  }

  return PLACEHOLDER_POSTS[slug] || null;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getJournalPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt || `${post.title} — A reflection on ${SITE_NAME}`,
  };
}

export default async function JournalPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getJournalPost(slug);
  if (!post) notFound();

  return (
    <div className="content">
      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: 8 }}>
        {post.date}
      </p>
      <h1>{post.title}</h1>
      {post.content.split('\n\n').map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/journal" className="btn btn--outline" style={{ width: 'auto', display: 'inline-flex' }}>
          ← Back to Journal
        </Link>
      </div>
    </div>
  );
}
