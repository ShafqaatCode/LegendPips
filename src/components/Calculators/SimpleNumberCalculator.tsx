import React, { useMemo, useState } from "react";
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
  CalcButtonRow,
  CalcButton,
  CalcResult,
  CalcError,
} from "./calculatorStyles";

export type SimpleField = { key: string; label: string; defaultValue?: string };

type Props = {
  title: string;
  description: string;
  fields: SimpleField[];
  compute: (values: Record<string, number>) => { ok: true; text: string } | { ok: false; error: string };
};

const SimpleNumberCalculator: React.FC<Props> = ({ title, description, fields, compute }) => {
  const initial = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.key, f.defaultValue || ""])),
    [fields]
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>{title}</CalcHeader>
          <CalcDescription>{description}</CalcDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const nums: Record<string, number> = {};
              for (const f of fields) {
                const n = parseFloat(values[f.key]);
                if (!Number.isFinite(n)) {
                  setError(`Enter a valid number for ${f.label}.`);
                  setResult(null);
                  return;
                }
                nums[f.key] = n;
              }
              const out = compute(nums);
              if (!out.ok) {
                setError(out.error);
                setResult(null);
                return;
              }
              setError(null);
              setResult(out.text);
            }}
          >
            <CalcFormRow>
              {fields.map((f) => (
                <CalcFormGroup key={f.key}>
                  <CalcField>
                    <CalcLabel htmlFor={f.key}>{f.label}</CalcLabel>
                    <CalcInput
                      id={f.key}
                      value={values[f.key] || ""}
                      onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                    />
                  </CalcField>
                </CalcFormGroup>
              ))}
            </CalcFormRow>
            <CalcButtonRow>
              <CalcButton type="submit">Calculate</CalcButton>
            </CalcButtonRow>
          </form>
          {error && <CalcError>{error}</CalcError>}
          {result && <CalcResult>{result}</CalcResult>}
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default SimpleNumberCalculator;
