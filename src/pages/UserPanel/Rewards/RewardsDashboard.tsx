import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiAward,
  FiCheck,
  FiChevronRight,
  FiGift,
  FiLock,
  FiShield,
  FiZap,
} from "react-icons/fi";
import {
  checkInStreak,
  claimStreakMilestone,
  fetchMyRewardsDashboard,
  type RewardsDashboard as RewardsDashboardData,
} from "../../../services/streakService";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  PageSubtitle,
  HintBar,
  ErrorBanner,
  PrimaryButton,
  GhostButton,
} from "../../../components/UserPanel/userUi";
import { ShimmerBar } from "../../../components/SharedComponents/Shimmer";

const RewardsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<RewardsDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await fetchMyRewardsDashboard());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (loading || !data) return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [loading, data]);

  const onCheckIn = async () => {
    if (busy || data?.streak.checkedInToday) return;
    setBusy(true);
    setOk(null);
    setError(null);
    try {
      const res = await checkInStreak();
      setOk(res.message || "Checked in.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check-in failed");
    } finally {
      setBusy(false);
    }
  };

  const onClaim = async (days: number) => {
    if (busy) return;
    setBusy(true);
    setOk(null);
    setError(null);
    try {
      const res = await claimStreakMilestone(days);
      setOk(res.message || "Milestone claimed.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  };

  const streak = data?.streak;
  const nextUnlock = data?.unlockPath.next;
  const nextMs = streak?.nextMilestone;

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Rewards & streak</PageTitle>
          <PageSubtitle>
            Earn Legend Points (LP), climb trader levels, unlock gift paths, and keep your trading streak alive.
          </PageSubtitle>
        </div>
        <HeaderActions>
          <LpPill>
            <strong>{loading ? "…" : data?.wallet.availableLp ?? 0}</strong> LP available
          </LpPill>
          <GhostButton type="button" $sm onClick={() => navigate("/streaks")}>
            Public board <FiChevronRight />
          </GhostButton>
        </HeaderActions>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {ok && <HintBar>{ok}</HintBar>}

      {/* Unlock path */}
      <UnlockHero>
        <UnlockBadge>
          <FiAward /> Reward unlock path
        </UnlockBadge>
        <UnlockGrid>
          <div>
            <h2>{data?.unlockPath.headline || "Hold for the reward path you really want"}</h2>
            <p>
              {data?.unlockPath.body ||
                "Reach LP targets to unlock gift and cash reward tiers. Redeem when ready — or keep climbing."}
            </p>
          </div>
          <TowardCard>
            <span className="label">
              Toward {nextUnlock?.label || "max tier"}
            </span>
            <strong>
              {loading ? "…" : data?.wallet.availableLp ?? 0}
              <em> / {nextUnlock ? nextUnlock.lpRequired.toLocaleString() : "—"} LP</em>
            </strong>
            <ProgressTrack>
              <ProgressFill
                $w={
                  nextUnlock
                    ? Math.min(100, ((data?.wallet.availableLp || 0) / nextUnlock.lpRequired) * 100)
                    : 100
                }
              />
            </ProgressTrack>
            <span className="hint">
              {nextUnlock
                ? `${nextUnlock.remaining.toLocaleString()} LP to unlock next`
                : "All unlock tiers reached"}
            </span>
          </TowardCard>
        </UnlockGrid>

        <TierGrid>
          {(loading ? Array.from({ length: 6 }) : data?.unlockPath.tiers || []).map((t: any, i) =>
            loading ? (
              <TierCard key={i} $state="locked">
                <ShimmerBar $h="120px" $w="100%" />
              </TierCard>
            ) : (
              <TierCard key={t.tier} $state={t.unlocked ? "unlocked" : t.status === "next" ? "next" : "locked"}>
                <div className="top">
                  {t.unlocked ? <FiCheck /> : <FiLock />}
                  <span>Tier {t.tier}</span>
                </div>
                <div className="size">{t.label}</div>
                <div className="lp">{t.lpRequired.toLocaleString()} LP</div>
                <div className="meta">{t.eligible} eligible reward{t.eligible === 1 ? "" : "s"}</div>
                <div className="foot">
                  {t.unlocked ? "Unlocked" : t.remaining > 0 ? `${t.remaining.toLocaleString()} LP left` : "Locked"}
                </div>
              </TierCard>
            )
          )}
        </TierGrid>
        <UnlockFoot>
          {data?.unlockPath.unlockedCount ?? 0} of {data?.unlockPath.totalTiers ?? 9} reward tiers currently unlocked ·
          LP is spent only when you redeem a gift/cash reward through support.
        </UnlockFoot>
      </UnlockHero>

      {/* Earn LP */}
      <Section>
        <SectionTitle>Earn LP toward your next unlock</SectionTitle>
        <TaskList>
          {(data?.earnTasks || []).map((task) => (
            <TaskRow key={task.id} $done={task.done} to={task.href}>
              <span className="check">{task.done ? <FiCheck /> : null}</span>
              <span className="title">{task.title}</span>
              <span className="lp">+{task.lp} LP</span>
              <FiChevronRight className="arrow" />
            </TaskRow>
          ))}
          {loading && <ShimmerBar $h="48px" $w="100%" />}
        </TaskList>
      </Section>

      {/* Trader levels */}
      <Section>
        <SectionTitle>Trader levels</SectionTitle>
        <LevelNote>
          Levels come from lifetime LP — streak check-ins, milestones, and real participation.
          {data?.traderLevels.progressToNext
            ? ` · ${data.traderLevels.progressToNext.remaining.toLocaleString()} LP to ${data.traderLevels.next?.name}`
            : ""}
        </LevelNote>
        <LevelRow>
          {(data?.traderLevels.levels || []).map((lvl) => (
            <LevelCard key={lvl.id} $current={lvl.current} $unlocked={lvl.unlocked}>
              <div className="icon">{lvl.current ? <FiAward /> : lvl.unlocked ? <FiCheck /> : <FiLock />}</div>
              <div className="lvl">Level {String(lvl.level).padStart(2, "0")}</div>
              <strong>{lvl.name}</strong>
              <em>{lvl.minLp.toLocaleString()} LP</em>
              <p>{lvl.perk}</p>
            </LevelCard>
          ))}
        </LevelRow>
      </Section>

      {/* Trading streak */}
      <Section id="trading-streak">
        <StreakHead>
          <div>
            <SectionTitle style={{ margin: 0 }}>Trading streak</SectionTitle>
            <LevelNote style={{ marginTop: 6 }}>
              Complete one meaningful check-in each day. Login alone does not count. Grace window:{" "}
              {data?.streakBoard.graceHours ?? 6} hours after midnight UTC.
            </LevelNote>
          </div>
          <StreakBadge>
            <FiZap /> {streak?.currentStreak ?? 0} day streak
          </StreakBadge>
        </StreakHead>

        <MetricGrid>
          <MetricCard $tone="gold">
            <div className="icon"><FiZap /></div>
            <strong>{streak?.currentStreak ?? 0} days</strong>
            <span>{streak?.checkedInToday ? "Checked in today" : "Complete an activity to begin"}</span>
          </MetricCard>
          <MetricCard $tone="green">
            <div className="icon"><FiAward /></div>
            <strong>{streak?.longestStreak ?? 0} days</strong>
            <span>Personal best</span>
          </MetricCard>
          <MetricCard $tone="navy">
            <div className="icon"><FiGift /></div>
            <strong>{nextMs ? `${nextMs.days} day milestone` : "All clear"}</strong>
            <span>
              {nextMs ? `${nextMs.lp} LP · ${nextMs.daysLeft} days left` : "Milestones claimed"}
            </span>
          </MetricCard>
          <MetricCard $tone="soft">
            <div className="icon"><FiShield /></div>
            <strong>{streak?.shields ?? 0} shields</strong>
            <span>Earn one after every {data?.streakBoard.shieldEveryDays ?? 30} check-ins</span>
          </MetricCard>
        </MetricGrid>

        <ProgressBlock>
          <div className="row">
            <strong>Progress to {streak?.progressToNext?.target || 14}-day consistency</strong>
            <span>
              {streak?.progressToNext?.current ?? 0} / {streak?.progressToNext?.target ?? 14} days
            </span>
          </div>
          <ProgressTrack>
            <ProgressFill
              $w={
                streak?.progressToNext?.target
                  ? Math.min(100, ((streak.progressToNext.current || 0) / streak.progressToNext.target) * 100)
                  : 0
              }
            />
          </ProgressTrack>
        </ProgressBlock>

        <CheckInRow>
          <PrimaryButton type="button" disabled={busy || !!streak?.checkedInToday} onClick={onCheckIn}>
            <FiZap />
            {streak?.checkedInToday ? "Checked in today" : `Check in · +${data?.streakBoard.checkInLp ?? 5} LP`}
          </PrimaryButton>
          <GhostButton type="button" onClick={() => navigate("/streaks")}>
            View public leaderboard
          </GhostButton>
        </CheckInRow>

        <MilestoneGrid>
          {(data?.streakBoard.milestones || []).map((m) => (
            <MilestoneCard key={m.days} $status={m.status}>
              <div className="tag">{m.days}d</div>
              <strong>{m.title}</strong>
              <em>{m.lp} LP</em>
              <p>{m.blurb}</p>
              {m.status === "claimable" ? (
                <PrimaryButton type="button" $sm disabled={busy} onClick={() => onClaim(m.days)}>
                  Claim reward
                </PrimaryButton>
              ) : (
                <span className="status">
                  {m.status === "claimed" ? "Claimed" : "Badge locked"}
                </span>
              )}
            </MilestoneCard>
          ))}
        </MilestoneGrid>
      </Section>
    </PageWrap>
  );
};

export default RewardsDashboard;

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
`;

const LpPill = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: linear-gradient(145deg, #132e58, #1a3d6e);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;

  strong {
    color: #fbc113;
    font-size: 1rem;
    font-weight: 800;
  }
`;

const UnlockHero = styled.section`
  margin-bottom: 1.25rem;
  padding: 1.35rem 1.25rem 1.15rem;
  border-radius: 18px;
  background: linear-gradient(145deg, #0b1830 0%, #132e58 55%, #1a3d6e 100%);
  color: #fff;
  border: 1px solid rgba(251, 193, 19, 0.22);
  box-shadow: 0 14px 36px rgba(19, 46, 88, 0.18);
`;

const UnlockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(251, 193, 19, 0.16);
  color: #fbc113;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.85rem;
`;

const UnlockGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 1rem;
  margin-bottom: 1.15rem;

  h2 {
    margin: 0 0 0.45rem;
    font-size: clamp(1.25rem, 2vw, 1.55rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.78);
    max-width: 36rem;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const TowardCard = styled.div`
  padding: 1rem 1.05rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);

  .label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 0.35rem;
  }

  strong {
    display: block;
    font-size: 1.35rem;
    font-weight: 800;
    color: #fbc113;
    em {
      font-style: normal;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
    }
  }

  .hint {
    display: block;
    margin-top: 0.45rem;
    font-size: 0.72rem;
    color: #fbc113;
    font-weight: 600;
  }
`;

const ProgressTrack = styled.div`
  margin-top: 0.65rem;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $w: number }>`
  height: 100%;
  width: ${({ $w }) => `${Math.max(0, Math.min(100, $w))}%`};
  border-radius: 999px;
  background: linear-gradient(90deg, #fbc113, #f4b400);
  transition: width 0.35s ease;
`;

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.65rem;
`;

const TierCard = styled.div<{ $state: string }>`
  padding: 0.9rem 0.85rem;
  border-radius: 14px;
  background: ${({ $state }) =>
    $state === "next"
      ? "rgba(251, 193, 19, 0.12)"
      : $state === "unlocked"
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.18)"};
  border: 1px solid
    ${({ $state }) =>
      $state === "next"
        ? "rgba(251, 193, 19, 0.55)"
        : $state === "unlocked"
          ? "rgba(255, 255, 255, 0.16)"
          : "rgba(255, 255, 255, 0.08)"};

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.68rem;
    font-weight: 800;
    color: ${({ $state }) => ($state === "next" ? "#fbc113" : "rgba(255,255,255,0.55)")};
    text-transform: uppercase;
    margin-bottom: 0.55rem;
  }

  .size {
    font-size: 1.05rem;
    font-weight: 800;
    color: #fff;
  }

  .lp {
    margin-top: 0.2rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #fbc113;
  }

  .meta {
    margin-top: 0.35rem;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.55);
  }

  .foot {
    margin-top: 0.65rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: ${({ $state }) => ($state === "unlocked" ? "#86efac" : "rgba(255,255,255,0.5)")};
  }
`;

const UnlockFoot = styled.p`
  margin: 0.9rem 0 0;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.55);
`;

const Section = styled.section`
  margin-bottom: 1.25rem;
  padding: 1.2rem 1.15rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: #132e58;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TaskRow = styled(Link)<{ $done?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  text-decoration: none;
  background: ${({ $done }) => ($done ? "rgba(34, 197, 94, 0.06)" : "#f8fafc")};
  border: 1px solid ${({ $done }) => ($done ? "rgba(34, 197, 94, 0.25)" : "#eef2f7")};

  .check {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${({ $done }) => ($done ? "#16a34a" : "#e2e8f0")};
    color: #fff;
    font-size: 0.85rem;
  }

  .title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #132e58;
  }

  .lp {
    font-size: 0.75rem;
    font-weight: 800;
    color: #132e58;
    background: rgba(251, 193, 19, 0.2);
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
  }

  .arrow {
    color: #94a3b8;
  }
`;

const LevelNote = styled.p`
  margin: -0.35rem 0 0.9rem;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.45;
`;

const LevelRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(160px, 1fr);
  gap: 0.65rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const LevelCard = styled.div<{ $current?: boolean; $unlocked?: boolean }>`
  min-width: 160px;
  padding: 0.95rem 0.85rem;
  border-radius: 14px;
  border: 1px solid
    ${({ $current }) => ($current ? "rgba(251, 193, 19, 0.55)" : "#e8ecf1")};
  background: ${({ $current }) =>
    $current ? "linear-gradient(165deg, #132e58, #1a3d6e)" : "#fff"};
  color: ${({ $current }) => ($current ? "#fff" : "#132e58")};

  .icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.55rem;
    background: ${({ $current }) => ($current ? "rgba(251, 193, 19, 0.2)" : "#f1f5f9")};
    color: ${({ $current, $unlocked }) => ($current ? "#fbc113" : $unlocked ? "#16a34a" : "#94a3b8")};
  }

  .lvl {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  strong {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.9rem;
  }

  em {
    display: block;
    margin-top: 0.25rem;
    font-style: normal;
    font-size: 0.72rem;
    font-weight: 700;
    color: ${({ $current }) => ($current ? "#fbc113" : "#64748b")};
  }

  p {
    margin: 0.45rem 0 0;
    font-size: 0.7rem;
    line-height: 1.4;
    opacity: 0.8;
  }
`;

const StreakHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StreakBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(251, 193, 19, 0.16);
  color: #132e58;
  font-size: 0.75rem;
  font-weight: 800;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MetricCard = styled.div<{ $tone: string }>`
  padding: 0.95rem 0.9rem;
  border-radius: 14px;
  border: 1px solid #e8ecf1;
  background: #fff;

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.55rem;
    background: ${({ $tone }) =>
      $tone === "gold"
        ? "rgba(251, 193, 19, 0.2)"
        : $tone === "green"
          ? "rgba(34, 197, 94, 0.12)"
          : $tone === "navy"
            ? "rgba(19, 46, 88, 0.1)"
            : "#f1f5f9"};
    color: ${({ $tone }) =>
      $tone === "gold" ? "#a16207" : $tone === "green" ? "#15803d" : $tone === "navy" ? "#132e58" : "#64748b"};
  }

  strong {
    display: block;
    font-size: 0.95rem;
    color: #132e58;
  }

  span {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.72rem;
    color: #64748b;
  }
`;

const ProgressBlock = styled.div`
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #eef2f7;

  .row {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.55rem;
    font-size: 0.82rem;
    strong {
      color: #132e58;
    }
    span {
      color: #64748b;
      font-weight: 600;
    }
  }

  ${ProgressTrack} {
    background: #e2e8f0;
  }
`;

const CheckInRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1.1rem;
`;

const MilestoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.65rem;
`;

const MilestoneCard = styled.div<{ $status: string }>`
  padding: 1rem 0.9rem;
  border-radius: 14px;
  border: 1px solid
    ${({ $status }) =>
      $status === "claimable"
        ? "rgba(251, 193, 19, 0.5)"
        : $status === "claimed"
          ? "rgba(34, 197, 94, 0.35)"
          : "#e8ecf1"};
  background: ${({ $status }) =>
    $status === "claimable" ? "rgba(251, 193, 19, 0.08)" : "#fff"};

  .tag {
    display: inline-flex;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: #132e58;
    color: #fbc113;
    font-size: 0.65rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  strong {
    display: block;
    font-size: 0.88rem;
    color: #132e58;
  }

  em {
    display: block;
    margin-top: 0.2rem;
    font-style: normal;
    font-size: 0.78rem;
    font-weight: 800;
    color: #a16207;
  }

  p {
    margin: 0.4rem 0 0.7rem;
    font-size: 0.72rem;
    color: #64748b;
    line-height: 1.4;
  }

  .status {
    font-size: 0.72rem;
    font-weight: 700;
    color: ${({ $status }) => ($status === "claimed" ? "#15803d" : "#94a3b8")};
  }
`;
