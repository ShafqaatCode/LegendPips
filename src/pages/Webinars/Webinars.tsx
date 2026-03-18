import React from 'react';
import WebinarsHero from '../../components/Webinars/WebinarsHero';
import PepperstoneBanner from '../../components/Forum/PepperstoneBanner';
import WebinarsList from '../../components/Webinars/WebinarsList';
import WhyJoinSection from '../../components/Webinars/WhyJoinSection';

const Webinars: React.FC = () => {
  return (
    <>
      <WebinarsHero />
      <PepperstoneBanner />
      <WebinarsList />
      <WhyJoinSection />
    </>
  );
};

export default Webinars;
