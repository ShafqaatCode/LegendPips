import React from "react";
import AboutContentPage from "./AboutContentPage";
import { ABOUT_PAGES } from "../../data/aboutPages";

const AboutPage: React.FC = () => <AboutContentPage content={ABOUT_PAGES.about} />;

export default AboutPage;
