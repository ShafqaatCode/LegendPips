import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiAward,
  FiVideo,
  FiBook,
  FiUsers,
  FiDollarSign,
  FiChevronRight,
  FiUserPlus,
  FiShield,
  FiSettings,
  FiLink,
  FiBell,
  FiLifeBuoy,
  FiMessageCircle,
  FiZap,
  FiShuffle,
  FiSearch,
  FiBarChart2,
  FiCalendar,
  FiPlayCircle,
  FiActivity,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import {
  fetchMyDashboard,
  fetchMyActivity,
  type DashboardStat,
  type ActivityRow,
} from "../../../services/userInsightService";
import { getMyKyc, type KycStatus } from "../../../services/kycService";
import { fetchMyAccountCare, type AccountCare } from "../../../services/accountManagerService";
import { fetchMyRebateSummary, formatUsd, type RebateSummary } from "../../../services/rebateService";
import { fetchMyStreak, checkInStreak, type TradingStreak } from "../../../services/streakService";
import {
  fetchMyLiveAccountRequests,
  liveAccountStatusLabel,
  type LiveAccountRequestRow,
} from "../../../services/liveAccountService";
import { fetchPublicSignals, type ApiSignal } from "../../../services/signalService";
import { fetchUnreadNotificationCount } from "../../../services/notificationService";
import { useLocale } from "../../../contexts/LocaleContext";
import { ShimmerBar } from "../../../components/SharedComponents/Shimmer";
import AccountManagerCard from "../../../components/UserPanel/AccountManagerCard";
import RecommendedBrokerCard from "../../../components/UserPanel/RecommendedBrokerCard";
import {
  PageWrap,
  DashboardHero,
  StatsGrid,
  StatCard,
  StatIconBox,
  StatBody,
  StatValue,
  StatLabel,
  StatMeta,
  HintBar,
  ErrorBanner,
  KycStrip,
  Pill,
  GhostNavLink,
  QuickLinksGrid,
  QuickLinkCard,
  ExploreLinksGrid,
  ExploreLinkCard,
  SectionLabel,
  WidgetPanel,
  userColors,
} from "../../../components/UserPanel/userUi";
import styled, { css } from "styled-components";

const iconByKey: Record<string, React.ElementType> = {
  contests: FiAward,
  signals: FiTrendingUp,
  webinars: FiVideo,
  courses: FiBook,
  forum: FiUsers,
  rebates: FiDollarSign,
};

const STAT_I18N: Record<string, string> = {
  contests: "panel.statContests",
  signals: "panel.statSignals",
  webinars: "panel.statWebinars",
  courses: "panel.statCourses",
  forum: "panel.statForum",
  rebates: "panel.statRebates",
};

const KYC_STATUS_KEY: Record<KycStatus, string> = {
  incomplete: "panel.statusIncomplete",
  pending: "panel.statusPending",
  approved: "panel.statusApproved",
  rejected: "panel.statusRejected",
};

const KYC_HINT_KEY: Record<KycStatus, string> = {
  incomplete: "panel.kycIncomplete",
  pending: "panel.kycPending",
  approved: "panel.kycApproved",
  rejected: "panel.kycRejected",
};

type QuickItem = {
  to: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  featured?: boolean;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLocale();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activitySummary, setActivitySummary] = useState<{
    thisMonth: number;
    changeText: string;
    positive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus>("incomplete");
  const [care, setCare] = useState<AccountCare | null>(null);
  const [rebate, setRebate] = useState<RebateSummary | null>(null);
  const [streak, setStreak] = useState<TradingStreak | null>(null);
  const [streakBusy, setStreakBusy] = useState(false);
  const [liveAccounts, setLiveAccounts] = useState<LiveAccountRequestRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [signals, setSignals] = useState<ApiSignal[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, kyc, accountCare, rebateSum, streakData, accounts, activityData, signalData, unreadCount] =
          await Promise.all([
            fetchMyDashboard(),
            getMyKyc().catch(() => null),
            fetchMyAccountCare().catch(() => null),
            fetchMyRebateSummary().catch(() => null),
            fetchMyStreak().catch(() => null),
            fetchMyLiveAccountRequests().catch(() => [] as LiveAccountRequestRow[]),
            fetchMyActivity(1, 6).catch(() => null),
            fetchPublicSignals({ page: 1, limit: 4, tradeStatus: "active" }).catch(() => null),
            fetchUnreadNotificationCount().catch(() => 0),
          ]);
        if (cancelled) return;
        setStats(data.stats || []);
        setActivitySummary(data.activitySummary || null);
        if (kyc) setKycStatus(kyc.kycStatus);
        if (accountCare) setCare(accountCare);
        if (rebateSum) setRebate(rebateSum);
        if (streakData) setStreak(streakData);
        setLiveAccounts(accounts || []);
        setActivity(activityData?.items || []);
        setSignals(signalData?.items || []);
        setUnread(unreadCount || 0);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onCheckIn = useCallback(async () => {
    if (streakBusy || streak?.checkedInToday) return;
    try {
      setStreakBusy(true);
      const next = await checkInStreak();
      setStreak(next.streak);
    } catch {
      /* ignore — user can retry from streak page */
    } finally {
      setStreakBusy(false);
    }
  }, [streak?.checkedInToday, streakBusy]);

  const approvedAccounts = liveAccounts.filter((a) => a.status === "approved").length;

  const essentials: QuickItem[] = [
    {
      to: "/user-panel/live-accounts",
      title: t("panel.qlLive"),
      desc: t("panel.qlLiveD"),
      icon: FiLink,
      featured: true,
    },
    {
      to: "/user-panel/rebates",
      title: t("panel.qlRebates"),
      desc: t("panel.qlRebatesD"),
      icon: FiDollarSign,
    },
    {
      to: "/user-panel/verification",
      title: t("panel.qlKyc"),
      desc: t("panel.qlKycD"),
      icon: FiShield,
    },
    {
      to: "/find-broker",
      title: t("panel.qlFindBroker"),
      desc: t("panel.qlFindBrokerD"),
      icon: FiSearch,
    },
  ];

  const learnTools: QuickItem[] = [
    { to: "/user-panel/calendar", title: t("panel.toolCalendar"), desc: t("panel.toolCalendarD"), icon: FiCalendar },
    { to: "/user-panel/courses", title: t("panel.toolCourses"), desc: t("panel.toolCoursesD"), icon: FiBook },
    { to: "/user-panel/webinars", title: t("panel.toolWebinars"), desc: t("panel.toolWebinarsD"), icon: FiVideo },
    { to: "/user-panel/videos", title: t("panel.toolVideos"), desc: t("panel.toolVideosD"), icon: FiPlayCircle },
    { to: "/user-panel/contests", title: t("panel.toolContests"), desc: t("panel.toolContestsD"), icon: FiAward },
    { to: "/user-panel/analysis", title: t("panel.toolAnalysis"), desc: t("panel.toolAnalysisD"), icon: FiActivity },
  ];

  const moreActions: QuickItem[] = [
    { to: "/user-panel/rewards", title: "Rewards & streak", desc: "LP points, levels & check-ins", icon: FiZap },
    { to: "/rewards", title: "Rewards", desc: "Gift & cash milestones", icon: FiAward },
    { to: "/leaderboard", title: "Leaderboard", desc: "Streaks & contest ranks", icon: FiBarChart2 },
    { to: "/user-panel/signals", title: t("panel.qlSignals"), desc: t("panel.qlSignalsD"), icon: FiTrendingUp },
    { to: "/user-panel/alerts", title: t("panel.qlAlerts"), desc: t("panel.qlAlertsD"), icon: FiBell },
    { to: "/user-panel/strategies", title: t("panel.qlStrategies"), desc: t("panel.qlStrategiesD"), icon: FiBarChart2 },
    { to: "/user-panel/invite", title: t("panel.qlInvite"), desc: t("panel.qlInviteD"), icon: FiUserPlus },
    { to: "/user-panel/ib-change", title: t("panel.qlIb"), desc: t("panel.qlIbD"), icon: FiShuffle },
    { to: "/rebates", title: t("panel.qlBrokers"), desc: t("panel.qlBrokersD"), icon: FiUsers },
    { to: "/user-panel/tickets", title: t("panel.qlTickets"), desc: t("panel.qlTicketsD"), icon: FiLifeBuoy },
    { to: "/live-chat", title: t("panel.qlChat"), desc: t("panel.qlChatD"), icon: FiMessageCircle },
  ];

  const latestAccount = liveAccounts[0];

  return (
    <PageWrap>
      <DashboardHero>
        <div>
          <h1>{t("panel.welcome", { name: user?.firstName || t("panel.userFallback") })}</h1>
          <p>{t("panel.dashSub")}</p>
          <HeroMeta>
            {approvedAccounts > 0 || liveAccounts.length > 0 ? (
              <span>
                <FiLink /> {t("panel.accountsLinked", { count: String(approvedAccounts || liveAccounts.length) })}
              </span>
            ) : null}
            {unread > 0 ? (
              <Link to="/user-panel/alerts">
                <FiBell /> {t("panel.unreadAlerts", { count: String(unread) })}
              </Link>
            ) : null}
          </HeroMeta>
        </div>
        <Pill $variant={kycStatus}>{t(KYC_STATUS_KEY[kycStatus])}</Pill>
      </DashboardHero>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <LinkAccountBanner to="/user-panel/live-accounts">
        <span className="badge-icon" aria-hidden>
          <FiLink />
        </span>
        <div className="copy">
          <span className="kicker">Most important</span>
          <strong>{t("panel.linkAccountCta")}</strong>
          <p>
            {latestAccount
              ? `${latestAccount.brokerName} · ${liveAccountStatusLabel(latestAccount.status)}`
              : t("panel.linkAccountDesc")}
          </p>
        </div>
        <span className="cta">
          Open <FiChevronRight />
        </span>
      </LinkAccountBanner>

      <KycStrip $variant={kycStatus}>
        <div>
          <div className="label">{t("panel.kycTitle")}</div>
          <div className="desc">{t(KYC_HINT_KEY[kycStatus])}</div>
        </div>
        <GhostNavLink to="/user-panel/verification">
          {kycStatus === "approved" ? t("panel.viewStatus") : t("panel.manageKyc")}
          <FiChevronRight />
        </GhostNavLink>
      </KycStrip>

      {activitySummary && !loading && (
        <HintBar>
          <strong>{t("panel.activityMonth")}</strong> {activitySummary.thisMonth} {t("panel.events")}
          <span
            style={{
              color: activitySummary.positive ? "#059669" : "#dc2626",
              marginLeft: 6,
              fontWeight: 600,
            }}
          >
            ({activitySummary.changeText} {t("panel.vsLast")})
          </span>
        </HintBar>
      )}

      <WidgetPanel>
        <SectionLabel>{t("panel.snapshotTitle")}</SectionLabel>
        <SnapshotGrid>
          <SnapCardLink to="/user-panel/rebates" $accent="gold">
            <div className="head">
              <span className="icon">
                <FiDollarSign />
              </span>
              <div className="head-copy">
                <span className="eyebrow">{t("panel.rebateWallet")}</span>
                <span className="cta-inline">
                  {t("panel.rebateWithdraw")} <FiChevronRight />
                </span>
              </div>
            </div>
            <div className="hero-value">
              {loading && !rebate ? <ShimmerBar $h="32px" $w="110px" /> : formatUsd(rebate?.availableCents ?? 0)}
            </div>
            <div className="hero-label">{t("panel.rebateAvailable")}</div>
            <div className="stat-row">
              <div className="stat">
                <strong>{formatUsd(rebate?.thisMonthCents ?? 0)}</strong>
                <span>{t("panel.rebateMonth")}</span>
              </div>
              <div className="stat">
                <strong>{formatUsd(rebate?.lifetimeCents ?? 0)}</strong>
                <span>{t("panel.rebateLifetime")}</span>
              </div>
            </div>
          </SnapCardLink>

          <SnapCard $accent="navy">
            <div className="head">
              <span className="icon">
                <FiZap />
              </span>
              <div className="head-copy">
                <span className="eyebrow">{t("panel.streakTitle")}</span>
                <Link className="cta-inline" to="/user-panel/rewards">
                  {t("panel.streakOpen")} <FiChevronRight />
                </Link>
              </div>
            </div>
            <div className="stat-row tall">
              <div className="stat highlight">
                <strong>{streak?.currentStreak ?? 0}</strong>
                <span>{t("panel.streakCurrent")}</span>
              </div>
              <div className="stat">
                <strong>{streak?.longestStreak ?? 0}</strong>
                <span>{t("panel.streakBest")}</span>
              </div>
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={onCheckIn}
              disabled={streakBusy || Boolean(streak?.checkedInToday)}
            >
              <FiZap />
              {streak?.checkedInToday ? t("panel.streakCheckedIn") : t("panel.streakCheckIn")}
            </button>
          </SnapCard>

          <SnapCardLink to="/user-panel/invite" $accent="soft">
            <div className="head">
              <span className="icon">
                <FiUserPlus />
              </span>
              <div className="head-copy">
                <span className="eyebrow">{t("panel.inviteSnapTitle")}</span>
                <span className="cta-inline">
                  {t("panel.inviteSnapCta")} <FiChevronRight />
                </span>
              </div>
            </div>
            <p className="body">{t("panel.inviteSnapDesc")}</p>
            <div className="invite-footer">
              <span className="pill">Referral rewards</span>
              <span className="go">
                Open <FiChevronRight />
              </span>
            </div>
          </SnapCardLink>
        </SnapshotGrid>
      </WidgetPanel>

      <WidgetPanel>
        <SectionLabel>{t("panel.essentials")}</SectionLabel>
        <QuickLinksGrid>
          {essentials.map((item) => {
            const Icon = item.icon;
            return (
              <QuickLinkCard key={item.to} to={item.to} $featured={item.featured}>
                <span className="icon">
                  <Icon />
                </span>
                <span className="title">{item.title}</span>
                <span className="desc">{item.desc}</span>
              </QuickLinkCard>
            );
          })}
        </QuickLinksGrid>
      </WidgetPanel>

      <WidgetPanel>
        <SectionLabel>{t("panel.overview")}</SectionLabel>
        <StatsGrid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <StatCard key={i}>
                  <StatIconBox $color="#e2e8f0">
                    <FiAward />
                  </StatIconBox>
                  <StatBody>
                    <StatValue>
                      <ShimmerBar $h="18px" $w="40px" />
                    </StatValue>
                    <StatLabel>
                      <ShimmerBar $h="10px" $w="70px" />
                    </StatLabel>
                  </StatBody>
                </StatCard>
              ))
            : stats.map((stat) => {
                const Icon = iconByKey[stat.key] || FiTrendingUp;
                return (
                  <StatCard key={stat.key}>
                    <StatIconBox $color={stat.color}>
                      <Icon />
                    </StatIconBox>
                    <StatBody>
                      <StatValue>{stat.value}</StatValue>
                      <StatLabel>{STAT_I18N[stat.key] ? t(STAT_I18N[stat.key]) : stat.label}</StatLabel>
                      <StatMeta $positive={stat.positive}>
                        {stat.changeText} {t("panel.thisMonth")}
                      </StatMeta>
                    </StatBody>
                  </StatCard>
                );
              })}
        </StatsGrid>
      </WidgetPanel>

      <SplitGrid>
        <WidgetPanel>
          <SectionHeadRow>
            <SectionLabel style={{ margin: 0, flex: 1 }}>{t("panel.recentActivity")}</SectionLabel>
            <GhostNavLink to="/user-panel/activity">
              {t("panel.viewAllActivity")} <FiChevronRight />
            </GhostNavLink>
          </SectionHeadRow>
          <ActivityList>
            {activity.length === 0 ? (
              <EmptyNote>{t("panel.noActivity")}</EmptyNote>
            ) : (
              activity.map((row) => (
                <ActivityItem key={row.id}>
                  <span className="dot" aria-hidden />
                  <div>
                    <strong>{row.title}</strong>
                    {row.description ? <p>{row.description}</p> : null}
                  </div>
                  <time>{row.time}</time>
                </ActivityItem>
              ))
            )}
          </ActivityList>
        </WidgetPanel>

        <WidgetPanel>
          <SectionHeadRow>
            <SectionLabel style={{ margin: 0, flex: 1 }}>{t("panel.liveSignals")}</SectionLabel>
            <GhostNavLink to="/user-panel/signals">
              {t("panel.viewAllSignals")} <FiChevronRight />
            </GhostNavLink>
          </SectionHeadRow>
          <SignalList>
            {signals.length === 0 ? (
              <EmptyNote>{t("panel.noSignals")}</EmptyNote>
            ) : (
              signals.map((s) => (
                <SignalItem key={s.id} to="/user-panel/signals" $buy={s.direction === "buy"}>
                  <span className="pair">{s.pair}</span>
                  <span className="dir">{s.direction.toUpperCase()}</span>
                  <span className="meta">
                    E {s.entry} · TP {s.tp} · SL {s.sl}
                  </span>
                </SignalItem>
              ))
            )}
          </SignalList>
        </WidgetPanel>
      </SplitGrid>

      <WidgetPanel>
        <SectionLabel>{t("panel.learnTools")}</SectionLabel>
        <ToolsGrid>
          {learnTools.map((item) => {
            const Icon = item.icon;
            return (
              <ToolTile key={item.to} to={item.to}>
                <span className="icon">
                  <Icon />
                </span>
                <span className="copy">
                  <strong>{item.title}</strong>
                  <em>{item.desc}</em>
                </span>
              </ToolTile>
            );
          })}
        </ToolsGrid>
      </WidgetPanel>

      <WidgetPanel>
        <SectionLabel>{t("panel.exploreMore")}</SectionLabel>
        <ExploreLinksGrid>
          {moreActions.map((item) => {
            const Icon = item.icon;
            return (
              <ExploreLinkCard key={item.to} to={item.to}>
                <span className="icon">
                  <Icon />
                </span>
                <span className="copy">
                  <span className="title">{item.title}</span>
                  <span className="desc">{item.desc}</span>
                </span>
                <FiChevronRight className="arrow" aria-hidden />
              </ExploreLinkCard>
            );
          })}
        </ExploreLinksGrid>
      </WidgetPanel>

      {(care?.manager || care?.recommendedBroker) && (
        <CareSection className="notranslate" data-no-auto-translate>
          <SectionLabel>Your support team</SectionLabel>
          <CareCards>
            {care.manager ? <AccountManagerCard manager={care.manager} /> : null}
            {care.recommendedBroker ? <RecommendedBrokerCard broker={care.recommendedBroker} /> : null}
          </CareCards>
        </CareSection>
      )}

      <div style={{ marginTop: "0.25rem", display: "flex", justifyContent: "flex-end" }}>
        <GhostNavLink to="/user-panel/settings">
          <FiSettings /> {t("panel.preferences")}
        </GhostNavLink>
      </div>
    </PageWrap>
  );
};

export default Dashboard;

const CareSection = styled.section`
  margin: 0.35rem 0 1.15rem;
  padding: 1.15rem 1.2rem 1.2rem;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.92) 100%);
  border: 1px solid rgba(19, 46, 88, 0.07);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.045);
`;

const CareCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 380px));
  gap: 0.9rem;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.75rem;

  span,
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.28rem 0.65rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.72rem;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    background: rgba(251, 193, 19, 0.2);
    border-color: rgba(251, 193, 19, 0.45);
    color: #fbc113;
  }
`;

const SnapshotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const snapCardStyles = css<{ $accent?: "gold" | "navy" | "soft" }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 220px;
  padding: 1.2rem 1.2rem 1.15rem;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  background:
    linear-gradient(165deg, #ffffff 0%, #fbfcfe 100%);
  border: 1px solid rgba(19, 46, 88, 0.08);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 12px 28px rgba(15, 23, 42, 0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: ${({ $accent }) =>
      $accent === "navy"
        ? `linear-gradient(90deg, ${userColors.navy}, #2a4f84)`
        : $accent === "soft"
          ? `linear-gradient(90deg, rgba(251, 193, 19, 0.85), rgba(19, 46, 88, 0.55))`
          : `linear-gradient(90deg, ${userColors.gold}, #f59e0b)`};
  }

  &::after {
    content: "";
    position: absolute;
    right: -28px;
    top: -28px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    pointer-events: none;
    background: ${({ $accent }) =>
      $accent === "navy"
        ? "radial-gradient(circle, rgba(19, 46, 88, 0.08), transparent 70%)"
        : $accent === "soft"
          ? "radial-gradient(circle, rgba(251, 193, 19, 0.14), transparent 70%)"
          : "radial-gradient(circle, rgba(251, 193, 19, 0.18), transparent 70%)"};
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(251, 193, 19, 0.4);
    box-shadow: 0 18px 40px rgba(19, 46, 88, 0.1);

    .cta-inline,
    .go {
      color: ${userColors.gold};
    }

    .icon {
      transform: scale(1.05);
    }
  }

  .head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    z-index: 1;
  }

  .icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
    background: ${({ $accent }) =>
      $accent === "navy"
        ? `linear-gradient(145deg, ${userColors.navy}, #1a3d6e)`
        : $accent === "soft"
          ? "linear-gradient(145deg, rgba(251, 193, 19, 0.22), rgba(251, 193, 19, 0.08))"
          : `linear-gradient(145deg, ${userColors.gold}, #f0b400)`};
    color: ${({ $accent }) => ($accent === "soft" ? userColors.navy : $accent === "navy" ? userColors.gold : userColors.navy)};
    box-shadow: ${({ $accent }) =>
      $accent === "navy"
        ? "0 8px 16px rgba(19, 46, 88, 0.22)"
        : $accent === "soft"
          ? "inset 0 0 0 1px rgba(251, 193, 19, 0.25)"
          : "0 8px 16px rgba(251, 193, 19, 0.35)"};
  }

  .head-copy {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .eyebrow {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${userColors.navy};
  }

  .cta-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: ${userColors.muted};
    text-decoration: none;
    transition: color 0.18s ease;
  }

  .hero-value {
    position: relative;
    z-index: 1;
    margin-top: 0.35rem;
    font-size: clamp(1.75rem, 2.6vw, 2.05rem);
    font-weight: 800;
    letter-spacing: -0.045em;
    line-height: 1;
    color: ${userColors.navy};
  }

  .hero-label {
    position: relative;
    z-index: 1;
    font-size: 0.74rem;
    font-weight: 600;
    color: ${userColors.muted};
  }

  .stat-row {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;
    margin-top: auto;

    &.tall {
      margin-top: 0.55rem;
    }
  }

  .stat {
    padding: 0.7rem 0.75rem;
    border-radius: 14px;
    background: rgba(19, 46, 88, 0.035);
    border: 1px solid rgba(19, 46, 88, 0.06);

    &.highlight {
      background: linear-gradient(145deg, rgba(251, 193, 19, 0.18), rgba(251, 193, 19, 0.06));
      border-color: rgba(251, 193, 19, 0.35);
    }

    strong {
      display: block;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: ${userColors.navy};
      line-height: 1.1;
    }

    span {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.66rem;
      font-weight: 700;
      color: ${userColors.muted};
    }
  }

  .primary-btn {
    position: relative;
    z-index: 1;
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.72rem 0.9rem;
    border: none;
    border-radius: 12px;
    background: linear-gradient(145deg, ${userColors.navy}, #1a3d6e);
    color: #fff;
    font-size: 0.82rem;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(19, 46, 88, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(19, 46, 88, 0.28);
    }

    &:disabled {
      opacity: 0.7;
      cursor: default;
      box-shadow: none;
    }
  }

  .body {
    position: relative;
    z-index: 1;
    margin: 0.35rem 0 0;
    font-size: 0.84rem;
    line-height: 1.55;
    color: ${userColors.muted};
    flex: 1;
  }

  .invite-footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.7rem;
  }

  .pill {
    display: inline-flex;
    padding: 0.28rem 0.6rem;
    border-radius: 999px;
    background: rgba(251, 193, 19, 0.16);
    color: ${userColors.navy};
    font-size: 0.68rem;
    font-weight: 800;
  }

  .go {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    font-size: 0.8rem;
    font-weight: 800;
    color: ${userColors.navy};
    transition: color 0.18s ease;
  }
`;

const SnapCard = styled.div<{ $accent?: "gold" | "navy" | "soft" }>`
  ${snapCardStyles}
`;

const SnapCardLink = styled(Link)<{ $accent?: "gold" | "navy" | "soft" }>`
  ${snapCardStyles}
`;

const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 0.9rem;
  margin-bottom: 0;

  > ${WidgetPanel} {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SectionHeadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const ActivityItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.7rem;
  align-items: start;
  padding: 0.75rem 0.8rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid rgba(19, 46, 88, 0.06);

  .dot {
    width: 8px;
    height: 8px;
    margin-top: 0.4rem;
    border-radius: 999px;
    background: ${userColors.gold};
    box-shadow: 0 0 0 3px rgba(251, 193, 19, 0.2);
  }

  strong {
    display: block;
    font-size: 0.82rem;
    font-weight: 800;
    color: ${userColors.navy};
  }

  p {
    margin: 0.15rem 0 0;
    font-size: 0.72rem;
    color: ${userColors.muted};
    line-height: 1.4;
  }

  time {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    white-space: nowrap;
  }
`;

const SignalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const SignalItem = styled(Link)<{ $buy?: boolean }>`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.55rem;
  padding: 0.8rem 0.85rem;
  border-radius: 12px;
  text-decoration: none;
  background: #fff;
  border: 1px solid rgba(19, 46, 88, 0.08);
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(251, 193, 19, 0.45);
  }

  .pair {
    font-size: 0.84rem;
    font-weight: 800;
    color: ${userColors.navy};
  }

  .dir {
    padding: 0.18rem 0.45rem;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 800;
    background: ${({ $buy }) => ($buy ? "rgba(5, 150, 105, 0.12)" : "rgba(220, 38, 38, 0.12)")};
    color: ${({ $buy }) => ($buy ? "#059669" : "#dc2626")};
  }

  .meta {
    font-size: 0.7rem;
    color: ${userColors.muted};
    text-align: right;
    font-weight: 600;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr auto;
    .meta {
      grid-column: 1 / -1;
      text-align: left;
    }
  }
`;

const EmptyNote = styled.p`
  margin: 0;
  padding: 1rem 0.25rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${userColors.muted};
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ToolTile = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 0.95rem;
  border-radius: 14px;
  text-decoration: none;
  background: linear-gradient(180deg, #fff 0%, #fbfcfe 100%);
  border: 1px solid rgba(19, 46, 88, 0.08);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.035);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(251, 193, 19, 0.45);
    box-shadow: 0 12px 26px rgba(19, 46, 88, 0.09);

    .icon {
      background: linear-gradient(145deg, #132e58, #1a3d6e);
      color: #fbc113;
    }
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(251, 193, 19, 0.16);
    color: ${userColors.navy};
    font-size: 1.05rem;
    flex-shrink: 0;
    transition: background 0.18s ease, color 0.18s ease;
  }

  .copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  strong {
    font-size: 0.84rem;
    font-weight: 800;
    color: ${userColors.navy};
  }

  em {
    font-style: normal;
    font-size: 0.7rem;
    color: ${userColors.muted};
  }
`;

const LinkAccountBanner = styled(Link)`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem 1.15rem;
  margin-bottom: 1.1rem;
  padding: 1.2rem 1.25rem;
  border-radius: 18px;
  text-decoration: none;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(ellipse 50% 90% at 100% 0%, rgba(251, 193, 19, 0.28), transparent 55%),
    linear-gradient(135deg, #0b1830 0%, #132e58 48%, #1a3d6e 100%);
  border: 1px solid rgba(251, 193, 19, 0.32);
  box-shadow: 0 16px 36px rgba(19, 46, 88, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(19, 46, 88, 0.28);

    .cta {
      background: #fff;
    }
  }

  .badge-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(251, 193, 19, 0.16);
    border: 1px solid rgba(251, 193, 19, 0.35);
    color: #fbc113;
    font-size: 1.35rem;
    flex-shrink: 0;
  }

  .kicker {
    display: inline-block;
    margin-bottom: 0.28rem;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fbc113;
  }

  strong {
    display: block;
    font-size: clamp(1.05rem, 1.5vw, 1.2rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #fff;
  }

  p {
    margin: 0.35rem 0 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.78);
    max-width: 48ch;
  }

  .cta {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.72rem 1.05rem;
    border-radius: 11px;
    background: #fbc113;
    color: #132e58;
    font-size: 0.84rem;
    font-weight: 800;
    transition: background 0.18s ease;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;

    .badge-icon {
      display: none;
    }

    .cta {
      width: 100%;
      justify-content: center;
    }
  }
`;
