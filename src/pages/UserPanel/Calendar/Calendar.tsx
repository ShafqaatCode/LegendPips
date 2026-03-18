import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiClock, FiVideo, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CalendarGrid = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthYear = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const NavButton = styled.button`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: #132E58;
  transition: all 0.2s ease;
  
  &:hover {
    background: #132E58;
    color: white;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const WeekDay = styled.div`
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0.5rem;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled.div<{ $isCurrentMonth?: boolean; $isToday?: boolean; $hasEvent?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isToday, $hasEvent }) => {
    if ($isToday) return '#132E58';
    if ($hasEvent) return '#Fbbf2415';
    return 'transparent';
  }};
  color: ${({ $isCurrentMonth, $isToday }) => {
    if ($isToday) return 'white';
    if (!$isCurrentMonth) return '#d1d5db';
    return '#132E58';
  }};
  font-weight: ${({ $isToday }) => ($isToday ? 700 : 500)};
  
  &:hover {
    background: ${({ $isToday }) => ($isToday ? '#1a4a7a' : '#f9fafb')};
  }
`;

const EventsSidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const EventsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 1.5rem 0;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventItem = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #Fbbf24;
`;

const EventTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #132E58;
  margin: 0 0 0.5rem 0;
`;

const EventTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const events = [
    { id: 1, title: 'Forex Trading Webinar', date: 15, time: '14:00', type: 'webinar' },
    { id: 2, title: 'Contest Ends', date: 20, time: '23:59', type: 'contest' },
    { id: 3, title: 'Live Trading Session', date: 22, time: '10:00', type: 'webinar' },
  ];

  const renderDays = () => {
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <DayCell key={`prev-${i}`} $isCurrentMonth={false}>
          {daysInPrevMonth - i}
        </DayCell>
      );
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvent = events.some(e => e.date === day);
      const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      days.push(
        <DayCell key={day} $isCurrentMonth $isToday={isToday} $hasEvent={hasEvent}>
          {day}
        </DayCell>
      );
    }
    
    // Next month days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <DayCell key={`next-${day}`} $isCurrentMonth={false}>
          {day}
        </DayCell>
      );
    }
    
    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <Container>
      <Header>
        <Title>Calendar</Title>
      </Header>

      <CalendarWrapper>
        <CalendarGrid>
          <CalendarHeader>
            <NavButton onClick={prevMonth}>
              <FiChevronLeft />
            </NavButton>
            <MonthYear>{monthNames[month]} {year}</MonthYear>
            <NavButton onClick={nextMonth}>
              <FiChevronRight />
            </NavButton>
          </CalendarHeader>
          <WeekDays>
            {weekDays.map(day => (
              <WeekDay key={day}>{day}</WeekDay>
            ))}
          </WeekDays>
          <DaysGrid>
            {renderDays()}
          </DaysGrid>
        </CalendarGrid>

        <EventsSidebar>
          <EventsTitle>Upcoming Events</EventsTitle>
          <EventList>
            {events.map(event => (
              <EventItem key={event.id}>
                <EventTitle>{event.title}</EventTitle>
                <EventTime>
                  <FiCalendar />
                  {monthNames[month]} {event.date}, {year}
                </EventTime>
                <EventTime>
                  <FiClock />
                  {event.time}
                </EventTime>
              </EventItem>
            ))}
          </EventList>
        </EventsSidebar>
      </CalendarWrapper>
    </Container>
  );
};

export default Calendar;
