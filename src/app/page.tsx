import JsonLd from '../components/JsonLd';
import FaqSection from '../components/FaqSection';
import { profilePageSchema, homepageFaqSchema } from '../lib/structuredData';
import { HOMEPAGE_FAQ_ITEMS } from '../data/faq';
import HomePageContent from './HomePageContent';

export default function HomePage() {
  return (
    <>
      <JsonLd data={profilePageSchema} />
      {/* The FAQPage schema describes exactly the five questions rendered below.
          The scanner reads the ROOT page, and the full thirteen live on /meet —
          but emitting thirteen here while showing five would be invisible
          schema, scoring the checkpoint without delivering the content. */}
      <JsonLd data={homepageFaqSchema} />
      <HomePageContent
        faq={(
          <FaqSection
            items={HOMEPAGE_FAQ_ITEMS}
            id="home-faq-heading"
            eyebrow="Straight answers"
            headingLead="What do recruiters"
            headingAccent="ask first?"
            intro="The five that come up before anything else — including the two people usually wait until the call to ask."
            footer={(
              <a href="/meet" className="hover:text-teal-400 transition-colors">
                All thirteen questions, answered on the booking page →
              </a>
            )}
            className="relative z-10 px-8 py-32 border-t border-white/5"
          />
        )}
      />
    </>
  );
}
