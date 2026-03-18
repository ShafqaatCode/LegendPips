import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiImage } from 'react-icons/fi';
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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  max-width: 400px;
  
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9375rem;
    color: #132E58;
    width: 100%;
  }
  
  svg {
    color: #9ca3af;
  }
`;

const BrokersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const BrokerCard = styled.div`
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

const BrokerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const BrokerLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const BrokerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 0.5rem 0;
`;

const BrokerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
  
  strong {
    color: #132E58;
    font-weight: 600;
  }
`;

const Badge = styled.span<{ $type: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $type }) => {
    if ($type === 'verified') return '#10b98115';
    if ($type === 'top') return '#Fbbf2415';
    return '#6b728015';
  }};
  color: ${({ $type }) => {
    if ($type === 'verified') return '#10b981';
    if ($type === 'top') return '#Fbbf24';
    return '#6b7280';
  }};
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

const BrokersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formMinDeposit, setFormMinDeposit] = useState('$100');
  const [formRegulation, setFormRegulation] = useState('');
  const [formSpreadFrom, setFormSpreadFrom] = useState('0.0 pips');
  const [formCashbackRate, setFormCashbackRate] = useState('0.35 pip');
  const [formTopCashback, setFormTopCashback] = useState(false);

  const [brokers, setBrokers] = useState([
    {
      id: '1',
      name: 'IC Markets',
      logo: 'IC',
      minDeposit: '$200',
      regulation: 'ASIC, CySEC',
      spreadFrom: '0.0 pips',
      verified: true,
      topCashback: true,
      cashbackRate: '0.40 pip',
    },
    {
      id: '2',
      name: 'XTREME Market',
      logo: 'XM',
      minDeposit: '$100',
      regulation: 'FCA, ASIC',
      spreadFrom: '0.1 pips',
      verified: true,
      topCashback: false,
      cashbackRate: '0.35 pip',
    },
    {
      id: '3',
      name: 'Pepperstone',
      logo: 'PS',
      minDeposit: '$200',
      regulation: 'ASIC, FCA',
      spreadFrom: '0.0 pips',
      verified: true,
      topCashback: true,
      cashbackRate: '0.45 pip',
    },
  ]);

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Brokers Management</Title>
        <Button
          $primary
          onClick={() => {
            setModalMode('add');
            setSelectedBrokerId(null);
            setFormName('');
            setFormMinDeposit('$100');
            setFormRegulation('');
            setFormSpreadFrom('0.0 pips');
            setFormCashbackRate('0.35 pip');
            setFormTopCashback(false);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Add New Broker
        </Button>
      </Header>

      <SearchBar>
        <FiSearch />
        <input
          type="text"
          placeholder="Search brokers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <BrokersGrid>
        {filteredBrokers.map((broker) => (
          <BrokerCard key={broker.id}>
            <BrokerHeader>
              <div>
                <BrokerLogo>{broker.logo}</BrokerLogo>
                <BrokerName>{broker.name}</BrokerName>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {broker.verified && <Badge $type="verified">Verified</Badge>}
                  {broker.topCashback && <Badge $type="top">Top Cashback</Badge>}
                </div>
              </div>
            </BrokerHeader>
            <BrokerInfo>
              <InfoItem>
                <span>Min Deposit:</span>
                <strong>{broker.minDeposit}</strong>
              </InfoItem>
              <InfoItem>
                <span>Regulation:</span>
                <strong>{broker.regulation}</strong>
              </InfoItem>
              <InfoItem>
                <span>Spread From:</span>
                <strong>{broker.spreadFrom}</strong>
              </InfoItem>
              <InfoItem>
                <span>Cashback Rate:</span>
                <strong>{broker.cashbackRate}</strong>
              </InfoItem>
            </BrokerInfo>
            <ActionButtons>
              <IconButton
                onClick={() => {
                  setModalMode('edit');
                  setSelectedBrokerId(broker.id);
                  setFormName(broker.name);
                  setFormMinDeposit(broker.minDeposit);
                  setFormRegulation(broker.regulation);
                  setFormSpreadFrom(broker.spreadFrom);
                  setFormCashbackRate(broker.cashbackRate || '0.35 pip');
                  setFormTopCashback(!!broker.topCashback);
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
                  setSelectedBrokerId(broker.id);
                  setIsModalOpen(true);
                }}
              >
                <FiTrash2 />
                Delete
              </IconButton>
            </ActionButtons>
          </BrokerCard>
        ))}
      </BrokersGrid>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === 'add'
            ? 'Add New Broker'
            : modalMode === 'edit'
              ? 'Edit Broker'
              : 'Delete Broker'
        }
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedBrokerId) return;
                  setBrokers((prev) => prev.filter((b) => b.id !== selectedBrokerId));
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
                  const name = formName.trim();
                  if (!name) return;

                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setBrokers((prev) => [
                      {
                        id,
                        name,
                        logo: name.slice(0, 2).toUpperCase(),
                        minDeposit: formMinDeposit,
                        regulation: formRegulation || '—',
                        spreadFrom: formSpreadFrom,
                        verified: false,
                        topCashback: formTopCashback,
                        cashbackRate: formCashbackRate,
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedBrokerId) {
                    setBrokers((prev) =>
                      prev.map((b) =>
                        b.id === selectedBrokerId
                          ? {
                              ...b,
                              name,
                              minDeposit: formMinDeposit,
                              regulation: formRegulation || b.regulation,
                              spreadFrom: formSpreadFrom,
                              cashbackRate: formCashbackRate,
                              topCashback: formTopCashback,
                              logo: name.slice(0, 2).toUpperCase(),
                            }
                          : b
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
            Are you sure you want to delete this broker?
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Broker Name</div>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
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
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Min Deposit</div>
              <input
                value={formMinDeposit}
                onChange={(e) => setFormMinDeposit(e.target.value)}
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
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Regulation</div>
              <input
                value={formRegulation}
                onChange={(e) => setFormRegulation(e.target.value)}
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
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Spread From</div>
              <input
                value={formSpreadFrom}
                onChange={(e) => setFormSpreadFrom(e.target.value)}
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
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Cashback Rate</div>
              <input
                value={formCashbackRate}
                onChange={(e) => setFormCashbackRate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={formTopCashback}
                onChange={(e) => setFormTopCashback(e.target.checked)}
              />
              <span style={{ fontWeight: 600, color: '#132E58' }}>Top Cashback</span>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default BrokersManagement;
