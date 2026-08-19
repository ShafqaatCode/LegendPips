import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GirlImage from "../../assets/bannerGirl.png";
import { FaPen } from "react-icons/fa";
import { FiGlobe, FiCpu, FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { RebateTabCategory } from "../../services/brokerService";
import {
  BROKER_KIND_COLORS,
  BROKER_KIND_DESCRIPTIONS,
  REBATE_TAB_LABELS,
} from "../../utils/brokerTypes";

const TAB_ICONS: Record<RebateTabCategory, React.ReactNode> = {
  forex: <FiGlobe />,
  prop: <FiAward />,
  crypto: <FiCpu />,
};

export interface RebatesBannerSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeTab: RebateTabCategory;
  onTabChange: (tab: RebateTabCategory) => void;
}

const PROP_FAQ_SECTIONS = [
  {
    title: "What is Prop Trading?",
    body: "Prop trading allows investors to trade financial markets using a firm's capital instead of their own. The main benefits are access to larger capital, enabling traders to take larger positions and pursue greater profit opportunities, with reduced personal financial risk since the trading capital belongs to the firm.",
  },
  {
    title: "What is the LegendPips Prop Trading Rebate Program?",
    body: "With our rebate service, you can choose from a list of trading props and receive cashback for your challenge purchase. Sign up through our partner links, buy your evaluation, and earn a percentage back on first and repeat purchases.",
  },
  {
    title: "How much Prop Trading Cashback can I earn?",
    body: "Your cashback reward depends on the prop firm's rate — typically a percentage on your first challenge purchase and a lower rate on repeat purchases. Some firms also offer an extra discount on top of cashback. Explore the props below for their current rates.",
  },
];

const TAB_COPY: Record<
  RebateTabCategory,
  { subtitle: string; descriptions: [string, string] }
> = {
  forex: {
    subtitle: "How does forex cashback work for you?",
    descriptions: [
      "Regardless of whether your trade wins or loses, every time you trade, a portion of your spread or commission is paid back to you as real cash — with no impact on your trading conditions. The more you trade, the more you earn! Earnings will depend on your broker's rebate rate, the instruments you trade, and your total trading volume.",
      "As a quick example, placing 15 trades per day at 0.2 lot size with a 0.5 pip rebate. That could add up to $315 a month, or $3,780 a year, simply from cashback!",
    ],
  },
  prop: {
    subtitle: "Ready to boost your trading profitability?",
    descriptions: [
      "Explore our list of prop firms below and their cashback rates. Buy the challenge through our link and get cashback for your purchase.",
      "Rates vary by firm — first purchase cashback, repeat purchase cashback, and optional challenge discounts are shown on each card.",
    ],
  },
  crypto: {
    subtitle: "How does crypto exchange cashback work for you?",
    descriptions: [
      "Trade crypto through partnered exchanges and platforms and earn cashback on every qualified trade. Rebates are credited based on each exchange’s cashback schedule — spot, CFDs, or other listed instruments.",
      "As an example, active traders placing 20 round-turn trades per week with a $1.50 per-lot rebate could earn over $120 a month in cashback, on top of your regular trading results.",
    ],
  },
};

const PROP_INTRO_SHORT =
  "Prop trading allows investors to trade financial markets using a firm's capital instead of their own. The main benefits of prop trading are access to larger capital enabling traders to take larger positions and pursue greater profit opportunities. It is a reduced-risk investment since the trading capital belongs to the firm, and traders do not bear the financial risk of losses from their trades.";

const RebatesBrokersSection = ({
  searchValue,
  onSearchChange,
  activeTab,
  onTabChange,
}: RebatesBannerSearchProps) => {
  const copy = TAB_COPY[activeTab];
  const [propReadMore, setPropReadMore] = useState(false);
  const isProp = activeTab === "prop";

  useEffect(() => {
    setPropReadMore(false);
  }, [activeTab]);

  return (
    <Wrapper>
      <Inner>
        <Content>
          <Left>
            <Title>Partner platforms</Title>

            <Tabs role="tablist" aria-label="Broker categories">
              {(["forex", "prop", "crypto"] as RebateTabCategory[]).map((tab) => (
                <Tab
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  $active={activeTab === tab}
                  $kind={tab}
                  onClick={() => onTabChange(tab)}
                >
                  <span className="ico">{TAB_ICONS[tab]}</span>
                  {REBATE_TAB_LABELS[tab]}
                </Tab>
              ))}
            </Tabs>

            <TypeHint>{BROKER_KIND_DESCRIPTIONS[activeTab]}</TypeHint>
            {isProp && (
              <TypeHint>
                Prefer a dedicated hub? <Link to="/prop-firms">Open the Prop Firm Hub</Link> for comparison tables and filters.
              </TypeHint>
            )}

            <FeatureBox $kind={activeTab}>
              {isProp ? (
                <>
                  Featuring partnered <Highlight>prop firms</Highlight> with challenge{" "}
                  <Highlight>cashback</Highlight> on first &amp; repeat purchases
                </>
              ) : activeTab === "crypto" ? (
                <>
                  Featuring curated <Highlight>crypto exchanges</Highlight> with trading{" "}
                  <Highlight>cashback</Highlight> on eligible volume
                </>
              ) : (
                <>
                  Featuring partnered <Highlight>forex brokers</Highlight> with real{" "}
                  <Highlight>rebates</Highlight> on every trade
                </>
              )}
            </FeatureBox>

            {isProp ? (
              <>
                <Subtitle>What is Prop Trading?</Subtitle>
                <Description>{PROP_INTRO_SHORT}</Description>
                {propReadMore && (
                  <>
                    {PROP_FAQ_SECTIONS.slice(1).map((section) => (
                      <PropFaqBlock key={section.title}>
                        <PropFaqHeading>{section.title}</PropFaqHeading>
                        <Description>{section.body}</Description>
                      </PropFaqBlock>
                    ))}
                  </>
                )}
                <ReadMoreWrap>
                  <ReadMoreBtn type="button" onClick={() => setPropReadMore((v) => !v)}>
                    {propReadMore ? "Read Less" : "Read More"}
                  </ReadMoreBtn>
                </ReadMoreWrap>
              </>
            ) : (
              <>
                <Subtitle>{copy.subtitle}</Subtitle>
                <Description>{copy.descriptions[0]}</Description>
                <Description>{copy.descriptions[1]}</Description>
              </>
            )}
          </Left>

          <Right>
            <Image src={GirlImage} alt="" />
          </Right>
        </Content>

        <SearchForm
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <SearchInput
            type="search"
            name="brokerSearch"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isProp
                ? "Search prop firms…"
                : activeTab === "crypto"
                  ? "Search crypto exchanges…"
                  : "Search forex brokers…"
            }
            autoComplete="off"
            aria-label={
              isProp
                ? "Search prop firms"
                : activeTab === "crypto"
                  ? "Search crypto exchanges"
                  : "Search forex brokers"
            }
          />
          <ReportButton type="button">
            Report
            <FaPen size={12} style={{ marginLeft: 6 }} aria-hidden />
          </ReportButton>
        </SearchForm>
      </Inner>
    </Wrapper>
  );
};

export default RebatesBrokersSection;

/** Same shell as ForumHero / AnalysisHero: full-bleed band + gutters, inner content capped. */
const Wrapper = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(0.5rem, 1.25vw, 0.85rem);
  background: #ffffff;
  overflow: hidden;
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: clamp(1.25rem, 3vw, 2rem);

  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const Left = styled.div`
  flex: 1;
  min-width: 0;
  max-width: min(44rem, 100%);
`;

const Right = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  color: #132e58;
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
`;

const Tabs = styled.div`
  display: inline-flex;
  gap: 0.45rem;
  padding: 5px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const Tab = styled.button<{ $active?: boolean; $kind: RebateTabCategory }>`
  border: none;
  border-radius: 9px;
  padding: 0.5rem 0.95rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active, $kind }) =>
    $active ? BROKER_KIND_COLORS[$kind].color : "#475569"};
  background: ${({ $active, $kind }) =>
    $active ? BROKER_KIND_COLORS[$kind].soft : "transparent"};
  box-shadow: ${({ $active, $kind }) =>
    $active ? `inset 0 0 0 1.5px ${BROKER_KIND_COLORS[$kind].border}` : "none"};
  transition: background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  .ico {
    display: inline-flex;
    font-size: 0.95rem;
  }

  &:hover {
    background: ${({ $kind }) => BROKER_KIND_COLORS[$kind].soft};
  }

  @media (max-width: 640px) {
    flex: 1;
    min-width: 0;
    justify-content: center;
    white-space: normal;
    text-align: center;
  }
`;

const TypeHint = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
  a { color: #132e58; font-weight: 700; }
`;

const FeatureBox = styled.div<{ $kind?: RebateTabCategory }>`
  display: inline-block;
  background: linear-gradient(125deg, #0c1f3d 0%, #132e58 55%, #1a4a7a 100%);
  color: #fff;
  padding: 0.6rem 1.05rem;
  border-radius: 10px 10px 10px 3px;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.45;
  font-weight: 500;
  margin-bottom: 1rem;
  max-width: 100%;
  box-shadow: 0 4px 14px rgba(19, 46, 88, 0.18);
  border-left: 3px solid
    ${({ $kind }) => ($kind ? BROKER_KIND_COLORS[$kind].border : "#fbbf24")};
`;

const Highlight = styled.span`
  color: #fbbf24;
  font-weight: 700;
`;

const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #132e58;
  line-height: 1.35;
`;

const PropFaqBlock = styled.div`
  margin-top: 0.75rem;
`;

const PropFaqHeading = styled.h3`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 600;
  margin: 0 0 0.35rem;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.35;
`;

const ReadMoreWrap = styled.div`
  margin-top: 0.65rem;
`;

const ReadMoreBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  padding: 0.45rem 1.15rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: rgba(19, 46, 88, 0.06);
    box-shadow: inset 0 0 0 1px #fbbf24;
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  margin: 0 0 0.65rem;
  color: #475569;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.65rem;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 0.85rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 0.875rem;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #132e58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.12);
  }
`;

const ReportButton = styled.button`
  flex-shrink: 0;
  height: 40px;
  padding: 0 1rem;
  border-radius: 8px;
  border: none;
  background: #132e58;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #0f2447;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Image = styled.img`
  max-width: min(380px, 42vw);
  height: auto;
  border-radius: 10px;
  display: block;
`;
