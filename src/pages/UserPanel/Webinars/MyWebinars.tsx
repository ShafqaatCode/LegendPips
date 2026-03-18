import React, { useState } from 'react';
import styled from 'styled-components';
import { FiVideo, FiCalendar, FiClock, FiUser, FiPlay, FiLock } from 'react-icons/fi';

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

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${({ $active }) => ($active ? '#132E58' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? '#132E58' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#132E58')};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #132E58;
    background: ${({ $active }) => ($active ? '#132E58' : '#f9fafb')};
  }
`;

const WebinarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const WebinarCard = styled.div`
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

const Thumbnail = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const StatusBadge = styled.span<{ $status: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => {
    if ($status === 'live') return '#ef4444';
    if ($status === 'upcoming') return '#10b981';
    return '#6b7280';
  }};
  color: white;
`;

const PremiumBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #Fbbf24;
  color: #132E58;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const WebinarTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const WebinarMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const ActionButton = styled.button<{ $premium?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $premium }) => ($premium ? '#Fbbf24' : '#132E58')};
  color: ${({ $premium }) => ($premium ? '#132E58' : 'white')};
  
  &:hover {
    background: ${({ $premium }) => ($premium ? '#f4b400' : '#1a4a7a')};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MyWebinars: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const webinars = [
    {
      id: 1,
      title: 'Advanced Forex Trading Strategies',
      instructor: 'John Smith',
      date: '2024-01-20',
      time: '14:00',
      status: 'upcoming',
      premium: false,
      duration: '60 min',
    },
    {
      id: 2,
      title: 'Crypto Market Analysis Masterclass',
      instructor: 'Jane Doe',
      date: '2024-01-18',
      time: '16:00',
      status: 'live',
      premium: true,
      duration: '90 min',
    },
    {
      id: 3,
      title: 'Risk Management Fundamentals',
      instructor: 'Mike Johnson',
      date: '2024-01-15',
      time: '10:00',
      status: 'recorded',
      premium: false,
      duration: '45 min',
    },
    {
      id: 4,
      title: 'Gold Trading Secrets',
      instructor: 'Sarah Williams',
      date: '2024-01-12',
      time: '15:00',
      status: 'recorded',
      premium: true,
      duration: '75 min',
    },
  ];

  const filteredWebinars = webinars.filter((webinar) => {
    if (activeFilter === 'all') return true;
    return webinar.status === activeFilter;
  });

  return (
    <Container>
      <Header>
        <Title>My Webinars</Title>
      </Header>

      <FilterTabs>
        <Tab $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
          All Webinars
        </Tab>
        <Tab $active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')}>
          Upcoming
        </Tab>
        <Tab $active={activeFilter === 'live'} onClick={() => setActiveFilter('live')}>
          Live
        </Tab>
        <Tab $active={activeFilter === 'recorded'} onClick={() => setActiveFilter('recorded')}>
          Recorded
        </Tab>
      </FilterTabs>

      <WebinarsGrid>
        {filteredWebinars.map((webinar) => (
          <WebinarCard key={webinar.id}>
            <Thumbnail>
              <FiVideo />
              <StatusBadge $status={webinar.status}>
                {webinar.status === 'live' ? 'LIVE' : webinar.status === 'upcoming' ? 'Upcoming' : 'Recorded'}
              </StatusBadge>
              {webinar.premium && <PremiumBadge>Premium</PremiumBadge>}
            </Thumbnail>
            <CardContent>
              <WebinarTitle>{webinar.title}</WebinarTitle>
              <WebinarMeta>
                <MetaItem>
                  <FiUser />
                  {webinar.instructor}
                </MetaItem>
                <MetaItem>
                  <FiCalendar />
                  {webinar.date}
                </MetaItem>
                <MetaItem>
                  <FiClock />
                  {webinar.time} • {webinar.duration}
                </MetaItem>
              </WebinarMeta>
              <ActionButton $premium={webinar.premium} disabled={webinar.premium && webinar.status === 'recorded'}>
                {webinar.premium && webinar.status === 'recorded' ? (
                  <>
                    <FiLock />
                    Premium - Unlock to Watch
                  </>
                ) : webinar.status === 'live' ? (
                  <>
                    <FiPlay />
                    Join Live
                  </>
                ) : webinar.status === 'upcoming' ? (
                  'Reserve Seat'
                ) : (
                  <>
                    <FiPlay />
                    Watch Replay
                  </>
                )}
              </ActionButton>
            </CardContent>
          </WebinarCard>
        ))}
      </WebinarsGrid>
    </Container>
  );
};

export default MyWebinars;
