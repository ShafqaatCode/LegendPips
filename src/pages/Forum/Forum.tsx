import React from 'react';
import { useLocation } from 'react-router-dom';
import ForumHero from '../../components/Forum/ForumHero';
import PepperstoneBanner from '../../components/Forum/PepperstoneBanner';
import ForumCategories from '../../components/Forum/ForumCategories';

const Forum: React.FC = () => {
  const { pathname } = useLocation();
  const latestOnly = pathname.includes('/forum/latest');

  return (
    <>
      {!latestOnly && <ForumHero />}
      {!latestOnly && <PepperstoneBanner />}
      <ForumCategories latestFocus={latestOnly} />
    </>
  );
};

export default Forum;
