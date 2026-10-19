import React, { useEffect, useState } from "react";
import {
  calculatePositionSize,
  FX_PAIR_OPTIONS,
  formatMoney,
  type FxPair,
} from "../../../utils/forexCalculators";
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
} from "../calculatorStyles";
import CalcOutput from "../CalcOutput";

const PositionSizeCalculator: React.FC = () => {
  const [pair, setPair] = useState<FxPair>("EUR/USD");
  const [balance, setBalance] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [stopPips, setStopPips] = useState("20");
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<{
    riskMoney: number;
    pipValue: number;
    lots: number;
    units: number;
  } | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const res = calculatePositionSize({
        pair,
        accountBalance: parseFloat(balance),
        riskPercent: parseFloat(riskPct),
        stopLossPips: parseFloat(stopPips),
      });
      if (!res.ok) {
        setError(res.error);
        setOut(null);
        return;
      }
      setError(null);
      setOut(res);
    }, 150);
    return () => window.clearTimeout(id);
  }, [pair, balance, riskPct, stopPips]);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Position Size Calculator</CalcHeader>
          <CalcDescription>
            Find a safe lot size from your account balance, risk %, and stop-loss in pips. Uses
            standard pip values (≈ $10/pip per lot on EUR/USD). Results update as you type.
          </CalcDescription>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="pair">Currency pair</CalcLabel>
                <CalcSelect
                  id="pair"
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
                <CalcLabel htmlFor="balance">Account balance (USD)</CalcLabel>
                <CalcInput
                  id="balance"
                  type="number"
                  min="1"
                  step="1"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="risk">Risk per trade (%)</CalcLabel>
                <CalcInput
                  id="risk"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={riskPct}
                  onChange={(e) => setRiskPct(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="sl">Stop-loss (pips)</CalcLabel>
                <CalcInput
                  id="sl"
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

          {out && (
            <CalcOutput
              heading="Recommended position"
              metrics={[
                {
                  label: "Lot size",
                  value: out.lots.toFixed(2),
                  tone: "primary",
                  note: "Trade this size to stay in risk",
                },
                {
                  label: "Risk amount",
                  value: formatMoney(out.riskMoney),
                  tone: "accent",
                  note: `${riskPct}% of balance`,
                },
                {
                  label: "Pip value (1.00 lot)",
                  value: formatMoney(out.pipValue),
                  tone: "muted",
                },
                {
                  label: "Units",
                  value: Math.round(out.units).toLocaleString(),
                  tone: "muted",
                },
              ]}
            />
          )}

          <CalcHint>
            Formula: lots = risk $ ÷ (stop pips × pip value per lot). Educational estimate for a USD
            account — confirm pip value with your broker.
          </CalcHint>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default PositionSizeCalculator;
