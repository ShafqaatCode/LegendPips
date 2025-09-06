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
import PipCalculator from "../components/Calculators/PipsCalculator/PipCalculator";
import MarginCalculator from "../components/Calculators/MarginCalculator/MarginCalculator";
import PositionSizeCalculator from "../components/Calculators/PositionSizeCalculator/PositionsizeCalculator";
import PivotPointCalculator from "../components/Calculators/PivotpointCalculator/PivotPointCalculator";
import RebateCalculator from "../components/Calculators/RebateCalculator/RebateCalculator";

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
        <Route path="pip-calculator" element={<PipCalculator />} />
        <Route path="position-size-calculator" element={<PositionSizeCalculator />} />
        <Route path="margin-calculator" element={<MarginCalculator />} />
        <Route path="rebate-calculator" element={<RebateCalculator />} />
        <Route path="pivot-point-calculator" element={<PivotPointCalculator />}/>

      </Route>
    </Routes>
  );
};

export default AppRoutes;
