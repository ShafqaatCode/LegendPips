import React from 'react';
import { FiPlay, FiClock, FiLock, FiVideo } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  CardsGrid, MediaCard, MediaThumb, CardBody, CardTitle, MetaLine, Pill,
} from '../../../components/UserPanel/userUi';

const VIDEOS = [
  { id: 1, title: 'Introduction to Forex Trading', duration: '15:30', premium: false },
  { id: 2, title: 'Advanced Chart Patterns Explained', duration: '22:45', premium: true },
  { id: 3, title: 'Risk Management Strategies', duration: '18:20', premium: false },
  { id: 4, title: 'Crypto Trading Fundamentals', duration: '25:10', premium: false },
  { id: 5, title: 'Mastering Technical Indicators', duration: '30:00', premium: true },
  { id: 6, title: 'Live Trading Session', duration: '45:15', premium: true },
];

const TradingVideos: React.FC = () => (
  <PageWrap>
    <PageHeader>
      <PageTitle><FiVideo /> Trading Videos</PageTitle>
      <PageSubtitle>Educational video library</PageSubtitle>
    </PageHeader>

    <CardsGrid>
      {VIDEOS.map((video) => (
        <MediaCard key={video.id} style={{ cursor: 'pointer' }}>
          <MediaThumb>
            <FiPlay style={{ fontSize: '1.25rem' }} />
            <span style={{ position: 'absolute', top: 8, right: 8 }}>
              <Pill $variant={video.premium ? 'pending' : 'approved'}>{video.premium ? 'Premium' : 'Free'}</Pill>
            </span>
          </MediaThumb>
          <CardBody>
            <CardTitle>{video.title}</CardTitle>
            <MetaLine>
              <FiClock />{video.duration}
              {video.premium && <><FiLock style={{ marginLeft: 8 }} /> Premium</>}
            </MetaLine>
          </CardBody>
        </MediaCard>
      ))}
    </CardsGrid>
  </PageWrap>
);

export default TradingVideos;
