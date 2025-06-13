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

function App() {
  return (
    <BrowserRouter>
      <TopHeader />
      <PromoBanner />
      <FeaturesSlider />
      <div>
        <UpperHeading>Your one-stop solution for trading</UpperHeading>
        <SectionHeading>Welcome to LegendPips</SectionHeading>
        <SubHeading>Join us and start your trading journey today!</SubHeading> 
      </div>
    </BrowserRouter>
  );
}

export default App;
