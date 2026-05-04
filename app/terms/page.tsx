import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE_NAME}. Read our terms before using the platform.`,
};

export default function TermsPage() {
  return (
    <div className="content">
      <h1>Terms of Service</h1>
      <p><em>Last updated: May 2026</em></p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using {SITE_NAME}, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.</p>

      <h2>2. User-Submitted Content</h2>
      <p>All letters submitted to {SITE_NAME} are user-generated content. By submitting a letter, you grant us a non-exclusive, worldwide, royalty-free license to display, reproduce, and distribute your submission on our platform.</p>
      <p>You retain ownership of your words. We simply host them.</p>

      <h2>3. Content Guidelines</h2>
      <ul>
        <li>No hate speech, threats, or harassment</li>
        <li>No sexually explicit content</li>
        <li>No personal information (addresses, phone numbers, etc.)</li>
        <li>No spam or commercial content</li>
        <li>Excessive profanity may result in rejection</li>
      </ul>

      <h2>4. Moderation</h2>
      <p>All submissions are reviewed before publication. We reserve the right to reject or remove any content at our sole discretion. Users who repeatedly violate guidelines may be banned.</p>

      <h2>5. Anonymity</h2>
      <p>We do not publicly display any identifying information about letter authors. However, we collect anonymized data (hashed IPs, country) for moderation and abuse prevention purposes.</p>

      <h2>6. No Warranty</h2>
      <p>The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uptime, data preservation, or that submitted letters will be published.</p>

      <h2>7. Limitation of Liability</h2>
      <p>{SITE_NAME} is not liable for any damages arising from the use of this service, including emotional distress caused by reading user-submitted content.</p>

      <h2>8. Changes to Terms</h2>
      <p>We may update these terms at any time. Continued use of the site constitutes acceptance of updated terms.</p>
    </div>
  );
}
