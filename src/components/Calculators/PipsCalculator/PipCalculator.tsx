import React, { useEffect, useState } from "react";
import {
  calculatePipValue,
  formatPipValue,
  PIP_INSTRUMENT_OPTIONS,
  type DepositCurrency,
  type PipInstrument,
} from "../../../utils/pipCalculator";
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

const PipCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState<PipInstrument>("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState<DepositCurrency>("USD");
  const [pips, setPips] = useState("20");
  const [lots, setLots] = useState("1");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const parsedLots = parseFloat(lots);
      const parsedPips = parseFloat(pips);

      if (!Number.isFinite(parsedLots) || parsedLots <= 0) {
        setError("Enter a valid lot size greater than 0.");
        setResult(null);
        return;
      }
      if (!Number.isFinite(parsedPips) || parsedPips <= 0) {
        setError("Enter a valid pip count greater than 0.");
        setResult(null);
        return;
      }

      setError(null);
      setResult(
        calculatePipValue({
          instrument,
          lots: parsedLots,
          pips: parsedPips,
          depositCurrency,
        })
      );
    }, 150);
    return () => window.clearTimeout(id);
  }, [depositCurrency, instrument, lots, pips]);

  const perPip =
    result !== null && Number.isFinite(parseFloat(pips)) && parseFloat(pips) > 0
      ? result / parseFloat(pips)
      : null;

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Pip Calculator</CalcHeader>
          <CalcDescription>
            See how much a price move is worth in your account currency. Pick the pair, lots, and
            pips — the result updates as you type.
          </CalcDescription>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="instrument">Instrument</CalcLabel>
                <CalcSelect
                  id="instrument"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value as PipInstrument)}
                >
                  {PIP_INSTRUMENT_OPTIONS.map((pair) => (
                    <option key={pair} value={pair}>
                      {pair}
                    </option>
                  ))}
                </CalcSelect>
              </CalcField>
            </CalcFormGroup>

            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="currency">Deposit Currency</CalcLabel>
                <CalcSelect
                  id="currency"
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value as DepositCurrency)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </CalcSelect>
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="lots">Trade Size (Lots)</CalcLabel>
                <CalcInput
                  id="lots"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={lots}
                  onChange={(e) => setLots(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>

            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="pips">Pips</CalcLabel>
                <CalcInput
                  id="pips"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={pips}
                  onChange={(e) => setPips(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>
          </CalcFormRow>

          {error && <CalcError role="alert">{error}</CalcError>}

          {result !== null && !error && (
            <CalcOutput
              heading="Pip value"
              metrics={[
                {
                  label: "Total value",
                  value: formatPipValue(result, depositCurrency),
                  tone: "primary",
                  note: `${pips} pips × ${lots} lot(s)`,
                },
                ...(perPip !== null
                  ? [
                      {
                        label: "Per pip",
                        value: formatPipValue(perPip, depositCurrency),
                        tone: "accent" as const,
                        note: "For this lot size",
                      },
                    ]
                  : []),
              ]}
            />
          )}

          <CalcHint>
            Uses standard contract sizes (100,000 units for FX, 100 oz for gold). Non-USD
            conversions use approximate reference rates.
          </CalcHint>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default PipCalculator;
