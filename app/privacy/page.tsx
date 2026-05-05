import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}. Learn how we handle your data.`,
};

export default function PrivacyPage() {
  return (
    <div className="content">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: May 2026</em></p>

      <h2>What We Collect</h2>
      <ul>
        <li><strong>Letter content:</strong> The name and message you submit</li>
        <li><strong>Anonymized identifier:</strong> We create a one-way, irreversible fingerprint for moderation purposes. We never store or log your actual network address</li>
        <li><strong>Country:</strong> General geographic region for moderation context</li>
        <li><strong>Anonymous session ID:</strong> A random identifier for moderation purposes</li>
      </ul>

      <h2>What We Do NOT Collect</h2>
      <ul>
        <li>Email addresses</li>
        <li>Real names of authors</li>
        <li>Cookies for tracking (we only use essential cookies)</li>
        <li>Any personally identifiable information</li>
        <li>Raw network addresses or device fingerprints</li>
      </ul>

      <h2>How We Use Your Data</h2>
      <p>Your data is used solely for:</p>
      <ul>
        <li>Displaying approved letters on the site</li>
        <li>Moderation and abuse prevention</li>
        <li>Rate limiting (6 submissions per day)</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>We use reputable, industry-standard third-party providers for infrastructure, security, and content delivery. All providers are bound by their own privacy policies and data protection standards. We do not sell or share your data with any third party for advertising or marketing purposes.</p>

      <h2>Data Retention</h2>
      <p>Approved letters are stored indefinitely. Rejected submissions are deleted after 30 days. Moderation records are retained for abuse prevention.</p>

      <h2>Your Rights</h2>
      <p>Since we do not collect personally identifiable information, traditional data subject requests (access, deletion) may not apply. If you need to contact us about a specific letter, please use our <a href="/contact">contact page</a>.</p>

      <h2>Contact</h2>
      <p>For privacy-related inquiries, please visit our <a href="/contact">contact page</a>.</p>
    </div>
  );
}
