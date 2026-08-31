import React from "react";
import AboutContentPage from "./AboutContentPage";
import { ABOUT_PAGES } from "../../data/aboutPages";

export const MethodologyPage: React.FC = () => (
  <AboutContentPage content={ABOUT_PAGES.methodology} />
);

export const CareersPage: React.FC = () => <AboutContentPage content={ABOUT_PAGES.careers} />;

export const PartnersPage: React.FC = () => <AboutContentPage content={ABOUT_PAGES.partners} />;

export const JournalistsPage: React.FC = () => (
  <AboutContentPage content={ABOUT_PAGES.journalists} />
);
