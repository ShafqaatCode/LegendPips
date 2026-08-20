import React, { useState } from 'react';
import styled from 'styled-components';
import bannerGirl from '../../assets/bannerGirl.png';
import brokerbannergirl from '../../assets/brokerbannergirl.jpg';
import bannerBg from '../../assets/banner/BannerBg.jpg';
import ReserveSeatModal from './ReserveSeatModal';
import JoinLiveModal from './JoinLiveModal';
import WatchReplayModal from './WatchReplayModal';
import type { ReserveSeatData } from './ReserveSeatModal';
import type { JoinLiveData } from './JoinLiveModal';
import type { WatchReplayData } from './WatchReplayModal';
import { useLocale } from '../../contexts/LocaleContext';

const SectionWrapper = styled.section`
  background: #fafbfc;
  padding: 60px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 30px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const FiltersWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#132E58' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#132E58')};
  border: 2px solid #132E58;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $active }) => ($active ? '#0b1b38' : '#f0f7ff')};
  }
`;

const ChatIcon = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
  
  &:hover {
    background: #f0f7ff;
    border-color: #132E58;
  }
  
  &::before {
    content: '😊';
  }
`;

const WebinarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const WebinarCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  overflow: hidden;
`;

const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusTag = styled.div<{ $type: 'live' | 'upcoming' | 'recorded' }>`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
  background: ${({ $type }) => {
    if ($type === 'live') return '#e74c3c';
    if ($type === 'upcoming') return '#10b981';
    return '#3b82f6';
  }};
  color: white;
`;

const PriceTag = styled.div<{ $premium?: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
  background: ${({ $premium }) => ($premium ? '#Fbbf24' : '#132E58')};
  color: ${({ $premium }) => ($premium ? '#132E58' : 'white')};
`;

const WebinarContent = styled.div`
  padding: 1.5rem;
`;

const WebinarTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const Instructor = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const WebinarDescription = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const WebinarMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DateTime = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButton = styled.button<{ $type: 'live' | 'upcoming' | 'recorded'; $premium?: boolean }>`
  width: 100%;
  background: ${({ $type, $premium }) => {
    if ($type === 'live') return '#132E58';
    if ($type === 'upcoming') return '#Fbbf24';
    return $premium ? '#Fbbf24' : '#132E58';
  }};
  color: ${({ $type, $premium }) => {
    if ($type === 'upcoming' || ($type === 'recorded' && $premium)) return '#132E58';
    return 'white';
  }};
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

interface Webinar {
  id: number;
  desc: "dLive" | "dSize";
  instructor: string;
  date?: string;
  time?: string;
  status: 'live' | 'upcoming' | 'recorded';
  price?: string;
  premium?: boolean;
  thumbnail: string;
}

const allWebinars: Webinar[] = [
  { id: 1, desc: "dLive", instructor: "Newson Official", date: "26/12/2020", time: "15:08", status: "live", thumbnail: bannerGirl },
  { id: 2, desc: "dLive", instructor: "Newson Official", date: "27/12/2020", time: "15:08", status: "upcoming", thumbnail: brokerbannergirl },
  { id: 3, desc: "dLive", instructor: "Newson Official", date: "28/12/2020", time: "14:00", status: "upcoming", thumbnail: bannerGirl },
  { id: 4, desc: "dLive", instructor: "Newson Official", date: "20/10/2020", time: "14:00", status: "recorded", premium: false, thumbnail: brokerbannergirl },
  { id: 5, desc: "dSize", instructor: "Newson Official", status: "recorded", premium: true, price: "$19.99", thumbnail: bannerGirl },
  { id: 6, desc: "dLive", instructor: "Newson Official", date: "20/10/2020", time: "14:00", status: "recorded", premium: false, thumbnail: brokerbannergirl },
  { id: 7, desc: "dSize", instructor: "Newson Official", status: "recorded", premium: true, price: "$19.99", thumbnail: bannerGirl },
  { id: 8, desc: "dLive", instructor: "Newson Official", date: "20/10/2020", time: "14:00", status: "recorded", premium: false, thumbnail: brokerbannergirl },
  { id: 9, desc: "dSize", instructor: "Newson Official", status: "recorded", premium: true, price: "$24.99", thumbnail: bannerGirl },
  { id: 10, desc: "dLive", instructor: "Newson Official", date: "22/10/2020", time: "16:00", status: "recorded", premium: false, thumbnail: brokerbannergirl },
  { id: 11, desc: "dSize", instructor: "Newson Official", status: "recorded", premium: true, price: "$19.99", thumbnail: bannerGirl },
  { id: 12, desc: "dLive", instructor: "Newson Official", date: "25/10/2020", time: "15:00", status: "recorded", premium: false, thumbnail: brokerbannergirl },
];

const WebinarsList: React.FC = () => {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [watchModalOpen, setWatchModalOpen] = useState(false);

  const titleOf = (w: Webinar) => t(`webinars.t${w.id}`);
  const descOf = (w: Webinar) => t(`webinars.${w.desc}`);
  const modalWebinar = selectedWebinar
    ? {
        ...selectedWebinar,
        title: titleOf(selectedWebinar),
        description: descOf(selectedWebinar),
      }
    : null;

  const getFilteredWebinars = () => {
    switch (activeFilter) {
      case "upcoming":
        return allWebinars.filter((w) => w.status === "upcoming");
      case "recorded":
        return allWebinars.filter((w) => w.status === "recorded");
      case "free":
        return allWebinars.filter((w) => w.status === "recorded" && !w.premium);
      case "premium":
        return allWebinars.filter((w) => w.premium);
      default:
        return allWebinars;
    }
  };

  const getButtonText = (webinar: Webinar) => {
    if (webinar.status === "live") return t("webinars.joinLive");
    if (webinar.status === "upcoming") return t("webinars.reserve");
    return t("webinars.replay");
  };

  const statusLabel = (webinar: Webinar) => {
    if (webinar.status === "live") return t("webinars.joinLive");
    if (webinar.status === "upcoming") return t("webinars.upcoming");
    return t("webinars.recorded");
  };

  const handleCardClick = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    
    if (webinar.status === 'live') {
      setJoinModalOpen(true);
    } else if (webinar.status === 'upcoming') {
      setReserveModalOpen(true);
    } else {
      setWatchModalOpen(true);
    }
  };

  const handleReserveSeat = async (data: ReserveSeatData) => {
    // TODO: Replace with actual API call
    console.log('Reserving seat:', data);
    // Example API call:
    // const response = await fetch('/api/webinars/reserve', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error('Failed to reserve seat');
    return Promise.resolve();
  };

  const handleJoinLive = async (data: JoinLiveData) => {
    // TODO: Replace with actual API call
    console.log('Joining live webinar:', data);
    // Example API call:
    // const response = await fetch('/api/webinars/join', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error('Failed to join webinar');
    return Promise.resolve();
  };

  const handleWatchReplay = async (data: WatchReplayData) => {
    // TODO: Replace with actual API call
    console.log('Watching replay:', data);
    // Example API call:
    // const response = await fetch('/api/webinars/watch', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error('Failed to access replay');
    return Promise.resolve();
  };

  const filters = [
    { id: "all", label: t("webinars.all") },
    { id: "upcoming", label: t("webinars.upcoming") },
    { id: "recorded", label: t("webinars.recorded") },
    { id: "free", label: t("webinars.free") },
    { id: "premium", label: t("webinars.premium") },
  ];

  return (
    <SectionWrapper>
      <ContentWrapper>
        <FiltersWrapper>
          <FilterButtons>
            {filters.map((filter) => (
              <FilterButton
                key={filter.id}
                $active={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </FilterButton>
            ))}
          </FilterButtons>
          <ChatIcon />
        </FiltersWrapper>

        <WebinarsGrid>
          {getFilteredWebinars().map((webinar) => (
            <WebinarCard key={webinar.id} onClick={() => handleCardClick(webinar)}>
              <ThumbnailWrapper>
                <Thumbnail src={webinar.thumbnail} alt={titleOf(webinar)} />
                <StatusTag $type={webinar.status}>
                  {statusLabel(webinar)}
                </StatusTag>
                {webinar.status === 'recorded' && (
                  <PriceTag $premium={webinar.premium}>
                    {webinar.premium ? `${t("webinars.premium")} ${webinar.price}` : t("webinars.free")}
                  </PriceTag>
                )}
              </ThumbnailWrapper>
              <WebinarContent>
                <WebinarTitle>{titleOf(webinar)}</WebinarTitle>
                <Instructor>{webinar.instructor}</Instructor>
                <WebinarDescription>{descOf(webinar)}</WebinarDescription>
                {(webinar.date || webinar.time) && (
                  <WebinarMeta>
                    {webinar.date && <DateTime>📅 {webinar.date}</DateTime>}
                    {webinar.time && <DateTime>🕐 {webinar.time}</DateTime>}
                  </WebinarMeta>
                )}
                <ActionButton 
                  $type={webinar.status} 
                  $premium={webinar.premium}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(webinar);
                  }}
                >
                  {getButtonText(webinar)}
                </ActionButton>
              </WebinarContent>
            </WebinarCard>
          ))}
        </WebinarsGrid>

        <ReserveSeatModal
          isOpen={reserveModalOpen}
          onClose={() => {
            setReserveModalOpen(false);
            setSelectedWebinar(null);
          }}
          webinar={modalWebinar}
          onSubmit={handleReserveSeat}
        />

        <JoinLiveModal
          isOpen={joinModalOpen}
          onClose={() => {
            setJoinModalOpen(false);
            setSelectedWebinar(null);
          }}
          webinar={modalWebinar}
          onJoin={handleJoinLive}
        />

        <WatchReplayModal
          isOpen={watchModalOpen}
          onClose={() => {
            setWatchModalOpen(false);
            setSelectedWebinar(null);
          }}
          webinar={modalWebinar}
          onWatch={handleWatchReplay}
        />
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default WebinarsList;
