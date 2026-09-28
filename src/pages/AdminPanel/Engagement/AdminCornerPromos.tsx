import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FiEdit2, FiGift, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  createCornerPromo,
  deleteCornerPromo,
  fetchAdminCornerPromos,
  updateCornerPromo,
  type CornerPromo,
  type CornerPromoInput,
  type CornerPromoSide,
} from "../../../services/cornerPromoService";
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

const emptyForm = (side: CornerPromoSide = "left"): CornerPromoInput => ({
  side,
  name: "",
  logoUrl: "",
  headline: side === "left" ? "" : "",
  body: "",
  discountCode: "",
  discountPercent: "",
  ctaLabel: side === "left" ? "Buy" : "View Broker",
  ctaUrl: "",
  active: true,
  sortOrder: 0,
});

const AdminCornerPromos: React.FC = () => {
  const [tab, setTab] = useState<CornerPromoSide>("left");
  const [items, setItems] = useState<CornerPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CornerPromoInput>(emptyForm("left"));

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setItems(await fetchAdminCornerPromos(tab));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
    setEditingId(null);
    setForm(emptyForm(tab));
  }, [load, tab]);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm(tab));
  };

  const startEdit = (row: CornerPromo) => {
    setEditingId(row.id);
    setForm({
      side: row.side,
      name: row.name,
      logoUrl: row.logoUrl || "",
      headline: row.headline || "",
      body: row.body,
      discountCode: row.discountCode || "",
      discountPercent: row.discountPercent || "",
      ctaLabel: row.ctaLabel,
      ctaUrl: row.ctaUrl,
      active: row.active,
      sortOrder: row.sortOrder,
      startsAt: row.startsAt || null,
      endsAt: row.endsAt || null,
    });
  };

  const onSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = { ...form, side: tab };
      if (editingId) await updateCornerPromo(editingId, payload);
      else await createCornerPromo(payload);
      setEditingId(null);
      setForm(emptyForm(tab));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this corner promo?")) return;
    try {
      await deleteCornerPromo(id);
      if (editingId === id) startNew();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const onToggle = async (row: CornerPromo) => {
    try {
      await updateCornerPromo(row.id, { active: !row.active });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>
            <FiGift /> Corner promos
          </PageTitle>
          <PageSubtitle>
            Full control of floating popups — left discount offers and right broker carousel slides.
          </PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Tabs>
        <TabBtn type="button" $on={tab === "left"} onClick={() => setTab("left")}>
          Left — Discount promo
        </TabBtn>
        <TabBtn type="button" $on={tab === "right"} onClick={() => setTab("right")}>
          Right — Broker carousel
        </TabBtn>
      </Tabs>

      <Layout>
        <SectionCard>
          <SectionHead>
            <h3>{editingId ? "Edit promo" : "New promo"}</h3>
            {editingId && (
              <GhostButton $sm type="button" onClick={startNew}>
                Cancel edit
              </GhostButton>
            )}
          </SectionHead>
          <SectionBody>
            <Field>
              Name / firm
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="OneFunded"
              />
            </Field>
            <Field>
              Logo URL (optional)
              <input
                value={form.logoUrl || ""}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            {tab === "left" && (
              <>
                <Field>
                  Headline
                  <input
                    value={form.headline || ""}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="15% OFF — Cut costs from day one"
                  />
                </Field>
                <Row2>
                  <Field>
                    Discount %
                    <input
                      value={form.discountPercent || ""}
                      onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                      placeholder="15%"
                    />
                  </Field>
                  <Field>
                    Discount code
                    <input
                      value={form.discountCode || ""}
                      onChange={(e) => setForm({ ...form, discountCode: e.target.value })}
                      placeholder="LEGENDPIPS"
                    />
                  </Field>
                </Row2>
              </>
            )}
            <Field>
              Body
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder={
                  tab === "left"
                    ? "Start your journey with a lower entry fee…"
                    : "Could return up to $1.5 per lot. Check rebate options."
                }
              />
            </Field>
            <Row2>
              <Field>
                CTA label
                <input
                  value={form.ctaLabel || ""}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  placeholder={tab === "left" ? "Buy" : "View Broker"}
                />
              </Field>
              <Field>
                Sort order
                <input
                  type="number"
                  value={form.sortOrder ?? 0}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </Field>
            </Row2>
            <Field>
              CTA URL
              <input
                value={form.ctaUrl}
                onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                placeholder="/rebates/broker/… or https://…"
              />
              <small>Internal path or full URL.</small>
            </Field>
            <CheckRow>
              <label>
                <input
                  type="checkbox"
                  checked={!!form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Active (show on site)
              </label>
            </CheckRow>
            <PrimaryButton type="button" onClick={onSave} disabled={saving}>
              <FiPlus /> {saving ? "Saving…" : editingId ? "Update promo" : "Create promo"}
            </PrimaryButton>
          </SectionBody>
        </SectionCard>

        <SectionCard>
          <SectionHead>
            <h3>
              {tab === "left" ? "Left popups" : "Right slides"} ({loading ? "…" : items.length})
            </h3>
            <GhostButton $sm type="button" onClick={load}>
              Refresh
            </GhostButton>
          </SectionHead>
          <SectionBody>
            {items.length === 0 && !loading && (
              <p style={{ margin: 0, color: adminColors.muted, fontSize: "0.85rem" }}>
                No promos yet. Create one on the left.
              </p>
            )}
            <List>
              {items.map((row) => (
                <Item key={row.id}>
                  <div>
                    <strong>{row.name}</strong>
                    <Meta>
                      {row.headline || row.body.slice(0, 80)}
                      {row.discountCode ? ` · code ${row.discountCode}` : ""}
                    </Meta>
                    <Pill $variant={row.active ? "approved" : "default"}>
                      {row.active ? "Active" : "Off"} · order {row.sortOrder}
                    </Pill>
                  </div>
                  <Actions>
                    <GhostButton $sm type="button" onClick={() => startEdit(row)}>
                      <FiEdit2 /> Edit
                    </GhostButton>
                    <GhostButton $sm type="button" onClick={() => onToggle(row)}>
                      {row.active ? "Disable" : "Enable"}
                    </GhostButton>
                    <GhostButton $sm type="button" onClick={() => onDelete(row.id)}>
                      <FiTrash2 />
                    </GhostButton>
                  </Actions>
                </Item>
              ))}
            </List>
          </SectionBody>
        </SectionCard>
      </Layout>
    </PageWrap>
  );
};

export default AdminCornerPromos;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const TabBtn = styled.button<{ $on?: boolean }>`
  border: 1px solid ${({ $on }) => ($on ? adminColors.navy : adminColors.border)};
  background: ${({ $on }) => ($on ? adminColors.navy : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : adminColors.navy)};
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
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
    min-height: 90px;
    resize: vertical;
    line-height: 1.45;
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
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CheckRow = styled.div`
  margin-bottom: 0.85rem;
  label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: ${adminColors.navy};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 0.85rem;
  border: 1px solid ${adminColors.border};
  border-radius: 10px;
  background: #f8fafc;

  strong {
    display: block;
    color: ${adminColors.navy};
    margin-bottom: 0.2rem;
  }
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: ${adminColors.muted};
  margin-bottom: 0.35rem;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: flex-start;
`;
