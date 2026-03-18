import React from 'react';
import VideosHero from '../../components/TradingVideos/VideosHero';
import FreeVideosSection from '../../components/TradingVideos/FreeVideosSection';
import PremiumVideosSection from '../../components/TradingVideos/PremiumVideosSection';

const TradingVideos: React.FC = () => {
  return (
    <>
      <VideosHero />
      <FreeVideosSection />
      <PremiumVideosSection />
    </>
  );
};

export default TradingVideos;
