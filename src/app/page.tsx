import JsonLd from '../components/JsonLd';
import { profilePageSchema } from '../lib/structuredData';
import HomePageContent from './HomePageContent';

export default function HomePage() {
  return (
    <>
      <JsonLd data={profilePageSchema} />
      <HomePageContent />
    </>
  );
}
