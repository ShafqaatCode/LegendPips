import React, { useEffect, useState } from "react";
import {
  calculatePositionSize,
  FX_PAIR_OPTIONS,
  formatMoney,
  type FxPair,
} from "../../utils/forexCalculators";
import {
  CalcPage,
  CalcContainer,
  CalcCard,
  CalcHeader,
  CalcDescription,
  CalcFormRow,
  CalcFormGroup,
  CalcField,
  CalcLabel,
  CalcInput,
  CalcSelect,
  CalcError,
  CalcHint,
} from "./calculatorStyles";
import CalcOutput from "./CalcOutput";

const RiskCalculator: React.FC = () => {
  const [balance, setBalance] = useState("5000");
  const [riskPct, setRiskPct] = useState("1");
  const [pair, setPair] = useState<FxPair>("EUR/USD");
  const [stopPips, setStopPips] = useState("20");
  const [error, setError] = useState<string | null>(null);
  const [riskMoney, setRiskMoney] = useState<number | null>(null);
  const [lots, setLots] = useState<number | null>(null);
  const [pipValue, setPipValue] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const bal = parseFloat(balance);
      const pct = parseFloat(riskPct);
      const sl = parseFloat(stopPips);

      if (!Number.isFinite(bal) || bal <= 0) {
        setError("Account balance must be greater than 0.");
        setRiskMoney(null);
        setLots(null);
        setPipValue(null);
        return;
      }
      if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
        setError("Risk % must be between 0 and 100.");
        setRiskMoney(null);
        setLots(null);
        setPipValue(null);
        return;
      }

      const dollars = (bal * pct) / 100;
      setRiskMoney(dollars);
      setError(null);

      if (!Number.isFinite(sl) || sl <= 0) {
        setLots(null);
        setPipValue(null);
        return;
      }

      const res = calculatePositionSize({
        pair,
        accountBalance: bal,
        riskPercent: pct,
        stopLossPips: sl,
      });
      if (!res.ok) {
        setError(res.error);
        setLots(null);
        setPipValue(null);
        return;
      }
      setLots(res.lots);
      setPipValue(res.pipValue);
    }, 120);
    return () => window.clearTimeout(id);
  }, [balance, riskPct, pair, stopPips]);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Account Risk Calculator</CalcHeader>
          <CalcDescription>
            See how many dollars you risk, and the lot size that keeps you inside that risk.
            Results update as you type.
          </CalcDescription>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="risk-bal">Account balance ($)</CalcLabel>
                <CalcInput
                  id="risk-bal"
                  type="number"
                  min="1"
                  step="1"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="risk-pct">Risk per trade (%)</CalcLabel>
                <CalcInput
                  id="risk-pct"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={riskPct}
                  onChange={(e) => setRiskPct(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="risk-pair">Currency pair</CalcLabel>
                <CalcSelect
                  id="risk-pair"
                  value={pair}
                  onChange={(e) => setPair(e.target.value as FxPair)}
                >
                  {FX_PAIR_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </CalcSelect>
              </CalcField>
            </CalcFormGroup>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="risk-sl">Stop-loss (pips)</CalcLabel>
                <CalcInput
                  id="risk-sl"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={stopPips}
                  onChange={(e) => setStopPips(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          {error && <CalcError role="alert">{error}</CalcError>}

          {riskMoney !== null && (
            <CalcOutput
              heading="Your risk at a glance"
              metrics={[
                {
                  label: "You risk",
                  value: formatMoney(riskMoney),
                  tone: "primary",
                  note: `${riskPct}% of ${formatMoney(parseFloat(balance) || 0)}`,
                },
                ...(lots !== null
                  ? [
                      {
                        label: "Lot size",
                        value: lots.toFixed(2),
                        tone: "accent" as const,
                        note: `For ${stopPips} pip stop on ${pair}`,
                      },
                    ]
                  : []),
                ...(pipValue !== null
                  ? [
                      {
                        label: "Pip value (1.00 lot)",
                        value: formatMoney(pipValue),
                        tone: "muted" as const,
                      },
                    ]
                  : []),
              ]}
            />
          )}

          <CalcHint>
            Risk $ = balance × risk %. Lot size = risk $ ÷ (stop pips × pip value). Example: $5,000
            at 1% = $50 risk; with a 20-pip stop on EUR/USD ≈ 0.25 lots.
          </CalcHint>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default RiskCalculator;
