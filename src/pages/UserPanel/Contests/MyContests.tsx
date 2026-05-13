import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { fetchMyContests } from '../../../services/contestService';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
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

const ContestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ContestCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
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

const ContestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContestTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 0.5rem 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => {
    if ($status === 'active') return '#10b981';
    if ($status === 'upcoming') return '#Fbbf24';
    return '#6b7280';
  }};
  color: ${({ $status }) => ($status === 'active' || $status === 'upcoming' ? 'white' : '#132E58')};
`;

const ContestDescription = styled.p`
  color: #6b7280;
  font-size: 0.9375rem;
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const ContestStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

const ContestFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ContestDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const ViewButton = styled.button`
  background: #132E58;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1a4a7a;
    transform: translateX(4px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
`;

const MyContests: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [contests, setContests] = useState<any[]>([]);

  useEffect(() => {
    fetchMyContests()
      .then((items) => {
        const mapped = items.map((entry: any) => {
          const contest = entry.contest || {};
          const endDate = contest.endDate ? new Date(contest.endDate).toISOString().slice(0, 10) : undefined;
          const statusRaw = contest.status || "Upcoming";
          const status = statusRaw === "Ongoing" ? "active" : statusRaw === "Upcoming" ? "upcoming" : "completed";
          return {
            id: contest._id,
            title: contest.title || "Contest",
            description: contest.description || contest.subtitle || "Contest participation",
            status,
            participants: contest.participants || 0,
            endDate,
            rank: 0,
            profit: `${Number(entry.leaderboardStats?.profitPercent || 0).toFixed(2)}%`,
            startDate: contest.startDate ? new Date(contest.startDate).toISOString().slice(0, 10) : undefined,
          };
        });
        setContests(mapped);
      })
      .catch(() => setContests([]));
  }, []);

  const filteredContests = contests.filter((contest) => {
    if (activeFilter === 'all') return true;
    return contest.status === activeFilter;
  });

  return (
    <Container>
      <Header>
        <Title>My Contests</Title>
      </Header>

      <FilterTabs>
        <Tab $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
          All Contests
        </Tab>
        <Tab $active={activeFilter === 'active'} onClick={() => setActiveFilter('active')}>
          Active
        </Tab>
        <Tab $active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')}>
          Upcoming
        </Tab>
        <Tab $active={activeFilter === 'completed'} onClick={() => setActiveFilter('completed')}>
          Completed
        </Tab>
      </FilterTabs>

      {filteredContests.length > 0 ? (
        <ContestsGrid>
          {filteredContests.map((contest) => (
            <ContestCard key={contest.id}>
              <ContestHeader>
                <div>
                  <ContestTitle>{contest.title}</ContestTitle>
                </div>
                <StatusBadge $status={contest.status}>
                  {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                </StatusBadge>
              </ContestHeader>
              <ContestDescription>{contest.description}</ContestDescription>
              
              {contest.status === 'active' && (
                <ContestStats>
                  <StatItem>
                    <StatValue>{contest.rank}</StatValue>
                    <StatLabel>Your Rank</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{contest.profit}</StatValue>
                    <StatLabel>Profit</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{contest.participants}</StatValue>
                    <StatLabel>Participants</StatLabel>
                  </StatItem>
                </ContestStats>
              )}

              <ContestFooter>
                <ContestDate>
                  <FiCalendar />
                  {contest.status === 'upcoming' 
                    ? `Starts: ${contest.startDate}`
                    : `Ends: ${contest.endDate}`
                  }
                </ContestDate>
                <ViewButton>
                  View Details
                  <FiArrowRight />
                </ViewButton>
              </ContestFooter>
            </ContestCard>
          ))}
        </ContestsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>🏆</EmptyIcon>
          <EmptyText>No contests found in this category.</EmptyText>
        </EmptyState>
      )}
    </Container>
  );
};

export default MyContests;
