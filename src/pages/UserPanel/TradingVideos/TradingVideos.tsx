import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlay, FiClock, FiLock, FiFilter } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  color: #132E58;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #132E58;
    background: #f9fafb;
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #Fbbf24;
  }
`;

const VideoThumbnail = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #132E58;
  font-size: 1.5rem;
  z-index: 1;
`;

const PremiumBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #Fbbf24;
  color: #132E58;
`;

const FreeBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #10b981;
  color: white;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const VideoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #132E58;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Duration = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const TradingVideos: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: 'Introduction to Forex Trading',
      duration: '15:30',
      premium: false,
    },
    {
      id: 2,
      title: 'Advanced Chart Patterns Explained',
      duration: '22:45',
      premium: true,
    },
    {
      id: 3,
      title: 'Risk Management Strategies',
      duration: '18:20',
      premium: false,
    },
    {
      id: 4,
      title: 'Crypto Trading Fundamentals',
      duration: '25:10',
      premium: false,
    },
    {
      id: 5,
      title: 'Mastering Technical Indicators',
      duration: '30:00',
      premium: true,
    },
    {
      id: 6,
      title: 'Live Trading Session',
      duration: '45:15',
      premium: true,
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Trading Videos</Title>
        <FilterButton>
          <FiFilter />
          Filter
        </FilterButton>
      </Header>

      <VideosGrid>
        {videos.map((video) => (
          <VideoCard key={video.id}>
            <VideoThumbnail>
              {video.premium ? <PremiumBadge>Premium</PremiumBadge> : <FreeBadge>FREE</FreeBadge>}
              <PlayIcon>
                <FiPlay />
              </PlayIcon>
            </VideoThumbnail>
            <CardContent>
              <VideoTitle>{video.title}</VideoTitle>
              <VideoMeta>
                <Duration>
                  <FiClock />
                  {video.duration}
                </Duration>
                {video.premium && (
                  <span style={{ color: '#Fbbf24', fontWeight: 600 }}>
                    <FiLock /> Premium
                  </span>
                )}
              </VideoMeta>
            </CardContent>
          </VideoCard>
        ))}
      </VideosGrid>
    </Container>
  );
};

export default TradingVideos;
