import SimpleNumberCalculator from "../../components/Calculators/SimpleNumberCalculator";
import TradingSlider from "../../components/TradingCard/TradingSlider";
import InstructionsSection from "../../components/Calculators/InstructionSet";

function ExtraCalculatorPage({
  title,
  description,
  fields,
  compute,
  steps,
}: {
  title: string;
  description: string;
  fields: { key: string; label: string; defaultValue?: string }[];
  compute: (v: Record<string, number>) => { ok: true; text: string } | { ok: false; error: string };
  steps: string[];
}) {
  return (
    <div>
      <SimpleNumberCalculator title={title} description={description} fields={fields} compute={compute} />
      <TradingSlider />
      <InstructionsSection calculatorName={title} steps={steps} footer="Educational estimates only — not trading advice." />
    </div>
  );
}

export function ProfitCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Profit Calculator"
      description="Estimate P/L from lot size, pip value, and pip move."
      fields={[
        { key: "lots", label: "Lots", defaultValue: "1" },
        { key: "pipValue", label: "Pip value ($)", defaultValue: "10" },
        { key: "pips", label: "Pips", defaultValue: "20" },
      ]}
      compute={(v) => ({ ok: true, text: `Estimated P/L: $${(v.lots * v.pipValue * v.pips).toFixed(2)}` })}
      steps={["Enter lots.", "Enter pip value in account currency.", "Enter pip distance."]}
    />
  );
}

export function RiskRewardCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Risk / Reward Calculator"
      description="See the reward-to-risk ratio of a planned trade."
      fields={[
        { key: "risk", label: "Risk ($)", defaultValue: "100" },
        { key: "reward", label: "Reward ($)", defaultValue: "200" },
      ]}
      compute={(v) =>
        v.risk <= 0
          ? { ok: false, error: "Risk must be greater than 0." }
          : { ok: true, text: `R:R = 1 : ${(v.reward / v.risk).toFixed(2)}` }
      }
      steps={["Enter dollar risk to stop.", "Enter dollar reward to target."]}
    />
  );
}

export function DrawdownCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Drawdown Calculator"
      description="Peak-to-trough drawdown as a percentage of equity."
      fields={[
        { key: "peak", label: "Peak equity", defaultValue: "10000" },
        { key: "trough", label: "Trough equity", defaultValue: "8500" },
      ]}
      compute={(v) =>
        v.peak <= 0
          ? { ok: false, error: "Peak must be greater than 0." }
          : { ok: true, text: `Drawdown: ${(((v.peak - v.trough) / v.peak) * 100).toFixed(2)}%` }
      }
      steps={["Enter peak equity.", "Enter trough equity."]}
    />
  );
}

export function CompoundCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Compound Calculator"
      description="Project account growth with a constant monthly return."
      fields={[
        { key: "start", label: "Starting balance", defaultValue: "1000" },
        { key: "rate", label: "Monthly %", defaultValue: "5" },
        { key: "months", label: "Months", defaultValue: "12" },
      ]}
      compute={(v) => {
        const end = v.start * Math.pow(1 + v.rate / 100, v.months);
        return { ok: true, text: `Projected balance: $${end.toFixed(2)}` };
      }}
      steps={["Enter starting balance.", "Enter monthly percent return.", "Enter number of months."]}
    />
  );
}

export function CryptoProfitCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Crypto Profit Calculator"
      description="Simple buy/sell profit for a coin quantity. Fees not included."
      fields={[
        { key: "qty", label: "Quantity", defaultValue: "1" },
        { key: "buy", label: "Buy price", defaultValue: "40000" },
        { key: "sell", label: "Sell price", defaultValue: "45000" },
      ]}
      compute={(v) => ({
        ok: true,
        text: `P/L: $${((v.sell - v.buy) * v.qty).toFixed(2)} (${(((v.sell - v.buy) / v.buy) * 100).toFixed(2)}%)`,
      })}
      steps={["Enter quantity.", "Enter buy price.", "Enter sell price."]}
    />
  );
}

export function LotCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Lot Calculator"
      description="Convert units to standard lots (100,000 units of base currency)."
      fields={[{ key: "units", label: "Units", defaultValue: "100000" }]}
      compute={(v) => ({ ok: true, text: `Standard lots: ${(v.units / 100000).toFixed(4)}` })}
      steps={["Enter position size in units of the base currency."]}
    />
  );
}
