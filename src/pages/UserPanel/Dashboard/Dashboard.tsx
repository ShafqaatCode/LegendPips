import React, { useEffect, useState } from 'react';
import {
  FiTrendingUp, FiAward, FiVideo, FiBook, FiUsers, FiDollarSign, FiChevronRight,
  FiUserPlus, FiShield, FiSettings, FiLink,
} from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchMyDashboard, type DashboardStat } from '../../../services/userInsightService';
import { getMyKyc, type KycStatus } from '../../../services/kycService';
import { fetchMyAccountCare, type AccountCare } from '../../../services/accountManagerService';
import { useLocale } from '../../../contexts/LocaleContext';
import { ShimmerBar } from '../../../components/SharedComponents/Shimmer';
import AccountManagerCard from '../../../components/UserPanel/AccountManagerCard';
import RecommendedBrokerCard from '../../../components/UserPanel/RecommendedBrokerCard';
import {
  PageWrap, DashboardHero, StatsGrid, StatCard, StatIconBox, StatBody,
  StatValue, StatLabel, StatMeta, HintBar, ErrorBanner, KycStrip, Pill, GhostNavLink,
  QuickLinksGrid, QuickLinkCard, SectionLabel,
} from '../../../components/UserPanel/userUi';
import styled from 'styled-components';

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
  const [kycStatus, setKycStatus] = useState<KycStatus>('incomplete');
  const [care, setCare] = useState<AccountCare | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, kyc, accountCare] = await Promise.all([
          fetchMyDashboard(),
          getMyKyc().catch(() => null),
          fetchMyAccountCare().catch(() => null),
        ]);
        if (cancelled) return;
        setStats(data.stats || []);
        setActivitySummary(data.activitySummary || null);
        if (kyc) setKycStatus(kyc.kycStatus);
        if (accountCare) setCare(accountCare);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageWrap>
      <DashboardHero>
        <div>
          <h1>{t("panel.welcome", { name: user?.firstName || t("panel.userFallback") })}</h1>
          <p>{t("panel.dashSub")}</p>
        </div>
        <Pill $variant={kycStatus}>{t(KYC_STATUS_KEY[kycStatus])}</Pill>
      </DashboardHero>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {(care?.manager || care?.recommendedBroker) && (
        <CareGrid>
          {care.manager ? <AccountManagerCard manager={care.manager} /> : null}
          {care.recommendedBroker ? <RecommendedBrokerCard broker={care.recommendedBroker} /> : null}
        </CareGrid>
      )}

      <KycStrip $variant={kycStatus}>
        <div>
          <div className="label">{t("panel.kycTitle")}</div>
          <div className="desc">{t(KYC_HINT_KEY[kycStatus])}</div>
        </div>
        <GhostNavLink to="/user-panel/verification">
          {kycStatus === 'approved' ? t("panel.viewStatus") : t("panel.manageKyc")}
          <FiChevronRight />
        </GhostNavLink>
      </KycStrip>

      {activitySummary && !loading && (
        <HintBar>
          <strong>{t("panel.activityMonth")}</strong> {activitySummary.thisMonth} {t("panel.events")}
          <span style={{ color: activitySummary.positive ? '#059669' : '#dc2626', marginLeft: 6, fontWeight: 600 }}>
            ({activitySummary.changeText} {t("panel.vsLast")})
          </span>
        </HintBar>
      )}

      <SectionLabel>{t("panel.overview")}</SectionLabel>
      <StatsGrid>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <StatCard key={i}>
                <StatIconBox $color="#e2e8f0"><FiAward /></StatIconBox>
                <StatBody>
                  <StatValue><ShimmerBar $h="18px" $w="40px" /></StatValue>
                  <StatLabel><ShimmerBar $h="10px" $w="70px" /></StatLabel>
                </StatBody>
              </StatCard>
            ))
          : stats.map((stat) => {
              const Icon = iconByKey[stat.key] || FiTrendingUp;
              return (
                <StatCard key={stat.key}>
                  <StatIconBox $color={stat.color}><Icon /></StatIconBox>
                  <StatBody>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{STAT_I18N[stat.key] ? t(STAT_I18N[stat.key]) : stat.label}</StatLabel>
                    <StatMeta $positive={stat.positive}>{stat.changeText} {t("panel.thisMonth")}</StatMeta>
                  </StatBody>
                </StatCard>
              );
            })}
      </StatsGrid>

      <SectionLabel>{t("panel.quick")}</SectionLabel>
      <QuickLinksGrid>
        {[
          { to: '/user-panel/rebates', title: t("panel.qlRebates"), desc: t("panel.qlRebatesD"), icon: FiDollarSign },
          { to: '/user-panel/live-accounts', title: t("panel.qlLive"), desc: t("panel.qlLiveD"), icon: FiLink },
          { to: '/user-panel/invite', title: t("panel.qlInvite"), desc: t("panel.qlInviteD"), icon: FiUserPlus },
          { to: '/user-panel/verification', title: t("panel.qlKyc"), desc: t("panel.qlKycD"), icon: FiShield },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <QuickLinkCard key={item.to} to={item.to}>
              <span className="icon"><Icon /></span>
              <span className="title">{item.title}</span>
              <span className="desc">{item.desc}</span>
            </QuickLinkCard>
          );
        })}
      </QuickLinksGrid>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <GhostNavLink to="/user-panel/settings">
          <FiSettings /> {t("panel.preferences")}
        </GhostNavLink>
      </div>
    </PageWrap>
  );
};

export default Dashboard;

const CareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

