import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL, EDITOR_NAME, EDITOR_BIO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${EDITOR_NAME} - Founder & Editor`,
  description: `About ${EDITOR_NAME}, the founder and editor of ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/author` },
};

export default function AuthorPage() {
  return (
    <TrustPage
      eyebrow="Founder & Editor"
      title={EDITOR_NAME}
      subtitle={`Founder and lead editor of ${SITE_NAME}.`}
      highlights={[
        { label: 'Role', value: 'Founder', detail: 'Created the archive to preserve unspoken words.' },
        { label: 'Focus', value: 'Editorial', detail: 'Oversees moderation and journal content.' },
        { label: 'Mission', value: 'Safe expression', detail: 'Ensures the platform remains a safe, anonymous space.' },
      ]}
      sections={[
        {
          title: 'About the Founder',
          eyebrow: 'Background',
          children: (
            <>
              <p>
                <strong>{EDITOR_NAME}</strong> is the founder and lead editor of {SITE_NAME}. 
                He created the archive as a dedicated, safe space for people to express the words they 
                could never say out loud. Recognizing the profound psychological need for closure, he 
                built the platform around the principle of the 25-word constraint—forcing distillation 
                and emotional honesty without the risks of direct contact.
              </p>
              <p>{EDITOR_BIO}</p>
            </>
          ),
        },
        {
          title: 'Editorial Philosophy',
          eyebrow: 'Approach',
          children: (
            <>
              <p>
                As the primary editor, Tejasvi oversees the {SITE_NAME} Journal, which explores the 
                intersection of human emotion, psychology, and digital communication. The editorial 
                approach is grounded in empathy and research, drawing on established psychological 
                frameworks to help readers understand their experiences of grief, limerence, and healing.
              </p>
              <p>
                He personally reviews submissions to ensure the archive remains free from abuse, 
                harassment, and harmful content, maintaining the delicate balance between free 
                expression and community safety.
              </p>
            </>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/about', label: 'How It Works', description: 'Learn how we moderate and publish letters.' },
        { href: '/journal', label: 'Journal', description: 'Read essays on psychology and heartbreak.' },
        { href: '/contact', label: 'Contact', description: 'Reach out to the editor.' },
      ]}
    />
  );
}
