import React, { useState } from 'react';
import styled from 'styled-components';
import bannerGirl from '../../assets/bannerGirl.png';
import brokerbannergirl from '../../assets/brokerbannergirl.jpg';

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
  margin: 0 auto 1rem;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.lead};
  line-height: 1.65;
  color: #555;
  text-align: center;
  margin: 0 auto 2rem;
  max-width: 42rem;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  overflow: hidden;
`;

const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: rgba(251, 191, 36, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s ease;
  
  &::after {
    content: '▶';
    color: #132E58;
    font-size: 20px;
    margin-left: 3px;
  }
  
  ${VideoCard}:hover & {
    background: #Fbbf24;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const PriceBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(19, 46, 88, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
`;

const VideoContent = styled.div`
  padding: 1.25rem;
`;

const VideoTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
  }
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-bottom: 1rem;
`;

const Duration = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: '⏱️';
    font-size: 12px;
  }
`;

const PremiumButton = styled.button`
  width: 100%;
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
  
  &::before {
    content: '🔒';
    font-size: 14px;
  }
`;

const premiumVideos = [
  {
    id: 1,
    title: 'Forex Trading Masterclass: Forex Fundamentals',
    duration: '2hr 20min',
    price: '$19.99',
    thumbnail: bannerGirl
  },
  {
    id: 2,
    title: 'Forex trading course for beginners 2023 | Forex strategies',
    duration: '3hr 15min',
    price: '$24.99',
    thumbnail: brokerbannergirl
  },
  {
    id: 3,
    title: 'Funded (FMO): Top 5 High-Winrate forex trading strategies',
    duration: '1hr 45min',
    price: '$29.99',
    thumbnail: bannerGirl
  },
  {
    id: 4,
    title: 'The Complete Foundation FOREX Trading Course',
    duration: '2hr 10min',
    price: '$19.99',
    thumbnail: brokerbannergirl
  },
  {
    id: 5,
    title: 'High-Probability Forex Gold Strategy: Trade like a Pro!',
    duration: '1hr 30min',
    price: '$39.99',
    thumbnail: bannerGirl
  },
  {
    id: 6,
    title: 'Advanced Price Action Trading Strategies',
    duration: '2hr 5min',
    price: '$34.99',
    thumbnail: brokerbannergirl
  },
  {
    id: 7,
    title: 'Professional Risk Management Techniques',
    duration: '1hr 50min',
    price: '$24.99',
    thumbnail: bannerGirl
  },
  {
    id: 8,
    title: 'Mastering Market Psychology and Discipline',
    duration: '2hr 30min',
    price: '$29.99',
    thumbnail: brokerbannergirl
  }
];

const PremiumVideosSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedVideos = showAll ? premiumVideos : premiumVideos.slice(0, 8);

  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>Unlock advanced learning with paid trading courses.</Heading>
        <Description>
          Gain access to in-depth lessons, proven strategies, and detailed market analysis. Learn how to manage risk, refine entries and exits, and trade with greater confidence and consistency.
        </Description>
        <VideosGrid>
          {displayedVideos.map((video) => (
            <VideoCard key={video.id}>
              <ThumbnailWrapper>
                <Thumbnail src={video.thumbnail} alt={video.title} />
                <PlayButton />
                <PriceBadge>{video.price}</PriceBadge>
              </ThumbnailWrapper>
              <VideoContent>
                <VideoTitle>{video.title}</VideoTitle>
                <VideoMeta>
                  <Duration>{video.duration} on-demand video</Duration>
                </VideoMeta>
                <PremiumButton>Premium</PremiumButton>
              </VideoContent>
            </VideoCard>
          ))}
        </VideosGrid>
        {!showAll && premiumVideos.length > 8 && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: '#132E58',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Show More
            </button>
          </div>
        )}
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default PremiumVideosSection;
