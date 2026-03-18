import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCalendar, FiUsers, FiAward, FiCheck } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';

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

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $primary }) => ($primary ? '#132E58' : 'white')};
  color: ${({ $primary }) => ($primary ? 'white' : '#132E58')};
  border: 2px solid ${({ $primary }) => ($primary ? '#132E58' : '#e5e7eb')};
  
  &:hover {
    background: ${({ $primary }) => ($primary ? '#1a4a7a' : '#f9fafb')};
    border-color: ${({ $primary }) => ($primary ? '#1a4a7a' : '#132E58')};
    transform: translateY(-2px);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
    if ($status === 'Ongoing') return '#10b98115';
    if ($status === 'Upcoming') return '#Fbbf2415';
    return '#6b728015';
  }};
  color: ${({ $status }) => {
    if ($status === 'Ongoing') return '#10b981';
    if ($status === 'Upcoming') return '#Fbbf24';
    return '#6b7280';
  }};
`;

const ContestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  
  svg {
    color: #Fbbf24;
  }
  
  strong {
    color: #132E58;
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f3f4f6')};
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#132E58')};
  
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fecaca' : '#e5e7eb')};
  }
`;

const ContestsManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const [contests, setContests] = useState([
    {
      id: '1',
      title: 'Forex Trading Championship',
      type: 'Monthly',
      status: 'Ongoing',
      participants: 1250,
      entry: 'Free',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      prize: '$50,000',
    },
    {
      id: '2',
      title: 'Crypto Master Challenge',
      type: 'Weekly',
      status: 'Ongoing',
      participants: 890,
      entry: 'Free',
      startDate: '2024-01-15',
      endDate: '2024-02-20',
      prize: '$25,000',
    },
    {
      id: '3',
      title: 'Gold Rush Competition',
      type: 'Special',
      status: 'Upcoming',
      participants: 0,
      entry: 'Free',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      prize: '$15,000',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Monthly');
  const [formStatus, setFormStatus] = useState<'Upcoming' | 'Ongoing' | 'Ended'>('Upcoming');

  const filteredContests = contests.filter((contest) => {
    if (activeFilter === 'all') return true;
    return contest.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <Container>
      <Header>
        <Title>Contests Management</Title>
        <Button
          $primary
          onClick={() => {
            setModalMode('add');
            setSelectedContestId(null);
            setFormTitle('');
            setFormType('Monthly');
            setFormStatus('Upcoming');
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Create Contest
        </Button>
      </Header>

      <FilterTabs>
        <Tab $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
          All Contests
        </Tab>
        <Tab $active={activeFilter === 'ongoing'} onClick={() => setActiveFilter('ongoing')}>
          Ongoing
        </Tab>
        <Tab $active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')}>
          Upcoming
        </Tab>
        <Tab $active={activeFilter === 'ended'} onClick={() => setActiveFilter('ended')}>
          Ended
        </Tab>
      </FilterTabs>

      <ContestsGrid>
        {filteredContests.map((contest) => (
          <ContestCard key={contest.id}>
            <ContestHeader>
              <div>
                <ContestTitle>{contest.title}</ContestTitle>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {contest.type}
                </div>
              </div>
              <StatusBadge $status={contest.status}>{contest.status}</StatusBadge>
            </ContestHeader>
            <ContestInfo>
              <InfoItem>
                <FiUsers />
                <span><strong>{contest.participants}</strong> Participants</span>
              </InfoItem>
              <InfoItem>
                <FiAward />
                <span>Prize: <strong>{contest.prize}</strong></span>
              </InfoItem>
              <InfoItem>
                <FiCalendar />
                <span>Start: <strong>{contest.startDate}</strong></span>
              </InfoItem>
              <InfoItem>
                <FiCalendar />
                <span>End: <strong>{contest.endDate}</strong></span>
              </InfoItem>
            </ContestInfo>
            <ActionButtons>
              <IconButton
                onClick={() => {
                  setModalMode('edit');
                  setSelectedContestId(contest.id);
                  setFormTitle(contest.title);
                  setFormType(contest.type);
                  setFormStatus(contest.status as any);
                  setIsModalOpen(true);
                }}
              >
                <FiEdit2 />
                Edit
              </IconButton>
              <IconButton
                $danger
                onClick={() => {
                  setModalMode('delete');
                  setSelectedContestId(contest.id);
                  setIsModalOpen(true);
                }}
              >
                <FiTrash2 />
                Delete
              </IconButton>
            </ActionButtons>
          </ContestCard>
        ))}
      </ContestsGrid>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === 'add'
            ? 'Create Contest'
            : modalMode === 'edit'
              ? 'Edit Contest'
              : 'Delete Contest'
        }
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedContestId) return;
                  setContests((prev) => prev.filter((c) => c.id !== selectedContestId));
                  setIsModalOpen(false);
                }}
              >
                <FiTrash2 />
                Delete
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                onClick={() => {
                  const title = formTitle.trim();
                  if (!title) return;

                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setContests((prev) => [
                      {
                        id,
                        title,
                        type: formType,
                        status: formStatus,
                        participants: 0,
                        entry: 'Free',
                        startDate: new Date().toISOString().slice(0, 10),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
                          .toISOString()
                          .slice(0, 10),
                        prize: '$10,000',
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedContestId) {
                    setContests((prev) =>
                      prev.map((c) =>
                        c.id === selectedContestId
                          ? { ...c, title, type: formType, status: formStatus }
                          : c
                      )
                    );
                  }

                  setIsModalOpen(false);
                }}
              >
                <FiCheck />
                Save
              </IconButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete this contest?
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Contest Title</div>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Type</div>
              <input
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Status</div>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  background: 'white',
                }}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Ended">Ended</option>
              </select>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default ContestsManagement;
