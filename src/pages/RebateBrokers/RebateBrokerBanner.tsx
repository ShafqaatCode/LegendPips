import styled from "styled-components";
import GirlImage from "../../assets/bannerGirl.png";
import { FaPen } from "react-icons/fa";

export interface RebatesBannerSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const RebatesBrokersSection = ({ searchValue, onSearchChange }: RebatesBannerSearchProps) => {
  return (
    <Wrapper>
      <Inner>
        <Content>
          <Left>
            <Title>Rebates Brokers</Title>

            <Tabs>
              <Tab type="button" $active>
                Forex Rebates
              </Tab>
              <Tab type="button">Cryptocurrency Rebates</Tab>
            </Tabs>

            <FeatureBox>
              Featuring <Highlight>36,828</Highlight> brokers and{" "}
              <Highlight>48</Highlight> different regulatory bodies
            </FeatureBox>

            <Subtitle>How does forex cashback work for you?</Subtitle>

            <Description>
              Regardless of whether your trade wins or loses, every time you trade, a portion of
              your spread or commission is paid back to you as real cash — with no impact on your
              trading conditions. The more you trade, the more you earn! Earnings will depend on
              your broker&apos;s rebate rate, the instruments you trade, and your total trading
              volume.
            </Description>

            <Description>
              As a quick example, placing 15 trades per day at 0.2 lot size with a 0.5 pip rebate.
              That could add up to $315 a month, or $3,780 a year, simply from cashback!
            </Description>
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
            placeholder="Search your broker"
            autoComplete="off"
            aria-label="Search brokers"
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
  gap: 0.35rem;
  padding: 3px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  @media (max-width: 480px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Tab = styled.button<{ $active?: boolean }>`
  border: none;
  border-radius: 6px;
  padding: 0.45rem 0.9rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  color: #132e58;
  background: ${({ $active }) => ($active ? "rgba(19, 46, 88, 0.08)" : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "inset 0 0 0 1px #fbbf24" : "none")};
  transition: background 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: rgba(19, 46, 88, 0.06);
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: center;
  }
`;

const FeatureBox = styled.div`
  display: inline-block;
  background-color: #132e58;
  color: #fff;
  padding: 0.55rem 1rem;
  border-radius: 8px 8px 8px 2px;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.45;
  font-weight: 500;
  margin-bottom: 1rem;
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(19, 46, 88, 0.15);
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
