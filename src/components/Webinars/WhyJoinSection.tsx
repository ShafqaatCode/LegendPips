import React from 'react';
import styled from 'styled-components';
import { useLocale } from '../../contexts/LocaleContext';

const SectionWrapper = styled.section`
  background: white;
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

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const BenefitItem = styled.li`
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  padding-inline-start: 2rem;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    inset-inline-start: 0;
    left: auto;
    color: #Fbbf24;
    font-weight: bold;
    font-size: 24px;
    top: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
    padding-left: 1.75rem;
  }
`;

const WhyJoinSection: React.FC = () => {
  const { t } = useLocale();
  const benefits = ["webinars.w1", "webinars.w2", "webinars.w3", "webinars.w4", "webinars.w5"];

  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>{t("webinars.why")}</Heading>
        <BenefitsList>
          {benefits.map((key) => (
            <BenefitItem key={key}>{t(key)}</BenefitItem>
          ))}
        </BenefitsList>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default WhyJoinSection;
