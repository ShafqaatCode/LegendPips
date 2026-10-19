import React from "react";
import BrokersManagement from "./BrokersManagement";

/** Dedicated admin panel for prop firms (separate from Brokers). */
const PropFirmsManagement: React.FC = () => {
  return <BrokersManagement panelMode="prop" />;
};

export default PropFirmsManagement;
