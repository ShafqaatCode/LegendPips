import React from "react";
import {
  CalcResultPanel,
  CalcResultHeading,
  CalcResultsGrid,
  CalcMetricCard,
  CalcMetricLabel,
  CalcMetricValue,
  CalcMetricNote,
} from "./calculatorStyles";

export type CalcMetric = {
  label: string;
  value: string;
  note?: string;
  tone?: "primary" | "accent" | "muted" | "positive" | "negative";
};

type Props = {
  metrics: CalcMetric[];
  heading?: string;
};

/** Clear, labeled result cards so clients can read outcomes at a glance. */
const CalcOutput: React.FC<Props> = ({ metrics, heading = "Your result" }) => {
  if (!metrics.length) return null;
  return (
    <CalcResultPanel aria-live="polite">
      <CalcResultHeading>{heading}</CalcResultHeading>
      <CalcResultsGrid>
        {metrics.map((m) => (
          <CalcMetricCard key={`${m.label}-${m.value}`} $tone={m.tone || "muted"}>
            <CalcMetricLabel>{m.label}</CalcMetricLabel>
            <CalcMetricValue>{m.value}</CalcMetricValue>
            {m.note ? <CalcMetricNote>{m.note}</CalcMetricNote> : null}
          </CalcMetricCard>
        ))}
      </CalcResultsGrid>
    </CalcResultPanel>
  );
};

export default CalcOutput;
