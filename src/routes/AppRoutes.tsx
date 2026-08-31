import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/Homepage";
import Brokers from "../pages/Brokers/BrokersPage";
import BeginnerBrokersPage from "../pages/Brokers/BeginnerBrokersPage";
import ScamBrokerShieldPage from "../pages/Brokers/ScamBrokerShieldPage";
import CountryBrokerMatcherPage from "../pages/Brokers/CountryBrokerMatcherPage";
import Contests from "../pages/Contests/Contestspage";
import RebateBrokers from "../pages/RebateBrokers/RebateBrokersPage";
import RebateBrokerDetailPage from "../pages/RebateBrokers/RebateBrokerDetailPage";
import Analysis from "../pages/Analysis/Analysis";
import AnalysisDetail from "../components/Analysis/AnalysisDetail";
import HitWorksPage from "../pages/HitWorksPage/HitWorksPage";
import SignalsPage from "../pages/SignalsPage/SignalsPage";
import RewardsPage from "../pages/RewardsPage/RewardsPage";
import RewardDetailPage from "../pages/RewardsPage/RewardDetailPage";
import Forum from "../pages/Forum/Forum";
import ForumThreadDetail from "../components/Forum/ForumThreadDetail";
import Courses from "../pages/Courses/Courses";
import TradingVideos from "../pages/TradingVideos/TradingVideos";
import Webinars from "../pages/Webinars/Webinars";
import { SignInPage, RegisterPage } from "../pages/Login/AuthPage";
import ContestDetails from "../components/Contest/ContestDetails";
import UserPanel from "../pages/UserPanel/UserPanel";
import Dashboard from "../pages/UserPanel/Dashboard/Dashboard";
import Profile from "../pages/UserPanel/Profile/Profile";
import MyContests from "../pages/UserPanel/Contests/MyContests";
import MySignals from "../pages/UserPanel/Signals/MySignals";
import MyWebinars from "../pages/UserPanel/Webinars/MyWebinars";
import MyCourses from "../pages/UserPanel/Courses/MyCourses";
import MyTradingVideos from "../pages/UserPanel/TradingVideos/TradingVideos";
import SavedAnalysis from "../pages/UserPanel/Analysis/SavedAnalysis";
import ForumPosts from "../pages/UserPanel/Forum/ForumPosts";
import MyBrokerReviews from "../pages/UserPanel/Reviews/MyBrokerReviews";
import MyComplaints from "../pages/UserPanel/Complaints/MyComplaints";
import Activity from "../pages/UserPanel/Activity/Activity";
import MyRebates from "../pages/UserPanel/Rebates/MyRebates";
import InviteFriends from "../pages/UserPanel/Referrals/InviteFriends";
import RequestIbChange from "../pages/UserPanel/IbChange/RequestIbChange";
import Calendar from "../pages/UserPanel/Calendar/Calendar";
import Settings from "../pages/UserPanel/Settings/Settings";
import KycVerification from "../pages/UserPanel/Verification/KycVerification";
import ProtectedRoute from "../components/UserPanel/ProtectedRoute";
import AdminPanel from "../pages/AdminPanel/AdminPanel";
import AdminDashboard from "../pages/AdminPanel/Dashboard/AdminDashboard";
import UsersManagement from "../pages/AdminPanel/Users/UsersManagement";
import UserDetail from "../pages/AdminPanel/Users/UserDetail";
import AdminBulkEmail from "../pages/AdminPanel/Users/AdminBulkEmail";
import KycRecordsManagement from "../pages/AdminPanel/Kyc/KycRecordsManagement";
import BrokersManagement from "../pages/AdminPanel/Brokers/BrokersManagement";
import AdminBrokerReviews from "../pages/AdminPanel/Brokers/AdminBrokerReviews";
import AdminSignupBonuses from "../pages/AdminPanel/Market/AdminSignupBonuses";
import AdminPerformingStocks from "../pages/AdminPanel/Market/AdminPerformingStocks";
import AdminComplaints from "../pages/AdminPanel/Complaints/AdminComplaints";
import BrokerSignupBonusesPage from "../pages/Brokers/BrokerSignupBonusesPage";
import BestPerformingStocksPage from "../pages/Stocks/BestPerformingStocksPage";
import ContestsManagement from "../pages/AdminPanel/Contests/ContestsManagement";
import SignalsManagement from "../pages/AdminPanel/Signals/SignalsManagement";
import WebinarsManagement from "../pages/AdminPanel/Webinars/WebinarsManagement";
import AnalysisManagement from "../pages/AdminPanel/Analysis/AnalysisManagement";
import CoursesManagement from "../pages/AdminPanel/Courses/CoursesManagement";
import Reports from "../pages/AdminPanel/Reports/Reports";
import AdminSecurity from "../pages/AdminPanel/Security/AdminSecurity";
import AdminSettings from "../pages/AdminPanel/Settings/AdminSettings";
import AdminFeedbackInbox from "../pages/AdminPanel/Engagement/AdminFeedbackInbox";
import AdminUserActivityFeed from "../pages/AdminPanel/Engagement/AdminUserActivityFeed";
import AdminReferralsProgress from "../pages/AdminPanel/Engagement/AdminReferralsProgress";
import AdminIbChangeRequests from "../pages/AdminPanel/Engagement/AdminIbChangeRequests";
import AdminLiveAccountRequests from "../pages/AdminPanel/Engagement/AdminLiveAccountRequests";
import AdminRebateCredits from "../pages/AdminPanel/Rebates/AdminRebateCredits";
import AdminTeamManagement from "../pages/AdminPanel/Team/AdminTeamManagement";
import ProtectedAdminRoute from "../components/AdminPanel/ProtectedAdminRoute";
import MyLiveAccounts from "../pages/UserPanel/LiveAccounts/MyLiveAccounts";

import MarginCalculatorPage from "../pages/MarginCalculator/MarginCalculatorPage";
import RebateCalculatorPage from "../pages/RebateCalculator/RebateCalculatorPage";
import PivotPointCalculatorPage from "../pages/PivotPointCalculator/PivotPointCalculatorPage";
import FibonacciCalculatorPage from "../pages/FibonacciCalculator/FibonacciCalculatorPage";
import PositionSizeCalculatorPage from "../pages/PositionSizeCalculator/PositionSizeCalculatorPage";
import PipCalculatorPage from "../pages/PipCalculator/PipCalculatorPage";
import CalculatorsPage from "../pages/Calculators/CalculatorsPage";
import AboutPage from "../pages/About/AboutPage";
import TeamPage from "../pages/About/TeamPage";
import {
  MethodologyPage,
  CareersPage,
  PartnersPage,
  JournalistsPage,
} from "../pages/About/AboutExtraPages";
import ComplaintsPage from "../pages/Complaints/ComplaintsPage";
import ComparePage from "../pages/Compare/ComparePage";
import PropFirmHubPage from "../pages/PropFirms/PropFirmHubPage";
import TradersPage, { CopyTradingPage } from "../pages/Traders/TradersPage";
import TraderDetailPage from "../pages/Traders/TraderDetailPage";
import MyTraderProfile from "../pages/UserPanel/Traders/MyTraderProfile";
import MyCopyTrading from "../pages/UserPanel/Traders/MyCopyTrading";
import AdminTraderProfiles from "../pages/AdminPanel/Traders/AdminTraderProfiles";
import LegalPage from "../pages/Legal/LegalPage";
import {
  ProfitCalculatorPage,
  RiskRewardCalculatorPage,
  DrawdownCalculatorPage,
  CompoundCalculatorPage,
  CryptoProfitCalculatorPage,
  LotCalculatorPage,
} from "../pages/ExtraCalculators/ExtraCalculatorPages";

// 👇 Add these imports


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ⬇ Admin Panel Layout */}
      <Route
        path="/admin-panel"
        element={
          <ProtectedAdminRoute>
            <AdminPanel />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users/bulk-email" element={<AdminBulkEmail />} />
        <Route path="kyc-records" element={<KycRecordsManagement />} />
        <Route path="kyc-records/:id" element={<UserDetail />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="brokers" element={<BrokersManagement />} />
        <Route path="broker-reviews" element={<AdminBrokerReviews />} />
        <Route path="signup-bonuses" element={<AdminSignupBonuses />} />
        <Route path="performing-stocks" element={<AdminPerformingStocks />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="contests" element={<ContestsManagement />} />
        <Route path="signals" element={<SignalsManagement />} />
        <Route path="webinars" element={<WebinarsManagement />} />
        <Route path="analysis" element={<AnalysisManagement />} />
        <Route path="courses" element={<CoursesManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="feedback-inbox" element={<AdminFeedbackInbox />} />
        <Route path="user-activity" element={<AdminUserActivityFeed />} />
        <Route path="referrals" element={<AdminReferralsProgress />} />
        <Route path="ib-change" element={<AdminIbChangeRequests />} />
        <Route path="live-accounts" element={<AdminLiveAccountRequests />} />
        <Route path="rebate-credits" element={<AdminRebateCredits />} />
        <Route path="traders" element={<AdminTraderProfiles />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="team" element={<AdminTeamManagement />} />
      </Route>

      {/* ⬇ User Panel Layout */}
      <Route
        path="/user-panel"
        element={
          <ProtectedRoute>
            <UserPanel />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="verification" element={<KycVerification />} />
        <Route path="contests" element={<MyContests />} />
        <Route path="signals" element={<MySignals />} />
        <Route path="webinars" element={<MyWebinars />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="trading-videos" element={<MyTradingVideos />} />
        <Route path="analysis" element={<SavedAnalysis />} />
        <Route path="forum" element={<ForumPosts />} />
        <Route path="broker-reviews" element={<MyBrokerReviews />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="activity" element={<Activity />} />
        <Route path="rebates" element={<MyRebates />} />
        <Route path="live-accounts" element={<MyLiveAccounts />} />
        <Route path="invite" element={<InviteFriends />} />
        <Route path="ib-change" element={<RequestIbChange />} />
        <Route path="trader-profile" element={<MyTraderProfile />} />
        <Route path="copy-trading" element={<MyCopyTrading />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ⬇ Main site layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tools" element={<CalculatorsPage />} />
        <Route path="calculators" element={<CalculatorsPage />} />
        <Route path="brokers/beginners" element={<BeginnerBrokersPage />} />
        <Route path="brokers/match" element={<CountryBrokerMatcherPage />} />
        <Route path="find-broker" element={<CountryBrokerMatcherPage />} />
        <Route path="brokers" element={<Brokers />} />
        
        <Route path="contests" element={<Contests />} />
        <Route path="contests/:contestId" element={<ContestDetails />} />
        
        <Route path="signals" element={<SignalsPage />} />
        <Route path="rewards/:rewardId" element={<RewardDetailPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="rebates/broker/:brokerId" element={<RebateBrokerDetailPage />} />
        <Route path="rebates" element={<RebateBrokers />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="analysis/:id" element={<AnalysisDetail />} />
        {/* External/demo articles may include extra path segments; keep this route from breaking. */}
        <Route path="analysis/:id/*" element={<AnalysisDetail />} />
        <Route path="how-it-works" element={<HitWorksPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="about/team" element={<TeamPage />} />
        <Route path="about/methodology" element={<MethodologyPage />} />
        <Route path="about/careers" element={<CareersPage />} />
        <Route path="about/partners" element={<PartnersPage />} />
        <Route path="about/journalists" element={<JournalistsPage />} />
        <Route path="scam-broker-shield" element={<ScamBrokerShieldPage />} />
        <Route path="broker-signup-bonuses" element={<BrokerSignupBonusesPage />} />
        <Route path="best-performing-stocks" element={<BestPerformingStocksPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="compare/:pairSlug" element={<ComparePage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="prop-firms" element={<PropFirmHubPage />} />
        <Route path="traders/:id" element={<TraderDetailPage />} />
        <Route path="traders" element={<TradersPage />} />
        <Route path="copy-trading" element={<CopyTradingPage />} />

        <Route path="forum" element={<Forum />} />
        <Route path="forum/thread/:threadId" element={<ForumThreadDetail />} />
        <Route path="courses" element={<Courses />} />
        <Route path="trading-videos" element={<TradingVideos />} />
        <Route path="webinars" element={<Webinars />} />
        {/* 👇 New routes for calculators */}
        <Route path="pip-calculator" element={<PipCalculatorPage />} />
        <Route path="position-size-calculator" element={<PositionSizeCalculatorPage />} />
        <Route path="margin-calculator" element={<MarginCalculatorPage />} />
        <Route path="rebate-calculator" element={<RebateCalculatorPage />} />
        <Route path="calculator" element={<RebateCalculatorPage />} />
        <Route path="pivot-point-calculator" element={<PivotPointCalculatorPage />}/>
        <Route path="fibonacci-calculator" element={<FibonacciCalculatorPage />}/>
        <Route path="profit-calculator" element={<ProfitCalculatorPage />} />
        <Route path="lot-calculator" element={<LotCalculatorPage />} />
        <Route path="risk-reward-calculator" element={<RiskRewardCalculatorPage />} />
        <Route path="drawdown-calculator" element={<DrawdownCalculatorPage />} />
        <Route path="compound-calculator" element={<CompoundCalculatorPage />} />
        <Route path="crypto-profit-calculator" element={<CryptoProfitCalculatorPage />} />
        <Route path="cashback-calculator" element={<RebateCalculatorPage />} />
        <Route path="legal/:slug" element={<LegalPage />} />
        <Route path="terms" element={<LegalPage slug="terms" />} />
        <Route path="privacy" element={<LegalPage slug="privacy" />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
