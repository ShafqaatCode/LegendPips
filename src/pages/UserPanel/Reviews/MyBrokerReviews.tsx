import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiCalendar, FiTrash2 } from 'react-icons/fi';
import {
  deleteMyBrokerReview,
  fetchMyBrokerReviews,
  type MyBrokerReview,
} from '../../../services/brokerReviewService';
import { PanelCardListSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  ListStack, ListCard, CardTitle, MetaLine, CardFooter,
  PrimaryButton, GhostButton, EmptyState, ErrorBanner,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const statusLabel: Record<string, string> = {
  pending: 'Awaiting moderation',
  approved: 'Published',
  rejected: 'Not published',
};

const MyBrokerReviews: React.FC = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [items, setItems] = useState<MyBrokerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchMyBrokerReviews());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!window.confirm('Remove this unpublished review?')) return;
    try {
      await deleteMyBrokerReview(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not delete');
    }
  };

  if (loading) {
    return (
      <PageWrap>
        <PageHeader><PageTitle><FiStar /> {t("panel.reviews")}</PageTitle></PageHeader>
        <EmptyState><PanelCardListSkeleton cards={3} /></EmptyState>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiStar /> {t("panel.reviews")}</PageTitle>
        <PageSubtitle>Ratings you submitted. Published reviews appear on the broker page after approval.</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {items.length === 0 ? (
        <EmptyState>
          <p>You have not reviewed a broker yet.</p>
          <PrimaryButton $sm type="button" style={{ marginTop: 8 }} onClick={() => navigate('/brokers')}>
            Browse brokers
          </PrimaryButton>
        </EmptyState>
      ) : (
        <ListStack>
          {items.map((row) => (
            <ListCard key={row.id}>
              <CardTitle>{row.brokerName || 'Broker'} · {row.rating}/5</CardTitle>
              <MetaLine>
                <FiCalendar /> {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : ''} · {statusLabel[row.status] || row.status}
              </MetaLine>
              {row.title ? <p style={{ margin: '0.35rem 0 0', fontWeight: 700 }}>{row.title}</p> : null}
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                {row.comment}
              </p>
              {row.status === 'rejected' && row.adminNote ? (
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#9a3412' }}>{row.adminNote}</p>
              ) : null}
              <CardFooter>
                <PrimaryButton $sm type="button" onClick={() => navigate(`/rebates/broker/${row.brokerId}#reviews`)}>
                  View broker
                </PrimaryButton>
                {row.status !== 'approved' && (
                  <GhostButton $sm type="button" onClick={() => remove(row.id)}>
                    <FiTrash2 /> Remove
                  </GhostButton>
                )}
              </CardFooter>
            </ListCard>
          ))}
        </ListStack>
      )}
    </PageWrap>
  );
};

export default MyBrokerReviews;
