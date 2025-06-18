import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/Homepage";
import Tools from "../pages/Tools/Tools";
import Brokers from "../pages/Brokers/BrokersPage";
import Contests from "../pages/Contests/Contests";

import RebateBrokers from "../pages/RebateBrokers/RebateBrokers";
import Analysis from "../pages/Analysis/Analysis";
import HitWorksPage from "../pages/HitWorksPage/HitWorksPage";
import SignalsPage from "../pages/SignalsPage/SignalsPage";
import Forum from "../pages/Forum/Forum";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/brokers" element={<Brokers />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/rebates" element={<RebateBrokers />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/how-it-works" element={<HitWorksPage />} />
        <Route path="/forum" element={<Forum />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;