import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLink, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import {
  fetchMyLiveAccountRequests,
  liveAccountStatusLabel,
  type LiveAccountRequestRow,
} from '../../../services/liveAccountService';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody,
  ErrorBanner, Pill, GhostButton,
  EmptyState,
  userColors,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';
import styled from 'styled-components';

const ListStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const RowCard = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  flex-wrap: wrap;

  .title {
    font-weight: 800;
    color: ${userColors.navy};
    font-size: 0.875rem;
  }
  .meta {
    font-size: 0.75rem;
    color: ${userColors.muted};
    margin-top: 0.2rem;
  }
  .note {
    font-size: 0.75rem;
    color: ${userColors.navy};
    margin-top: 0.35rem;
  }
`;

const MyLiveAccounts: React.FC = () => {
  const { t } = useLocale();
  const [items, setItems] = useState<LiveAccountRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setItems(await fetchMyLiveAccountRequests());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pillVariant = (s: string) => {
    if (s === 'approved') return 'approved';
    if (s === 'rejected') return 'rejected';
    if (s === 'in_progress') return 'user';
    if (s === 'pending') return 'pending';
    return 'default';
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiLink /> {t("panel.liveAccounts")}</PageTitle>
        <PageSubtitle>
          Track account numbers you submitted for cashback linking — pending, approved, or rejected
        </PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SectionCard>
        <SectionHead>
          <h2>Your submissions</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <GhostButton $sm type="button" onClick={load} disabled={loading}>
              <FiRefreshCw /> Refresh
            </GhostButton>
            <Link to="/rebates" style={{ textDecoration: 'none' }}>
              <GhostButton $sm type="button">
                <FiExternalLink /> Find brokers
              </GhostButton>
            </Link>
          </div>
        </SectionHead>
        <SectionBody>
          {loading && <p style={{ margin: 0, color: userColors.muted, fontSize: '0.875rem' }}>Loading…</p>}
          {!loading && items.length === 0 && (
            <EmptyState>
              No live accounts submitted yet. Open a rebate broker, choose <strong>Setup account</strong>,
              enter your account number, and submit.
            </EmptyState>
          )}
          {!loading && items.length > 0 && (
            <ListStack>
              {items.map((row) => (
                <RowCard key={row.id}>
                  <div>
                    <div className="title">{row.brokerName}</div>
                    <div className="meta">
                      Account #{row.accountNumber}
                      {row.time ? ` · ${row.time}` : ''}
                      {row.createdAt
                        ? ` · ${new Date(row.createdAt).toLocaleString()}`
                        : ''}
                    </div>
                    {row.adminNote && (
                      <div className="note">
                        <strong>Team note:</strong> {row.adminNote}
                      </div>
                    )}
                  </div>
                  <Pill $variant={pillVariant(row.status)}>
                    {liveAccountStatusLabel(row.status)}
                  </Pill>
                </RowCard>
              ))}
            </ListStack>
          )}
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default MyLiveAccounts;
