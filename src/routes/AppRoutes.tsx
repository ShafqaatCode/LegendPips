import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/Homepage";
import Tools from "../pages/Tools/Tools";
import Brokers from "../pages/Brokers/BrokersPage";
import Contests from "../pages/Contests/Contests";
import RebateBrokers from "../pages/RebateBrokers/RebateBrokersPage";
import Analysis from "../pages/Analysis/Analysis";
import HitWorksPage from "../pages/HitWorksPage/HitWorksPage";
import SignalsPage from "../pages/SignalsPage/SignalsPage";
import Forum from "../pages/Forum/Forum";
import LoginForm from "../pages/Login/Login";
import RegisterForm from "../pages/Register/Register";

// 👇 Add these imports


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ⬇ Public routes (outside Layout) */}
      <Route path="/signin" element={<LoginForm />}/>
      <Route path="/register" element={<RegisterForm />} />

      {/* ⬇ Main site layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tools" element={<Tools />} />
        <Route path="brokers" element={<Brokers />} />
        <Route path="contests" element={<Contests />} />
        <Route path="signals" element={<SignalsPage />} />
        <Route path="rebates" element={<RebateBrokers />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="how-it-works" element={<HitWorksPage />} />
        <Route path="forum" element={<Forum />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
