// RebateCalculator.tsx
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
  /* flex: 1 1 45%; */
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
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #132e58;

`;

// Inner Box (dark small box)
const InnerInput = styled.input`
  /* width: 100%; */
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
  /* width: 100%; */
  width: 160px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  font-size: 20px;
  background: #132e58;
  color: #fff;
  text-align: center;

  &:focus {
    /* outline: none; */
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

const ProfitBox = styled.div`
  background: #de992f;
  color: #ffffff;
  font-weight: 600;
  padding: 8px 60px;
  border-radius: 6px;
  font-size: 24px;
`;

// ===== Component =====
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
    <Container>
      <Header>Rebate Calculator</Header>
      <Description>
        Our Rebate Calculator is a dedicated tool for cashback platform users,
        instantly showing how much cashback a trader could receive. By entering
        deposit currency, rebate tier, traded currency pair, and trade volume
        (lots), traders can see clear earning projections — supporting informed
        and strategic choices.
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
            <Label htmlFor="rebate">Rebate Per Lot</Label>
              <InnerInput
                id="rebate"
                type="number"
                min="0"
                step="0.01"
                value={rebatePerLot}
                onChange={(e) => setRebatePerLot(parseFloat(e.target.value) || 0)}
              />
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
            <Label htmlFor="lots">Lots</Label>
              <InnerInput
                id="lots"
                type="number"
                min="0"
                step="0.01"
                value={lots}
                onChange={(e) => setLots(parseFloat(e.target.value) || 0)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <OuterBox>
            <Label htmlFor="account">Account Type</Label>
              <InnerSelect
                id="account"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option>Standard</option>
                <option>Pro</option>
                <option>VIP</option>
              </InnerSelect>
            </OuterBox>
          </FormGroup>
        </FormRow>

        <ButtonRow>
          <Button type="button" onClick={calculateProfit}>
            Calculate
          </Button>
          <ProfitBox>Profit : {profit.toFixed(2)}</ProfitBox>
        </ButtonRow>
      </form>
    </Container>
  );
};

export default RebateCalculator;
