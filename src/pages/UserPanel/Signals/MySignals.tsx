import React, { useState } from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown, FiLock, FiCalendar, FiFilter } from 'react-icons/fi';

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

const SignalsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #132E58;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #132E58;
  font-size: 0.9375rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: space-between;
    
    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
  }
`;

const PairBadge = styled.span`
  background: #132E58;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ActionButton = styled.button<{ $type: 'buy' | 'sell' | 'locked' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  ${({ $type }) => {
    if ($type === 'buy') {
      return `
        background: #10b981;
        color: white;
        &:hover { background: #059669; }
      `;
    }
    if ($type === 'sell') {
      return `
        background: #ef4444;
        color: white;
        &:hover { background: #dc2626; }
      `;
    }
    return `
      background: #f3f4f6;
      color: #6b7280;
      cursor: not-allowed;
    `;
  }}
`;

const ProfitBadge = styled.span<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => {
    if ($status === 'open') return '#10b98115';
    if ($status === 'closed') return '#6b728015';
    return '#Fbbf2415';
  }};
  color: ${({ $status }) => {
    if ($status === 'open') return '#10b981';
    if ($status === 'closed') return '#6b7280';
    return '#Fbbf24';
  }};
`;

const MySignals: React.FC = () => {
  const signals = [
    {
      id: 1,
      pair: 'EUR/USD',
      type: 'buy',
      entry: '1.0850',
      tp: '1.0900',
      sl: '1.0820',
      status: 'open',
      profit: '+2.5%',
      date: '2024-01-15',
      locked: false,
    },
    {
      id: 2,
      pair: 'GBP/USD',
      type: 'sell',
      entry: '1.2650',
      tp: '1.2600',
      sl: '1.2680',
      status: 'closed',
      profit: '+1.8%',
      date: '2024-01-14',
      locked: false,
    },
    {
      id: 3,
      pair: 'XAU/USD',
      type: 'buy',
      entry: '2025.50',
      tp: '2035.00',
      sl: '2020.00',
      status: 'open',
      profit: '+3.2%',
      date: '2024-01-16',
      locked: true,
    },
    {
      id: 4,
      pair: 'USD/JPY',
      type: 'sell',
      entry: '148.50',
      tp: '148.00',
      sl: '148.80',
      status: 'pending',
      profit: '0%',
      date: '2024-01-17',
      locked: false,
    },
  ];

  return (
    <Container>
      <Header>
        <Title>My Signals</Title>
        <FilterButton>
          <FiFilter />
          Filter
        </FilterButton>
      </Header>

      <SignalsTable>
        <TableHeader>
          <div>Pair</div>
          <div>Type</div>
          <div>Entry / TP / SL</div>
          <div>Status</div>
          <div>Profit</div>
          <div>Date</div>
        </TableHeader>
        {signals.map((signal) => (
          <TableRow key={signal.id}>
            <TableCell data-label="Pair">
              <PairBadge>{signal.pair}</PairBadge>
            </TableCell>
            <TableCell data-label="Type">
              <ActionButton
                $type={signal.locked ? 'locked' : (signal.type as "buy" | "sell")}
                disabled={signal.locked}
              >
                {signal.locked ? (
                  <>
                    <FiLock />
                    Locked
                  </>
                ) : (
                  <>
                    {signal.type === 'buy' ? <FiTrendingUp /> : <FiTrendingDown />}
                    {signal.type.toUpperCase()}
                  </>
                )}
              </ActionButton>
            </TableCell>
            <TableCell data-label="Entry / TP / SL">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                <span>Entry: {signal.entry}</span>
                <span>TP: {signal.tp}</span>
                <span>SL: {signal.sl}</span>
              </div>
            </TableCell>
            <TableCell data-label="Status">
              <StatusBadge $status={signal.status}>
                {signal.status.charAt(0).toUpperCase() + signal.status.slice(1)}
              </StatusBadge>
            </TableCell>
            <TableCell data-label="Profit">
              <ProfitBadge $positive={signal.profit.startsWith('+')}>
                {signal.profit.startsWith('+') ? <FiTrendingUp /> : <FiTrendingDown />}
                {signal.profit}
              </ProfitBadge>
            </TableCell>
            <TableCell data-label="Date">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCalendar />
                {signal.date}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </SignalsTable>
    </Container>
  );
};

export default MySignals;
