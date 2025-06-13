import "./App.css";
import PromoBanner from "./components/PromoBanner/PromoBanner";
import {
  SectionHeading,
  UpperHeading,
  SubHeading,
} from "./components/SharedStyleComponents/StyleHeadings.styles";
import TopHeader from "./components/Header/TopHeader";
import { BrowserRouter } from "react-router-dom";
import FeaturesSlider from "./components/FeatureSection/FeaturesSlider";
import Signals from "./components/Signals/Signals";

function App() {
  return (
    <BrowserRouter>
      <TopHeader />
      <PromoBanner />
      <FeaturesSlider />
      <Signals />
    </BrowserRouter>
  );
}

export default App;
