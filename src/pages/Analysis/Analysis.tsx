import React from 'react';
import { useLocation } from 'react-router-dom';
import AnalysisHero from '../../components/Analysis/AnalysisHero';
import AnalysisList from '../../components/Analysis/AnalysisList';
import { newsSlugFromPath } from '../../data/newsNav';

const Analysis: React.FC = () => {
  const { pathname } = useLocation();
  const categorySlug = newsSlugFromPath(pathname);

  return (
    <>
      <AnalysisHero />
      <AnalysisList categorySlug={categorySlug} />
    </>
  );
};

export default Analysis;