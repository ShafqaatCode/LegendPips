// PipCalculator.tsx
import React, { useState } from "react";
import styled from "styled-components";

// ===== Styled Components =====
const Container = styled.section`
  max-width: 1250px;
 margin: 80px auto 40px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 40px auto 20px;
    padding: 20px;
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
  flex: 1;
  min-width: 220px;
  max-width: 500px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 100%;
    max-width: 100%;
  }
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
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
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
  padding: 12px 40px;
  border-radius: 8px;
  font-size: 24px;
  white-space: nowrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 24px;
    font-size: 20px;
    width: 100%;
    text-align: center;
  }
`;

// ===== Component =====
const PipCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("XAU/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [pips, setPips] = useState<number>(20);
  const [contractSize, setContractSize] = useState<number>(100);
  const [result, setResult] = useState<number>(0);

  const calculatePipValue = () => {
    // For XAU/USD and similar pairs: Pip Value = (Pips * Contract Size) / 10
    // Simplified calculation for demo
    const pipValue = (pips * contractSize) / 10;
    setResult(pipValue);
  };

  return (
    <Container>
      <Header>Pip Calculator</Header>
      <Description>
        The Pip Calculator is a vital tool for Forex traders to accurately determine pip values across different account types. It helps you measure the impact of price movements and enables smarter trading decisions.
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
                <option>XAU/USD</option>
                <option>EUR/USD</option>
                <option>GBP/USD</option>
                <option>USD/JPY</option>
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
          {result > 0 && (
            <ResultBox>
              US ${result.toFixed(2)}
            </ResultBox>
          )}
        </ButtonRow>
      </form>
    </Container>
  );
};

export default PipCalculator;
