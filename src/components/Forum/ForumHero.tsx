import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ArrowRight from '../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg';

const HeroWrapper = styled.section`
  position: relative;
  padding: 120px 3rem 80px 3rem;
  background: white;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 2rem 60px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 100px 1.5rem 40px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftContent = styled.div`
  color: #132E58;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #132E58;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 40px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const HighlightText = styled.span`
  color: #Fbbf24;
`;

const Subtitle = styled.p`
  font-size: 24px;
  font-weight: 500;
  color: #132E58;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
  }
`;

const JoinButton = styled.button`
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
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
  max-width: 500px;
  height: 400px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '👥';
    font-size: 200px;
    opacity: 0.3;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 300px;
    max-width: 100%;
    
    &::before {
      font-size: 120px;
    }
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
