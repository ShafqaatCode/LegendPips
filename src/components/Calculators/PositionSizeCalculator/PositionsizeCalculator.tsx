// PositionSizeCalculator.tsx
import React, { useState } from "react";
import styled from "styled-components";

// ===== Styled Components =====
const Container = styled.section`
  max-width: 1250px;
  margin: 80px auto 40px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;

   @media (max-width: 786px) {
    margin: 0;
  }
`;

const Header = styled.h2`
  background: #de992f;
  color: #ffffff;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  display: inline-block;
  font-size: 24px;
`;

const Description = styled.p`
  margin: 16px 0 50px;
  color: #132e58;
  font-size: 20px;
  line-height: 1.6;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  margin: 0 20px 20px 20px;

  @media (max-width: 600px) {
    margin: auto;
  }
`;

const FormGroup = styled.div`
  min-width: 250px;
  width: 550px;
`;

const Label = styled.label`
  font-size: 20px;
  margin-bottom: 6px;
  display: block;
  color: #132e58;
  
  font-weight: 500;
`;

const OuterBox = styled.div`
  border: 2px solid #132e58;
  border-radius: 8px;
  padding: 5px 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

`;

const InnerInput = styled.input`
  width: 160px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  font-size: 20px;
  background: #132e58;
  color: #fff;
  text-align: center;

  &:focus {
    outline: none;
  }
`;

const InnerSelect = styled.select`
  width: 160px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  font-size: 20px;
  background: #132e58;
  color: #fff;
  text-align: center;

  &:focus {
    outline: none;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

const Button = styled.button`
  background: #132e58;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #173a6a;
  }
`;

const ResultsGrid = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
`;

const ResultBox = styled.div`
  background: #de992f;
  color: #ffffff;
  font-weight: 600;
  padding: 16px 40px;
  border-radius: 6px;
  font-size: 20px;
  text-align: center;
`;

// ===== Component =====
const PositionSizeCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("XAU/USD");
  const [currency, setCurrency] = useState("USD");
  const [accountSize, setAccountSize] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [contractSize, setContractSize] = useState<number>(0);
  const [riskMode, setRiskMode] = useState("%");
  const [riskValue, setRiskValue] = useState<number>(0);

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

    // Formula for units
    const units = stopLoss > 0 ? moneyRisk / stopLoss : 0;
    // Lots calculation (units / contract size)
    const lots = contractSize > 0 ? units / contractSize : 0;

    setResults({
      money: moneyRisk,
      units,
      lots,
    });
  };

  return (
    <Container>
      <Header>Position Size Calculator</Header>
      <Description>
        The Lot Size Calculator is an essential risk management tool that
        enables traders to determine the optimal position size for each trade.
        By factoring in the selected currency pair, risk tolerance, and chosen
        stop-loss level, it helps maintain a balanced approach to trading.
      </Description>

      <form onSubmit={(e) => e.preventDefault()}>
        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label>Instrument</Label>
              <InnerSelect
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              >
                <option>XAU/USD</option>
                <option>EUR/USD</option>
                <option>GBP/USD</option>
              </InnerSelect>
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label>Deposit Currency</Label>
              <InnerSelect
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </InnerSelect>
            </OuterBox>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label>Account Size</Label>
              <InnerInput
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
              />
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label>Stop-Loss (Pips)</Label>
              <InnerInput
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label>Contract Size (Units)</Label>
              <InnerInput
                type="number"
                value={contractSize}
                onChange={(e) =>
                  setContractSize(parseFloat(e.target.value) || 0)
                }
              />
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label>Risk Ratio / Money</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <InnerInput
                  type="number"
                  value={riskValue}
                  onChange={(e) =>
                    setRiskValue(parseFloat(e.target.value) || 0)
                  }
                />
                <InnerSelect
                  value={riskMode}
                  onChange={(e) => setRiskMode(e.target.value)}
                >
                  <option value="%">%</option>
                  <option value="$">$</option>
                </InnerSelect>
              </div>
            </OuterBox>
          </FormGroup>
        </FormRow>

        <ButtonRow>
          <Button type="button" onClick={calculate}>
            Calculate
          </Button>
        </ButtonRow>
      </form>

      <ResultsGrid>
        <ResultBox>Money, {currency}: {results.money.toFixed(2)}</ResultBox>
        <ResultBox>Units: {results.units.toFixed(2)}</ResultBox>
        <ResultBox>Lots: {results.lots.toFixed(3)}</ResultBox>
      </ResultsGrid>
    </Container>
  );
};

export default PositionSizeCalculator;
