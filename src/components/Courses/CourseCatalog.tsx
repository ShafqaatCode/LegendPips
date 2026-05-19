import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FiBook, FiClock, FiLock } from "react-icons/fi";
import {
  enrollInCourse,
  fetchPublishedCourses,
  type Course,
} from "../../services/courseService";
import { getAuthToken } from "../../utils/apiConfig";
import { CourseGridSkeleton } from "../SharedComponents/Shimmer";

const SectionWrapper = styled.section`
  background: #ffffff;
  padding: 72px 3rem 80px;
  scroll-margin-top: 96px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 56px 2rem 64px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 1.5rem 48px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #132e58;
  text-align: center;
  margin: 0 0 0.75rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 28px;
  }
`;

const Subheading = styled.p`
  text-align: center;
  color: #6b7280;
  max-width: 640px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  font-size: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FilterBtn = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 2px solid ${({ $active }) => ($active ? "#132e58" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#132e58" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#132e58")};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #132e58;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.article`
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 14px rgba(19, 46, 88, 0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(19, 46, 88, 0.1);
  }
`;

const Thumb = styled.div<{ $img?: string }>`
  height: 160px;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover no-repeat` : "linear-gradient(135deg, #132e58 0%, #1a4a7a 100%)"};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
`;

const PremiumBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #fbbf24;
  color: #132e58;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
`;

const CatBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(255, 255, 255, 0.92);
  color: #132e58;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  text-transform: capitalize;
`;

const CardBody = styled.div`
  padding: 1.25rem 1.25rem 1.35rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #132e58;
  line-height: 1.35;
`;

const Desc = styled.p`
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  svg {
    color: #fbbf24;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Btn = styled.button`
  flex: 1;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: #132e58;
  color: white;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SecondaryLink = styled(Link)`
  flex: 1;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
  text-decoration: none;
  background: #f3f4f6;
  color: #132e58;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const Message = styled.div<{ $error?: boolean }>`
  text-align: center;
  padding: 2rem;
  color: ${({ $error }) => ($error ? "#b91c1c" : "#6b7280")};
  font-size: 0.95rem;
`;

const CourseCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("All");
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPublishedCourses({
          page: 1,
          limit: 24,
          category: category === "All" ? undefined : category,
        });
        if (!cancelled) setItems(res.items || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Could not load courses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const handleEnroll = async (course: Course) => {
    if (!getAuthToken()) {
      navigate("/signin", { state: { from: "/courses#course-catalog" } });
      return;
    }
    const id = course._id;
    setEnrollingId(id);
    setBanner(null);
    try {
      await enrollInCourse(id);
      setBanner("You are enrolled. Continue in My Courses.");
    } catch (e: any) {
      setBanner(e.message || "Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <SectionWrapper id="course-catalog">
      <ContentWrapper>
        <Heading>Course catalog</Heading>
        <Subheading>
          Structured programs you can start today. Free and premium tracks are managed from the admin panel and
          appear here automatically.
        </Subheading>

        <Toolbar>
          {["All", "forex", "crypto", "general"].map((c) => (
            <FilterBtn key={c} type="button" $active={category === c} onClick={() => setCategory(c)}>
              {c === "All" ? "All courses" : c}
            </FilterBtn>
          ))}
        </Toolbar>

        {banner && (
          <Message $error={banner.toLowerCase().includes("fail")}>{banner}</Message>
        )}

        {loading && <CourseGridSkeleton cards={8} />}
        {!loading && error && <Message $error>{error}</Message>}
        {!loading && !error && items.length === 0 && (
          <Message>No published courses yet. Admins can add courses from the admin panel.</Message>
        )}

        {!loading && !error && items.length > 0 && (
          <Grid>
            {items.map((course) => {
              const id = course._id;
              return (
                <Card key={id}>
                  <Thumb $img={course.thumbnailUrl}>
                    {!course.thumbnailUrl && <FiBook />}
                    <CatBadge>{course.category}</CatBadge>
                    {course.premium && <PremiumBadge>Premium</PremiumBadge>}
                  </Thumb>
                  <CardBody>
                    <Title>{course.title}</Title>
                    {course.description ? <Desc>{course.description}</Desc> : <Desc>&nbsp;</Desc>}
                    <Meta>
                      <span>
                        <FiBook />
                        {course.lessons} lessons
                      </span>
                      <span>
                        <FiClock />
                        {course.duration}
                      </span>
                      {course.premium && course.price != null && (
                        <span>
                          <FiLock />${course.price}
                        </span>
                      )}
                    </Meta>
                    <Actions>
                      <Btn type="button" disabled={enrollingId === id} onClick={() => handleEnroll(course)}>
                        {enrollingId === id ? "…" : "Enroll"}
                      </Btn>
                      <SecondaryLink to="/user-panel/courses">My courses</SecondaryLink>
                    </Actions>
                  </CardBody>
                </Card>
              );
            })}
          </Grid>
        )}
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default CourseCatalog;
