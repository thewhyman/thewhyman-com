import { notFound } from 'next/navigation';
import { talks, getTalkBySlug } from '@/data/talks';
import TalkPageContent from './TalkPageContent';

export function generateStaticParams() {
  return talks.map((talk) => ({ slug: talk.slug }));
}

export const dynamicParams = false;

export default async function TalkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const talk = getTalkBySlug(slug);

  if (!talk) {
    notFound();
  }

  return <TalkPageContent talk={talk} />;
}
