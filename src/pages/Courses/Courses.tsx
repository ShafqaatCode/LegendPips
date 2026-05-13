import React from 'react';
import CoursesHero from '../../components/Courses/CoursesHero';
import MarketsSection from '../../components/Courses/MarketsSection';
import CoursesSection from '../../components/Courses/CoursesSection';
import ForexCoursesSection from '../../components/Courses/ForexCoursesSection';
import CourseCatalog from '../../components/Courses/CourseCatalog';
import WebinarsSection from '../../components/Courses/WebinarsSection';
import WhyStandOutSection from '../../components/Courses/WhyStandOutSection';

const Courses: React.FC = () => {
  return (
    <>
      <CoursesHero />
      <MarketsSection />
      <CoursesSection />
      <ForexCoursesSection />
      <CourseCatalog />
      <WebinarsSection />
      <WhyStandOutSection />
    </>
  );
};

export default Courses;
