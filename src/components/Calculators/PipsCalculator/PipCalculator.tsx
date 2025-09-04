// PipCalculator.tsx
import React, { useState } from "react";
import styled from "styled-components";

// ===== Styled Components =====
const Container = styled.section`
  max-width: 1250px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
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
  min-width: 220px;
  width: 500px;
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
  background: #0d2c54;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #173a6a;
  }
`;

const ResultBox = styled.div`
  background: #de992f;
  color: #ffffff;
  font-weight: 600;
  padding: 8px 60px;
  border-radius: 6px;
  font-size: 24px;
`;

// ===== Component =====
const PipCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [pips, setPips] = useState<number>(1);           // default 1 pip
  const [contractSize, setContractSize] = useState<number>(100000); // standard lot
  const [result, setResult] = useState<number>(0);

  const calculatePipValue = () => {
    // Basic pip value formula (simplified for demo):
    // Pip Value = (Pip * Contract Size) / 10,000
    const pipValue = (pips * contractSize) / 10000;
    setResult(pipValue);
  };

  return (
    <Container>
      <Header>Pip Calculator</Header>
      <Description>
        Our Pip Calculator is a vital tool for Forex traders to accurately determine pip values across different account
        types. Whether trading standard, mini, or micro lots, it helps you measure the impact of price movements on your
        positions. By knowing the precise pip value, you can manage risk more effectively and make smarter trading decisions.
      </Description>

      <form onSubmit={(e) => e.preventDefault()}>
        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label htmlFor="instrument">Instrument</Label>
              <InnerSelect
                id="instrument"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              >
                <option>EUR/USD</option>
                <option>GBP/USD</option>
                <option>USD/JPY</option>
                <option>XAU/USD</option>
              </InnerSelect>
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label htmlFor="currency">Deposit Currency</Label>
              <InnerSelect
                id="currency"
                value={depositCurrency}
                onChange={(e) => setDepositCurrency(e.target.value)}
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
              <Label htmlFor="pips">Pips</Label>
              <InnerInput
                id="pips"
                type="number"
                min="0"
                step="0.01"
                value={pips}
                onChange={(e) => setPips(parseFloat(e.target.value) || 0)}
              />
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label htmlFor="contract">Contract size (Units)</Label>
              <InnerInput
                id="contract"
                type="number"
                min="1"
                step="1"
                value={contractSize}
                onChange={(e) => setContractSize(parseFloat(e.target.value) || 0)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <ButtonRow>
          <Button type="button" onClick={calculatePipValue}>
            Calculate
          </Button>
          <ResultBox>
            Result : {result.toFixed(2)}
          </ResultBox>
        </ButtonRow>
      </form>
    </Container>
  );
};

export default PipCalculator;
