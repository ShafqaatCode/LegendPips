import React from 'react';
import styled from 'styled-components';
import bannerGirl from '../../assets/bannerGirl.png';

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

const PanelsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftPanel = styled.div`
  background: #132E58;
  border-radius: 16px;
  padding: 3rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem;
  }
`;

const PanelBadge = styled.div`
  background: #Fbbf24;
  color: #132E58;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 2rem;
`;

const PanelTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BenefitItem = styled.li`
  font-size: 16px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #Fbbf24;
    font-weight: bold;
    font-size: 20px;
  }
`;

const RightPanel = styled.div`
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 400px;
  }
`;

const ProfessionalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom left;
  border-radius: 16px;
`;

const CoursesSection: React.FC = () => {
  const benefits = [
    'Step-by-step lessons from experienced traders.',
    'Clear explanations of strategy and risk control.',
    'Precision chart reading and trade planning.',
    'Guidance to avoid common mistakes.',
    'Real examples that build confidence and skill.',
    'Structured lessons designed for beginners and intermediate traders.',
    'Help with developing discipline and consistent trading habits.'
  ];

  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>OUR COURSES</Heading>
        <PanelsWrapper>
          <LeftPanel>
            <PanelBadge>Learn With Professionals</PanelBadge>
            <PanelTitle>Learn With Professionals</PanelTitle>
            <BenefitsList>
              {benefits.map((benefit, index) => (
                <BenefitItem key={index}>{benefit}</BenefitItem>
              ))}
            </BenefitsList>
          </LeftPanel>
          <RightPanel>
            <ProfessionalImage src={bannerGirl} alt="Professional Trader" />
          </RightPanel>
        </PanelsWrapper>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default CoursesSection;
