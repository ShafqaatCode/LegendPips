// MarginCalculator.tsx
import React, { useState } from "react";
import styled from "styled-components";


// ===== Styled Components =====

const Wrapper = styled.div`

`
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

// Outer Box (bordered container)
const OuterBox = styled.div`
  border: 2px solid #132e58;
  border-radius: 8px;
  padding: 5px 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Inner Box (dark small box)
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
const MarginCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState("XAU/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [currentPrice, setCurrentPrice] = useState<number>(3371.59); // matches screenshot
  const [contractSize, setContractSize] = useState<number>(100);      // matches screenshot
  const [leverage, setLeverage] = useState("100:1");                   // matches screenshot
  const [result, setResult] = useState<number>(0);

  const calculateMargin = () => {
    // Margin = (Price * ContractSize) / Leverage
    const lev = parseInt(leverage.split(":")[0], 10) || 1;
    const margin = (currentPrice * contractSize) / lev;
    setResult(margin);
  };

  return (
    <Wrapper>


      <Container>
        <Header>Margin Calculator</Header>
        <Description>
          The LegendPips Margin Calculator is an indispensable tool for traders to determine the exact margin required to open
          a position. By factoring in your account currency, chosen trading pair, leverage, and trade size, it ensures you
          maintain proper margin levels at all times. This promotes responsible risk management, prevents margin-related
          issues, and helps you trade with confidence knowing your positions are fully supported.
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
                <Label htmlFor="price">Current Price (XAU)</Label>
                <InnerInput
                  id="price"
                  type="number"
                  step="0.00001"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                />
              </OuterBox>
            </FormGroup>

            <FormGroup>
              <OuterBox>
                <Label htmlFor="contract">Contract size (Units)</Label>
                <InnerInput
                  id="contract"
                  type="number"
                  step="1"
                  value={contractSize}
                  onChange={(e) => setContractSize(parseFloat(e.target.value) || 0)}
                />
              </OuterBox>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <OuterBox>
                <Label htmlFor="leverage">Leverage</Label>
                <InnerSelect
                  id="leverage"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                >
                  <option>50:1</option>
                  <option>100:1</option>
                  <option>200:1</option>
                  <option>500:1</option>
                </InnerSelect>
              </OuterBox>
            </FormGroup>
          </FormRow>

          <ButtonRow>
            <Button type="button" onClick={calculateMargin}>
              Calculate
            </Button>
            <ResultBox>
              Result : {result.toFixed(5)}
            </ResultBox>
          </ButtonRow>
        </form>

      </Container>
      
    </Wrapper>
  );
};

export default MarginCalculator;
