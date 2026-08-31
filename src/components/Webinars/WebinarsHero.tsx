import React from 'react';
import styled from 'styled-components';
import { useLocale } from "../../contexts/LocaleContext";

const HeroWrapper = styled.section`
  background: white;
  padding: clamp(2.5rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter};
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const LeftContent = styled.div``;

const Heading = styled.h1`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  color: #132e58;
  margin: 0 0 1rem;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
`;

const HighlightText = styled.span`
  color: #fbbf24;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: #555;
  max-width: 40rem;
  margin: 0;
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: -1;
    justify-content: flex-start;
  }
`;

const IconWrapper = styled.div`
  width: clamp(72px, 14vw, 96px);
  height: clamp(72px, 14vw, 96px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  color: #132e58;
  opacity: 0.85;
`;

const WebinarsHero: React.FC = () => {
  const { t } = useLocale();
  return (
    <HeroWrapper>
      <ContentWrapper>
        <LeftContent>
          <Heading>
            {t("webinars.title")} <HighlightText>{t("webinars.highlight")}</HighlightText>
          </Heading>
          <Description>
            {t("webinars.body")}
          </Description>
        </LeftContent>
        <RightContent>
          <IconWrapper>🎓</IconWrapper>
        </RightContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default WebinarsHero;
