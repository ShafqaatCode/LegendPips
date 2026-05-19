import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";
import {
  fetchMyCourseEnrollments,
  updateCourseProgress,
  type MyEnrollmentItem,
} from "../../../services/courseService";
import { PanelCardListSkeleton } from "../../../components/SharedComponents/Shimmer";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132e58;
  margin: 0;
`;

const BrowseLink = styled(Link)`
  font-weight: 600;
  color: #132e58;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 2px solid #132e58;
  border-radius: 8px;

  &:hover {
    background: #f9fafb;
  }
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

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
`;

const CourseThumbnail = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #132e58 0%, #1a4a7a 100%);
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
  background: #fbbf24;
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
  background: #fbbf24;
  color: #132e58;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #132e58;
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
    color: #fbbf24;
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
  color: #132e58;
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
  background: ${({ $completed }) => ($completed ? "#10b981" : "#132e58")};
  color: white;

  &:hover:not(:disabled) {
    background: ${({ $completed }) => ($completed ? "#059669" : "#1a4a7a")};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  line-height: 1.6;
`;

const ErrorBox = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: #fee2e2;
  color: #b91c1c;
  margin-bottom: 1rem;
`;

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<MyEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchMyCourseEnrollments();
      setCourses(items);
    } catch (e: any) {
      setError(e.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleContinue = async (course: MyEnrollmentItem) => {
    if (course.status === "completed") return;
    const next = Math.min(course.lessons, course.completed + 1);
    setSavingId(course.courseId);
    try {
      await updateCourseProgress(course.courseId, next);
      await load();
    } catch (e: any) {
      setError(e.message || "Could not update progress");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Courses</Title>
        </Header>
        <EmptyState>
          <PanelCardListSkeleton cards={3} />
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Courses</Title>
        <BrowseLink to="/courses#course-catalog">Browse catalog</BrowseLink>
      </Header>

      {error && <ErrorBox>{error}</ErrorBox>}

      {courses.length === 0 ? (
        <EmptyState>
          <p>You are not enrolled in any courses yet.</p>
          <p style={{ marginTop: "1rem" }}>
            <BrowseLink to="/courses#course-catalog">Explore the course catalog</BrowseLink>
          </p>
        </EmptyState>
      ) : (
        <CoursesGrid>
          {courses.map((course) => {
            const progress = course.lessons > 0 ? Math.round((course.completed / course.lessons) * 100) : 0;
            const done = course.status === "completed";

            return (
              <CourseCard key={course.enrollmentId}>
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
                    <ProgressText>
                      {course.completed}/{course.lessons} Lessons
                    </ProgressText>
                  </ProgressInfo>
                  <ActionButton
                    type="button"
                    $completed={done}
                    disabled={done || savingId === course.courseId}
                    onClick={() => handleContinue(course)}
                  >
                    {done ? (
                      <>
                        <FiCheckCircle />
                        Completed
                      </>
                    ) : (
                      <>
                        <FiTrendingUp />
                        {savingId === course.courseId ? "Saving…" : "Continue (+1 lesson)"}
                      </>
                    )}
                  </ActionButton>
                </CardContent>
              </CourseCard>
            );
          })}
        </CoursesGrid>
      )}
    </Container>
  );
};

export default MyCourses;
