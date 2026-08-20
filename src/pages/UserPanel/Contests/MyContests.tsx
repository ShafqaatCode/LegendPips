import React, { useEffect, useState } from 'react';
import { FiAward, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { fetchMyContests } from '../../../services/contestService';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  FilterTabs, FilterTab, CardsGrid, MediaCard, CardBody, CardTitle,
  MetaLine, InlineStats, CardFooter, PrimaryButton, EmptyState, BadgeOverlay,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const MyContests: React.FC = () => {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState('all');
  const [contests, setContests] = useState<any[]>([]);

  useEffect(() => {
    fetchMyContests()
      .then((items) => {
        const mapped = items.map((entry: any) => {
          const contest = entry.contest || {};
          const statusRaw = contest.status || 'Upcoming';
          const status = statusRaw === 'Ongoing' ? 'active' : statusRaw === 'Upcoming' ? 'upcoming' : 'completed';
          return {
            id: contest._id,
            title: contest.title || 'Contest',
            description: contest.description || contest.subtitle || '',
            status,
            participants: contest.participants || 0,
            endDate: contest.endDate ? new Date(contest.endDate).toLocaleDateString() : '—',
            rank: 0,
            profit: `${Number(entry.leaderboardStats?.profitPercent || 0).toFixed(2)}%`,
            startDate: contest.startDate ? new Date(contest.startDate).toLocaleDateString() : '—',
          };
        });
        setContests(mapped);
      })
      .catch(() => setContests([]));
  }, []);

  const filtered = contests.filter((c) => activeFilter === 'all' || c.status === activeFilter);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiAward /> {t("panel.contests")}</PageTitle>
        <PageSubtitle>Contests you have joined</PageSubtitle>
      </PageHeader>

      <FilterTabs>
        {['all', 'active', 'upcoming', 'completed'].map((f) => (
          <FilterTab key={f} $active={activeFilter === f} onClick={() => setActiveFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </FilterTab>
        ))}
      </FilterTabs>

      {filtered.length === 0 ? (
        <EmptyState>No contests in this category.</EmptyState>
      ) : (
        <CardsGrid>
          {filtered.map((contest) => (
            <MediaCard key={contest.id}>
              <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #132E58, #1a4a7a)', position: 'relative' }}>
                <BadgeOverlay $variant={contest.status}>{contest.status}</BadgeOverlay>
                <FiAward style={{ color: '#Fbbf24', fontSize: '1.25rem' }} />
              </div>
              <CardBody>
                <CardTitle>{contest.title}</CardTitle>
                {contest.description && (
                  <MetaLine style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {contest.description}
                  </MetaLine>
                )}
                {contest.status === 'active' && (
                  <InlineStats>
                    <div><strong>{contest.rank || '—'}</strong><span>Rank</span></div>
                    <div><strong>{contest.profit}</strong><span>Profit</span></div>
                    <div><strong>{contest.participants}</strong><span>Players</span></div>
                  </InlineStats>
                )}
                <CardFooter>
                  <MetaLine><FiCalendar />{contest.status === 'upcoming' ? `Starts ${contest.startDate}` : `Ends ${contest.endDate}`}</MetaLine>
                  <PrimaryButton $sm type="button">View <FiArrowRight /></PrimaryButton>
                </CardFooter>
              </CardBody>
            </MediaCard>
          ))}
        </CardsGrid>
      )}
    </PageWrap>
  );
};

export default MyContests;
