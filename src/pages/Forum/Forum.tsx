import React from 'react';
import ForumHero from '../../components/Forum/ForumHero';
import PepperstoneBanner from '../../components/Forum/PepperstoneBanner';
import ForumCategories from '../../components/Forum/ForumCategories';

const Forum: React.FC = () => {
  return (
    <>
      <ForumHero />
      <PepperstoneBanner />
      <ForumCategories />
    </>
  );
};

export default Forum;