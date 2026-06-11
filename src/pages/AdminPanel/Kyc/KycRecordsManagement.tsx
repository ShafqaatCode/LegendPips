import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiShield, FiSearch, FiEye } from 'react-icons/fi';
import { getAllUsers, type AdminUser } from '../../../services/userService';
import { KYC_STATUS_LABELS, type KycStatus } from '../../../services/kycService';
import { getKycRecordPreset } from '../../../utils/kycRecordFilters';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  FilterBar, SearchInput, FilterCount,
  TableCard, DataTable, Th, Td, Tr, EmptyCell,
  UserCell, UserAvatar, UserName, UserEmail, Pill,
  ActionGroup, IconBtn, Pagination, PageButtons, PageBtn,
  ErrorBanner, GhostButton,
} from '../../../components/AdminPanel/adminUi';

const KycRecordsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preset = getKycRecordPreset(searchParams.get('filter'));

  const [records, setRecords] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers({
        page,
        limit: 12,
        search: searchTerm,
        kycStatus: preset.params.kycStatus,
        kycScope: preset.params.kycScope,
        sortBy: 'kycSubmitted',
      });
      setRecords(data.items);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, preset]);

  useEffect(() => {
    const timer = setTimeout(loadRecords, 300);
    return () => clearTimeout(timer);
  }, [loadRecords]);

  const clearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiShield /> {preset.title}</PageTitle>
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
        {searchTerm && (
          <GhostButton $sm type="button" onClick={clearSearch}>Clear search</GhostButton>
        )}
        <FilterCount>{totalItems} record{totalItems !== 1 ? 's' : ''}</FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
              <Th>Documents</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><EmptyCell colSpan={5}>Loading…</EmptyCell></tr>
            ) : records.length === 0 ? (
              <tr><EmptyCell colSpan={5}>No KYC records match this view.</EmptyCell></tr>
            ) : (
              records.map((record) => (
                <Tr key={record.id}>
                  <Td>
                    <UserCell>
                      <UserAvatar>{record.firstName[0]}{record.lastName[0]}</UserAvatar>
                      <div>
                        <UserName>{record.firstName} {record.lastName}</UserName>
                        <UserEmail>{record.email}</UserEmail>
                      </div>
                    </UserCell>
                  </Td>
                  <Td>
                    <Pill $variant={record.kycStatus || 'incomplete'}>
                      {KYC_STATUS_LABELS[(record.kycStatus || 'incomplete') as KycStatus]}
                    </Pill>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#64748b' }}>
                    {fmtDate(record.kycSubmittedAt)}
                  </Td>
                  <Td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {record.kycDocumentCount ?? 0} file{(record.kycDocumentCount ?? 0) !== 1 ? 's' : ''}
                  </Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn
                        title="Review KYC"
                        onClick={() => navigate(`/admin-panel/kyc-records/${record.id}`, { state: { kycFilter: preset.id } })}
                      >
                        <FiEye />
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
    </PageWrap>
  );
};

export default KycRecordsManagement;
