import React, { useState } from 'react';
import { FiVideo, FiCalendar, FiClock, FiUser, FiPlay, FiLock } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  FilterTabs, FilterTab, CardsGrid, MediaCard, MediaThumb, CardBody, CardTitle,
  MetaLine, PrimaryButton, BadgeOverlay, Pill,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const WEBINARS = [
  { id: 1, title: 'Advanced Forex Trading Strategies', instructor: 'John Smith', date: '2024-01-20', time: '14:00', status: 'upcoming', premium: false, duration: '60 min' },
  { id: 2, title: 'Crypto Market Analysis Masterclass', instructor: 'Jane Doe', date: '2024-01-18', time: '16:00', status: 'live', premium: true, duration: '90 min' },
  { id: 3, title: 'Risk Management Fundamentals', instructor: 'Mike Johnson', date: '2024-01-15', time: '10:00', status: 'recorded', premium: false, duration: '45 min' },
  { id: 4, title: 'Gold Trading Secrets', instructor: 'Sarah Williams', date: '2024-01-12', time: '15:00', status: 'recorded', premium: true, duration: '75 min' },
];

const MyWebinars: React.FC = () => {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState('all');
  const filtered = WEBINARS.filter((w) => activeFilter === 'all' || w.status === activeFilter);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiVideo /> {t("panel.webinars")}</PageTitle>
        <PageSubtitle>Live sessions and recorded replays</PageSubtitle>
      </PageHeader>

      <FilterTabs>
        {['all', 'upcoming', 'live', 'recorded'].map((f) => (
          <FilterTab key={f} $active={activeFilter === f} onClick={() => setActiveFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </FilterTab>
        ))}
      </FilterTabs>

      <CardsGrid>
        {filtered.map((webinar) => (
          <MediaCard key={webinar.id}>
            <MediaThumb>
              <FiVideo />
              <BadgeOverlay $variant={webinar.status === 'live' ? 'live' : webinar.status === 'upcoming' ? 'upcoming' : undefined}>
                {webinar.status === 'live' ? 'LIVE' : webinar.status === 'upcoming' ? 'Soon' : 'Replay'}
              </BadgeOverlay>
              {webinar.premium && <span style={{ position: 'absolute', top: 8, left: 8 }}><Pill $variant="pending">Premium</Pill></span>}
            </MediaThumb>
            <CardBody>
              <CardTitle>{webinar.title}</CardTitle>
              <MetaLine><FiUser />{webinar.instructor}</MetaLine>
              <MetaLine><FiCalendar />{webinar.date} · <FiClock />{webinar.time} · {webinar.duration}</MetaLine>
              <PrimaryButton
                $sm
                type="button"
                style={{ width: '100%', marginTop: 8, background: webinar.premium ? '#Fbbf24' : undefined, color: webinar.premium ? '#132E58' : undefined }}
                disabled={webinar.premium && webinar.status === 'recorded'}
              >
                {webinar.premium && webinar.status === 'recorded' ? <><FiLock /> Unlock</> :
                 webinar.status === 'live' ? <><FiPlay /> Join Live</> :
                 webinar.status === 'upcoming' ? 'Reserve' : <><FiPlay /> Watch</>}
              </PrimaryButton>
            </CardBody>
          </MediaCard>
        ))}
      </CardsGrid>
    </PageWrap>
  );
};

export default MyWebinars;
