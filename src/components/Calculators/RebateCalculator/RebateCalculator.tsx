import React, { useEffect, useState } from "react";
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
  CalcHint,
} from "../calculatorStyles";
import CalcOutput from "../CalcOutput";

const RebateCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [rebatePerLot, setRebatePerLot] = useState("5");
  const [lots, setLots] = useState("10");
  const [accountType, setAccountType] = useState("Standard");
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const rebate = parseFloat(rebatePerLot);
    const volume = parseFloat(lots);
    if (!Number.isFinite(rebate) || !Number.isFinite(volume) || rebate < 0 || volume < 0) {
      setProfit(0);
      return;
    }
    setProfit(rebate * volume);
  }, [rebatePerLot, lots]);

  const sym = depositCurrency === "EUR" ? "€" : depositCurrency === "GBP" ? "£" : "$";

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Rebate Calculator</CalcHeader>
          <CalcDescription>
            See how much cashback you could earn. Enter rebate per lot and traded volume for a clear
            earnings projection.
          </CalcDescription>

          <CalcFormRow>
            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="instrument">Instrument</CalcLabel>
                <CalcSelect
                  id="instrument"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                >
                  <option>EUR/USD</option>
                  <option>GBP/USD</option>
                  <option>XAU/USD</option>
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
                <CalcLabel htmlFor="rebate">Rebate per lot</CalcLabel>
                <CalcInput
                  id="rebate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={rebatePerLot}
                  onChange={(e) => setRebatePerLot(e.target.value)}
                />
              </CalcField>
            </CalcFormGroup>

            <CalcFormGroup>
              <CalcField>
                <CalcLabel htmlFor="lots">Lots traded</CalcLabel>
                <CalcInput
                  id="lots"
                  type="number"
                  min="0"
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
                <CalcLabel htmlFor="account">Account type</CalcLabel>
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

          <CalcOutput
            heading="Estimated cashback"
            metrics={[
              {
                label: "Total rebate",
                value: `${sym}${profit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                tone: "primary",
                note: `${lots || 0} lots × ${rebatePerLot || 0} rebate`,
              },
              {
                label: "Per lot",
                value: `${sym}${Number(rebatePerLot || 0).toFixed(2)}`,
                tone: "accent",
              },
              {
                label: "Account",
                value: accountType,
                tone: "muted",
                note: instrument,
              },
            ]}
          />

          <CalcHint>
            Educational estimate based on your inputs. Actual LegendPips cashback depends on broker
            and account terms.
          </CalcHint>
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default RebateCalculator;
