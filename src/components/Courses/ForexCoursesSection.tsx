import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: #fafbfc;
  padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter};
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.typography.sectionTitle};
  line-height: ${({ theme }) => theme.typography.sectionTitleLh};
  font-weight: 700;
  color: #132e58;
  text-align: center;
  margin: 0 auto 2rem;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 3vw, 2rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CourseCard = styled.div<{ $orange?: boolean }>`
  background: ${({ $orange }) => ($orange ? "#Fbbf24" : "#132E58")};
  border-radius: 16px;
  padding: clamp(1.5rem, 4vw, 2rem);
  color: ${({ $orange }) => ($orange ? "#132E58" : "white")};
  position: relative;
`;

const CourseTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 700;
  margin: 0 0 0.75rem;
`;

const CourseSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  margin: 0 0 1.25rem;
  opacity: 0.9;
`;

const Badge = styled.div<{ $orange?: boolean }>`
  background: ${({ $orange }) => ($orange ? "#132E58" : "#Fbbf24")};
  color: ${({ $orange }) => ($orange ? "white" : "#132E58")};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  &::before {
    content: ${({ $orange }) => ($orange ? '"👑"' : '"FREE"')};
    font-size: 14px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FeatureItem = styled.li`
  font-size: 15px;
  line-height: 1.6;
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '•';
    position: absolute;
    left: 0;
    font-size: 20px;
    font-weight: bold;
  }
`;

const CourseButton = styled.button<{ $orange?: boolean }>`
  background: ${({ $orange }) => ($orange ? '#132E58' : '#Fbbf24')};
  color: ${({ $orange }) => ($orange ? 'white' : '#132E58')};
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const ForexCoursesSection: React.FC = () => {
  const scrollToCatalog = () => {
    const el = document.getElementById("course-catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.hash = "course-catalog";
  };

  const freeCourseFeatures = [
    'Beginner Forex Trading Course',
    'Learn the ethics of your trade and how you can trade forex',
    'Learn fundamental to technical analysis',
    'Forecast analysis and risk management',
    'Understand market structure and price action',
    'Advanced technical analysis',
    'Fundamental analysis'
  ];

  const proCourseFeatures = [
    'Advanced Trading Strategies',
    'High probability trading setups and position sizing',
    'Advanced trading from real indicators',
    'Smart automated trading',
    'Risk management and capital protection',
    'Live market trading'
  ];

  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>Forex Trading Mastery Courses</Heading>
        <CoursesGrid>
          <CourseCard>
            <Badge>FREE</Badge>
            <CourseTitle>Learn Forex For Free</CourseTitle>
            <CourseSubtitle>Designed for New Traders in Forex and Crypto.</CourseSubtitle>
            <FeaturesList>
              {freeCourseFeatures.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </FeaturesList>
            <CourseButton type="button" onClick={scrollToCatalog}>
              Start learning free
            </CourseButton>
          </CourseCard>
          
          <CourseCard $orange>
            <Badge $orange>👑</Badge>
            <CourseTitle>Pro Trading Academy</CourseTitle>
            <CourseSubtitle>Professional Level Trading Academy.</CourseSubtitle>
            <FeaturesList>
              {proCourseFeatures.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </FeaturesList>
            <CourseButton $orange type="button" onClick={scrollToCatalog}>
              View catalog & enroll
            </CourseButton>
          </CourseCard>
        </CoursesGrid>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default ForexCoursesSection;
