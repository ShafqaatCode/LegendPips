import React, { useEffect, useState } from "react";
import {
  calculateRequiredMargin,
  FX_PAIR_OPTIONS,
  FX_PAIRS,
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

const LEVERAGE_OPTIONS = ["50", "100", "200", "500", "1000"];

const MarginCalculator: React.FC = () => {
  const [pair, setPair] = useState<FxPair>("EUR/USD");
  const [lots, setLots] = useState("1");
  const [price, setPrice] = useState(String(FX_PAIRS["EUR/USD"].defaultPrice));
  const [leverage, setLeverage] = useState("100");
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<{ notionalUsd: number; marginUsd: number } | null>(null);

  useEffect(() => {
    setPrice(String(FX_PAIRS[pair].defaultPrice));
  }, [pair]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const res = calculateRequiredMargin({
        pair,
        lots: parseFloat(lots),
        leverage: parseFloat(leverage),
        price: parseFloat(price),
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
  }, [pair, lots, leverage, price]);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Margin Calculator</CalcHeader>
          <CalcDescription>
            See how much margin you need to open a trade. Enter pair, lots, price, and leverage.
            Results update as you type.
          </CalcDescription>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="m-pair">Currency pair</CalcLabel>
                <CalcSelect
                  id="m-pair"
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
                <CalcLabel htmlFor="m-lots">Trade size (lots)</CalcLabel>
                <CalcInput
                  id="m-lots"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={lots}
                  onChange={(e) => setLots(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="m-price">Current price</CalcLabel>
                <CalcInput
                  id="m-price"
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="m-lev">Leverage</CalcLabel>
                <CalcSelect
                  id="m-lev"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                >
                  {LEVERAGE_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}:1
                    </option>
                  ))}
                </CalcSelect>
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          {error && <CalcError role="alert">{error}</CalcError>}

          {out && (
            <CalcOutput
              heading="Margin required"
              metrics={[
                {
                  label: "Required margin",
                  value: formatMoney(out.marginUsd),
                  tone: "primary",
                  note: `At ${leverage}:1 leverage`,
                },
                {
                  label: "Notional value",
                  value: formatMoney(out.notionalUsd),
                  tone: "accent",
                  note: "Full position size",
                },
              ]}
            />
          )}

          <CalcHint>
            Formula: margin = (price × contract size × lots) ÷ leverage. Contract size is 100,000
            for FX and 100 for gold. Educational estimate for a USD account.
          </CalcHint>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default MarginCalculator;
