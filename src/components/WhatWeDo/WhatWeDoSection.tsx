import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiPercent, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import { useLocale } from "../../contexts/LocaleContext";

const viewport = { once: true, amount: 0.2 } as const;

function parseNum(v: string): number {
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

const WhatWeDoSection: React.FC = () => {
  const { t } = useLocale();
  const [lots, setLots] = useState("10");
  const [rebatePerLot, setRebatePerLot] = useState("5");
  const [instrument, setInstrument] = useState("XAU/USD");

  const result = useMemo(
    () => Math.max(0, parseNum(lots) * parseNum(rebatePerLot)),
    [lots, rebatePerLot]
  );

  const stats = [
    {
      value: t("whatWeDo.statRebate"),
      label: t("whatWeDo.statRebateLabel"),
      icon: <FiPercent size={15} />,
    },
    {
      value: t("whatWeDo.statCost"),
      label: t("whatWeDo.statCostLabel"),
      icon: <FiTrendingDown size={15} />,
    },
    {
      value: t("whatWeDo.statCash"),
      label: t("whatWeDo.statCashLabel"),
      icon: <FiDollarSign size={15} />,
    },
  ];

  return (
    <Section aria-labelledby="what-we-do-heading">
      <Inner>
        <SectionHeadingSet
          upperText={t("whatWeDo.kicker")}
          mainHeading={t("whatWeDo.title")}
          subText={t("whatWeDo.p1")}
        />

        <Layout>
          <Story>
            <Lead
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55 }}
            >
              {t("whatWeDo.p2")}
            </Lead>
            <Paragraph
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              {t("whatWeDo.p3")}
            </Paragraph>
            <Paragraph
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: 0.14 }}
            >
              {t("whatWeDo.p4")}
            </Paragraph>

            <Stats>
              {stats.map((s, i) => (
                <StatCard
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                >
                  <StatIcon aria-hidden>{s.icon}</StatIcon>
                  <StatValue>{s.value}</StatValue>
                  <StatLabel>{s.label}</StatLabel>
                </StatCard>
              ))}
            </Stats>

            <Closing
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              {t("whatWeDo.p5")}
            </Closing>
          </Story>

          <Visual
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            <VisualKicker>Rebate calculator</VisualKicker>
            <VisualTitle>Estimate your cashback</VisualTitle>

            <Fields>
              <Field>
                <FieldLabel htmlFor="wwd-instrument">Instrument</FieldLabel>
                <FieldSelect
                  id="wwd-instrument"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                >
                  <option>XAU/USD</option>
                  <option>EUR/USD</option>
                  <option>GBP/USD</option>
                </FieldSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="wwd-rebate">Rebate / lot ($)</FieldLabel>
                <FieldInput
                  id="wwd-rebate"
                  inputMode="decimal"
                  value={rebatePerLot}
                  onChange={(e) => setRebatePerLot(e.target.value)}
                  placeholder="5"
                />
              </Field>
              <Field $full>
                <FieldLabel htmlFor="wwd-lots">Lots traded</FieldLabel>
                <FieldInput
                  id="wwd-lots"
                  inputMode="decimal"
                  value={lots}
                  onChange={(e) => setLots(e.target.value)}
                  placeholder="10"
                />
              </Field>
            </Fields>

            <ResultCard $profit>
              <ResultLabel>Estimated rebate</ResultLabel>
              <ResultValue $profit>${result.toFixed(2)}</ResultValue>
              <ResultHint>
                Formula: rebate per lot × lots · {instrument}
              </ResultHint>
            </ResultCard>

            <CalcLink to="/rebate-calculator">
              Open full rebate calculator <FiArrowUpRight />
            </CalcLink>
          </Visual>
        </Layout>
      </Inner>
    </Section>
  );
};

export default WhatWeDoSection;

const Section = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(2.75rem, 5.5vw, 4.25rem) 0;
  background:
    radial-gradient(ellipse 70% 55% at 8% 0%, rgba(251, 191, 36, 0.14), transparent 55%),
    radial-gradient(ellipse 55% 50% at 92% 100%, rgba(29, 78, 216, 0.1), transparent 50%),
    linear-gradient(180deg, #f7f9fc 0%, #eef2f8 48%, #f7f9fc 100%);
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.9fr);
  gap: clamp(1.25rem, 3vw, 2rem);
  align-items: start;
  margin-top: 0.35rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Story = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
`;

const Lead = styled(motion.p)`
  margin: 0;
  font-size: clamp(0.98rem, 1.2vw + 0.7rem, 1.08rem);
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const Paragraph = styled(motion.p)`
  margin: 0;
  font-size: clamp(0.9rem, 0.9vw + 0.7rem, 0.98rem);
  line-height: 1.7;
  color: #475569;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 0.35rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(19, 46, 88, 0.08);
  border-radius: 14px;
  padding: 0.9rem 0.95rem;
  box-shadow: 0 10px 24px rgba(19, 46, 88, 0.05);
  backdrop-filter: blur(6px);
`;

const StatIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 0.55rem;
`;

const StatValue = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.1;
`;

const StatLabel = styled.div`
  margin-top: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.muted};
`;

const Visual = styled(motion.aside)`
  position: relative;
  border-radius: 18px;
  padding: 1.25rem 1.2rem 1.2rem;
  background: linear-gradient(165deg, #0f2448 0%, #132e58 48%, #0c1f3d 100%);
  color: #fff;
  box-shadow: 0 22px 44px rgba(8, 20, 40, 0.28);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: auto -20% -30% auto;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.28), transparent 70%);
    pointer-events: none;
  }
`;

const VisualKicker = styled.p`
  position: relative;
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.95);
`;

const VisualTitle = styled.h3`
  position: relative;
  margin: 0 0 0.95rem;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
`;

const Fields = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
`;

const Field = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
`;

const FieldLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
`;

const fieldControlCss = `
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  color: #fff;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: rgba(251, 191, 36, 0.55);
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.12);
  }
`;

const FieldInput = styled.input`
  ${fieldControlCss}

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`;

const FieldSelect = styled.select`
  ${fieldControlCss}
  cursor: pointer;

  option {
    color: #0f172a;
  }
`;

const ResultCard = styled.div<{ $profit?: boolean }>`
  position: relative;
  border-radius: 12px;
  padding: 0.95rem 1rem;
  background: ${({ $profit }) =>
    $profit ? "rgba(251, 191, 36, 0.14)" : "rgba(248, 113, 113, 0.12)"};
  border: 1px solid
    ${({ $profit }) =>
      $profit ? "rgba(251, 191, 36, 0.35)" : "rgba(248, 113, 113, 0.35)"};
  margin-bottom: 0.85rem;
`;

const ResultLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 0.2rem;
`;

const ResultValue = styled.div<{ $profit?: boolean }>`
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ $profit, theme }) => ($profit ? theme.colors.gold : "#fca5a5")};
  line-height: 1.15;
`;

const ResultHint = styled.div`
  margin-top: 0.35rem;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
`;

const CalcLink = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(251, 191, 36, 0.95);
  text-decoration: none;

  &:hover {
    color: #fff;
  }
`;

const Closing = styled(motion.p)`
  margin: 1.15rem 0 0;
  padding: 0.95rem 1.05rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(19, 46, 88, 0.08);
  font-size: 0.92rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(19, 46, 88, 0.04);
`;
