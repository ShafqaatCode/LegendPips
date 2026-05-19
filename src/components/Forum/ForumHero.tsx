import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ArrowRight from '../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg';

const HeroWrapper = styled.section`
  position: relative;
  padding: clamp(2.5rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter};
  background: white;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const LeftContent = styled.div`
  color: #132e58;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  margin: 0 0 0.65rem;
  color: #132e58;
`;

const HighlightText = styled.span`
  color: #fbbf24;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.heroSubtitle};
  font-weight: 500;
  color: #132e58;
  margin: 0 0 1rem;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: #555;
  margin: 0 0 1.25rem;
`;

const JoinButton = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: none;
  padding: 0.55rem 1.25rem;
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
  
  img {
    width: 20px;
    height: 20px;
  }
`;

const RightContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: -1;
  }
`;

const CommunityGraphic = styled.div`
  width: 100%;
  max-width: min(380px, 100%);
  height: clamp(220px, 36vh, 300px);
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  border-radius: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "👥";
    font-size: clamp(4rem, 18vw, 7rem);
    opacity: 0.3;
  }
`;

const ChatBubble = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #132E58;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &::after {
    content: '💬';
    font-size: 24px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
    
    &::after {
      font-size: 20px;
    }
  }
`;

const ForumHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroWrapper>
      <ContentWrapper>
        <LeftContent>
          <Title>
            Welcome To The LegendPips <HighlightText>Community</HighlightText>
          </Title>
          <Subtitle>Trade, Learn, Discuss.</Subtitle>
          <Description>
            Share your market ideas, ask questions, and take part in discussions that give you a clear view of real trading conditions. Learn directly from experienced traders and explore analysis across Forex, Gold, Crypto, Stocks, and Indices. You get practical insights, short breakdowns, and strategy explanations that help you make stronger decisions and stay prepared for every major market move.
          </Description>
          <JoinButton onClick={() => navigate('/register')}>
            Join Now
            <img src={ArrowRight} alt="Arrow" />
          </JoinButton>
        </LeftContent>
        <RightContent>
          <CommunityGraphic>
            <ChatBubble />
          </CommunityGraphic>
        </RightContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default ForumHero;
