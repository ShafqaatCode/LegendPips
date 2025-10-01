import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/Homepage";
import Tools from "../pages/Tools/Tools";
import Brokers from "../pages/Brokers/BrokersPage";
import Contests from "../pages/Contests/Contestspage";
import RebateBrokers from "../pages/RebateBrokers/RebateBrokersPage";
import Analysis from "../pages/Analysis/Analysis";
import HitWorksPage from "../pages/HitWorksPage/HitWorksPage";
import SignalsPage from "../pages/SignalsPage/SignalsPage";
import Forum from "../pages/Forum/Forum";
import LoginForm from "../pages/Login/LoginForm";
import RegisterForm from "../pages/Register/RegisterForm";
import ContestDetails from "../components/Contest/ContestDetails";

import MarginCalculatorPage from "../pages/MarginCalculator/MarginCalculatorPage";
import RebateCalculatorPage from "../pages/RebateCalculator/RebateCalculatorPage";
import PivotPointCalculatorPage from "../pages/PivotPointCalculator/PivotPointCalculatorPage";
import PositionSizeCalculatorPage from "../pages/PositionSizeCalculator/PositionSizeCalculatorPage";
import PipCalculatorPage from "../pages/PipCalculator/PipCalculatorPage";

// 👇 Add these imports


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      <Route path="/signin" element={<LoginForm />}/>
      <Route path="/register" element={<RegisterForm />} />

      {/* ⬇ Main site layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tools" element={<Tools />} />
        <Route path="brokers" element={<Brokers />} />
        
        <Route path="contests" element={<Contests />} />
        <Route path="contests/:contestId" element={<ContestDetails />} />
        
        <Route path="signals" element={<SignalsPage />} />
        <Route path="rebates" element={<RebateBrokers />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="how-it-works" element={<HitWorksPage />} />

        <Route path="forum" element={<Forum />} />
        {/* 👇 New routes for calculators */}
        <Route path="pip-calculator" element={<PipCalculatorPage />} />
        <Route path="position-size-calculator" element={<PositionSizeCalculatorPage />} />
        <Route path="margin-calculator" element={<MarginCalculatorPage />} />
        <Route path="rebate-calculator" element={<RebateCalculatorPage />} />
        <Route path="pivot-point-calculator" element={<PivotPointCalculatorPage />}/>

      </Route>
    </Routes>
  );
};

export default AppRoutes;
