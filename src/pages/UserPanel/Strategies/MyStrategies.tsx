import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiEye, FiEyeOff, FiPlus, FiSend, FiTrash2 } from "react-icons/fi";
import {
  createStrategy,
  deleteMyStrategy,
  fetchMyStrategies,
  submitMyStrategy,
  updateMyStrategy,
  type StrategyMarket,
  type StrategyRisk,
  type StrategyTimeframe,
  type TradingStrategy,
} from "../../../services/strategyService";
import { findContentSafetyIssue } from "../../../utils/contentSafety";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  PageSubtitle,
  HintBar,
  ErrorBanner,
  SectionCard,
  SectionHead,
  SectionBody,
  FormGrid,
  Field,
  PrimaryButton,
  GhostButton,
} from "../../../components/UserPanel/userUi";

const MARKETS: StrategyMarket[] = ["forex", "crypto", "indices", "commodities"];
const TIMEFRAMES: StrategyTimeframe[] = ["scalp", "intraday", "swing", "position"];
const RISKS: StrategyRisk[] = ["low", "medium", "high"];

const emptyForm = () => ({
  title: "",
  summary: "",
  content: "",
  entryRules: "",
  exitRules: "",
  riskRules: "",
  markets: [] as StrategyMarket[],
  timeframe: "intraday" as StrategyTimeframe,
  riskLevel: "medium" as StrategyRisk,
  tags: "",
  claimedWinRatePercent: "",
  claimedRoiPercent: "",
  published: false,
});

const MyStrategies: React.FC = () => {
  const [items, setItems] = useState<TradingStrategy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const load = useCallback(async () => {
    try {
      setItems(await fetchMyStrategies());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
    setOk(null);
    setError(null);
  };

  const startEdit = (s: TradingStrategy) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      summary: s.summary || "",
      content: s.content,
      entryRules: s.entryRules || "",
      exitRules: s.exitRules || "",
      riskRules: s.riskRules || "",
      markets: s.markets || [],
      timeframe: s.timeframe,
      riskLevel: s.riskLevel,
      tags: (s.tags || []).join(", "),
      claimedWinRatePercent: s.claimedWinRatePercent != null ? String(s.claimedWinRatePercent) : "",
      claimedRoiPercent: s.claimedRoiPercent != null ? String(s.claimedRoiPercent) : "",
      published: s.published,
    });
    setShowForm(true);
    setOk(null);
    setError(null);
  };

  const toggleMarket = (m: StrategyMarket) => {
    setForm((f) => ({
      ...f,
      markets: f.markets.includes(m) ? f.markets.filter((x) => x !== m) : [...f.markets, m],
    }));
  };

  const onSave = async () => {
    setError(null);
    setOk(null);
    const safety = findContentSafetyIssue(
      `${form.title}\n${form.summary}\n${form.content}\n${form.entryRules}\n${form.exitRules}\n${form.riskRules}`
    );
    if (safety) {
      setError(safety);
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: form.title,
        summary: form.summary || undefined,
        content: form.content,
        entryRules: form.entryRules || undefined,
        exitRules: form.exitRules || undefined,
        riskRules: form.riskRules || undefined,
        markets: form.markets,
        timeframe: form.timeframe,
        riskLevel: form.riskLevel,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        claimedWinRatePercent:
          form.claimedWinRatePercent === "" ? undefined : Number(form.claimedWinRatePercent),
        claimedRoiPercent: form.claimedRoiPercent === "" ? undefined : Number(form.claimedRoiPercent),
        published: form.published,
      };
      if (editingId) {
        await updateMyStrategy(editingId, body);
        setOk(
          body.published
            ? "Saved and submitted for admin review."
            : "Strategy saved as draft."
        );
      } else {
        await createStrategy(body);
        setOk(
          body.published
            ? "Submitted for admin review. It goes live after approval."
            : "Draft saved."
        );
      }
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onSubmitReview = async (s: TradingStrategy) => {
    try {
      await submitMyStrategy(s.id);
      await load();
      setOk("Submitted for admin review.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    }
  };

  const onUnpublish = async (s: TradingStrategy) => {
    try {
      await updateMyStrategy(s.id, { published: false });
      await load();
      setOk("Strategy pulled from public / review queue.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this strategy?")) return;
    try {
      await deleteMyStrategy(id);
      await load();
      setOk("Strategy deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>My strategies</PageTitle>
          <PageSubtitle>
            Share profitable setups with the community. Strategies go live on{" "}
            <Link to="/strategies">/strategies</Link> only after admin approval.
          </PageSubtitle>
        </div>
        <PrimaryButton type="button" onClick={startNew}>
          <FiPlus /> New strategy
        </PrimaryButton>
      </PageHeader>

      <HintBar>
        Be honest about risk. Self-reported win rate and ROI help others compare — don&apos;t pad the numbers.
      </HintBar>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {ok && <HintBar>{ok}</HintBar>}

      {showForm && (
        <SectionCard>
          <SectionHead>
            <h3>{editingId ? "Edit strategy" : "Share a strategy"}</h3>
            <GhostButton type="button" onClick={() => setShowForm(false)}>
              Cancel
            </GhostButton>
          </SectionHead>
          <SectionBody>
            <FormGrid>
              <Field>
                <label>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. London breakout with tight stops"
                />
              </Field>
              <Field>
                <label>Short summary</label>
                <input
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="One-line pitch"
                />
              </Field>
              <Field style={{ gridColumn: "1 / -1" }}>
                <label>How it works *</label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Describe the setup, session, instruments, and why it works for you…"
                />
              </Field>
              <Field>
                <label>Entry rules</label>
                <textarea
                  rows={3}
                  value={form.entryRules}
                  onChange={(e) => setForm({ ...form, entryRules: e.target.value })}
                />
              </Field>
              <Field>
                <label>Exit rules</label>
                <textarea
                  rows={3}
                  value={form.exitRules}
                  onChange={(e) => setForm({ ...form, exitRules: e.target.value })}
                />
              </Field>
              <Field style={{ gridColumn: "1 / -1" }}>
                <label>Risk management</label>
                <textarea
                  rows={3}
                  value={form.riskRules}
                  onChange={(e) => setForm({ ...form, riskRules: e.target.value })}
                />
              </Field>
              <Field>
                <label>Markets</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {MARKETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMarket(m)}
                      style={{
                        cursor: "pointer",
                        border: form.markets.includes(m) ? "1px solid #fbbf24" : "1px solid #e2e8f0",
                        background: form.markets.includes(m) ? "#fef3c7" : "#f8fafc",
                        borderRadius: 999,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                        color: "#132e58",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>
              <Field>
                <label>Timeframe</label>
                <select
                  value={form.timeframe}
                  onChange={(e) => setForm({ ...form, timeframe: e.target.value as StrategyTimeframe })}
                >
                  {TIMEFRAMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <label>Risk level</label>
                <select
                  value={form.riskLevel}
                  onChange={(e) => setForm({ ...form, riskLevel: e.target.value as StrategyRisk })}
                >
                  {RISKS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <label>Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="breakout, smc, news"
                />
              </Field>
              <Field>
                <label>Claimed win rate %</label>
                <input
                  type="number"
                  value={form.claimedWinRatePercent}
                  onChange={(e) => setForm({ ...form, claimedWinRatePercent: e.target.value })}
                />
              </Field>
              <Field>
                <label>Claimed ROI %</label>
                <input
                  type="number"
                  value={form.claimedRoiPercent}
                  onChange={(e) => setForm({ ...form, claimedRoiPercent: e.target.value })}
                />
              </Field>
              <Field>
                <label>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  />{" "}
                  Submit for admin review (required before going public)
                </label>
              </Field>
            </FormGrid>
            <div style={{ marginTop: 12 }}>
              <PrimaryButton type="button" onClick={onSave} disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save strategy" : form.published ? "Submit for review" : "Save draft"}
              </PrimaryButton>
            </div>
          </SectionBody>
        </SectionCard>
      )}

      <SectionCard>
        <SectionHead>
          <h3>Your strategies ({items.length})</h3>
        </SectionHead>
        <SectionBody>
          {items.length === 0 && <p style={{ color: "#64748b", margin: 0 }}>No strategies yet. Share your first one.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <strong style={{ color: "#132e58" }}>{s.title}</strong>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    <StatusLabel status={s.moderationStatus} /> · {s.likeCount} likes · {s.viewCount} views
                    {s.moderationStatus === "approved" && (
                      <>
                        {" · "}
                        <Link to={`/strategies/${s.id}`}>View public page</Link>
                      </>
                    )}
                    {s.moderationStatus === "rejected" && s.adminNote && (
                      <div style={{ color: "#b91c1c", marginTop: 4 }}>Admin: {s.adminNote}</div>
                    )}
                    {s.moderationStatus === "pending" && (
                      <div style={{ color: "#b45309", marginTop: 4 }}>Waiting for admin approval…</div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <GhostButton type="button" onClick={() => startEdit(s)}>
                    <FiEdit2 /> Edit
                  </GhostButton>
                  {(s.moderationStatus === "draft" || s.moderationStatus === "rejected") && (
                    <GhostButton type="button" onClick={() => onSubmitReview(s)}>
                      <FiSend /> Submit for review
                    </GhostButton>
                  )}
                  {(s.moderationStatus === "pending" || s.moderationStatus === "approved") && (
                    <GhostButton type="button" onClick={() => onUnpublish(s)}>
                      <FiEyeOff /> Unpublish
                    </GhostButton>
                  )}
                  <GhostButton type="button" onClick={() => onDelete(s.id)}>
                    <FiTrash2 /> Delete
                  </GhostButton>
                </div>
              </div>
            ))}
          </div>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

const StatusLabel: React.FC<{ status?: string }> = ({ status }) => {
  const label =
    status === "approved"
      ? "Approved (live)"
      : status === "pending"
        ? "Pending review"
        : status === "rejected"
          ? "Rejected"
          : "Draft";
  const color =
    status === "approved" ? "#059669" : status === "pending" ? "#b45309" : status === "rejected" ? "#b91c1c" : "#64748b";
  return <span style={{ fontWeight: 700, color }}>{label}</span>;
};

export default MyStrategies;
