import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how Honey, If Only works — write an anonymous unsent letter, have it reviewed, and share your unspoken words with the world.',
};

export default function AboutPage() {
  return (
    <div className="content">
      <h1>How It Works</h1>
      <p>
        <strong>Honey, If Only</strong> is a quiet corner of the internet for the things you never said.
        A place to leave the words that got stuck in your throat, the apologies that came too late,
        and the confessions that never found their moment.
      </p>

      <h2>1. Write a Letter</h2>
      <p>
        Go to the <Link href="/write">Write a Letter</Link> page. Enter the name of the person your words
        are for, write your message (up to 25 words), and choose a color for your paper. That&apos;s it.
      </p>

      <h2>2. We Review It</h2>
      <p>
        Every letter is reviewed by a real person before it appears on the site. We check for harmful
        content, spam, and anything that doesn&apos;t belong. Most letters are approved within a few hours.
      </p>

      <h2>3. It Lives Here Forever</h2>
      <p>
        Once approved, your letter appears in the <Link href="/letters">Letters</Link> archive on a
        piece of crumpled paper — raw, imperfect, and real. Just like the feelings behind it.
      </p>

      <h2>4. Names Become Pages</h2>
      <p>
        Every name becomes its own page. If multiple people write to &quot;Sarah,&quot; all those letters
        live together at <code>/to/sarah</code>. It&apos;s a small way of showing that some people
        carry a lot of unsaid words.
      </p>

      <h2>A Few Rules</h2>
      <ul>
        <li>Keep it to 25 words or fewer — brevity makes it hit harder</li>
        <li>No extreme profanity or harmful content</li>
        <li>You can submit up to 6 letters per day</li>
        <li>All letters are anonymous — we never show who wrote them</li>
      </ul>

      <h2>Why Paper?</h2>
      <p>
        Because some things are better written on paper. Digital feels temporary. Paper feels like
        it matters. Even if this paper is crumpled and imperfect — especially then.
      </p>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/write" className="btn" style={{ width: 'auto', display: 'inline-flex' }}>
          Write Your Letter
        </Link>
      </div>
    </div>
  );
}
