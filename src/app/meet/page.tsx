import type { Metadata } from 'next';
import canonical from '../../../data/canonical.json';
import JsonLd from '@/components/JsonLd';
import { faqPageSchema } from '@/lib/structuredData';
import MeetPageContent from './MeetPageContent';

export const metadata: Metadata = {
  title: `Meet | ${canonical.basics.name}`,
  description: canonical.basics.summary,
};

export default function MeetPage() {
  return (
    <>
      <JsonLd data={faqPageSchema} />
      <MeetPageContent />
    </>
  );
}
