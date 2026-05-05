import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the team behind Honey, If Only.',
};

export default function ContactPage() {
  return (
    <div className="content">
      <h1>Contact</h1>
      <p>
        We&apos;d love to hear from you — whether it&apos;s a question, a suggestion,
        or a request to remove a letter.
      </p>

      <h2>Get in Touch</h2>
      <p>
        Email us at: <a href="mailto:ifonlyisentthis@gmail.com"><strong>ifonlyisentthis@gmail.com</strong></a>
      </p>

      <h2>Letter Removal</h2>
      <p>
        If you believe a letter on our site references you and you&apos;d like it removed,
        please email us with the letter&apos;s URL and a brief explanation. We take these
        requests seriously and will respond within 48 hours.
      </p>

      <h2>Report Abuse</h2>
      <p>
        If you see content that violates our guidelines — hate speech, harassment, or
        anything harmful — please report it immediately by emailing us the letter&apos;s URL.
      </p>

      <h2>Business Inquiries</h2>
      <p>
        For advertising, partnerships, or media inquiries, please reach out to:
        <a href="mailto:ifonlyisentthis@gmail.com"><strong> ifonlyisentthis@gmail.com</strong></a>
      </p>
    </div>
  );
}
