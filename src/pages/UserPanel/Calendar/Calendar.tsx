import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody, MetaLine, ListStack, ListCard, CardTitle,
  GhostButton,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 0.75rem;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
`;

const MonthLabel = styled.h2`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #132E58;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.25rem;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: #64748b;
  padding: 0.25rem;
`;

const DayCell = styled.div<{ $muted?: boolean; $today?: boolean; $event?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: ${({ $today }) => ($today ? 700 : 500)};
  cursor: pointer;
  background: ${({ $today, $event }) =>
    $today ? '#132E58' : $event ? '#fffbeb' : 'transparent'};
  color: ${({ $muted, $today }) =>
    $today ? 'white' : $muted ? '#cbd5e1' : '#132E58'};

  &:hover { background: ${({ $today }) => ($today ? '#1a4a7a' : '#f8fafc')}; }
`;

const Calendar: React.FC = () => {
  const { t } = useLocale();
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const events = [
    { id: 1, title: 'Forex Trading Webinar', date: 15, time: '14:00' },
    { id: 2, title: 'Contest Ends', date: 20, time: '23:59' },
    { id: 3, title: 'Live Trading Session', date: 22, time: '10:00' },
  ];

  const days: React.ReactNode[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(<DayCell key={`p-${i}`} $muted>{daysInPrevMonth - i}</DayCell>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    days.push(<DayCell key={day} $today={isToday} $event={events.some((e) => e.date === day)}>{day}</DayCell>);
  }
  while (days.length < 42) {
    days.push(<DayCell key={`n-${days.length}`} $muted>{days.length - firstDay - daysInMonth + 1}</DayCell>);
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiCalendar /> {t("panel.calendar")}</PageTitle>
        <PageSubtitle>Webinars, contests, and scheduled events</PageSubtitle>
      </PageHeader>

      <Layout>
        <SectionCard style={{ marginBottom: 0 }}>
          <SectionBody>
            <CalHeader>
              <GhostButton $sm type="button" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><FiChevronLeft /></GhostButton>
              <MonthLabel>{monthNames[month]} {year}</MonthLabel>
              <GhostButton $sm type="button" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><FiChevronRight /></GhostButton>
            </CalHeader>
            <WeekRow>{weekDays.map((d) => <WeekDay key={d}>{d}</WeekDay>)}</WeekRow>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
              {days.slice(0, 42)}
            </div>
          </SectionBody>
        </SectionCard>

        <SectionCard style={{ marginBottom: 0 }}>
          <SectionHead><h2>Upcoming</h2></SectionHead>
          <SectionBody style={{ paddingTop: 0 }}>
            <ListStack>
              {events.map((event) => (
                <ListCard key={event.id} style={{ cursor: 'default', padding: '0.625rem' }}>
                  <CardTitle>{event.title}</CardTitle>
                  <MetaLine><FiCalendar />{monthNames[month]} {event.date}</MetaLine>
                  <MetaLine><FiClock />{event.time}</MetaLine>
                </ListCard>
              ))}
            </ListStack>
          </SectionBody>
        </SectionCard>
      </Layout>
    </PageWrap>
  );
};

export default Calendar;
