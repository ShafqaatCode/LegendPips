import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiZap } from "react-icons/fi";
import {
  checkInStreak,
  fetchMyStreak,
  updateMyStreak,
  type TradingStreak,
} from "../../../services/streakService";
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

const MyStreak: React.FC = () => {
  const [streak, setStreak] = useState<TradingStreak | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [note, setNote] = useState("");

  const apply = (s: TradingStreak) => {
    setStreak(s);
    setDisplayName(s.displayName || "");
    setVisibility(s.visibility || "public");
    setNote(s.note || "");
  };

  const load = useCallback(async () => {
    try {
      apply(await fetchMyStreak());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCheckIn = async () => {
    setError(null);
    setOk(null);
    setBusy(true);
    try {
      const res = await checkInStreak(note || undefined);
      apply(res.streak);
      setOk(res.message || "Checked in.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check-in failed");
    } finally {
      setBusy(false);
    }
  };

  const onSaveSettings = async () => {
    setError(null);
    setOk(null);
    setBusy(true);
    try {
      apply(await updateMyStreak({ displayName, visibility, note }));
      setOk("Streak settings saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Trading streak</PageTitle>
          <PageSubtitle>
            Check in once per day after you follow your plan. Public streaks appear on{" "}
            <Link to="/streaks">/streaks</Link>.
          </PageSubtitle>
        </div>
      </PageHeader>

      <HintBar>
        Streaks reward discipline — showing up and sticking to rules — not P&amp;L. Miss a day and the current count
        resets.
      </HintBar>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {ok && <HintBar>{ok}</HintBar>}

      <SectionCard>
        <SectionHead>
          <h3>
            <FiZap /> Your fire
          </h3>
        </SectionHead>
        <SectionBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <StatBox>
              <b style={{ display: "block", fontSize: "1.35rem", color: "#132e58" }}>
                {streak?.currentStreak ?? 0}
              </b>
              Current
            </StatBox>
            <StatBox>
              <b style={{ display: "block", fontSize: "1.35rem", color: "#132e58" }}>
                {streak?.longestStreak ?? 0}
              </b>
              Best
            </StatBox>
            <StatBox>
              <b style={{ display: "block", fontSize: "1.35rem", color: "#132e58" }}>
                {streak?.totalCheckIns ?? 0}
              </b>
              Total check-ins
            </StatBox>
          </div>
          <PrimaryButton type="button" onClick={onCheckIn} disabled={busy || !!streak?.checkedInToday}>
            {streak?.checkedInToday ? (
              <>
                <FiCheck /> Checked in today
              </>
            ) : (
              <>
                <FiZap /> Check in for today
              </>
            )}
          </PrimaryButton>
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead>
          <h3>Settings</h3>
        </SectionHead>
        <SectionBody>
          <FormGrid>
            <Field>
              <label>Display name on leaderboard</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </Field>
            <Field>
              <label>Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </Field>
            <Field style={{ gridColumn: "1 / -1" }}>
              <label>Today&apos;s note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Followed my plan / skipped revenge trades…"
              />
            </Field>
          </FormGrid>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GhostButton type="button" onClick={onSaveSettings} disabled={busy}>
              Save settings
            </GhostButton>
            <Link to="/streaks" style={{ alignSelf: "center", fontWeight: 700, color: "#132e58" }}>
              View leaderboard
            </Link>
          </div>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default MyStreak;

const StatBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: "12px 14px",
      fontSize: 12,
      color: "#64748b",
    }}
  >
    {children}
  </div>
);
