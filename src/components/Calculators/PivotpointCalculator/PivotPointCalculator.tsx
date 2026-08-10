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
  CalcResultsGrid,
  CalcResultTile,
} from "../calculatorStyles";

const PivotPointCalculator: React.FC = () => {
  const [type, setType] = useState("Standard");
  const [high, setHigh] = useState<string>("3000");
  const [low, setLow] = useState<string>("2000");
  const [open, setOpen] = useState<string>("2800");
  const [close, setClose] = useState<string>("2800");
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
    let r1 = 0,
      r2 = 0,
      r3 = 0,
      s1 = 0,
      s2 = 0,
      s3 = 0;

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
        r1 = c + ((h - l) * 1.1) / 12;
        r2 = c + ((h - l) * 1.1) / 6;
        r3 = c + ((h - l) * 1.1) / 4;
        s1 = c - ((h - l) * 1.1) / 12;
        s2 = c - ((h - l) * 1.1) / 6;
        s3 = c - ((h - l) * 1.1) / 4;
        break;
      case "DeMark": {
        const x = c < o ? h + 2 * l + c : 2 * h + l + c;
        pivot = x / 4;
        r1 = x / 2 - l;
        s1 = x / 2 - h;
        break;
      }
    }

    setResults({ pivot, r1, r2, r3, s1, s2, s3 });
  };

  const fmt = (n: number) => n.toFixed(2);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>Pivot Point Calculator</CalcHeader>
          <CalcDescription>
            Calculate Standard, Camarilla, Woodie, and DeMark pivot levels from OHLC data to
            map support and resistance for entries, exits, and stop placement.
          </CalcDescription>

          <form onSubmit={(e) => e.preventDefault()}>
            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="type">Type</CalcLabel>
                  <CalcSelect
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Standard</option>
                    <option>Woodie</option>
                    <option>Camarilla</option>
                    <option>DeMark</option>
                  </CalcSelect>
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="high">High Price</CalcLabel>
                  <CalcInput
                    id="high"
                    type="number"
                    value={high}
                    onChange={(e) => setHigh(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="low">Low Price</CalcLabel>
                  <CalcInput
                    id="low"
                    type="number"
                    value={low}
                    onChange={(e) => setLow(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>

              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="open">Open Price</CalcLabel>
                  <CalcInput
                    id="open"
                    type="number"
                    value={open}
                    onChange={(e) => setOpen(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcFormRow>
              <CalcFormGroup>
                <CalcField>
                  <CalcLabel htmlFor="close">Close Price</CalcLabel>
                  <CalcInput
                    id="close"
                    type="number"
                    value={close}
                    onChange={(e) => setClose(e.target.value)}
                  />
                </CalcField>
              </CalcFormGroup>
            </CalcFormRow>

            <CalcButtonRow>
              <CalcButton type="button" onClick={calculate}>
                Calculate
              </CalcButton>
            </CalcButtonRow>
          </form>

          {results.pivot > 0 && (
            <CalcResultsGrid>
              <CalcResultTile>
                Resistance 3 <span>{fmt(results.r3)}</span>
              </CalcResultTile>
              <CalcResultTile>
                Resistance 2 <span>{fmt(results.r2)}</span>
              </CalcResultTile>
              <CalcResultTile>
                Resistance 1 <span>{fmt(results.r1)}</span>
              </CalcResultTile>
              <CalcResultTile $highlight>
                Pivot Point <span>{fmt(results.pivot)}</span>
              </CalcResultTile>
              <CalcResultTile>
                Support 1 <span>{fmt(results.s1)}</span>
              </CalcResultTile>
              <CalcResultTile>
                Support 2 <span>{fmt(results.s2)}</span>
              </CalcResultTile>
              <CalcResultTile>
                Support 3 <span>{fmt(results.s3)}</span>
              </CalcResultTile>
            </CalcResultsGrid>
          )}
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default PivotPointCalculator;
