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

const RebateCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("XAU/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [rebatePerLot, setRebatePerLot] = useState<number>(0);
  const [lots, setLots] = useState<number>(0);
  const [accountType, setAccountType] = useState("Standard");
  const [profit, setProfit] = useState<number>(0);

  const calculateProfit = () => {
    setProfit(rebatePerLot * lots);
  };

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Rebate Calculator</CalcHeader>
          <CalcDescription>
            See how much cashback you could earn. Enter rebate per lot, traded volume, and
            account details for a clear earnings projection.
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
                  <CalcLabel htmlFor="rebate">Rebate Per Lot</CalcLabel>
                  <CalcInput
                    id="rebate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={rebatePerLot}
                    onChange={(e) => setRebatePerLot(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="lots">Lots</CalcLabel>
                  <CalcInput
                    id="lots"
                    type="number"
                    min="0"
                    step="0.01"
                    value={lots}
                    onChange={(e) => setLots(parseFloat(e.target.value) || 0)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="account">Account Type</CalcLabel>
                  <CalcSelect
                    id="account"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option>Standard</option>
                    <option>Pro</option>
                    <option>VIP</option>
                  </CalcSelect>
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcButtonRow>
              <CalcButton type="button" onClick={calculateProfit}>
                Calculate
              </CalcButton>
              <CalcResult>
                Profit: {profit.toFixed(2)} {depositCurrency}
              </CalcResult>
            </CalcButtonRow>
          </form>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default RebateCalculator;
