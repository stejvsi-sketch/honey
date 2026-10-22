import { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Unsent Messages FAQ',
  description: 'Find answers about searching the public archive, submitting messages, moderation, privacy, color tags, and how the project works.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

export default function FAQPage() {
  const faqItems = [
    {
      question: 'What is Honey, If Only?',
      answer: 'Honey, If Only is a public archive of short unsent messages. No account is required. Approved submissions may be read by others, so it is not a private journal or confidential service.',
    },
    {
      question: 'Is my submission truly anonymous?',
      answer: 'No account or email is required, but a submission is not confidential. The optional sender-name field may be shown with an approved letter. The recipient name, message, chosen color, and optional sender name may appear publicly; older archive entries may also contain names or handles from a different publication process. Do not submit information you do not want displayed. The Privacy Policy explains data handled for security and moderation.',
    },
    {
      question: 'How do I find messages for a specific name?',
      answer: 'Use the search bar on the Archive page to look for a recipient name. Results depend on the spelling and what is available in the current archive. Many people share the same name, so a matching message does not identify a particular person.',
    },
    {
      question: 'Why isn\'t my name showing up?',
      answer: 'A search that returns no result only means that the current archive did not return a match for that spelling. Names can be written differently, and messages on this site cannot show whether anyone outside the archive has written or thought about you.',
    },
    {
      question: 'Why is there a 25-word limit?',
      answer: 'The current submission form uses a 25-word maximum as a concise format. It is a design choice, not a claim that short messages are more honest or helpful than longer private writing.',
    },
    {
      question: 'What do the colors mean?',
      answer: 'Colors are a visual convention used by this site, not a universal code for emotions. The writer chooses the color; readers should not assume it reveals a sender\'s exact feelings. See our Color Meanings page for the site\'s palette.',
    },
    {
      question: 'Can I edit or delete my message after submitting?',
      answer: 'There is no self-service edit or delete option. If you need a letter reviewed for removal, contact us with its URL and details; we may ask for information needed to locate it. Approved letters may remain in the archive, as described in the Privacy Policy.',
    },
    {
      question: 'What kind of content is not allowed?',
      answer: 'The current submission rules prohibit hate speech, targeted abuse, threats, explicit sexual content, and personal information such as contact details. New submissions are reviewed before publication; screening cannot guarantee that every existing archive entry has the same review history.',
    },
    {
      question: 'I found a message that is abusive. What should I do?',
      answer: 'Contact us with the letter URL and a brief description of the concern. We will review the request under the current site rules; contacting us does not guarantee that a letter will be removed.',
    },
    {
      question: 'Why is my unsent message not posting?',
      answer: 'New submissions go through review before publication, and review time can vary. A message may be declined under the current rules or delayed by a technical issue. Before resubmitting, check the archive to avoid posting the same message twice; contact us if you need help locating it.',
    },
    {
      question: 'Are the messages in the archive real?',
      answer: 'We cannot independently verify who wrote a message or whether every account of an event is accurate. New submissions through the current form are reviewed before publication, but moderation is not identity verification. Older archive entries may have a different publication history. Read letters as user-submitted writing, not verified reports about identifiable people.',
    },
    {
      question: 'How is Honey, If Only different from other unsent message sites?',
      answer: 'Honey, If Only is a curated, aesthetically designed archive with strict moderation and a 25-word constraint. Unlike larger platforms that can feel overwhelming or unfiltered, every message here is reviewed by a human, presented on a textured card with intentional color coding, and treated as a genuine piece of emotional expression. We prioritize quality and emotional resonance over volume.',
    },
    {
      question: 'How do I search for a name in an unsent message archive?',
      answer: 'On Honey, If Only, you can search for a recipient name using the search bar on the Letters page or the Name Archive. Results show messages that match in the current archive; a matching name does not establish who a message is about.',
    },
    {
      question: 'How do I submit a message to an unsent letter archive?',
      answer: 'Use the Write page to enter the recipient name, message, and color. The optional sender-name field may be displayed publicly if supplied. New submissions are reviewed before publication, and review time can vary. No account or email is required.',
    },
    {
      question: 'What is an unsent letter archive and how does it work?',
      answer: 'An unsent letter archive is a public collection of messages people choose not to send. Honey, If Only uses a 25-word maximum and reviews new submissions through the current form; older archive entries may have a different publication history.',
    },
    {
      question: 'How long does it take for my unsent message to appear?',
      answer: 'Review time can vary. If a new submission does not appear, it may still be under review, may not meet the current rules, or may have encountered a technical issue. Contact us with the details if you need help.',
    },
    {
      question: 'Can I delete my message after submitting it?',
      answer: 'There is no self-service edit or delete option. If you need a letter reviewed for removal, contact us with its URL and details; we may ask for information needed to locate it. Approved letters may remain in the archive, as described in the Privacy Policy.',
    },
    {
      question: 'What do the letter colors mean?',
      answer: "Colors are a visual convention used by this site, not a universal code for emotions. The writer chooses the color; readers should not assume it reveals a sender's exact feelings. See the Color Meanings page for the site's palette.",
    },
    {
      question: 'Are there other sites like Honey, If Only?',
      answer: 'There are several platforms for anonymous unsent letters, each with a different approach. Honey, If Only stands out for its strict 25-word constraint that forces emotional distillation, active human moderation of every submission, and a premium design that treats each message with care. If you value quality and sincerity over volume, this is the archive built for that.',
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
        subtitle="Everything you need to know about searching the public archive, submitting messages, moderation, and privacy."
        highlights={[
          { label: 'Format', value: '25-word maximum', detail: 'A concise format for current submissions.' },
          { label: 'Privacy', value: 'No account required', detail: 'Approved submissions are public; the optional sender name may appear.' },
          { label: 'Moderation', value: 'New submissions reviewed', detail: 'Review does not verify identity; older archive entries may differ.' },
        ]}
        sections={[
          {
            title: 'What is Honey, If Only?',
            eyebrow: 'About',
            children: (
              <p>
                Honey, If Only is a public archive of short unsent messages. No account is required. Approved submissions may be read by others, so it is not a private journal or confidential service.
              </p>
            ),
          },
          {
            title: 'Is my submission truly anonymous?',
            eyebrow: 'Privacy',
            children: (
              <p>
                No account or email is required, but a submission is not confidential. The optional sender-name field may be shown with an approved letter. The recipient name, message, chosen color, and optional sender name may appear publicly; older archive entries may also contain names or handles from a different publication process. Do not submit information you do not want displayed. The <Link href="/privacy">Privacy Policy</Link> explains data handled for security and moderation.
              </p>
            ),
          },
          {
            title: 'How do I find messages for a specific name?',
            eyebrow: 'Searching',
            children: (
              <p>
                Use the search bar on the <Link href="/letters">Archive page</Link> to look for a recipient name. Results depend on the spelling and what is available in the current archive. Many people share the same name, so a matching message does not identify a particular person.
              </p>
            ),
          },
          {
            title: 'Why isn\'t my name showing up?',
            eyebrow: 'Searching',
            children: (
              <p>
                A search that returns no result only means that the current archive did not return a match for that spelling. Names can be written differently, and messages on this site cannot show whether anyone outside the archive has written or thought about you.
              </p>
            ),
          },
          {
            title: 'Why is there a 25-word limit?',
            eyebrow: 'Submitting',
            children: (
              <p>
                The current submission form uses a 25-word maximum as a concise format. It is a design choice, not a claim that short messages are more honest or helpful than longer private writing.
              </p>
            ),
          },
          {
            title: 'What do the colors mean?',
            eyebrow: 'Submitting',
            children: (
              <p>
                Colors are a visual convention used by this site, not a universal code for emotions. The writer chooses the color; readers should not assume it reveals a sender&apos;s exact feelings. See our <Link href="/colors">Color Meanings</Link> page for the site&apos;s palette.
              </p>
            ),
          },
          {
            title: 'Can I edit or delete my message after submitting?',
            eyebrow: 'Moderation',
            children: (
              <p>
                There is no self-service edit or delete option. If you need a letter reviewed for removal, contact us with its URL and details; we may ask for information needed to locate it. Approved letters may remain in the archive, as described in the <Link href="/privacy">Privacy Policy</Link>.
              </p>
            ),
          },
          {
            title: 'What kind of content is not allowed?',
            eyebrow: 'Safety',
            children: (
              <p>
                The current submission rules prohibit hate speech, targeted abuse, threats, explicit sexual content, and personal information such as contact details. New submissions are reviewed before publication; screening cannot guarantee that every existing archive entry has the same review history.
              </p>
            ),
          },
          {
            title: 'I found a message that is abusive. What should I do?',
            eyebrow: 'Safety',
            children: (
              <p>
                Contact us with the letter URL and a brief description of the concern. We will review the request under the current site rules; contacting us does not guarantee that a letter will be removed.
              </p>
            ),
          },
          {
            title: 'Why is my unsent message not posting?',
            eyebrow: 'Troubleshooting',
            children: (
              <p>
                New submissions are reviewed before publication, and review time can vary. A message may be declined under the current rules or delayed by a technical issue. Before resubmitting, check the archive to avoid posting the same message twice; contact us through the <Link href="/contact">Contact page</Link> if you need help locating it.
              </p>
            ),
          },
          {
            title: 'Are the messages in the archive real?',
            eyebrow: 'Authenticity',
            children: (
              <p>
                We cannot independently verify who wrote a message or whether every account of an event is accurate. New submissions through the current form are reviewed before publication, but moderation is not identity verification. Older archive entries may have a different publication history. Read letters as user-submitted writing, not verified reports about identifiable people.
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
            title: 'How do I search for a name in an unsent message archive?',
            eyebrow: 'Searching',
            children: (
              <p>
                Search for a recipient name using the search bar on our <Link href="/letters">Letters page</Link> or the <Link href="/archive">Name Archive</Link>. Results show messages that match the name in the current archive; a matching name does not establish who a message is about.
              </p>
            ),
          },
          {
            title: 'How do I submit a message to an unsent letter archive?',
            eyebrow: 'Submitting',
            children: (
              <p>
                Use the <Link href="/write">Write</Link> page to enter the recipient name, message, and color. The optional sender-name field may be displayed publicly if supplied. New submissions are reviewed before publication, and review time can vary. No account or email is required.
              </p>
            ),
          },
          {
            title: 'What is an unsent letter archive and how does it work?',
            eyebrow: 'About',
            children: (
              <p>
                An unsent letter archive is a public collection of messages people choose not to send. Honey, If Only uses a 25-word maximum and reviews new submissions through the current form; older archive entries may have a different publication history. Learn more on our <Link href="/about">About page</Link>.
              </p>
            ),
          },
          {
            title: 'How long does it take for my unsent message to appear?',
            eyebrow: 'Troubleshooting',
            children: (
              <p>
                Review time can vary. If a new submission does not appear, it may still be under review, may not meet the current rules, or may have encountered a technical issue. Contact us through the <Link href="/contact">Contact page</Link> if you need help.
              </p>
            ),
          },
          {
            title: 'Can I delete my message after submitting it?',
            eyebrow: 'Moderation',
            children: (
              <p>
                There is no self-service edit or delete option. If you need a letter reviewed for removal, contact us with its URL and details; we may ask for information needed to locate it. Approved letters may remain in the archive, as described in the <Link href="/privacy">Privacy Policy</Link>.
              </p>
            ),
          },
          {
            title: 'What do the letter colors mean?',
            eyebrow: 'Submitting',
            children: (
              <p>
                Colors are a visual convention used by this site, not a universal code for emotions. The writer chooses the color; readers should not assume it reveals a sender&apos;s exact feelings. See our <Link href="/colors">Color Meanings</Link> page for the site&apos;s palette.
              </p>
            ),
          },
          {
            title: 'Are there other sites like Honey, If Only?',
            eyebrow: 'About',
            children: (
              <p>
                There are several platforms for anonymous unsent letters, each with a different approach. Honey, If Only stands out for its strict 25-word constraint that forces emotional distillation, active human moderation of every submission, and a premium design that treats each message with care. If you value quality and sincerity over volume, this is the archive built for that. Learn more on our <Link href="/about">About page</Link>.
              </p>
            ),
          },
        ]}
        relatedLinks={[
          { href: '/about', label: 'How It Works', description: 'Learn how we review new submissions and publish letters.' },
          { href: '/colors', label: 'Color Meanings', description: 'Explore the emotional context behind the colors.' },
          { href: '/contact', label: 'Contact', description: 'Reach out to report abuse or request removals.' },
        ]}
      />
    </>
  );
}
