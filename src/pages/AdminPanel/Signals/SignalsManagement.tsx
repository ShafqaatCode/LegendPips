import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTrendingUp, FiTrendingDown, FiLock, FiUnlock } from 'react-icons/fi';
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

const SignalsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
`;

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #132E58;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #132E58;
  font-size: 0.9375rem;
`;

const PairBadge = styled.span`
  background: #132E58;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const TypeButton = styled.button<{ $type: 'buy' | 'sell' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ $type }) => ($type === 'buy' ? '#10b981' : '#ef4444')};
  color: white;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => {
    if ($status === 'active') return '#10b98115';
    if ($status === 'closed') return '#6b728015';
    return '#Fbbf2415';
  }};
  color: ${({ $status }) => {
    if ($status === 'active') return '#10b981';
    if ($status === 'closed') return '#6b7280';
    return '#Fbbf24';
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#132E58')};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f3f4f6')};
  }
`;

const SignalsManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  const [formPair, setFormPair] = useState('EUR/USD');
  const [formType, setFormType] = useState<'buy' | 'sell'>('buy');
  const [formEntry, setFormEntry] = useState('1.0850');
  const [formTp, setFormTp] = useState('1.0900');
  const [formSl, setFormSl] = useState('1.0820');
  const [formStatus, setFormStatus] = useState<'active' | 'closed'>('active');
  const [formPremium, setFormPremium] = useState(false);

  const [signals, setSignals] = useState([
    {
      id: '1',
      pair: 'EUR/USD',
      type: 'buy',
      entry: '1.0850',
      tp: '1.0900',
      sl: '1.0820',
      status: 'active',
      premium: false,
      createdAt: '2024-01-20',
    },
    {
      id: '2',
      pair: 'GBP/USD',
      type: 'sell',
      entry: '1.2650',
      tp: '1.2600',
      sl: '1.2680',
      status: 'closed',
      premium: false,
      createdAt: '2024-01-19',
    },
    {
      id: '3',
      pair: 'XAU/USD',
      type: 'buy',
      entry: '2025.50',
      tp: '2035.00',
      sl: '2020.00',
      status: 'active',
      premium: true,
      createdAt: '2024-01-20',
    },
  ]);

  return (
    <Container>
      <Header>
        <Title>Signals Management</Title>
        <Button
          $primary
          onClick={() => {
            setModalMode('add');
            setSelectedSignalId(null);
            setFormPair('EUR/USD');
            setFormType('buy');
            setFormEntry('1.0850');
            setFormTp('1.0900');
            setFormSl('1.0820');
            setFormStatus('active');
            setFormPremium(false);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Create Signal
        </Button>
      </Header>

      <SignalsTable>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Pair</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Entry / TP / SL</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Premium</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {signals.map((signal) => (
              <TableRow key={signal.id}>
                <TableCell>
                  <PairBadge>{signal.pair}</PairBadge>
                </TableCell>
                <TableCell>
                  <TypeButton $type={signal.type as "buy" | "sell"}>
                    {signal.type === 'buy' ? <FiTrendingUp /> : <FiTrendingDown />}
                    {signal.type.toUpperCase()}
                  </TypeButton>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                    <span>Entry: <strong>{signal.entry}</strong></span>
                    <span>TP: <strong>{signal.tp}</strong></span>
                    <span>SL: <strong>{signal.sl}</strong></span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge $status={signal.status}>
                    {signal.status.charAt(0).toUpperCase() + signal.status.slice(1)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {signal.premium ? (
                    <Badge $type="premium">Premium</Badge>
                  ) : (
                    <Badge $type="free">Free</Badge>
                  )}
                </TableCell>
                <TableCell>{signal.createdAt}</TableCell>
                <TableCell>
                  <ActionButtons>
                    <IconButton
                      title="Edit Signal"
                      onClick={() => {
                        setModalMode('edit');
                        setSelectedSignalId(signal.id);
                        setFormPair(signal.pair);
                        setFormType(signal.type as any);
                        setFormEntry(signal.entry);
                        setFormTp(signal.tp);
                        setFormSl(signal.sl);
                        setFormStatus(signal.status as any);
                        setFormPremium(!!signal.premium);
                        setIsModalOpen(true);
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      $danger
                      title="Delete Signal"
                      onClick={() => {
                        setModalMode('delete');
                        setSelectedSignalId(signal.id);
                        setIsModalOpen(true);
                      }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SignalsTable>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === 'add'
            ? 'Create Signal'
            : modalMode === 'edit'
              ? 'Edit Signal'
              : 'Delete Signal'
        }
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedSignalId) return;
                  setSignals((prev) => prev.filter((s) => s.id !== selectedSignalId));
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
                    setSignals((prev) => [
                      {
                        id,
                        pair: formPair,
                        type: formType,
                        entry: formEntry,
                        tp: formTp,
                        sl: formSl,
                        status: formStatus,
                        premium: formPremium,
                        createdAt: new Date().toISOString().slice(0, 10),
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedSignalId) {
                    setSignals((prev) =>
                      prev.map((s) =>
                        s.id === selectedSignalId
                          ? {
                              ...s,
                              pair: formPair,
                              type: formType,
                              entry: formEntry,
                              tp: formTp,
                              sl: formSl,
                              status: formStatus,
                              premium: formPremium,
                            }
                          : s
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
            Are you sure you want to delete this signal?
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Pair</div>
              <input
                value={formPair}
                onChange={(e) => setFormPair(e.target.value)}
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
              <span style={{ fontWeight: 700, color: '#132E58' }}>Type</span>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.9rem',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  background: 'white',
                }}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </label>

            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Entry</div>
              <input
                value={formEntry}
                onChange={(e) => setFormEntry(e.target.value)}
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
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>TP</div>
              <input
                value={formTp}
                onChange={(e) => setFormTp(e.target.value)}
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
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>SL</div>
              <input
                value={formSl}
                onChange={(e) => setFormSl(e.target.value)}
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
              <span style={{ fontWeight: 700, color: '#132E58' }}>Status</span>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.9rem',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  background: 'white',
                }}
              >
                <option value="active">active</option>
                <option value="closed">closed</option>
              </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              <span style={{ fontWeight: 600, color: '#132E58' }}>Premium</span>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

const Badge = styled.span<{ $type: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $type }) => {
    if ($type === 'premium') return '#Fbbf2415';
    return '#10b98115';
  }};
  color: ${({ $type }) => {
    if ($type === 'premium') return '#Fbbf24';
    return '#10b981';
  }};
`;

export default SignalsManagement;
