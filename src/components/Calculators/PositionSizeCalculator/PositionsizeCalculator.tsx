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
  CalcSelect,
  CalcButtonRow,
  CalcButton,
  CalcResult,
  CalcResultsGrid,
} from "../calculatorStyles";

const PositionSizeCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("XAU/USD");
  const [currency, setCurrency] = useState("USD");
  const [accountSize, setAccountSize] = useState<number>(1000);
  const [stopLoss, setStopLoss] = useState<number>(20);
  const [contractSize, setContractSize] = useState<number>(100);
  const [riskMode, setRiskMode] = useState("%");
  const [riskValue, setRiskValue] = useState<number>(2);

  const [results, setResults] = useState({
    money: 0,
    units: 0,
    lots: 0,
  });

  const calculate = () => {
    let moneyRisk = 0;
    if (riskMode === "%") {
      moneyRisk = (accountSize * riskValue) / 100;
    } else {
      moneyRisk = riskValue;
    }
    const units = stopLoss > 0 ? moneyRisk / stopLoss : 0;
    const lots = contractSize > 0 ? units / contractSize : 0;
    setResults({ money: moneyRisk, units, lots });
  };

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Position Size Calculator</CalcHeader>
          <CalcDescription>
            Determine optimal lot size from your account balance, risk tolerance, and
            stop-loss — so you can manage risk and size trades with confidence.
          </CalcDescription>

          <form onSubmit={(e) => e.preventDefault()}>
            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel>Instrument</CalcLabel>
                  <CalcSelect
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                  >
                    <option>XAU/USD</option>
                    <option>EUR/USD</option>
                    <option>GBP/USD</option>
                  </CalcSelect>
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel>Deposit Currency</CalcLabel>
                  <CalcSelect value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </CalcSelect>
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel>Account Size</CalcLabel>
                  <CalcInput
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel>Stop-Loss (Pips)</CalcLabel>
                  <CalcInput
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel>Contract Size (Units)</CalcLabel>
                  <CalcInput
                    type="number"
                    value={contractSize}
                    onChange={(e) => setContractSize(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel>Risk Ratio / Money</CalcLabel>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CalcInput
                      type="number"
                      value={riskValue}
                      onChange={(e) => setRiskValue(parseFloat(e.target.value) || 0)}
                      style={{ width: "5.5rem" }}
                    />
                    <CalcSelect
                      value={riskMode}
                      onChange={(e) => setRiskMode(e.target.value)}
                      style={{ width: "4rem" }}
                    >
                      <option value="%">%</option>
                      <option value="$">$</option>
                    </CalcSelect>
                  </div>
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcButtonRow>
              <CalcButton type="button" onClick={calculate}>
                Calculate
              </CalcButton>
            </CalcButtonRow>
          </form>

          {results.money > 0 && (
            <CalcResultsGrid>
              <CalcResult>
                Money ({currency}): ${results.money.toFixed(2)}
              </CalcResult>
              <CalcResult $muted>Units: {results.units.toFixed(0)}</CalcResult>
              <CalcResult $muted>Lots: {results.lots.toFixed(3)}</CalcResult>
            </CalcResultsGrid>
          )}
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default PositionSizeCalculator;
