import SimpleNumberCalculator from "../../components/Calculators/SimpleNumberCalculator";
import RiskCalculator from "../../components/Calculators/RiskCalculator";
import TradingSlider from "../../components/TradingCard/TradingSlider";
import InstructionsSection from "../../components/Calculators/InstructionSet";
import { calcCryptoExchangeFees, calcRiskOfRuin } from "../../utils/marketTools";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ExtraCalculatorPage({
  title,
  description,
  fields,
  compute,
  steps,
  hint,
}: {
  title: string;
  description: string;
  fields: { key: string; label: string; defaultValue?: string; step?: string; min?: string }[];
  compute: Parameters<typeof SimpleNumberCalculator>[0]["compute"];
  steps: string[];
  hint?: string;
}) {
  return (
    <div>
      <SimpleNumberCalculator
        title={title}
        description={description}
        fields={fields}
        compute={compute}
        hint={hint}
      />
      <TradingSlider />
      <InstructionsSection
        calculatorName={title}
        steps={steps}
        footer="Educational estimates only — not trading advice."
      />
    </div>
  );
}

export function ProfitCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Profit Calculator"
      description="Quick P/L: lots × pip value × pips. For EUR/USD, 1.00 lot ≈ $10 per pip."
      fields={[
        { key: "lots", label: "Lots", defaultValue: "1", min: "0.01", step: "0.01" },
        { key: "pipValue", label: "Pip value ($ per lot)", defaultValue: "10", min: "0.01" },
        { key: "pips", label: "Pips won / lost", defaultValue: "20", min: "0.1" },
      ]}
      compute={(v) => {
        if (v.lots <= 0 || v.pipValue <= 0) return { ok: false, error: "Lots and pip value must be > 0." };
        const pl = v.lots * v.pipValue * v.pips;
        return {
          ok: true,
          heading: "Estimated profit / loss",
          metrics: [
            {
              label: "P/L",
              value: money(pl),
              tone: pl >= 0 ? "positive" : "negative",
              note: pl >= 0 ? "Projected profit" : "Projected loss",
            },
            { label: "Lots", value: String(v.lots), tone: "muted" },
            { label: "Pips", value: String(v.pips), tone: "muted" },
          ],
        };
      }}
      hint="Example: 0.5 lot × $10 × 30 pips = $150."
      steps={["Enter lots.", "Enter pip value in account currency (often $10 for EUR/USD).", "Enter pip distance."]}
    />
  );
}

export function RiskRewardCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Risk / Reward Calculator"
      description="Compare stop distance to target distance (or $ risk to $ reward)."
      fields={[
        { key: "risk", label: "Risk ($ or pips)", defaultValue: "100", min: "0.01" },
        { key: "reward", label: "Reward ($ or pips)", defaultValue: "200", min: "0" },
      ]}
      compute={(v) => {
        if (v.risk <= 0) return { ok: false, error: "Risk must be greater than 0." };
        const ratio = v.reward / v.risk;
        return {
          ok: true,
          heading: "Risk to reward",
          metrics: [
            {
              label: "R : R ratio",
              value: `1 : ${ratio.toFixed(2)}`,
              tone: "primary",
              note: ratio >= 2 ? "Solid target vs risk" : ratio >= 1 ? "Break-even edge" : "Reward is below risk",
            },
            { label: "Risk", value: String(v.risk), tone: "muted" },
            { label: "Reward", value: String(v.reward), tone: "accent" },
          ],
        };
      }}
      steps={["Enter risk (same unit as reward).", "Enter reward."]}
    />
  );
}

export function DrawdownCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Drawdown Calculator"
      description="How much equity fell from peak to trough."
      fields={[
        { key: "peak", label: "Peak equity ($)", defaultValue: "10000", min: "0.01" },
        { key: "trough", label: "Trough equity ($)", defaultValue: "8500", min: "0" },
      ]}
      compute={(v) => {
        if (v.peak <= 0) return { ok: false, error: "Peak must be greater than 0." };
        if (v.trough > v.peak) return { ok: false, error: "Trough cannot be above peak." };
        const dd = ((v.peak - v.trough) / v.peak) * 100;
        const lost = v.peak - v.trough;
        return {
          ok: true,
          heading: "Drawdown summary",
          metrics: [
            {
              label: "Drawdown",
              value: `${dd.toFixed(2)}%`,
              tone: "primary",
              note: "Peak to trough drop",
            },
            {
              label: "Amount lost",
              value: money(lost),
              tone: "negative",
            },
            { label: "Peak", value: money(v.peak), tone: "muted" },
            { label: "Trough", value: money(v.trough), tone: "muted" },
          ],
        };
      }}
      steps={["Enter highest equity.", "Enter lowest equity after that."]}
    />
  );
}

export function CompoundCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Compound Calculator"
      description="Project balance if you earn a steady monthly % return."
      fields={[
        { key: "start", label: "Starting balance ($)", defaultValue: "1000", min: "0.01" },
        { key: "rate", label: "Monthly return (%)", defaultValue: "5", step: "0.1" },
        { key: "months", label: "Months", defaultValue: "12", min: "1", step: "1" },
      ]}
      compute={(v) => {
        if (v.start <= 0) return { ok: false, error: "Starting balance must be > 0." };
        if (v.months < 1) return { ok: false, error: "Months must be at least 1." };
        const months = Math.floor(v.months);
        const end = v.start * Math.pow(1 + v.rate / 100, months);
        const profit = end - v.start;
        const growthPct = (profit / v.start) * 100;
        return {
          ok: true,
          heading: `After ${months} months`,
          metrics: [
            {
              label: "Final balance",
              value: money(end),
              tone: "primary",
              note: "Compounded monthly",
            },
            {
              label: "Total profit",
              value: money(profit),
              tone: profit >= 0 ? "positive" : "negative",
              note: `${growthPct >= 0 ? "+" : ""}${growthPct.toFixed(1)}% growth`,
            },
            { label: "Started with", value: money(v.start), tone: "muted" },
            { label: "Monthly rate", value: `${v.rate}%`, tone: "accent" },
          ],
        };
      }}
      hint="Assumes returns compound monthly with no withdrawals."
      steps={["Enter starting balance.", "Enter monthly percent return.", "Enter number of months."]}
    />
  );
}

export function CryptoProfitCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Crypto Profit Calculator"
      description="Simple buy → sell profit for a coin amount (fees ignored)."
      fields={[
        { key: "qty", label: "Quantity", defaultValue: "1", min: "0" },
        { key: "buy", label: "Buy price ($)", defaultValue: "40000", min: "0.01" },
        { key: "sell", label: "Sell price ($)", defaultValue: "45000", min: "0" },
      ]}
      compute={(v) => {
        if (v.qty <= 0 || v.buy <= 0) return { ok: false, error: "Quantity and buy price must be > 0." };
        const pl = (v.sell - v.buy) * v.qty;
        const pct = ((v.sell - v.buy) / v.buy) * 100;
        return {
          ok: true,
          heading: "Trade outcome",
          metrics: [
            {
              label: "Profit / loss",
              value: money(pl),
              tone: pl >= 0 ? "positive" : "negative",
              note: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
            },
            { label: "Buy cost", value: money(v.buy * v.qty), tone: "muted" },
            { label: "Sell value", value: money(v.sell * v.qty), tone: "accent" },
          ],
        };
      }}
      steps={["Enter quantity.", "Enter buy price.", "Enter sell price."]}
    />
  );
}

export function LotCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Lot Calculator"
      description="Convert base-currency units into standard lots (1 lot = 100,000 units)."
      fields={[{ key: "units", label: "Units", defaultValue: "100000", min: "0" }]}
      compute={(v) => {
        if (v.units < 0) return { ok: false, error: "Units cannot be negative." };
        return {
          ok: true,
          heading: "Lot conversion",
          metrics: [
            {
              label: "Standard lots",
              value: (v.units / 100000).toFixed(4),
              tone: "primary",
              note: "100,000 units each",
            },
            {
              label: "Mini lots",
              value: (v.units / 10000).toFixed(4),
              tone: "accent",
              note: "10,000 units each",
            },
            {
              label: "Micro lots",
              value: (v.units / 1000).toFixed(4),
              tone: "muted",
              note: "1,000 units each",
            },
          ],
        };
      }}
      steps={["Enter position size in units of the base currency."]}
    />
  );
}

export function AccountRiskCalculatorPage() {
  return (
    <div>
      <RiskCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Account Risk"
        steps={[
          "Enter your account balance in dollars.",
          "Enter the percent of the account you are willing to risk (e.g. 1).",
          "Pick the currency pair and your stop-loss in pips.",
          "Read the risk amount ($) and the suggested lot size.",
        ]}
        footer="Educational estimate only — confirm pip value and lot size with your broker."
      />
    </div>
  );
}

export function BreakEvenCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Break-Even Calculator"
      description="How many pips you need to cover spread + commission before profit starts."
      fields={[
        { key: "spread", label: "Spread (pips)", defaultValue: "1.2", min: "0" },
        { key: "commission", label: "Commission ($ per lot, round-trip)", defaultValue: "7", min: "0" },
        { key: "pipValue", label: "Pip value ($ per lot)", defaultValue: "10", min: "0.01" },
      ]}
      compute={(v) => {
        if (v.pipValue <= 0) return { ok: false, error: "Pip value must be > 0." };
        const commissionPips = v.commission / v.pipValue;
        const be = v.spread + commissionPips;
        return {
          ok: true,
          heading: "Break-even point",
          metrics: [
            {
              label: "Break-even",
              value: `${be.toFixed(2)} pips`,
              tone: "primary",
              note: "Move needed before profit",
            },
            { label: "From spread", value: `${v.spread.toFixed(2)} pips`, tone: "muted" },
            {
              label: "From commission",
              value: `${commissionPips.toFixed(2)} pips`,
              tone: "accent",
            },
          ],
        };
      }}
      hint="Price must move past break-even before the trade is in profit after costs."
      steps={[
        "Enter your typical spread in pips.",
        "Enter round-trip commission in $ per lot (0 if none).",
        "Enter pip value (often $10 on EUR/USD).",
      ]}
    />
  );
}

export function RiskOfRuinCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Risk of Ruin Calculator"
      description="Estimate the chance of blowing the account with fixed risk % and reward:risk."
      fields={[
        { key: "winRate", label: "Win rate (%)", defaultValue: "55", min: "0" },
        { key: "riskPct", label: "Risk per trade (% of account)", defaultValue: "2", min: "0.1" },
        { key: "rr", label: "Reward : Risk", defaultValue: "1.5", min: "0.1" },
      ]}
      compute={(v) => {
        const res = calcRiskOfRuin(v.winRate, v.riskPct, v.rr);
        if (!res.ok) return res;
        return {
          ok: true,
          heading: "Account survival estimate",
          metrics: [
            {
              label: "Risk of ruin",
              value: `${res.percent.toFixed(2)}%`,
              tone: res.percent >= 50 ? "negative" : res.percent >= 20 ? "accent" : "positive",
              note: "Chance of losing the account",
            },
            {
              label: "Edge per R",
              value: `${(res.edge * 100).toFixed(2)}%`,
              tone: res.edge > 0 ? "positive" : "negative",
            },
            { label: "Win rate", value: `${v.winRate}%`, tone: "muted" },
          ],
        };
      }}
      steps={[
        "Enter win rate.",
        "Enter risk per trade as % of account.",
        "Enter average reward relative to risk (e.g. 2 = 2:1).",
      ]}
    />
  );
}

export function CryptoExchangeFeesCalculatorPage() {
  return (
    <ExtraCalculatorPage
      title="Crypto Exchange Fees Calculator"
      description="Estimate buy + sell fees for a round-trip crypto trade."
      fields={[
        { key: "amount", label: "Trade size (USD)", defaultValue: "1000", min: "0.01" },
        { key: "buyFee", label: "Buy fee (%)", defaultValue: "0.1", min: "0" },
        { key: "sellFee", label: "Sell fee (%)", defaultValue: "0.1", min: "0" },
      ]}
      compute={(v) => {
        const res = calcCryptoExchangeFees(v.amount, v.buyFee, v.sellFee);
        if (!res.ok) return res;
        return {
          ok: true,
          heading: "Round-trip fees",
          metrics: [
            {
              label: "Total fees",
              value: money(res.total),
              tone: "primary",
              note: "Buy + sell combined",
            },
            { label: "Buy fee", value: money(res.buyFee), tone: "muted" },
            { label: "Sell fee", value: money(res.sellFee), tone: "muted" },
            {
              label: "Net after fees",
              value: money(res.netAfterRoundTrip),
              tone: "accent",
            },
          ],
        };
      }}
      steps={["Enter trade size in USD.", "Enter buy fee %.", "Enter sell fee %."]}
    />
  );
}
