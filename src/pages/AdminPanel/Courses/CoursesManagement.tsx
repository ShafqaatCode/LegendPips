import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiLoader } from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import {
  adminCreateCourse,
  adminDeleteCourse,
  adminFetchCourses,
  adminUpdateCourse,
  type Course,
} from "../../../services/courseService";

const Container = styled.div`
  max-width: 1600px;
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

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $primary }) => ($primary ? "#132e58" : "white")};
  color: ${({ $primary }) => ($primary ? "white" : "#132e58")};
  border: 2px solid ${({ $primary }) => ($primary ? "#132e58" : "#e5e7eb")};

  &:hover {
    background: ${({ $primary }) => ($primary ? "#1a4a7a" : "#f9fafb")};
    border-color: ${({ $primary }) => ($primary ? "#1a4a7a" : "#132e58")};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  font-size: 0.9375rem;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

const CourseThumbnail = styled.div<{ $img?: string }>`
  width: 100%;
  height: 180px;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover no-repeat` : "linear-gradient(135deg, #132e58 0%, #1a4a7a 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
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

const DraftBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e5e7eb;
  color: #374151;
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

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;

  svg {
    color: #fbbf24;
  }

  strong {
    color: #132e58;
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $danger }) => ($danger ? "#fee2e2" : "#f3f4f6")};
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#132e58")};

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fecaca" : "#e5e7eb")};
  }
`;

const ModalFooterBtn = styled.button<{ $danger?: boolean }>`
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: ${({ $danger }) => ($danger ? "#ef4444" : "#f3f4f6")};
  color: ${({ $danger }) => ($danger ? "white" : "#132e58")};

  &:hover {
    opacity: 0.92;
  }
`;

const ErrorBanner = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

type ModalMode = "add" | "edit" | "delete";

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<"forex" | "crypto" | "general">("general");
  const [formLessons, setFormLessons] = useState("10");
  const [formDuration, setFormDuration] = useState("4 hours");
  const [formPremium, setFormPremium] = useState(false);
  const [formPrice, setFormPrice] = useState("");
  const [formThumbnailUrl, setFormThumbnailUrl] = useState("");
  const [formPublished, setFormPublished] = useState(true);

  const loadCourses = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await adminFetchCourses({ page: 1, limit: 50, search: search.trim() || undefined });
      setCourses(res.items || []);
    } catch (e: any) {
      setListError(e.message || "Failed to load courses");
    } finally {
      setListLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openAdd = () => {
    setModalMode("add");
    setSelectedCourseId(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("general");
    setFormLessons("10");
    setFormDuration("4 hours");
    setFormPremium(false);
    setFormPrice("");
    setFormThumbnailUrl("");
    setFormPublished(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setModalMode("edit");
    setSelectedCourseId(c._id);
    setFormTitle(c.title);
    setFormDescription(c.description || "");
    setFormCategory(c.category || "general");
    setFormLessons(String(c.lessons ?? 0));
    setFormDuration(c.duration || "");
    setFormPremium(!!c.premium);
    setFormPrice(c.price != null ? String(c.price) : "");
    setFormThumbnailUrl(c.thumbnailUrl || "");
    setFormPublished(c.published !== false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openDelete = (id: string) => {
    setModalMode("delete");
    setSelectedCourseId(id);
    setModalError(null);
    setIsModalOpen(true);
  };

  const submitForm = async () => {
    const title = formTitle.trim();
    if (!title) {
      setModalError("Title is required");
      return;
    }
    const lessons = Number(formLessons);
    if (Number.isNaN(lessons) || lessons < 0) {
      setModalError("Lessons must be a non-negative number");
      return;
    }
    if (!formDuration.trim()) {
      setModalError("Duration is required");
      return;
    }

    setSaving(true);
    setModalError(null);
    try {
      const priceNum = formPrice.trim() === "" ? undefined : Number(formPrice);
      if (formPrice.trim() !== "" && Number.isNaN(priceNum)) {
        setModalError("Price must be a number");
        setSaving(false);
        return;
      }

      const payload = {
        title,
        description: formDescription.trim(),
        category: formCategory,
        lessons,
        duration: formDuration.trim(),
        premium: formPremium,
        price: formPremium && priceNum !== undefined ? priceNum : undefined,
        thumbnailUrl: formThumbnailUrl.trim() || undefined,
        published: formPublished,
      };

      if (modalMode === "add") {
        await adminCreateCourse(payload);
      } else if (modalMode === "edit" && selectedCourseId) {
        await adminUpdateCourse(selectedCourseId, payload);
      }
      setIsModalOpen(false);
      await loadCourses();
    } catch (e: any) {
      setModalError(e.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCourseId) return;
    setSaving(true);
    setModalError(null);
    try {
      await adminDeleteCourse(selectedCourseId);
      setIsModalOpen(false);
      await loadCourses();
    } catch (e: any) {
      setModalError(e.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Courses Management</Title>
        <Button $primary type="button" onClick={openAdd}>
          <FiPlus />
          Create Course
        </Button>
      </Header>

      <SearchRow>
        <SearchInput
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") loadCourses();
          }}
        />
        <Button type="button" onClick={loadCourses}>
          Search
        </Button>
      </SearchRow>

      {listError && <ErrorBanner>{listError}</ErrorBanner>}

      {listLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#132e58" }}>
          <FiLoader style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }} />
        </div>
      ) : (
        <CoursesGrid>
          {courses.map((course) => (
            <CourseCard key={course._id}>
              <CourseThumbnail $img={course.thumbnailUrl}>
                {!course.thumbnailUrl && <FiBook />}
                {course.premium && <PremiumBadge>Premium</PremiumBadge>}
                {!course.published && <DraftBadge>Draft</DraftBadge>}
              </CourseThumbnail>
              <CardContent>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseInfo>
                  <InfoItem>
                    <FiBook />
                    <span>
                      <strong>{course.lessons}</strong> Lessons · {course.category}
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <span>
                      Duration: <strong>{course.duration}</strong>
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <span>
                      Enrolled: <strong>{course.enrolled ?? 0}</strong> students
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <span>
                      Status: <strong>{course.published ? "Published" : "Draft"}</strong>
                    </span>
                  </InfoItem>
                </CourseInfo>
                <ActionButtons>
                  <IconButton type="button" onClick={() => openEdit(course)}>
                    <FiEdit2 />
                    Edit
                  </IconButton>
                  <IconButton type="button" $danger onClick={() => openDelete(course._id)}>
                    <FiTrash2 />
                    Delete
                  </IconButton>
                </ActionButtons>
              </CardContent>
            </CourseCard>
          ))}
        </CoursesGrid>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === "add" ? "Create Course" : modalMode === "edit" ? "Edit Course" : "Delete Course"
        }
        onClose={() => !saving && setIsModalOpen(false)}
        footer={
          modalMode === "delete" ? (
            <>
              <ModalFooterBtn type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </ModalFooterBtn>
              <ModalFooterBtn type="button" $danger onClick={confirmDelete} disabled={saving}>
                <FiTrash2 />
                {saving ? "…" : "Delete"}
              </ModalFooterBtn>
            </>
          ) : (
            <>
              <ModalFooterBtn type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </ModalFooterBtn>
              <ModalFooterBtn type="button" onClick={submitForm} disabled={saving}>
                <FiEdit2 />
                {saving ? "…" : "Save"}
              </ModalFooterBtn>
            </>
          )
        }
      >
        {modalError && (
          <div style={{ color: "#b91c1c", marginBottom: 12, fontSize: 14 }}>{modalError}</div>
        )}
        {modalMode === "delete" ? (
          <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete this course? All student enrollments for this course will be removed.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Title</div>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Description</div>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Category</div>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              >
                <option value="general">general</option>
                <option value="forex">forex</option>
                <option value="crypto">crypto</option>
              </select>
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Lessons</div>
              <input
                value={formLessons}
                onChange={(e) => setFormLessons(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Duration</div>
              <input
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Thumbnail URL (optional)</div>
              <input
                value={formThumbnailUrl}
                onChange={(e) => setFormThumbnailUrl(e.target.value)}
                placeholder="https://…"
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              <span style={{ fontWeight: 600, color: "#132E58" }}>Premium</span>
            </label>
            {formPremium && (
              <label>
                <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Price (optional)</div>
                <input
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
                />
              </label>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={formPublished}
                onChange={(e) => setFormPublished(e.target.checked)}
              />
              <span style={{ fontWeight: 600, color: "#132E58" }}>Published (visible on site)</span>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default CoursesManagement;
