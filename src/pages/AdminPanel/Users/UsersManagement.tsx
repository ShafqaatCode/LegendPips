import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUsers, FiEdit2, FiTrash2, FiSearch, FiFilter, FiPlus, FiCheck, FiX } from 'react-icons/fi';
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    flex-direction: column;
  }
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
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  svg {
    color: #9ca3af;
  }
`;

const TableWrapper = styled.div`
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
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #132E58;
  font-size: 0.9375rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #132E58;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #132E58;
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Badge = styled.span<{ $type: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $type }) => {
    if ($type === 'admin') return '#Fbbf2415';
    if ($type === 'active') return '#10b98115';
    return '#6b728015';
  }};
  color: ${({ $type }) => {
    if ($type === 'admin') return '#Fbbf24';
    if ($type === 'active') return '#10b981';
    return '#6b7280';
  }};
`;

const ActionButtonsCell = styled.div`
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
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f3f4f6')};
  }
`;

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'trader' | 'admin'>('trader');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const [users, setUsers] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      role: 'trader',
      status: 'active',
      joinedDate: '2024-01-15',
      lastLogin: '2024-01-20',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'trader',
      status: 'active',
      joinedDate: '2024-01-10',
      lastLogin: '2024-01-19',
    },
    {
      id: '3',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-01-01',
      lastLogin: '2024-01-20',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Users Management</Title>
        <ActionButtons>
          <Button
            $primary
            onClick={() => {
              setModalMode('add');
              setSelectedUserId(null);
              setFormFirstName('');
              setFormLastName('');
              setFormEmail('');
              setFormRole('trader');
              setFormStatus('active');
              setIsModalOpen(true);
            }}
          >
            <FiPlus />
            Add New User
          </Button>
        </ActionButtons>
      </Header>

      <SearchBar>
        <FiSearch />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <TableWrapper>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Joined Date</TableHeaderCell>
              <TableHeaderCell>Last Login</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <UserInfo>
                    <Avatar>
                      {user.firstName[0]}{user.lastName[0]}
                    </Avatar>
                    <UserDetails>
                      <UserName>{user.firstName} {user.lastName}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserDetails>
                  </UserInfo>
                </TableCell>
                <TableCell>
                  <Badge $type={user.role}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge $type={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell>{user.joinedDate}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <ActionButtonsCell>
                    <IconButton
                      title="Edit User"
                      onClick={() => {
                        setModalMode('edit');
                        setSelectedUserId(user.id);
                        setFormFirstName(user.firstName);
                        setFormLastName(user.lastName);
                        setFormEmail(user.email);
                        setFormRole(user.role as any);
                        setFormStatus(user.status as any);
                        setIsModalOpen(true);
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      $danger
                      title="Delete User"
                      onClick={() => {
                        setModalMode('delete');
                        setSelectedUserId(user.id);
                        setIsModalOpen(true);
                      }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </ActionButtonsCell>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === 'add' ? 'Add New User' : modalMode === 'edit' ? 'Edit User' : 'Delete User'
        }
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedUserId) return;
                  setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
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
                  const firstName = formFirstName.trim();
                  const lastName = formLastName.trim();
                  const email = formEmail.trim();
                  if (!firstName || !lastName || !email) return;

                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setUsers((prev) => [
                      {
                        id,
                        firstName,
                        lastName,
                        email,
                        role: formRole,
                        status: formStatus,
                        joinedDate: new Date().toISOString().slice(0, 10),
                        lastLogin: new Date().toISOString().slice(0, 10),
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedUserId) {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === selectedUserId
                          ? {
                              ...u,
                              firstName,
                              lastName,
                              email,
                              role: formRole,
                              status: formStatus,
                            }
                          : u
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
            Are you sure you want to delete this user?
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>First Name</div>
              <input
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Last Name</div>
              <input
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Email</div>
              <input
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#132E58' }}>Role</span>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                style={{ flex: 1, padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none', background: 'white' }}
              >
                <option value="trader">trader</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#132E58' }}>Status</span>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                style={{ flex: 1, padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none', background: 'white' }}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default UsersManagement;
