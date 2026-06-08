import type { ApiBroker, RebateContentSection } from "../services/brokerService";

const DEFAULT_NOTES =
  "Please avoid churning as it is not accepted by brokers. If you simply wish to generate rebates for your account without actually trading, please don't — such rebates will be voided by the broker.";

function forexCryptoContent(broker: ApiBroker): RebateContentSection[] {
  const name = broker.name;
  const cashback = broker.cashbackRate || "competitive cashback";

  return [
    {
      title: `What is ${name} Cashback?`,
      paragraphs: [
        `Forex rebates (or cashback) is cash you get back for each trade you make. Just like any cashback program, you earn a portion of the costs charged by ${name} when you trade through our referral.`,
        `Each broker has different cashback rates for account types and instruments. For example, you may receive cashback on EURUSD trades but different rates — or none — on other instruments. Payment timing and minimum trade duration can also vary by broker.`,
        `LegendPips provides rebate tracking in your dashboard so you can see the cashback you earn over time. ${name} cashback helps increase profitability and cut trading costs without changing your spreads or commissions.`,
      ],
    },
    {
      title: `How ${name} cashback works`,
      paragraphs: [
        `When you open a new trading account with ${name} through LegendPips — or link an existing account under our referrer when supported — ${name} pays us a commission that we share with you as cashback.`,
        `Your trading conditions with ${name} stay the same. You simply earn ${cashback} back on eligible volume based on the schedule shown in the table above.`,
      ],
    },
    {
      title: `How much ${name} cashback can I earn?`,
      paragraphs: [
        `Your ${name} cashback depends on trading volume: the more you trade, the more you can earn.`,
        `Use our rebate calculator to estimate monthly or yearly cashback based on your average lots per day and instrument.`,
      ],
    },
    {
      title: `How ${name} cashback is paid`,
      paragraphs: [
        `Cashback is tracked in your LegendPips dashboard. Payouts are typically released after we reconcile rebates with ${name} — often within a few days after month end.`,
        `You can withdraw accumulated cashback using the options available on your rebates page once funds are released.`,
      ],
    },
    {
      title: `Is this the best ${name} cashback?`,
      paragraphs: [
        `LegendPips aims to offer competitive ${name} cashback rates, transparent reporting, and support if you need help with account setup or rebate questions.`,
        `If you already trade with ${name}, linking through LegendPips lets you recover part of your trading costs on eligible activity.`,
      ],
    },
  ];
}

function propContent(broker: ApiBroker): RebateContentSection[] {
  const name = broker.name;

  return [
    {
      title: `What is ${name} prop cashback?`,
      paragraphs: [
        `Prop firm cashback returns part of your challenge purchase price when you buy through LegendPips. Rates differ for first-time and repeat purchases, as shown in the table above.`,
        `This works like a rebate on evaluation fees — you keep the same challenge terms from ${name} while earning cashback on qualifying purchases.`,
      ],
    },
    {
      title: `How ${name} prop cashback works`,
      paragraphs: [
        `Select a challenge program and complete checkout via our partner link. After your purchase is confirmed, cashback is credited according to the first-purchase or repeat-purchase tier.`,
        `Repeat buyers often receive a higher cashback percentage on subsequent challenge purchases with the same firm.`,
      ],
    },
    {
      title: `How much can I earn?`,
      paragraphs: [
        `Earnings depend on challenge size and how often you purchase. Check the Challenge cashback table for exact percentages per program.`,
        `Combine cashback with any listed discount codes where applicable to lower your effective challenge cost.`,
      ],
    },
    {
      title: `How cashback is paid`,
      paragraphs: [
        `Prop cashback appears in your LegendPips rebates dashboard after purchase verification. Withdraw once the amount is released to your account balance.`,
      ],
    },
  ];
}

export function resolveRebateNotes(broker: ApiBroker): string {
  if (broker.rebateNotes?.trim()) return broker.rebateNotes.trim();
  return DEFAULT_NOTES;
}

export function resolveRebateContentSections(broker: ApiBroker): RebateContentSection[] {
  if (broker.rebateContentSections?.length) return broker.rebateContentSections;
  if (broker.rebateCategory === "prop") return propContent(broker);
  return forexCryptoContent(broker);
}
