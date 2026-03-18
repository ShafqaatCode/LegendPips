import React, { useState } from 'react';
import styled from 'styled-components';
import bannerGirl from '../../assets/bannerGirl.png';
import brokerbannergirl from '../../assets/brokerbannergirl.jpg';

const SectionWrapper = styled.section`
  background: white;
  padding: 80px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: #132E58;
  text-align: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: #555;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
    margin-bottom: 2rem;
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
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
  width: 60px;
  height: 60px;
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
    font-size: 24px;
    margin-left: 4px;
  }
  
  ${VideoCard}:hover & {
    background: #Fbbf24;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const FreeBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #Fbbf24;
  color: #132E58;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
`;

const VideoContent = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 1rem;
`;

const Duration = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: '⏱️';
    font-size: 14px;
  }
`;

const WatchButton = styled.button`
  width: 100%;
  background: #132E58;
  color: white;
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
    background: #0b1b38;
    transform: translateY(-2px);
  }
  
  &::after {
    content: '▶';
    font-size: 12px;
  }
`;

const ShowMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  background: #132E58;
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0b1b38;
    transform: translateY(-2px);
  }
  
  &::after {
    content: '↓';
    font-size: 18px;
  }
`;

const freeVideos = [
  {
    id: 1,
    title: 'Introductory Forex Trading Course',
    duration: '2hr 20min',
    thumbnail: bannerGirl
  },
  {
    id: 2,
    title: 'The Advanced Forex Course for Smart Traders',
    duration: '3hr 15min',
    thumbnail: brokerbannergirl
  },
  {
    id: 3,
    title: 'Forex & Financial Market Trading Tutorial - Online Strategies',
    duration: '1hr 45min',
    thumbnail: bannerGirl
  },
  {
    id: 4,
    title: 'The Essentials of Forex Fundamental Analysis',
    duration: '2hr 10min',
    thumbnail: brokerbannergirl
  },
  {
    id: 5,
    title: 'Risk Management in Forex Trading',
    duration: '1hr 30min',
    thumbnail: bannerGirl
  },
  {
    id: 6,
    title: 'Technical Analysis Basics for Beginners',
    duration: '2hr 5min',
    thumbnail: brokerbannergirl
  }
];

const FreeVideosSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedVideos = showAll ? freeVideos : freeVideos.slice(0, 6);

  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>Start learning Trading with no cost.</Heading>
        <Description>
          Access free lessons designed for beginners. Learn how the market works, understand charts, manage risk, and build basic trading skills. This is the best way to gain knowledge and confidence before moving to advanced strategies or live trading.
        </Description>
        <VideosGrid>
          {displayedVideos.map((video) => (
            <VideoCard key={video.id}>
              <ThumbnailWrapper>
                <Thumbnail src={video.thumbnail} alt={video.title} />
                <PlayButton />
                <FreeBadge>FREE</FreeBadge>
              </ThumbnailWrapper>
              <VideoContent>
                <VideoTitle>{video.title}</VideoTitle>
                <VideoMeta>
                  <Duration>{video.duration} on-demand video</Duration>
                </VideoMeta>
                <WatchButton>Watch Now</WatchButton>
              </VideoContent>
            </VideoCard>
          ))}
        </VideosGrid>
        {!showAll && freeVideos.length > 6 && (
          <ShowMoreButton onClick={() => setShowAll(true)}>
            Show More
          </ShowMoreButton>
        )}
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default FreeVideosSection;
