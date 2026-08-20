import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiAlertTriangle, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { fetchMyComplaints, type BrokerComplaint } from '../../../services/complaintService';
import { PanelCardListSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  ListStack, ListCard, CardTitle, MetaLine, CardFooter,
  PrimaryButton, EmptyState, ErrorBanner,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const statusLabel: Record<string, string> = {
  pending: 'Submitted',
  investigating: 'Under investigation',
  broker_contacted: 'Broker contacted',
  broker_responded: 'Broker responded',
  resolved: 'Resolved',
  unresolved: 'Unresolved',
  dismissed: 'Dismissed',
};

const EvidenceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.55rem;
  a, img {
    display: block;
  }
  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
`;

const MetaBits = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  color: #64748b;
`;

const MyComplaints: React.FC = () => {
  const { t } = useLocale();
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
        <PageHeader><PageTitle><FiAlertTriangle /> {t("panel.complaints")}</PageTitle></PageHeader>
        <EmptyState><PanelCardListSkeleton cards={3} /></EmptyState>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiAlertTriangle /> {t("panel.complaints")}</PageTitle>
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
          {items.map((row) => {
            const shots = row.evidenceUrls?.length
              ? row.evidenceUrls
              : row.evidenceUrl
                ? [row.evidenceUrl]
                : [];
            return (
              <ListCard key={row.id}>
                <CardTitle>{row.ticketId} · {row.brokerName}</CardTitle>
                <MetaLine>
                  <FiCalendar /> {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''} · {statusLabel[row.status] || row.status}
                </MetaLine>
                <p style={{ margin: '0.35rem 0 0', fontWeight: 700 }}>{row.subject}</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                  {row.details}
                </p>
                {(row.amount || row.incidentDate || row.accountRef) && (
                  <MetaBits>
                    {[row.amount && `Amount: ${row.amount}`, row.incidentDate && `Date: ${row.incidentDate}`, row.accountRef && `Ref: ${row.accountRef}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </MetaBits>
                )}
                {shots.length > 0 && (
                  <EvidenceRow>
                    {shots.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" title="Open evidence">
                        {/\.(jpe?g|png|webp)(\?|$)/i.test(url) || url.includes('cloudinary') ? (
                          <img src={url} alt="Evidence" />
                        ) : (
                          <span style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <FiExternalLink /> Evidence
                          </span>
                        )}
                      </a>
                    ))}
                  </EvidenceRow>
                )}
                {row.resolution ? (
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#166534' }}>{row.resolution}</p>
                ) : null}
                {row.brokerResponse ? (
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#1e40af' }}>Broker: {row.brokerResponse}</p>
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
            );
          })}
        </ListStack>
      )}
    </PageWrap>
  );
};

export default MyComplaints;
