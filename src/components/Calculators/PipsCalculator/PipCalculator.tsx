import React, { useCallback, useState } from "react";
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
  CalcButtonRow,
  CalcButton,
  CalcResult,
  CalcHint,
  CalcError,
} from "../calculatorStyles";

const PipCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState<PipInstrument>("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState<DepositCurrency>("USD");
  const [pips, setPips] = useState("20");
  const [lots, setLots] = useState("1");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCalculation = useCallback(() => {
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
  }, [depositCurrency, instrument, lots, pips]);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Pip Calculator</CalcHeader>
          <CalcDescription>
            Measure how much a price move is worth in your account currency. Select your
            instrument, lot size, and pip distance, then calculate the total pip value.
          </CalcDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCalculation();
            }}
          >
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

            <CalcButtonRow>
              <CalcButton type="submit">Calculate</CalcButton>
              {result !== null && !error && (
                <CalcResult aria-live="polite">
                  {formatPipValue(result, depositCurrency)}
                </CalcResult>
              )}
            </CalcButtonRow>

            {error && <CalcError role="alert">{error}</CalcError>}
            <CalcHint>
              Uses standard contract sizes (100,000 units for FX, 100 oz for gold). Non-USD
              conversions use approximate reference rates.
            </CalcHint>
          </form>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default PipCalculator;
