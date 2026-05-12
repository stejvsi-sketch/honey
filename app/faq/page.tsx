import { Metadata } from 'next';
import Link from 'next/link';
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
    <div className="page__container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page__header">
        <h1 className="page__title">Frequently Asked Questions</h1>
        <p className="page__subtitle">Everything you need to know about the archive.</p>
      </div>

      <div className="prose">
        <section style={{ marginBottom: '32px' }}>
          <h2>About the Project</h2>
          
          <h3 style={{ marginTop: '24px' }}>What is Honey, If Only?</h3>
          <p>
            Honey, If Only is an anonymous digital archive for unsent messages, unspoken words, and love letters never sent. It provides a safe space for people to release their heartbreak, regret, or unrequited feelings by distilling them into 25 words or less.
          </p>

          <h3 style={{ marginTop: '24px' }}>Is my submission truly anonymous?</h3>
          <p>
            Yes. We do not collect names, email addresses, or account information when you submit a message. We do not display IP addresses. The only information published is exactly what you type into the submission form.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2>Searching the Archive</h2>

          <h3 style={{ marginTop: '24px' }}>How do I find messages for a specific name?</h3>
          <p>
            You can search for a name using the search bar on the <Link href="/letters">Archive page</Link>. If someone has submitted a message to that name, it will appear in the results. Keep in mind that many people share the same name, so a message addressed to "David" or "Sarah" may not necessarily be about the person you know.
          </p>

          <h3 style={{ marginTop: '24px' }}>Why isn't my name showing up?</h3>
          <p>
            If your name does not appear when you search, it means no one has submitted a message addressed to that exact name yet. Some names may be spelled differently, or the sender may have chosen to use an initial instead.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2>Submitting a Message</h2>

          <h3 style={{ marginTop: '24px' }}>Why is there a 25-word limit?</h3>
          <p>
            The 25-word constraint forces distillation. When you have unlimited space, it's easy to get lost in explanations or cyclical arguments. Restricting the message to 25 words forces you to identify the absolute core of your feeling. It strips away the excess and leaves only the raw truth.
          </p>

          <h3 style={{ marginTop: '24px' }}>What do the colors mean?</h3>
          <p>
            Every letter requires you to choose a color that represents the emotion behind the message. For example, Blush Coral represents passion and urgency, while Faded Denim represents quiet, everyday melancholy. You can read a full breakdown of the emotions on our <Link href="/colors">Color Meanings</Link> page.
          </p>

          <h3 style={{ marginTop: '24px' }}>How long does moderation take?</h3>
          <p>
            All messages are screened automatically for hate speech, severe profanity, and identifying personal information (like phone numbers or full addresses). Once submitted, approved messages typically appear in the archive immediately.
          </p>

          <h3 style={{ marginTop: '24px' }}>Can I edit or delete my message after submitting?</h3>
          <p>
            Because submissions are entirely anonymous and no accounts are created, we have no way to verify who submitted a specific message. Therefore, messages cannot be edited or deleted by the user once they are submitted to the archive. Please be certain of your words before you press send.
          </p>
        </section>

        <section>
          <h2>Moderation and Safety</h2>

          <h3 style={{ marginTop: '24px' }}>What kind of content is not allowed?</h3>
          <p>
            We strictly prohibit hate speech, bullying, slurs, explicit sexual content, threats of violence, and personally identifying information (such as full names, phone numbers, or addresses). Submissions containing this content are automatically rejected by our filtering system.
          </p>

          <h3 style={{ marginTop: '24px' }}>I found a message that is abusive. What should I do?</h3>
          <p>
            If a message bypasses our filters and contains severe bullying, hate speech, or doxxing, please contact us immediately via the <Link href="/contact">Contact page</Link> with the exact name and text of the message so we can remove it.
          </p>
        </section>
      </div>
    </div>
  );
}
