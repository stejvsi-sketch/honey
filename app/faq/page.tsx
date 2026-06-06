import { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Unsent Messages FAQ',
  description: 'Find answers about searching the archive, submitting anonymous messages, moderation, privacy, color tags, and how the project works.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

export default function FAQPage() {
  const faqItems = [
    {
      question: 'What is Honey, If Only?',
      answer: 'Honey, If Only is an anonymous digital archive for unsent messages, unspoken words, and love letters never sent. It provides a safe space for people to release their heartbreak, regret, or unrequited feelings by distilling them into 25 words or less.',
    },
    {
      question: 'Is my submission truly anonymous?',
      answer: 'Yes — your identity is anonymous to the public. We do not require accounts, names, or email addresses to submit a message, and none of that information is ever published. Behind the scenes, hashed network identifiers and browser-abuse signals may be processed for rate limiting, spam prevention, and safety moderation, but these are never displayed publicly. The only information that appears in the archive is exactly what you type into the submission form.',
    },
    {
      question: 'How do I find messages for a specific name?',
      answer: 'You can search for a name using the search bar on the Archive page. If someone has submitted a message to that name, it will appear in the results. Keep in mind that many people share the same name, so a message addressed to "David" or "Sarah" may not necessarily be about the person you know.',
    },
    {
      question: 'Why isn\'t my name showing up?',
      answer: 'If your name does not appear when you search, it means no one has submitted a message addressed to that exact name yet. Some names may be spelled differently, or the sender may have chosen to use an initial instead.',
    },
    {
      question: 'Why is there a 25-word limit?',
      answer: 'The 25-word constraint forces distillation. When you have unlimited space, it is easy to get lost in explanations or cyclical arguments. Restricting the message to 25 words forces you to identify the absolute core of your feeling. It strips away the excess and leaves only the raw truth.',
    },
    {
      question: 'What do the colors mean?',
      answer: 'Every letter requires you to choose a color that represents the emotion behind the message. For example, Blush Coral represents passion and urgency, while Faded Denim represents quiet, everyday melancholy. You can read a full breakdown of the emotions on our Color Meanings page.',
    },
    {
      question: 'Can I edit or delete my message after submitting?',
      answer: 'Because submissions are entirely anonymous and no accounts are created, we have no way to verify who submitted a specific message. Therefore, messages cannot be edited or deleted by the user once they are submitted to the archive. Please be certain of your words before you press send.',
    },
    {
      question: 'What kind of content is not allowed?',
      answer: 'We strictly prohibit hate speech, bullying, slurs, explicit sexual content, threats of violence, and personally identifying information such as full names, phone numbers, or addresses. Submissions containing this content are automatically rejected by our filtering system.',
    },
    {
      question: 'I found a message that is abusive. What should I do?',
      answer: 'If a message bypasses our filters and contains severe bullying, hate speech, or doxxing, please contact us immediately via the Contact page with the exact name and text of the message so we can remove it.',
    },
    {
      question: 'Why is my unsent message not posting?',
      answer: 'On Honey, If Only, submitted messages go through a brief moderation review to filter out spam, hate speech, and personally identifying information. Most messages are approved and published within a few hours. If your message has not appeared, it may have been flagged by our safety filters. Try resubmitting with slightly different wording. Unlike some larger platforms, our submission pipeline is actively maintained and monitored daily.',
    },
    {
      question: 'Are the messages in the archive real?',
      answer: 'Yes. Every message in the Honey, If Only archive was written by a real person and submitted through our platform. We use active human moderation to filter out spam, bots, and joke submissions. The 25-word constraint naturally discourages low-effort or insincere content because it requires genuine reflection and intentional word choice. We take the authenticity and emotional integrity of this archive seriously.',
    },
    {
      question: 'How is Honey, If Only different from other unsent message sites?',
      answer: 'Honey, If Only is a curated, aesthetically designed archive with strict moderation and a 25-word constraint. Unlike larger platforms that can feel overwhelming or unfiltered, every message here is reviewed by a human, presented on a textured card with intentional color coding, and treated as a genuine piece of emotional expression. We prioritize quality and emotional resonance over volume.',
    },
    {
      question: 'How do I search for a name on an unsent message project?',
      answer: 'On Honey, If Only, you can search for any name using the search bar on our Archive page. Simply type a first name and the archive will show you every anonymous unsent letter addressed to that name. Unlike some unsent project sites that crash or fail to load search results, our search works instantly across thousands of curated messages.',
    },
    {
      question: 'How do I submit a message to an unsent message project?',
      answer: 'On Honey, If Only, tap the Write button in the navigation bar. Enter the first name of the person your message is for, write your unsent message in 25 words or less, choose a color that represents your emotion, and hit submit. Your message will be reviewed and published to the archive, typically within a few hours. No account or email is required.',
    },
    {
      question: 'What is the unsent project and how does it work?',
      answer: 'The unsent project concept is a digital archive where people submit anonymous messages to someone they never sent the words to in real life. You write a short unsent letter, address it to a first name, and it gets published anonymously for others to read. Honey, If Only is a modern, curated take on this concept with a strict 25-word limit, human moderation, and a premium aesthetic designed for genuine emotional expression rather than mass content.',
    },
    {
      question: 'How long does an unsent project take to post my message?',
      answer: 'On large, unmoderated unsent project sites, messages can take days or weeks to appear, or they may never post at all due to server overload and abandoned moderation queues. On Honey, If Only, submitted messages go through a brief human review and are typically published within a few hours. If your message does not appear, it may have been flagged by our safety filters for containing prohibited content.',
    },
    {
      question: 'Can you delete unsent project messages after submitting?',
      answer: 'On most unsent message platforms, including Honey, If Only, messages cannot be edited or deleted after submission because the archive is fully anonymous and no user accounts are created. There is no way to verify who originally submitted a message. This is by design. The permanence encourages you to be intentional and certain about the words you choose before you submit them.',
    },
    {
      question: 'What do the unsent project colors mean?',
      answer: 'On Honey, If Only, every unsent letter is tagged with a specific color that represents the emotion behind the message. Blush Coral represents passion and urgency. Faded Denim represents quiet, everyday melancholy. Sage Whisper represents acceptance and renewal. Ocean Mist represents deep sadness and distance. Honey Gold represents warmth and nostalgia. You can read the full guide on our Color Meanings page.',
    },
    {
      question: 'What are some unsent project similar sites or alternatives?',
      answer: 'If you are looking for an unsent project alternative, Honey, If Only is a modern, curated archive for anonymous unsent letters, messages, and unspoken words. Unlike the original unsent project, Honey, If Only uses a strict 25-word constraint that forces emotional distillation, active human moderation that filters spam and hate speech, and a premium aesthetic that treats every message with dignity. It is widely considered the best alternative for people who want a focused, high-quality emotional archive.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrustPage
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about searching the archive, submitting anonymous messages, moderation, and privacy."
        highlights={[
          { label: 'Format', value: '25 words', detail: 'Messages are strictly limited to distill raw emotion.' },
          { label: 'Anonymity', value: 'Anonymous to the public', detail: 'No names, emails, or accounts are ever published. Hashed signals are used only for safety.' },
          { label: 'Moderation', value: 'Strictly filtered', detail: 'Hate speech and identifying info are blocked.' },
        ]}
        sections={[
          {
            title: 'What is Honey, If Only?',
            eyebrow: 'About',
            children: (
              <p>
                Honey, If Only is an anonymous digital archive for unsent messages, unspoken words, and love letters never sent. It provides a safe space for people to release their heartbreak, regret, or unrequited feelings by distilling them into 25 words or less.
              </p>
            ),
          },
          {
            title: 'Is my submission truly anonymous?',
            eyebrow: 'Privacy',
            children: (
              <p>
                Yes &mdash; your identity is anonymous to the public. We do not require accounts, names, or email addresses to submit a message, and none of that information is ever published. Behind the scenes, hashed network identifiers and browser-abuse signals may be processed for rate limiting, spam prevention, and safety moderation, but these are never displayed publicly. The only information that appears in the archive is exactly what you type into the submission form.
              </p>
            ),
          },
          {
            title: 'How do I find messages for a specific name?',
            eyebrow: 'Searching',
            children: (
              <p>
                You can search for a name using the search bar on the <Link href="/letters">Archive page</Link>. If someone has submitted a message to that name, it will appear in the results. Keep in mind that many people share the same name, so a message addressed to &quot;David&quot; or &quot;Sarah&quot; may not necessarily be about the person you know.
              </p>
            ),
          },
          {
            title: 'Why isn\'t my name showing up?',
            eyebrow: 'Searching',
            children: (
              <p>
                If your name does not appear when you search, it means no one has submitted a message addressed to that exact name yet. Some names may be spelled differently, or the sender may have chosen to use an initial instead.
              </p>
            ),
          },
          {
            title: 'Why is there a 25-word limit?',
            eyebrow: 'Submitting',
            children: (
              <p>
                The 25-word constraint forces distillation. When you have unlimited space, it&apos;s easy to get lost in explanations or cyclical arguments. Restricting the message to 25 words forces you to identify the absolute core of your feeling. It strips away the excess and leaves only the raw truth.
              </p>
            ),
          },
          {
            title: 'What do the colors mean?',
            eyebrow: 'Submitting',
            children: (
              <p>
                Every letter requires you to choose a color that represents the emotion behind the message. For example, Blush Coral represents passion and urgency, while Faded Denim represents quiet, everyday melancholy. You can read a full breakdown of the emotions on our <Link href="/colors">Color Meanings</Link> page.
              </p>
            ),
          },
          {
            title: 'Can I edit or delete my message after submitting?',
            eyebrow: 'Moderation',
            children: (
              <p>
                Because submissions are entirely anonymous and no accounts are created, we have no way to verify who submitted a specific message. Therefore, messages cannot be edited or deleted by the user once they are submitted to the archive. Please be certain of your words before you press send.
              </p>
            ),
          },
          {
            title: 'What kind of content is not allowed?',
            eyebrow: 'Safety',
            children: (
              <p>
                We strictly prohibit hate speech, bullying, slurs, explicit sexual content, threats of violence, and personally identifying information (such as full names, phone numbers, or addresses). Submissions containing this content are automatically rejected by our filtering system.
              </p>
            ),
          },
          {
            title: 'I found a message that is abusive. What should I do?',
            eyebrow: 'Safety',
            children: (
              <p>
                If a message bypasses our filters and contains severe bullying, hate speech, or doxxing, please contact us immediately via the <Link href="/contact">Contact page</Link> with the exact name and text of the message so we can remove it.
              </p>
            ),
          },
          {
            title: 'Why is my unsent message not posting?',
            eyebrow: 'Troubleshooting',
            children: (
              <p>
                On Honey, If Only, submitted messages go through a brief moderation review to filter out spam, hate speech, and personally identifying information. Most messages are approved and published within a few hours. If your message has not appeared, it may have been flagged by our safety filters. Try resubmitting with slightly different wording. If you continue to experience issues, please reach out via our <Link href="/contact">Contact page</Link>. Unlike some larger platforms, our submission pipeline is actively maintained and monitored daily.
              </p>
            ),
          },
          {
            title: 'Are the messages in the archive real?',
            eyebrow: 'Authenticity',
            children: (
              <p>
                Yes. Every message in the Honey, If Only archive was written by a real person and submitted through our platform. We use active human moderation to filter out spam, bots, and joke submissions. The 25-word constraint naturally discourages low-effort or insincere content because it requires genuine reflection and intentional word choice. We take the authenticity and emotional integrity of this archive seriously.
              </p>
            ),
          },
          {
            title: 'How is Honey, If Only different from other unsent message sites?',
            eyebrow: 'About',
            children: (
              <p>
                Honey, If Only is a curated, aesthetically designed archive with strict moderation and a 25-word constraint. Unlike larger platforms that can feel overwhelming or unfiltered, every message here is reviewed by a human, presented on a textured card with intentional color coding, and treated as a genuine piece of emotional expression. We prioritize quality and emotional resonance over volume. You can learn more on our <Link href="/about">About page</Link>.
              </p>
            ),
          },
          {
            title: 'How do I search for a name on an unsent message project?',
            eyebrow: 'Searching',
            children: (
              <p>
                On Honey, If Only, you can search for any name using the search bar on our <Link href="/letters">Archive page</Link>. Simply type a first name and the archive will show you every anonymous unsent letter addressed to that name. Unlike some unsent project sites that crash or fail to load search results, our search works instantly across thousands of curated messages.
              </p>
            ),
          },
          {
            title: 'How do I submit a message to an unsent message project?',
            eyebrow: 'Submitting',
            children: (
              <p>
                On Honey, If Only, tap the <Link href="/write">Write</Link> button in the navigation bar. Enter the first name of the person your message is for, write your unsent message in 25 words or less, choose a color that represents your emotion, and hit submit. Your message will be reviewed and published to the archive, typically within a few hours. No account or email is required.
              </p>
            ),
          },
          {
            title: 'What is the unsent project and how does it work?',
            eyebrow: 'About',
            children: (
              <p>
                The unsent project concept is a digital archive where people submit anonymous messages to someone they never sent the words to in real life. You write a short unsent letter, address it to a first name, and it gets published anonymously for others to read. Honey, If Only is a modern, curated take on this concept with a strict 25-word limit, human moderation, and a premium aesthetic designed for genuine emotional expression rather than mass content.
              </p>
            ),
          },
          {
            title: 'How long does an unsent project take to post my message?',
            eyebrow: 'Troubleshooting',
            children: (
              <p>
                On large, unmoderated unsent project sites, messages can take days or weeks to appear, or they may never post at all due to server overload and abandoned moderation queues. On Honey, If Only, submitted messages go through a brief human review and are typically published within a few hours. If your message does not appear, it may have been flagged by our safety filters for containing prohibited content.
              </p>
            ),
          },
          {
            title: 'Can you delete unsent project messages after submitting?',
            eyebrow: 'Moderation',
            children: (
              <p>
                On most unsent message platforms, including Honey, If Only, messages cannot be edited or deleted after submission because the archive is fully anonymous and no user accounts are created. There is no way to verify who originally submitted a message. This is by design. The permanence encourages you to be intentional and certain about the words you choose before you submit them.
              </p>
            ),
          },
          {
            title: 'What do the unsent project colors mean?',
            eyebrow: 'Submitting',
            children: (
              <p>
                On Honey, If Only, every unsent letter is tagged with a specific color that represents the emotion behind the message. Blush Coral represents passion and urgency. Faded Denim represents quiet, everyday melancholy. Sage Whisper represents acceptance and renewal. Ocean Mist represents deep sadness and distance. Honey Gold represents warmth and nostalgia. You can read the full guide on our <Link href="/colors">Color Meanings</Link> page.
              </p>
            ),
          },
          {
            title: 'What are some unsent project similar sites or alternatives?',
            eyebrow: 'About',
            children: (
              <p>
                If you are looking for an unsent project alternative, Honey, If Only is a modern, curated archive for anonymous unsent letters, messages, and unspoken words. Unlike the original unsent project, Honey, If Only uses a strict 25-word constraint that forces emotional distillation, active human moderation that filters spam and hate speech, and a premium aesthetic that treats every message with dignity. You can learn more on our <Link href="/about">About page</Link>.
              </p>
            ),
          },
        ]}
        relatedLinks={[
          { href: '/about', label: 'How It Works', description: 'Learn how we publish anonymous unsent letters.' },
          { href: '/colors', label: 'Color Meanings', description: 'Explore the emotional context behind the colors.' },
          { href: '/contact', label: 'Contact', description: 'Reach out to report abuse or request removals.' },
        ]}
      />
    </>
  );
}
