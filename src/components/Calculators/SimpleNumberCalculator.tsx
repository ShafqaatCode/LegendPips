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
  CalcButtonRow,
  CalcButton,
  CalcError,
  CalcHint,
} from "./calculatorStyles";
import CalcOutput, { type CalcMetric } from "./CalcOutput";

export type SimpleField = {
  key: string;
  label: string;
  defaultValue?: string;
  step?: string;
  min?: string;
};

export type ComputeOk = { ok: true; metrics: CalcMetric[]; heading?: string };
export type ComputeFail = { ok: false; error: string };

type Props = {
  title: string;
  description: string;
  fields: SimpleField[];
  compute: (values: Record<string, number>) => ComputeOk | ComputeFail;
  live?: boolean;
  hint?: string;
};

function buildInitial(fields: SimpleField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""]));
}

const SimpleNumberCalculator: React.FC<Props> = ({
  title,
  description,
  fields,
  compute,
  live = true,
  hint,
}) => {
  const fieldKeys = fields.map((f) => f.key).join("|");
  const [values, setValues] = useState<Record<string, string>>(() => buildInitial(fields));
  const [metrics, setMetrics] = useState<CalcMetric[]>([]);
  const [heading, setHeading] = useState("Your result");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(buildInitial(fields));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when field keys change
  }, [fieldKeys]);

  const run = (src: Record<string, string> = values) => {
    const nums: Record<string, number> = {};
    for (const f of fields) {
      const raw = (src[f.key] ?? "").trim();
      if (raw === "") {
        setError(`Enter a value for ${f.label}.`);
        setMetrics([]);
        return;
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        setError(`Enter a valid number for ${f.label}.`);
        setMetrics([]);
        return;
      }
      nums[f.key] = n;
    }
    try {
      const out = compute(nums);
      if (!out.ok) {
        setError(out.error);
        setMetrics([]);
        return;
      }
      setError(null);
      setMetrics(out.metrics);
      setHeading(out.heading || "Your result");
    } catch {
      setError("Could not calculate. Check your inputs.");
      setMetrics([]);
    }
  };

  useEffect(() => {
    if (!live) return;
    const id = window.setTimeout(() => run(values), 100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, live, fieldKeys]);

  return (
    <CalcPage>
      <CalcContainer>
        <CalcCard>
          <CalcHeader>{title}</CalcHeader>
          <CalcDescription>{description}</CalcDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
          >
            <CalcFormRow>
              {fields.map((f) => (
                <CalcFormGroup key={f.key}>
                  <CalcField>
                    <CalcLabel htmlFor={f.key}>{f.label}</CalcLabel>
                    <CalcInput
                      id={f.key}
                      type="number"
                      inputMode="decimal"
                      step={f.step || "any"}
                      min={f.min}
                      value={values[f.key] ?? ""}
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
          {error && <CalcError role="alert">{error}</CalcError>}
          {metrics.length > 0 && <CalcOutput heading={heading} metrics={metrics} />}
          {hint && <CalcHint>{hint}</CalcHint>}
        </CalcCard>
      </CalcContainer>
    </CalcPage>
  );
};

export default SimpleNumberCalculator;
