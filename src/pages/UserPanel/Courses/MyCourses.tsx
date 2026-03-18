import React, { useState } from 'react';
import styled from 'styled-components';
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp, FiLock } from 'react-icons/fi';

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

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #Fbbf24;
  }
`;

const CourseThumbnail = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: #Fbbf24;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s ease;
`;

const PremiumBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #Fbbf24;
  color: #132E58;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const CourseMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
`;

const ProgressText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #132E58;
`;

const ActionButton = styled.button<{ $completed?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $completed }) => ($completed ? '#10b981' : '#132E58')};
  color: white;
  
  &:hover {
    background: ${({ $completed }) => ($completed ? '#059669' : '#1a4a7a')};
    transform: translateY(-2px);
  }
`;

const MyCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Forex Trading Basics',
      lessons: 12,
      completed: 8,
      duration: '4 hours',
      premium: false,
      status: 'in-progress',
    },
    {
      id: 2,
      title: 'Advanced Technical Analysis',
      lessons: 20,
      completed: 20,
      duration: '8 hours',
      premium: true,
      status: 'completed',
    },
    {
      id: 3,
      title: 'Crypto Trading Mastery',
      lessons: 15,
      completed: 0,
      duration: '6 hours',
      premium: true,
      status: 'locked',
    },
    {
      id: 4,
      title: 'Risk Management Essentials',
      lessons: 10,
      completed: 5,
      duration: '3 hours',
      premium: false,
      status: 'in-progress',
    },
  ];

  return (
    <Container>
      <Header>
        <Title>My Courses</Title>
      </Header>

      <CoursesGrid>
        {courses.map((course) => {
          const progress = course.lessons > 0 ? Math.round((course.completed / course.lessons) * 100) : 0;
          
          return (
            <CourseCard key={course.id}>
              <CourseThumbnail>
                <FiBook />
                {course.premium && <PremiumBadge>Premium</PremiumBadge>}
                <ProgressBar>
                  <ProgressFill $progress={progress} />
                </ProgressBar>
              </CourseThumbnail>
              <CardContent>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseMeta>
                  <MetaItem>
                    <FiBook />
                    {course.lessons} Lessons
                  </MetaItem>
                  <MetaItem>
                    <FiClock />
                    {course.duration}
                  </MetaItem>
                </CourseMeta>
                <ProgressInfo>
                  <ProgressText>Progress: {progress}%</ProgressText>
                  <ProgressText>{course.completed}/{course.lessons} Lessons</ProgressText>
                </ProgressInfo>
                <ActionButton $completed={course.status === 'completed'} disabled={course.status === 'locked'}>
                  {course.status === 'locked' ? (
                    <>
                      <FiLock />
                      Unlock Course
                    </>
                  ) : course.status === 'completed' ? (
                    <>
                      <FiCheckCircle />
                      Completed
                    </>
                  ) : (
                    <>
                      <FiTrendingUp />
                      Continue Learning
                    </>
                  )}
                </ActionButton>
              </CardContent>
            </CourseCard>
          );
        })}
      </CoursesGrid>
    </Container>
  );
};

export default MyCourses;
