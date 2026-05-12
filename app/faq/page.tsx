import { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Unsent Messages FAQ | ${SITE_NAME}`,
  description: 'Find answers about searching the archive, submitting anonymous messages, moderation, privacy, color tags, and how the project works.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

export default function FAQPage() {
  return (
    <TrustPage
      eyebrow="FAQ"
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about searching the archive, submitting anonymous messages, moderation, and privacy."
      highlights={[
        { label: 'Format', value: '25 words', detail: 'Messages are strictly limited to distill raw emotion.' },
        { label: 'Anonymity', value: '100% Anonymous', detail: 'We never collect names, emails, or IP addresses.' },
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
              Yes. We do not collect names, email addresses, or account information when you submit a message. We do not display IP addresses. The only information published is exactly what you type into the submission form.
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
      ]}
      relatedLinks={[
        { href: '/about', label: 'How It Works', description: 'Learn how we publish anonymous unsent letters.' },
        { href: '/colors', label: 'Color Meanings', description: 'Explore the emotional context behind the colors.' },
        { href: '/contact', label: 'Contact', description: 'Reach out to report abuse or request removals.' },
      ]}
    />
  );
}
