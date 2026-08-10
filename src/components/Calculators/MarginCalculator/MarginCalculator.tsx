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
} from "../calculatorStyles";

const MarginCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("XAU/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [currentPrice, setCurrentPrice] = useState<number>(3371.59);
  const [contractSize, setContractSize] = useState<number>(100);
  const [leverage, setLeverage] = useState("100:1");
  const [result, setResult] = useState<number>(0);

  const calculateMargin = () => {
    const lev = parseInt(leverage.split(":")[0], 10) || 1;
    const margin = (currentPrice * contractSize) / lev;
    setResult(margin);
  };

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Margin Calculator</CalcHeader>
          <CalcDescription>
            Determine the exact margin required to open a position by factoring in your account
            currency, trading pair, leverage, and trade size — so you can manage risk and avoid
            margin issues with confidence.
          </CalcDescription>

          <form onSubmit={(e) => e.preventDefault()}>
            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="instrument">Instrument</CalcLabel>
                  <CalcSelect
                    id="instrument"
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
                  <CalcLabel htmlFor="currency">Deposit Currency</CalcLabel>
                  <CalcSelect
                    id="currency"
                    value={depositCurrency}
                    onChange={(e) => setDepositCurrency(e.target.value)}
                  >
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
                  <CalcLabel htmlFor="price">Current Price</CalcLabel>
                  <CalcInput
                    id="price"
                    type="number"
                    step="0.00001"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="contract">Contract Size (Units)</CalcLabel>
                  <CalcInput
                    id="contract"
                    type="number"
                    step="1"
                    value={contractSize}
                    onChange={(e) => setContractSize(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="leverage">Leverage</CalcLabel>
                  <CalcSelect
                    id="leverage"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                  >
                    <option>50:1</option>
                    <option>100:1</option>
                    <option>200:1</option>
                    <option>500:1</option>
                  </CalcSelect>
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcButtonRow>
              <CalcButton type="button" onClick={calculateMargin}>
                Calculate
              </CalcButton>
              {result > 0 && (
                <CalcResult>
                  Result: {result.toFixed(5)} {depositCurrency}
                </CalcResult>
              )}
            </CalcButtonRow>
          </form>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default MarginCalculator;
