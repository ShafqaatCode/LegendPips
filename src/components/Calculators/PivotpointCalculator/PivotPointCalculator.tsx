// PivotPointCalculator.tsx
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

const ResultBox = styled.div<{ highlight?: boolean }>`
  background: ${({ highlight }) => (highlight ? "#de992f" : "#D9D9D9")};
  color: ${({ highlight }) => (highlight ? "#ffffff" : "#132e58")};
  font-weight: 600;
  padding: 16px;
  border-radius: 6px;
  font-size: 24px;
  text-align: center;
  

  span{
    margin-left: 10px;
  }
`;

// ===== Component =====
const PivotPointCalculator: React.FC = () => {
  const [type, setType] = useState("Standard");
  const [high, setHigh] = useState<string>("0000");
  const [low, setLow] = useState<string>("0000");
  const [open, setOpen] = useState<string>("0000");
  const [close, setClose] = useState<string>("0000");
  const [results, setResults] = useState<Record<string, number>>({
    pivot: 0,
    r1: 0,
    r2: 0,
    r3: 0,
    s1: 0,
    s2: 0,
    s3: 0,
  });

  const calculate = () => {
    const h = parseFloat(high) || 0;
    const l = parseFloat(low) || 0;
    const o = parseFloat(open) || 0;
    const c = parseFloat(close) || 0;

    let pivot = 0;
    let r1 = 0, r2 = 0, r3 = 0, s1 = 0, s2 = 0, s3 = 0;

    switch (type) {
      case "Standard":
        pivot = (h + l + c) / 3;
        r1 = 2 * pivot - l;
        s1 = 2 * pivot - h;
        r2 = pivot + (h - l);
        s2 = pivot - (h - l);
        r3 = h + 2 * (pivot - l);
        s3 = l - 2 * (h - pivot);
        break;

      case "Woodie":
        pivot = (h + l + 2 * o) / 4;
        r1 = 2 * pivot - l;
        s1 = 2 * pivot - h;
        r2 = pivot + (h - l);
        s2 = pivot - (h - l);
        break;

      case "Camarilla":
        pivot = (h + l + c) / 3;
        r1 = c + (h - l) * 1.1 / 12;
        r2 = c + (h - l) * 1.1 / 6;
        r3 = c + (h - l) * 1.1 / 4;
        s1 = c - (h - l) * 1.1 / 12;
        s2 = c - (h - l) * 1.1 / 6;
        s3 = c - (h - l) * 1.1 / 4;
        break;

      case "DeMark":
        let x = c < o ? (h + 2 * l + c) : (2 * h + l + c);
        pivot = x / 4;
        r1 = x / 2 - l;
        s1 = x / 2 - h;
        break;
    }

    setResults({ pivot, r1, r2, r3, s1, s2, s3 });
  };

  return (
    <Container>
      <Header>Pivot Point Calculator</Header>
      <Description>
        The Pivot Point Calculator helps traders identify potential support and resistance levels using OHLC data.
        Choose from Standard, Camarilla, Woodie’s, or DeMark’s methods to calculate multiple levels.
      </Description>

      <form onSubmit={(e) => e.preventDefault()}>
        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label htmlFor="type">Type</Label>
              <InnerSelect id="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option>Standard</option>
                <option>Woodie</option>
                <option>Camarilla</option>
                <option>DeMark</option>
              </InnerSelect>
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label htmlFor="high">High Price</Label>
              <InnerInput
                id="high"
                type="number"
                value={high}
                onChange={(e) => setHigh(e.target.value)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label htmlFor="low">Low Price</Label>
              <InnerInput
                id="low"
                type="number"
                value={low}
                onChange={(e) => setLow(e.target.value)}
              />
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label htmlFor="open">Open Price</Label>
              <InnerInput
                id="open"
                type="number"
                value={open}
                onChange={(e) => setOpen(e.target.value)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label htmlFor="close">Close Price</Label>
              <InnerInput
                id="close"
                type="number"
                value={close}
                onChange={(e) => setClose(e.target.value)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <ButtonRow>
          <Button type="button" onClick={calculate}>Calculate</Button>
        </ButtonRow>
      </form>

      <ResultsGrid>
        <ResultBox>Resistance 3: <span>{results.r3.toFixed(2)}</span> </ResultBox>
        <ResultBox>Resistance 2: <span>{results.r2.toFixed(2)}</span></ResultBox>
        <ResultBox>Resistance 1: <span>{results.r1.toFixed(2)}</span></ResultBox>
        <ResultBox highlight>Pivot Point: <span>{results.pivot.toFixed(2)}</span></ResultBox>
        <ResultBox>Support 1: <span>{results.s1.toFixed(2)}</span></ResultBox>
        <ResultBox>Support 2: <span>{results.s2.toFixed(2)}</span></ResultBox>
        <ResultBox>Support 3: <span>{results.s3.toFixed(2)}</span></ResultBox>
      </ResultsGrid>
    </Container>
  );
};

export default PivotPointCalculator;
