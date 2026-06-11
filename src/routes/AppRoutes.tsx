import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/Homepage";
import Brokers from "../pages/Brokers/BrokersPage";
import Contests from "../pages/Contests/Contestspage";
import RebateBrokers from "../pages/RebateBrokers/RebateBrokersPage";
import RebateBrokerDetailPage from "../pages/RebateBrokers/RebateBrokerDetailPage";
import Analysis from "../pages/Analysis/Analysis";
import AnalysisDetail from "../components/Analysis/AnalysisDetail";
import HitWorksPage from "../pages/HitWorksPage/HitWorksPage";
import SignalsPage from "../pages/SignalsPage/SignalsPage";
import RewardsPage from "../pages/RewardsPage/RewardsPage";
import Forum from "../pages/Forum/Forum";
import ForumThreadDetail from "../components/Forum/ForumThreadDetail";
import Courses from "../pages/Courses/Courses";
import TradingVideos from "../pages/TradingVideos/TradingVideos";
import Webinars from "../pages/Webinars/Webinars";
import LoginForm from "../pages/Login/LoginForm";
import RegisterForm from "../pages/Register/RegisterForm";
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
import Activity from "../pages/UserPanel/Activity/Activity";
import MyRebates from "../pages/UserPanel/Rebates/MyRebates";
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
import ContestsManagement from "../pages/AdminPanel/Contests/ContestsManagement";
import SignalsManagement from "../pages/AdminPanel/Signals/SignalsManagement";
import WebinarsManagement from "../pages/AdminPanel/Webinars/WebinarsManagement";
import AnalysisManagement from "../pages/AdminPanel/Analysis/AnalysisManagement";
import CoursesManagement from "../pages/AdminPanel/Courses/CoursesManagement";
import Reports from "../pages/AdminPanel/Reports/Reports";
import AdminSettings from "../pages/AdminPanel/Settings/AdminSettings";
import AdminFeedbackInbox from "../pages/AdminPanel/Engagement/AdminFeedbackInbox";
import AdminUserActivityFeed from "../pages/AdminPanel/Engagement/AdminUserActivityFeed";
import AdminRebateCredits from "../pages/AdminPanel/Rebates/AdminRebateCredits";
import ProtectedAdminRoute from "../components/AdminPanel/ProtectedAdminRoute";

import MarginCalculatorPage from "../pages/MarginCalculator/MarginCalculatorPage";
import RebateCalculatorPage from "../pages/RebateCalculator/RebateCalculatorPage";
import PivotPointCalculatorPage from "../pages/PivotPointCalculator/PivotPointCalculatorPage";
import PositionSizeCalculatorPage from "../pages/PositionSizeCalculator/PositionSizeCalculatorPage";
import PipCalculatorPage from "../pages/PipCalculator/PipCalculatorPage";
import CalculatorsPage from "../pages/Calculators/CalculatorsPage";
import AboutPage from "../pages/About/AboutPage";

// 👇 Add these imports


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      <Route path="/signin" element={<LoginForm />}/>
      <Route path="/register" element={<RegisterForm />} />

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
        <Route path="contests" element={<ContestsManagement />} />
        <Route path="signals" element={<SignalsManagement />} />
        <Route path="webinars" element={<WebinarsManagement />} />
        <Route path="analysis" element={<AnalysisManagement />} />
        <Route path="courses" element={<CoursesManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="feedback-inbox" element={<AdminFeedbackInbox />} />
        <Route path="user-activity" element={<AdminUserActivityFeed />} />
        <Route path="rebate-credits" element={<AdminRebateCredits />} />
        <Route path="settings" element={<AdminSettings />} />
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
        <Route path="activity" element={<Activity />} />
        <Route path="rebates" element={<MyRebates />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ⬇ Main site layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tools" element={<CalculatorsPage />} />
        <Route path="calculators" element={<CalculatorsPage />} />
        <Route path="brokers" element={<Brokers />} />
        
        <Route path="contests" element={<Contests />} />
        <Route path="contests/:contestId" element={<ContestDetails />} />
        
        <Route path="signals" element={<SignalsPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="rebates/broker/:brokerId" element={<RebateBrokerDetailPage />} />
        <Route path="rebates" element={<RebateBrokers />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="analysis/:id" element={<AnalysisDetail />} />
        {/* External/demo articles may include extra path segments; keep this route from breaking. */}
        <Route path="analysis/:id/*" element={<AnalysisDetail />} />
        <Route path="how-it-works" element={<HitWorksPage />} />
        <Route path="about" element={<AboutPage />} />

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

      </Route>
    </Routes>
  );
};

export default AppRoutes;
