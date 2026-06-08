import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
  calculatePipValue,
  formatPipValue,
  PIP_INSTRUMENT_OPTIONS,
  type DepositCurrency,
  type PipInstrument,
} from "../../../utils/pipCalculator";

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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
    margin: 12px 0 30px;
  }
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 20px 20px;

  @media (max-width: 600px) {
    margin: 0 0 20px;
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
  gap: 0.5rem;
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
  cursor: pointer;

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

const Hint = styled.p`
  margin: 0.75rem 20px 0;
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.45;
`;

const PipCalculator: React.FC = () => {
  const [instrument, setInstrument] = useState<PipInstrument>("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState<DepositCurrency>("USD");
  const [pips, setPips] = useState("20");
  const [lots, setLots] = useState("1");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCalculation = useCallback(() => {
    const parsedLots = parseFloat(lots);
    const parsedPips = parseFloat(pips);

    if (!Number.isFinite(parsedLots) || parsedLots <= 0) {
      setError("Enter a valid lot size greater than 0.");
      setResult(null);
      return;
    }
    if (!Number.isFinite(parsedPips) || parsedPips <= 0) {
      setError("Enter a valid pip count greater than 0.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      calculatePipValue({
        instrument,
        lots: parsedLots,
        pips: parsedPips,
        depositCurrency,
      })
    );
  }, [depositCurrency, instrument, lots, pips]);

  return (
    <Container>
      <Header>Pip Calculator</Header>
      <Description>
        The Pip Calculator helps you measure how much a price move is worth in your account
        currency. Select your instrument, lot size, and pip distance, then calculate the total
        pip value.
      </Description>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCalculation();
        }}
      >
        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label htmlFor="instrument">Instrument</Label>
              <InnerSelect
                id="instrument"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as PipInstrument)}
              >
                {PIP_INSTRUMENT_OPTIONS.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </InnerSelect>
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label htmlFor="currency">Deposit Currency</Label>
              <InnerSelect
                id="currency"
                value={depositCurrency}
                onChange={(e) => setDepositCurrency(e.target.value as DepositCurrency)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </InnerSelect>
            </OuterBox>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <OuterBox>
              <Label htmlFor="lots">Trade Size (Lots)</Label>
              <InnerInput
                id="lots"
                type="number"
                min="0.01"
                step="0.01"
                value={lots}
                onChange={(e) => setLots(e.target.value)}
              />
            </OuterBox>
          </FormGroup>

          <FormGroup>
            <OuterBox>
              <Label htmlFor="pips">Pips</Label>
              <InnerInput
                id="pips"
                type="number"
                min="0.01"
                step="0.01"
                value={pips}
                onChange={(e) => setPips(e.target.value)}
              />
            </OuterBox>
          </FormGroup>
        </FormRow>

        <ButtonRow>
          <Button type="submit">Calculate</Button>
          {result !== null && !error && (
            <ResultBox aria-live="polite">
              {formatPipValue(result, depositCurrency)}
            </ResultBox>
          )}
        </ButtonRow>

        {error && (
          <Hint style={{ color: "#b91c1c" }} role="alert">
            {error}
          </Hint>
        )}
        <Hint>
          Uses standard contract sizes (100,000 units for FX, 100 oz for gold). Non-USD conversions
          use approximate reference rates.
        </Hint>
      </form>
    </Container>
  );
};

export default PipCalculator;
