import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer for ${SITE_NAME}. Important information about user-generated content.`,
};

export default function DisclaimerPage() {
  return (
    <div className="content">
      <h1>Disclaimer</h1>
      <p><em>Last updated: May 2026</em></p>

      <h2>User-Generated Content</h2>
      <p>All letters displayed on {SITE_NAME} are submitted by anonymous users. The views, opinions, and sentiments expressed in these letters do not represent the views of {SITE_NAME} or its operators.</p>

      <h2>No Professional Advice</h2>
      <p>This platform is not a substitute for professional mental health support. If you are experiencing emotional distress, please reach out to a qualified professional or a crisis helpline in your area.</p>

      <h2>Content Accuracy</h2>
      <p>We make no guarantees about the accuracy, completeness, or authenticity of any user-submitted content. Letters may be fictional, exaggerated, or otherwise not representative of real events.</p>

      <h2>Emotional Content Warning</h2>
      <p>Some letters on this site may contain emotionally heavy content including themes of loss, regret, heartbreak, and grief. Please browse at your own discretion.</p>

      <h2>External Links</h2>
      <p>Any external links found on this site are provided for convenience. We are not responsible for the content or practices of linked websites.</p>
    </div>
  );
}
