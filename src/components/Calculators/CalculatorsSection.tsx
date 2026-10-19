import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowUpRight } from "react-icons/fi";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import { CALCULATORS_CATALOG } from "../../data/calculatorsCatalog";
import { getCalculatorIcon } from "./calculatorIcons";

const HOME_CALCULATOR_IDS = [
  "lot-size",
  "account-risk",
  "pip",
  "margin",
  "profit",
  "break-even",
] as const;

const Section = styled.section`
  background: linear-gradient(180deg, #f7f8fb 0%, #ffffff 55%, #ffffff 100%);
  padding: clamp(2.75rem, 5vw, 3.75rem) 0;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2rem);
  box-sizing: border-box;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.8vw, 1rem);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.05rem 1.1rem 1.15rem;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid #e4e8ef;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(19, 46, 88, 0.04), 0 8px 20px rgba(19, 46, 88, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.5);
    box-shadow: 0 2px 4px rgba(19, 46, 88, 0.06), 0 14px 28px rgba(19, 46, 88, 0.1);
    transform: translateY(-2px);

    .open {
      color: ${({ theme }) => theme.colors.primary};
      gap: 0.4rem;
    }
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
`;

const IconBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.22) 0%, rgba(251, 191, 36, 0.08) 100%);
  border: 1px solid rgba(251, 191, 36, 0.35);
  flex-shrink: 0;

  svg {
    display: block;
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    flex-shrink: 0;
  }
`;

const Tag = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const Title = styled.h3`
  margin: 0.2rem 0 0;
  font-size: clamp(0.95rem, 0.4vw + 0.85rem, 1.05rem);
  line-height: 1.3;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`;

const Blurb = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Open = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: auto;
  padding-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  transition: color 0.15s ease, gap 0.15s ease;
`;

const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 2rem;
  font-size: 16px;
  font-weight: 500;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  font-family: ${({ theme }) => theme.font.family};
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

const CalculatorsSection: React.FC = () => {
  const items = HOME_CALCULATOR_IDS.map((id) => CALCULATORS_CATALOG.find((c) => c.id === id)).filter(
    Boolean
  ) as typeof CALCULATORS_CATALOG;

  return (
    <Section aria-label="Trading calculators">
      <Inner>
        <SectionHeadingSet
          upperText="Trading tools"
          mainHeading="Calculators"
          subText="Quick risk, size, and cashback tools — open any calculator for an instant overview, or browse the full set."
        />

        <Grid>
          {items.map((item) => (
            <Card key={item.id} to={item.path}>
              <CardTop>
                <IconBadge aria-hidden>{getCalculatorIcon(item.id, 20)}</IconBadge>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Tag>{item.shortLabel}</Tag>
                  <Title>{item.title}</Title>
                </div>
              </CardTop>
              <Blurb>{item.description}</Blurb>
              <Open className="open">
                Open calculator <FiArrowUpRight size={14} aria-hidden />
              </Open>
            </Card>
          ))}
        </Grid>

        <Cta to="/calculators">
          View all calculators
          <img width={24} height={24} src={ArrowIcon} alt="" aria-hidden />
        </Cta>
      </Inner>
    </Section>
  );
};

export default CalculatorsSection;
