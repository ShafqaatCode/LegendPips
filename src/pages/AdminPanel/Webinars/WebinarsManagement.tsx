import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiVideo, FiCalendar, FiUser, FiUsers, FiDollarSign } from 'react-icons/fi';
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

const WebinarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

const WebinarsManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formInstructor, setFormInstructor] = useState('');
  const [formDate, setFormDate] = useState('2024-01-20');
  const [formTime, setFormTime] = useState('14:00');
  const [formStatus, setFormStatus] = useState<'live' | 'upcoming' | 'recorded'>('upcoming');
  const [formPremium, setFormPremium] = useState(false);
  const [formPrice, setFormPrice] = useState('49');

  const [webinars, setWebinars] = useState([
    {
      id: '1',
      title: 'Advanced Forex Trading Strategies',
      instructor: 'John Smith',
      date: '2024-01-20',
      time: '14:00',
      status: 'upcoming',
      premium: false,
      price: 0,
      participants: 45,
    },
    {
      id: '2',
      title: 'Crypto Market Analysis Masterclass',
      instructor: 'Jane Doe',
      date: '2024-01-18',
      time: '16:00',
      status: 'live',
      premium: true,
      price: 49,
      participants: 120,
    },
    {
      id: '3',
      title: 'Risk Management Fundamentals',
      instructor: 'Mike Johnson',
      date: '2024-01-15',
      time: '10:00',
      status: 'recorded',
      premium: false,
      price: 0,
      participants: 89,
    },
  ]);

  const filteredWebinars = webinars.filter((webinar) => {
    if (activeFilter === 'all') return true;
    return webinar.status === activeFilter;
  });

  return (
    <Container>
      <Header>
        <Title>Webinars Management</Title>
        <Button
          $primary
          onClick={() => {
            setModalMode('add');
            setSelectedWebinarId(null);
            setFormTitle('');
            setFormInstructor('');
            setFormDate('2024-01-20');
            setFormTime('14:00');
            setFormStatus('upcoming');
            setFormPremium(false);
            setFormPrice('49');
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Create Webinar
        </Button>
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
                  {webinar.date} at {webinar.time}
                </MetaItem>
                <MetaItem>
                  <FiUsers />
                  {webinar.participants} Participants
                </MetaItem>
                {webinar.premium && (
                  <MetaItem>
                    <FiDollarSign />
                    ${webinar.price}
                  </MetaItem>
                )}
              </WebinarMeta>
              <ActionButtons>
                <IconButton
                  onClick={() => {
                    setModalMode('edit');
                    setSelectedWebinarId(webinar.id);
                    setFormTitle(webinar.title);
                    setFormInstructor(webinar.instructor);
                    setFormDate(webinar.date);
                    setFormTime(webinar.time);
                    setFormStatus(webinar.status as any);
                    setFormPremium(!!webinar.premium);
                    setFormPrice(String(webinar.price || 0));
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
                    setSelectedWebinarId(webinar.id);
                    setIsModalOpen(true);
                  }}
                >
                  <FiTrash2 />
                  Delete
                </IconButton>
              </ActionButtons>
            </CardContent>
          </WebinarCard>
        ))}
      </WebinarsGrid>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === 'add'
            ? 'Create Webinar'
            : modalMode === 'edit'
              ? 'Edit Webinar'
              : 'Delete Webinar'
        }
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedWebinarId) return;
                  setWebinars((prev) => prev.filter((w) => w.id !== selectedWebinarId));
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
                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setWebinars((prev) => [
                      {
                        id,
                        title: formTitle || 'New Webinar',
                        instructor: formInstructor || 'Instructor',
                        date: formDate,
                        time: formTime,
                        status: formStatus,
                        premium: formPremium,
                        price: formPremium ? Number(formPrice) || 0 : 0,
                        participants: 0,
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedWebinarId) {
                    setWebinars((prev) =>
                      prev.map((w) =>
                        w.id === selectedWebinarId
                          ? {
                              ...w,
                              title: formTitle,
                              instructor: formInstructor,
                              date: formDate,
                              time: formTime,
                              status: formStatus,
                              premium: formPremium,
                              price: formPremium ? Number(formPrice) || 0 : 0,
                            }
                          : w
                      )
                    );
                  }
                  setIsModalOpen(false);
                }}
              >
                <FiEdit2 />
                Save
              </IconButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete this webinar?
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Title</div>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Instructor</div>
              <input
                value={formInstructor}
                onChange={(e) => setFormInstructor(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#132E58' }}>Status</span>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                style={{ flex: 1, padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none', background: 'white' }}
              >
                <option value="upcoming">upcoming</option>
                <option value="live">live</option>
                <option value="recorded">recorded</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              <span style={{ fontWeight: 600, color: '#132E58' }}>Premium</span>
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Price</div>
              <input
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default WebinarsManagement;
