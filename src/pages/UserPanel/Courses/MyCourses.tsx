import React, { useCallback, useEffect, useState } from 'react';
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import {
  fetchMyCourseEnrollments,
  updateCourseProgress,
  type MyEnrollmentItem,
} from '../../../services/courseService';
import { PanelCardListSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle, PageHeaderRow,
  CardsGrid, MediaCard, MediaThumb, CardBody, CardTitle, MetaLine,
  PrimaryButton, EmptyState, ErrorBanner, GhostNavLink, BadgeOverlay,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const MyCourses: React.FC = () => {
  const { t } = useLocale();
  const [courses, setCourses] = useState<MyEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCourses(await fetchMyCourseEnrollments());
    } catch (e: any) {
      setError(e.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleContinue = async (course: MyEnrollmentItem) => {
    if (course.status === 'completed') return;
    const next = Math.min(course.lessons, course.completed + 1);
    setSavingId(course.courseId);
    try {
      await updateCourseProgress(course.courseId, next);
      await load();
    } catch (e: any) {
      setError(e.message || 'Could not update progress');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <PageWrap>
      <PageHeaderRow>
        <PageHeader style={{ marginBottom: 0 }}>
          <PageTitle><FiBook /> {t("panel.courses")}</PageTitle>
          <PageSubtitle>Your enrolled courses and progress</PageSubtitle>
        </PageHeader>
        <GhostNavLink to="/courses#course-catalog">Browse catalog</GhostNavLink>
      </PageHeaderRow>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading ? (
        <EmptyState><PanelCardListSkeleton cards={3} /></EmptyState>
      ) : courses.length === 0 ? (
        <EmptyState>
          <p>Not enrolled in any courses yet.</p>
          <GhostNavLink to="/courses#course-catalog" style={{ marginTop: 8, display: 'inline-flex' }}>Explore catalog</GhostNavLink>
        </EmptyState>
      ) : (
        <CardsGrid>
          {courses.map((course) => {
            const progress = course.lessons > 0 ? Math.round((course.completed / course.lessons) * 100) : 0;
            const done = course.status === 'completed';
            return (
              <MediaCard key={course.enrollmentId}>
                <MediaThumb>
                  <FiBook />
                  {course.premium && <BadgeOverlay $variant="upcoming">Premium</BadgeOverlay>}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#Fbbf24' }} />
                  </div>
                </MediaThumb>
                <CardBody>
                  <CardTitle>{course.title}</CardTitle>
                  <MetaLine><FiBook />{course.lessons} lessons · {course.duration}</MetaLine>
                  <MetaLine><FiClock />{course.completed}/{course.lessons} · {progress}%</MetaLine>
                  <PrimaryButton
                    $sm
                    type="button"
                    style={{ width: '100%', marginTop: 8, background: done ? '#059669' : undefined }}
                    disabled={done || savingId === course.courseId}
                    onClick={() => handleContinue(course)}
                  >
                    {done ? <><FiCheckCircle /> Completed</> : <><FiTrendingUp /> {savingId === course.courseId ? 'Saving…' : 'Continue'}</>}
                  </PrimaryButton>
                </CardBody>
              </MediaCard>
            );
          })}
        </CardsGrid>
      )}
    </PageWrap>
  );
};

export default MyCourses;
