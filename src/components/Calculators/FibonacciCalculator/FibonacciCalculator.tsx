import React, { useState } from "react";
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
  CalcButtonRow,
  CalcButton,
  CalcToggleRow,
  CalcToggle,
  CalcSplitResults,
  CalcPanelTitle,
  CalcStack,
  CalcResultTile,
  CalcError,
  CalcHint,
} from "../calculatorStyles";

const RETRACEMENT_LEVELS = [
  { label: "0% (b)", ratio: 0 },
  { label: "23.6%", ratio: 0.236 },
  { label: "38.2%", ratio: 0.382 },
  { label: "50%", ratio: 0.5 },
  { label: "61.8%", ratio: 0.618 },
  { label: "76.4%", ratio: 0.764 },
  { label: "100% (a)", ratio: 1 },
  { label: "138.2%", ratio: 1.382 },
];

const EXTENSION_LEVELS = [
  { label: "261.8%", ratio: 2.618 },
  { label: "200%", ratio: 2 },
  { label: "161.8%", ratio: 1.618 },
  { label: "138.2%", ratio: 1.382 },
  { label: "100%", ratio: 1 },
  { label: "61.8%", ratio: 0.618 },
];

type Trend = "uptrend" | "downtrend";
type FibResult = { label: string; value: number };

function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const decimals = abs >= 100 ? 2 : abs >= 1 ? 4 : 5;
  return value.toFixed(decimals);
}

function computeLevels(
  high: number,
  low: number,
  trend: Trend,
  custom?: number
): { retracements: FibResult[]; extensions: FibResult[] } {
  const range = high - low;
  const up = trend === "uptrend";

  const retracements = RETRACEMENT_LEVELS.map(({ label, ratio }) => ({
    label,
    value: up ? low + range * ratio : high - range * ratio,
  }));

  const base =
    custom != null && Number.isFinite(custom) ? custom : up ? high : low;

  const extensions = EXTENSION_LEVELS.map(({ label, ratio }) => ({
    label,
    value: up ? base + range * ratio : base - range * ratio,
  }));

  return { retracements, extensions };
}

const FibonacciCalculator: React.FC = () => {
  const [high, setHigh] = useState("1.12000");
  const [low, setLow] = useState("1.10000");
  const [custom, setCustom] = useState("");
  const [trend, setTrend] = useState<Trend>("uptrend");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    retracements: FibResult[];
    extensions: FibResult[];
  } | null>(null);

  const calculate = () => {
    const h = parseFloat(high);
    const l = parseFloat(low);
    const cRaw = custom.trim();
    const c = cRaw === "" ? undefined : parseFloat(cRaw);

    if (!Number.isFinite(h) || !Number.isFinite(l)) {
      setError("Enter valid High and Low price values.");
      setResults(null);
      return;
    }
    if (h <= l) {
      setError("High value must be greater than Low value.");
      setResults(null);
      return;
    }
    if (cRaw !== "" && !Number.isFinite(c as number)) {
      setError("Custom value must be a valid number (or leave blank).");
      setResults(null);
      return;
    }

    setError(null);
    setResults(computeLevels(h, l, trend, c));
  };

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Fibonacci Calculator</CalcHeader>
          <CalcDescription>
            Identify retracement and extension levels from a swing high and low. Choose
            uptrend or downtrend to map classic Fibonacci zones for entries, exits, and
            targets.
          </CalcDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              calculate();
            }}
          >
            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="fib-high">High Value</CalcLabel>
                  <CalcInput
                    id="fib-high"
                    type="number"
                    step="any"
                    value={high}
                    onChange={(e) => setHigh(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="fib-low">Low Value</CalcLabel>
                  <CalcInput
                    id="fib-low"
                    type="number"
                    step="any"
                    value={low}
                    onChange={(e) => setLow(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="fib-custom">Custom Value</CalcLabel>
                  <CalcInput
                    id="fib-custom"
                    type="number"
                    step="any"
                    placeholder="Optional"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcToggleRow>
              <CalcToggle
                type="button"
                $active={trend === "uptrend"}
                onClick={() => setTrend("uptrend")}
              >
                Uptrend
              </CalcToggle>
              <CalcToggle
                type="button"
                $active={trend === "downtrend"}
                onClick={() => setTrend("downtrend")}
              >
                Downtrend
              </CalcToggle>
            </CalcToggleRow>

            <CalcButtonRow>
              <CalcButton type="submit">Calculate</CalcButton>
            </CalcButtonRow>

            {error && <CalcError role="alert">{error}</CalcError>}
            {!error && !results && (
              <CalcHint>
                Use the high and low of your swing for the selected trend.
              </CalcHint>
            )}
          </form>

          {results && (
            <CalcSplitResults>
              <div>
                <CalcPanelTitle>
                  {trend === "uptrend" ? "Uptrend" : "Downtrend"} Retracements
                </CalcPanelTitle>
                <CalcStack>
                  {results.retracements.map((row) => (
                    <CalcResultTile
                      key={row.label}
                      $highlight={
                        row.label.includes("61.8") || row.label.includes("50%")
                      }
                    >
                      {row.label}
                      <span>{formatPrice(row.value)}</span>
                    </CalcResultTile>
                  ))}
                </CalcStack>
              </div>

              <div>
                <CalcPanelTitle>Extensions</CalcPanelTitle>
                <CalcStack>
                  {results.extensions.map((row) => (
                    <CalcResultTile
                      key={row.label}
                      $highlight={row.label.includes("161.8")}
                    >
                      {row.label}
                      <span>{formatPrice(row.value)}</span>
                    </CalcResultTile>
                  ))}
                </CalcStack>
              </div>
            </CalcSplitResults>
          )}
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default FibonacciCalculator;
