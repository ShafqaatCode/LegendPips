import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiSearch, FiUsers, FiClock, FiCheck } from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import { CourseGridSkeleton } from "../../../components/SharedComponents/Shimmer";
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, SearchInput, FilterCount,
  ErrorBanner, Pill, adminColors,
} from "../../../components/AdminPanel/adminUi";
import {
  adminCreateCourse,
  adminDeleteCourse,
  adminFetchCourses,
  adminUpdateCourse,
  type Course,
} from "../../../services/courseService";

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`;

const MiniStat = styled.div`
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  padding: 0.85rem 1rem;
  box-shadow: ${adminColors.shadow};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  .icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
  }
  .val { font-size: 1.25rem; font-weight: 800; color: ${adminColors.navy}; }
  .lbl { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: ${adminColors.muted}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.9rem;
`;

const Card = styled.article`
  background: white;
  border-radius: 16px;
  border: 1px solid ${adminColors.border};
  box-shadow: ${adminColors.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${adminColors.shadowHover};
    border-color: rgba(251, 191, 36, 0.45);
  }
`;

const Thumb = styled.div<{ $img?: string }>`
  height: 120px;
  background: ${({ $img }) =>
    $img
      ? `url(${$img}) center/cover no-repeat`
      : `radial-gradient(ellipse 80% 120% at 100% 0%, rgba(251, 191, 36, 0.2) 0%, transparent 55%),
         linear-gradient(125deg, #0c1f3d 0%, ${adminColors.navy} 50%, ${adminColors.navyLight} 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.9);
  font-size: 2rem;
  position: relative;
`;

const BadgeFloat = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: space-between;
  gap: 0.35rem;
  pointer-events: none;
`;

const Body = styled.div` padding: 0.95rem 1rem 0.65rem; flex: 1; `;

const Title = styled.h3`
  margin: 0 0 0.65rem;
  font-size: 0.975rem;
  font-weight: 800;
  color: ${adminColors.navy};
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const Metric = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 0.45rem 0.55rem;
  .k {
    font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    color: ${adminColors.muted}; margin-bottom: 0.1rem; display: flex; align-items: center; gap: 0.2rem;
    svg { color: ${adminColors.gold}; font-size: 0.7rem; }
  }
  .v { font-size: 0.78rem; font-weight: 700; color: ${adminColors.navy}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

const Footer = styled.div`
  padding: 0.7rem 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.45rem;
  background: #fafbfc;
`;

const Empty = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;
  background: white; border: 1px dashed ${adminColors.border}; border-radius: 16px; color: ${adminColors.muted};
  strong { display: block; color: ${adminColors.navy}; margin-bottom: 0.35rem; }
`;

const FormField = styled.label`
  display: flex; flex-direction: column; gap: 0.35rem;
  font-size: 0.6875rem; font-weight: 700; color: ${adminColors.navy}; margin-bottom: 0.7rem;
  input, select, textarea {
    width: 100%; padding: 0.55rem 0.7rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; font-weight: 400; outline: none; background: #fafbfc; box-sizing: border-box;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); background: white; }
  }
  textarea { min-height: 72px; resize: vertical; }
`;

const CheckRow = styled.label`
  display: flex; align-items: center; gap: 0.55rem; font-weight: 600; color: ${adminColors.navy};
  font-size: 0.8125rem; margin-bottom: 0.7rem; cursor: pointer;
  padding: 0.5rem 0.65rem; border-radius: 9px; background: #f8fafc; border: 1px solid #f1f5f9;
  input { accent-color: ${adminColors.navy}; }
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

  const stats = useMemo(() => ({
    total: courses.length,
    published: courses.filter((c) => c.published !== false).length,
    premium: courses.filter((c) => c.premium).length,
    enrolled: courses.reduce((s, c) => s + (c.enrolled ?? 0), 0),
  }), [courses]);

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
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiBook /> Courses</PageTitle>
          <PageSubtitle>Publish learning paths, track enrollment, and control premium access</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> Create course
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: "#dbeafe", color: "#2563eb" }}><FiBook /></div>
          <div><div className="val">{listLoading ? "…" : stats.total}</div><div className="lbl">Courses</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: "#d1fae5", color: "#059669" }}><FiCheck /></div>
          <div><div className="val">{listLoading ? "…" : stats.published}</div><div className="lbl">Published</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: "#fef3c7", color: "#d97706" }}><FiBook /></div>
          <div><div className="val">{listLoading ? "…" : stats.premium}</div><div className="lbl">Premium</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: "#ede9fe", color: "#7c3aed" }}><FiUsers /></div>
          <div><div className="val">{listLoading ? "…" : stats.enrolled}</div><div className="lbl">Enrolled</div></div>
        </MiniStat>
      </StatsRow>

      <FilterBar>
        <SearchInput style={{ maxWidth: 320, flex: 1 }}>
          <FiSearch />
          <input
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") loadCourses(); }}
          />
        </SearchInput>
        <GhostButton $sm type="button" onClick={loadCourses}>Search</GhostButton>
        <FilterCount>{listLoading ? "Loading…" : `${courses.length} shown`}</FilterCount>
      </FilterBar>

      {listError && <ErrorBanner>{listError}</ErrorBanner>}

      {listLoading ? (
        <CourseGridSkeleton cards={6} />
      ) : (
        <Grid>
          {courses.length === 0 ? (
            <Empty>
              <strong>No courses yet</strong>
              Create your first course to get started.
            </Empty>
          ) : (
            courses.map((course) => (
              <Card key={course._id}>
                <Thumb $img={course.thumbnailUrl || undefined}>
                  {!course.thumbnailUrl && <FiBook />}
                  <BadgeFloat>
                    {!course.published ? <Pill $variant="incomplete">Draft</Pill> : <span />}
                    {course.premium && <Pill $variant="admin">Premium</Pill>}
                  </BadgeFloat>
                </Thumb>
                <Body>
                  <Title>{course.title}</Title>
                  <Metrics>
                    <Metric>
                      <div className="k"><FiBook /> Lessons</div>
                      <div className="v">{course.lessons} · {course.category}</div>
                    </Metric>
                    <Metric>
                      <div className="k"><FiClock /> Duration</div>
                      <div className="v">{course.duration || "—"}</div>
                    </Metric>
                    <Metric>
                      <div className="k"><FiUsers /> Enrolled</div>
                      <div className="v">{course.enrolled ?? 0}</div>
                    </Metric>
                    <Metric>
                      <div className="k">Status</div>
                      <div className="v">{course.published ? "Published" : "Draft"}</div>
                    </Metric>
                  </Metrics>
                </Body>
                <Footer>
                  <GhostButton $sm type="button" style={{ flex: 1, justifyContent: "center" }} onClick={() => openEdit(course)}>
                    <FiEdit2 /> Edit
                  </GhostButton>
                  <GhostButton $sm $danger type="button" style={{ flex: 1, justifyContent: "center" }} onClick={() => openDelete(course._id)}>
                    <FiTrash2 /> Delete
                  </GhostButton>
                </Footer>
              </Card>
            ))
          )}
        </Grid>
      )}

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === "add" ? "Create Course" : modalMode === "edit" ? "Edit Course" : "Delete Course"}
        onClose={() => !saving && setIsModalOpen(false)}
        footer={
          modalMode === "delete" ? (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</GhostButton>
              <GhostButton type="button" $danger onClick={confirmDelete} disabled={saving}>
                <FiTrash2 /> {saving ? "Deleting…" : "Delete"}
              </GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</GhostButton>
              <PrimaryButton type="button" onClick={submitForm} disabled={saving}>
                <FiCheck /> {saving ? "Saving…" : "Save course"}
              </PrimaryButton>
            </>
          )
        }
      >
        {modalError && (
          <div style={{ color: "#b91c1c", marginBottom: 12, fontSize: 13, fontWeight: 600 }}>{modalError}</div>
        )}
        {modalMode === "delete" ? (
          <div style={{ color: adminColors.muted, fontSize: 14, lineHeight: 1.6 }}>
            Delete this course? All student enrollments for it will be removed.
          </div>
        ) : (
          <div>
            <FormField>Title<input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} /></FormField>
            <FormField>Description<textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} /></FormField>
            <FormField>
              Category
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}>
                <option value="general">general</option>
                <option value="forex">forex</option>
                <option value="crypto">crypto</option>
              </select>
            </FormField>
            <FormField>Lessons<input value={formLessons} onChange={(e) => setFormLessons(e.target.value)} /></FormField>
            <FormField>Duration<input value={formDuration} onChange={(e) => setFormDuration(e.target.value)} /></FormField>
            <FormField>Thumbnail URL (optional)
              <input value={formThumbnailUrl} onChange={(e) => setFormThumbnailUrl(e.target.value)} placeholder="https://…" />
            </FormField>
            <CheckRow>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              Premium
            </CheckRow>
            {formPremium && (
              <FormField>Price (optional)
                <input value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              </FormField>
            )}
            <CheckRow>
              <input type="checkbox" checked={formPublished} onChange={(e) => setFormPublished(e.target.checked)} />
              Published (visible on site)
            </CheckRow>
          </div>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default CoursesManagement;
