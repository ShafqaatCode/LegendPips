import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import { fetchMyComplaints, type BrokerComplaint } from '../../../services/complaintService';
import { PanelCardListSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  ListStack, ListCard, CardTitle, MetaLine, CardFooter,
  PrimaryButton, EmptyState, ErrorBanner,
} from '../../../components/UserPanel/userUi';

const statusLabel: Record<string, string> = {
  pending: 'Awaiting review',
  investigating: 'Under investigation',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BrokerComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchMyComplaints());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <PageWrap>
        <PageHeader><PageTitle><FiAlertTriangle /> My complaints</PageTitle></PageHeader>
        <EmptyState><PanelCardListSkeleton cards={3} /></EmptyState>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiAlertTriangle /> My complaints</PageTitle>
        <PageSubtitle>Tickets you filed with the Broker Complaint Center</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {items.length === 0 ? (
        <EmptyState>
          <p>You have not submitted a complaint yet.</p>
          <PrimaryButton $sm type="button" style={{ marginTop: 8 }} onClick={() => navigate('/complaints')}>
            Open complaint center
          </PrimaryButton>
        </EmptyState>
      ) : (
        <ListStack>
          {items.map((row) => (
            <ListCard key={row.id}>
              <CardTitle>{row.ticketId} · {row.brokerName}</CardTitle>
              <MetaLine>
                <FiCalendar /> {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''} · {statusLabel[row.status] || row.status}
              </MetaLine>
              <p style={{ margin: '0.35rem 0 0', fontWeight: 700 }}>{row.subject}</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                {row.details}
              </p>
              {row.resolution ? (
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#166534' }}>{row.resolution}</p>
              ) : null}
              {row.status === 'dismissed' && row.adminNote ? (
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#9a3412' }}>{row.adminNote}</p>
              ) : null}
              <CardFooter>
                <PrimaryButton $sm type="button" onClick={() => navigate('/complaints')}>
                  File another
                </PrimaryButton>
              </CardFooter>
            </ListCard>
          ))}
        </ListStack>
      )}
    </PageWrap>
  );
};

export default MyComplaints;
