import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiUsers, FiSearch, FiEye, FiTrash2, FiSlash, FiCheckCircle } from 'react-icons/fi';
import { getAllUsers, deleteUser, blockOrUnblockUser, type AdminUser } from '../../../services/userService';
import { KYC_STATUS_LABELS, type KycStatus } from '../../../services/kycService';
import { getUserListPreset } from '../../../utils/userListFilters';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  FilterBar, SearchInput, FilterSelect, FilterCount,
  TableCard, DataTable, Th, Td, Tr, EmptyCell,
  UserCell, UserAvatar, UserName, UserEmail, Pill,
  ActionGroup, IconBtn, Pagination, PageButtons, PageBtn,
  ErrorBanner, GhostButton,
} from '../../../components/AdminPanel/adminUi';

const UsersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const preset = getUserListPreset(searchParams.get('filter'));

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState(preset.params.kycStatus || '');
  const [statusFilter, setStatusFilter] = useState(preset.params.status || '');
  const [roleFilter, setRoleFilter] = useState(preset.params.role || '');
  const [emailFilter, setEmailFilter] = useState(preset.params.emailVerified || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const p = getUserListPreset(searchParams.get('filter'));
    setKycFilter(p.params.kycStatus || '');
    setStatusFilter(p.params.status || '');
    setRoleFilter(p.params.role || '');
    setEmailFilter(p.params.emailVerified || '');
    setPage(1);
  }, [searchParams]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers({
        page,
        limit: 12,
        search: searchTerm,
        kycStatus: kycFilter,
        status: statusFilter,
        role: roleFilter,
        emailVerified: emailFilter,
      });
      setUsers(data.items);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, kycFilter, statusFilter, roleFilter, emailFilter]);

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleBlockToggle = async (user: AdminUser) => {
    const action = user.status === 'blocked' ? 'unblock' : 'block';
    if (!window.confirm(`${action === 'block' ? 'Ban' : 'Unban'} ${user.firstName} ${user.lastName}?`)) return;
    setActionLoading(user.id);
    try {
      await blockOrUnblockUser(user.id, action);
      await loadUsers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(deleteId);
    try {
      await deleteUser(deleteId);
      setDeleteId(null);
      await loadUsers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    setPage(1);
  };

  const hasExtraFilters = searchTerm || roleFilter;

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiUsers /> {preset.title}</PageTitle>
          <PageSubtitle>{preset.subtitle}</PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      <FilterBar>
        <SearchInput>
          <FiSearch />
          <input
            placeholder="Search name or email…"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </SearchInput>
        {!preset.params.status && (
          <FilterSelect value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="blocked">Banned</option>
          </FilterSelect>
        )}
        <FilterSelect value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </FilterSelect>
        {!preset.params.kycStatus && (
          <FilterSelect value={kycFilter} onChange={(e) => { setKycFilter(e.target.value); setPage(1); }}>
            <option value="">All KYC</option>
            <option value="pending">Pending</option>
            <option value="approved">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="incomplete">Not started</option>
          </FilterSelect>
        )}
        {hasExtraFilters && (
          <GhostButton $sm type="button" onClick={clearFilters}>Clear search</GhostButton>
        )}
        <FilterCount>{totalItems} user{totalItems !== 1 ? 's' : ''}</FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Account</Th>
              <Th>KYC</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><EmptyCell colSpan={6}>Loading…</EmptyCell></tr>
            ) : users.length === 0 ? (
              <tr><EmptyCell colSpan={6}>No users match this view.</EmptyCell></tr>
            ) : (
              users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <UserCell>
                      <UserAvatar>{user.firstName[0]}{user.lastName[0]}</UserAvatar>
                      <div>
                        <UserName>{user.firstName} {user.lastName}</UserName>
                        <UserEmail>{user.email}</UserEmail>
                      </div>
                    </UserCell>
                  </Td>
                  <Td><Pill $variant={user.role || 'user'}>{user.role}</Pill></Td>
                  <Td><Pill $variant={user.status || 'active'}>{user.status === 'blocked' ? 'banned' : user.status}</Pill></Td>
                  <Td>
                    <Pill $variant={user.kycStatus || 'incomplete'}>
                      {KYC_STATUS_LABELS[(user.kycStatus || 'incomplete') as KycStatus]}
                    </Pill>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#64748b' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="View details" onClick={() => navigate(`/admin-panel/users/${user.id}`)}>
                        <FiEye />
                      </IconBtn>
                      <IconBtn
                        $success={user.status === 'blocked'}
                        title={user.status === 'blocked' ? 'Unban' : 'Ban'}
                        disabled={actionLoading === user.id || user.role === 'admin'}
                        onClick={() => handleBlockToggle(user)}
                      >
                        {user.status === 'blocked' ? <FiCheckCircle /> : <FiSlash />}
                      </IconBtn>
                      <IconBtn
                        $danger
                        title="Delete"
                        disabled={actionLoading === user.id || user.role === 'admin'}
                        onClick={() => setDeleteId(user.id)}
                      >
                        <FiTrash2 />
                      </IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </DataTable>

        {totalPages > 1 && (
          <Pagination>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Page {page} of {totalPages}</span>
            <PageButtons>
              <PageBtn disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</PageBtn>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>;
              })}
              <PageBtn disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</PageBtn>
            </PageButtons>
          </Pagination>
        )}
      </TableCard>

      <SimpleModal
        isOpen={!!deleteId}
        title="Delete User"
        onClose={() => setDeleteId(null)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setDeleteId(null)}>Cancel</GhostButton>
            <GhostButton $danger type="button" onClick={handleDelete}>
              <FiTrash2 /> Delete permanently
            </GhostButton>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
          This action cannot be undone.
        </p>
      </SimpleModal>
    </PageWrap>
  );
};

export default UsersManagement;
