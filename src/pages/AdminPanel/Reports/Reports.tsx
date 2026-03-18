import React, { useState } from 'react';
import styled from 'styled-components';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiDownload, FiCalendar } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1600px;
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

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: #132E58;
  color: white;
  
  &:hover {
    background: #1a4a7a;
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ $positive }) => ($positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ReportsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ReportInfo = styled.div`
  flex: 1;
`;

const ReportTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #132E58;
  margin: 0 0 0.25rem 0;
`;

const ReportDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const DownloadButton = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: #132E58;
  color: white;
  
  &:hover {
    background: #1a4a7a;
  }
`;

const Reports: React.FC = () => {
  const stats = [
    {
      icon: FiBarChart2,
      label: 'Total Revenue',
      value: '$125,678',
      change: '+15%',
      positive: true,
      color: '#10b981',
    },
    {
      icon: FiTrendingUp,
      label: 'Active Users',
      value: '1,234',
      change: '+12%',
      positive: true,
      color: '#3b82f6',
    },
    {
      icon: FiBarChart2,
      label: 'Total Signals',
      value: '456',
      change: '+23',
      positive: true,
      color: '#Fbbf24',
    },
    {
      icon: FiTrendingDown,
      label: 'Churn Rate',
      value: '2.5%',
      change: '-0.5%',
      positive: true,
      color: '#10b981',
    },
  ];

  const reports = [
    {
      id: '1',
      title: 'Monthly Revenue Report',
      description: 'Complete revenue breakdown for January 2024',
      date: '2024-01-31',
    },
    {
      id: '2',
      title: 'User Growth Analysis',
      description: 'User acquisition and retention metrics',
      date: '2024-01-30',
    },
    {
      id: '3',
      title: 'Contest Performance Report',
      description: 'Analysis of all contests and participation rates',
      date: '2024-01-29',
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Reports & Analytics</Title>
        <Button
          onClick={() => {
            // Frontend-only demo action (no API yet)
            alert("Export is not connected yet. This is a frontend demo.");
          }}
        >
          <FiDownload />
          Export All Reports
        </Button>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatIcon $color={stat.color}>
                <stat.icon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <StatChange $positive={stat.positive}>
              {stat.positive ? <FiTrendingUp /> : <FiTrendingDown />}
              {stat.change} this month
            </StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      <ReportsSection>
        <SectionTitle>Available Reports</SectionTitle>
        <ReportsList>
          {reports.map((report) => (
            <ReportItem key={report.id}>
              <ReportInfo>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportDescription>{report.description}</ReportDescription>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <FiCalendar />
                  {report.date}
                </div>
              </ReportInfo>
              <DownloadButton>
                <FiDownload />
                Download
              </DownloadButton>
            </ReportItem>
          ))}
        </ReportsList>
      </ReportsSection>
    </Container>
  );
};

export default Reports;
