import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/Homepage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;