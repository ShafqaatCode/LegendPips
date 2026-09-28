import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FiAlertCircle, FiBell, FiEdit2, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import {
  createPanelHighlight,
  deletePanelHighlight,
  fetchAdminPanelHighlights,
  getHighlightTheme,
  HIGHLIGHT_THEMES,
  updatePanelHighlight,
  type HighlightIconStyle,
  type HighlightPlacement,
  type HighlightTheme,
  type PanelHighlight,
  type PanelHighlightInput,
} from "../../../services/panelHighlightService";
import {
  PageWrap,
  PageHeader,
  PageTitleGroup,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionHead,
  SectionBody,
  PrimaryButton,
  GhostButton,
  ErrorBanner,
  Pill,
  adminColors,
} from "../../../components/AdminPanel/adminUi";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${adminColors.navy};

  input,
  select,
  textarea {
    font-weight: 400;
    padding: 0.55rem 0.65rem;
    border: 1px solid ${adminColors.border};
    border-radius: 8px;
    font-size: 0.8125rem;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: ${adminColors.navy};
    }
  }

  textarea {
    min-height: 160px;
    resize: vertical;
    line-height: 1.5;
  }

  small {
    font-weight: 500;
    color: ${adminColors.muted};
  }
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.85rem;

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ThemeCard = styled.button<{ $active?: boolean; $bg: string; $accent: string }>`
  border: 2px solid ${({ $active, $accent }) => ($active ? $accent : adminColors.border)};
  border-radius: 12px;
  padding: 0.55rem;
  background: ${({ $bg }) => $bg};
  cursor: pointer;
  text-align: left;
  transition: transform 0.12s, box-shadow 0.12s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  }

  .swatch {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: ${({ $accent }) => $accent};
    margin-bottom: 0.4rem;
  }

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    color: ${adminColors.navy};
  }
`;

const IconRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
`;

const IconChip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? adminColors.navy : adminColors.border)};
  background: ${({ $active }) => ($active ? "rgba(19,46,88,0.08)" : "#fff")};
  color: ${adminColors.navy};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
`;

const PreviewCard = styled.div`
  position: sticky;
  top: 1rem;
`;

const PreviewBanner = styled.div<{ $bg: string; $text: string }>`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  padding: 0.7rem 0.8rem;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  margin-bottom: 0.85rem;
`;

const PreviewAvatar = styled.div<{ $accent: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $accent }) => $accent};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  flex-shrink: 0;
`;

const PreviewCta = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: auto;
`;

const PreviewDetail = styled.div<{ $hero: string }>`
  border: 1px solid ${adminColors.border};
  border-radius: 16px;
  overflow: hidden;
  background: #fff;

  .hero {
    padding: 1.1rem 1rem;
    background: ${({ $hero }) => $hero};
    color: #fff;
  }

  .hero h3 {
    margin: 0.2rem 0 0;
    font-size: 1rem;
    font-weight: 800;
  }

  .hero .eye {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.9;
    font-weight: 700;
  }

  .body {
    padding: 0.95rem 1rem 1.1rem;
    font-size: 0.8rem;
    line-height: 1.6;
    color: #475569;
    white-space: pre-wrap;
    max-height: 220px;
    overflow: auto;
  }
`;

const SuccessBanner = styled.div`
  padding: 0.625rem 0.875rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  color: #047857;
  font-size: 0.8125rem;
  margin-bottom: 0.875rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  background: #fff;
  flex-wrap: wrap;

  .title {
    font-weight: 700;
    color: ${adminColors.navy};
    font-size: 0.8125rem;
  }

  .meta {
    font-size: 0.7rem;
    color: ${adminColors.muted};
    margin-top: 0.2rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const emptyForm = (): PanelHighlightInput => ({
  title: "",
  eyebrow: "Important Notice:",
  ctaLabel: "See why",
  content: "",
  initials: "LP",
  theme: "lavender",
  iconStyle: "initials",
  placement: "top",
  active: true,
  priority: 0,
});

const AdminPanelHighlights: React.FC = () => {
  const [items, setItems] = useState<PanelHighlight[]>([]);
  const [form, setForm] = useState<PanelHighlightInput>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setItems(await fetchAdminPanelHighlights());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const theme = useMemo(() => getHighlightTheme(form.theme), [form.theme]);

  const setField = <K extends keyof PanelHighlightInput>(key: K, value: PanelHighlightInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const startEdit = (row: PanelHighlight) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      eyebrow: row.eyebrow || "",
      ctaLabel: row.ctaLabel || "See why",
      content: row.content,
      initials: row.initials || "LP",
      theme: row.theme,
      iconStyle: row.iconStyle,
      placement: row.placement,
      active: row.active,
      priority: row.priority,
    });
    setSuccess(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        await updatePanelHighlight(editingId, form);
        setSuccess("Highlight updated.");
      } else {
        await createPanelHighlight(form);
        setSuccess("Highlight created and will show for members when active.");
      }
      reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this highlight?")) return;
    try {
      await deletePanelHighlight(id);
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleActive = async (row: PanelHighlight) => {
    try {
      await updatePanelHighlight(row.id, { active: !row.active });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const iconPreview =
    form.iconStyle === "bell" ? (
      <FiBell size={14} />
    ) : form.iconStyle === "alert" ? (
      <FiAlertCircle size={14} />
    ) : form.iconStyle === "star" ? (
      <FiStar size={14} />
    ) : (
      (form.initials || "LP").slice(0, 3).toUpperCase()
    );

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Panel highlights</PageTitle>
          <PageSubtitle>
            Beautiful notice banners for the member panel — with a “See why” detail page members can open
          </PageSubtitle>
        </PageTitleGroup>
        {editingId && (
          <GhostButton type="button" onClick={reset}>
            <FiPlus /> New highlight
          </GhostButton>
        )}
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {success && <SuccessBanner>{success}</SuccessBanner>}

      <Layout>
        <SectionCard>
          <SectionHead>
            <h2>{editingId ? "Edit highlight" : "Create highlight"}</h2>
          </SectionHead>
          <SectionBody>
            <form onSubmit={onSave}>
              <Field>
                Eyebrow (optional lead-in)
                <input
                  value={form.eyebrow || ""}
                  onChange={(e) => setField("eyebrow", e.target.value)}
                  placeholder="Important Notice:"
                  maxLength={80}
                />
              </Field>
              <Field>
                Banner title
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="JustMarkets is no longer supported on LegendPips."
                  required
                  maxLength={220}
                />
              </Field>
              <Field>
                See why page content
                <textarea
                  value={form.content}
                  onChange={(e) => setField("content", e.target.value)}
                  placeholder={"Write the full explanation.\n\nUse a blank line between paragraphs."}
                  required
                />
                <small>Blank lines become paragraphs on the detail page.</small>
              </Field>

              <Row2>
                <Field>
                  CTA button label
                  <input
                    value={form.ctaLabel || ""}
                    onChange={(e) => setField("ctaLabel", e.target.value)}
                    placeholder="See why"
                    maxLength={40}
                  />
                </Field>
                <Field>
                  Initials (circle)
                  <input
                    value={form.initials || ""}
                    onChange={(e) => setField("initials", e.target.value.toUpperCase().slice(0, 3))}
                    placeholder="JM"
                    maxLength={3}
                  />
                </Field>
              </Row2>

              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: adminColors.navy, marginBottom: 8 }}>
                Design theme
              </div>
              <ThemeGrid>
                {HIGHLIGHT_THEMES.map((t) => (
                  <ThemeCard
                    key={t.key}
                    type="button"
                    $bg={t.bannerBg}
                    $accent={t.accent}
                    $active={form.theme === t.key}
                    onClick={() => setField("theme", t.key as HighlightTheme)}
                  >
                    <div className="swatch" />
                    <div className="label">{t.label}</div>
                  </ThemeCard>
                ))}
              </ThemeGrid>

              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: adminColors.navy, marginBottom: 8 }}>
                Icon style
              </div>
              <IconRow>
                {(
                  [
                    ["initials", "Initials"],
                    ["bell", "Bell"],
                    ["alert", "Alert"],
                    ["star", "Star"],
                  ] as [HighlightIconStyle, string][]
                ).map(([key, label]) => (
                  <IconChip
                    key={key}
                    type="button"
                    $active={form.iconStyle === key}
                    onClick={() => setField("iconStyle", key)}
                  >
                    {key === "bell" ? <FiBell size={12} /> : null}
                    {key === "alert" ? <FiAlertCircle size={12} /> : null}
                    {key === "star" ? <FiStar size={12} /> : null}
                    {label}
                  </IconChip>
                ))}
              </IconRow>

              <Row2>
                <Field>
                  Placement
                  <select
                    value={form.placement || "top"}
                    onChange={(e) => setField("placement", e.target.value as HighlightPlacement)}
                  >
                    <option value="top">Top bar (under header)</option>
                    <option value="bottom">Bottom sticky bar</option>
                  </select>
                </Field>
                <Field>
                  Priority (higher shows first)
                  <input
                    type="number"
                    value={form.priority ?? 0}
                    onChange={(e) => setField("priority", Number(e.target.value) || 0)}
                    min={-100}
                    max={100}
                  />
                </Field>
              </Row2>

              <Field style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.active !== false}
                  onChange={(e) => setField("active", e.target.checked)}
                />
                Active (visible to members)
              </Field>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Update highlight" : "Publish highlight"}
                </PrimaryButton>
                {editingId && (
                  <GhostButton type="button" onClick={reset}>
                    Cancel
                  </GhostButton>
                )}
              </div>
            </form>
          </SectionBody>
        </SectionCard>

        <PreviewCard>
          <SectionCard>
            <SectionHead>
              <h2>Live preview</h2>
            </SectionHead>
            <SectionBody>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: adminColors.muted, marginBottom: 8 }}>
                BANNER
              </div>
              <PreviewBanner $bg={theme.bannerBg} $text={theme.text}>
                <PreviewAvatar $accent={theme.accent}>{iconPreview}</PreviewAvatar>
                <div style={{ flex: 1, minWidth: 120, fontSize: "0.78rem", lineHeight: 1.4 }}>
                  {form.eyebrow ? <strong>{form.eyebrow} </strong> : null}
                  {form.title || "Your title appears here"}
                </div>
                <PreviewCta $bg={theme.ctaBg} $color={theme.ctaText}>
                  {form.ctaLabel || "See why"}
                </PreviewCta>
                <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Close</span>
              </PreviewBanner>

              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: adminColors.muted, marginBottom: 8 }}>
                SEE WHY PAGE
              </div>
              <PreviewDetail $hero={theme.detailHero}>
                <div className="hero">
                  <div className="eye">{form.eyebrow || "Highlight"}</div>
                  <h3>{form.title || "Detail title"}</h3>
                </div>
                <div className="body">
                  {form.content || "Full explanation content will render here with paragraph spacing."}
                </div>
              </PreviewDetail>
            </SectionBody>
          </SectionCard>
        </PreviewCard>
      </Layout>

      <SectionCard style={{ marginTop: "1rem" }}>
        <SectionHead>
          <h2>All highlights</h2>
          <GhostButton $sm type="button" onClick={load} disabled={loading}>
            Refresh
          </GhostButton>
        </SectionHead>
        <SectionBody>
          {loading && <p style={{ margin: 0, color: adminColors.muted, fontSize: "0.875rem" }}>Loading…</p>}
          {!loading && items.length === 0 && (
            <p style={{ margin: 0, color: adminColors.muted, fontSize: "0.875rem" }}>
              No highlights yet. Create one above.
            </p>
          )}
          <List>
            {items.map((row) => (
              <ListItem key={row.id}>
                <div>
                  <div className="title">{row.title}</div>
                  <div className="meta">
                    {row.placement === "bottom" ? "Bottom" : "Top"} · {row.theme} · priority {row.priority}
                    {row.eyebrow ? ` · ${row.eyebrow}` : ""}
                  </div>
                </div>
                <Actions>
                  <Pill $variant={row.active ? "active" : "default"}>
                    {row.active ? "Active" : "Off"}
                  </Pill>
                  <GhostButton $sm type="button" onClick={() => toggleActive(row)}>
                    {row.active ? "Disable" : "Enable"}
                  </GhostButton>
                  <GhostButton $sm type="button" onClick={() => startEdit(row)}>
                    <FiEdit2 /> Edit
                  </GhostButton>
                  <GhostButton $sm type="button" onClick={() => onDelete(row.id)}>
                    <FiTrash2 /> Delete
                  </GhostButton>
                </Actions>
              </ListItem>
            ))}
          </List>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default AdminPanelHighlights;
