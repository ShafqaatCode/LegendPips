import styled from "styled-components";
import GirlImage from "../../assets/bannerGirl.png";
import { FaPen } from "react-icons/fa";

const RebatesBrokersSection = () => {
  return (
    <Wrapper>
      <Content>
        <Left>
          <Title>Rebates Brokers</Title>

          <Tabs>
            <Tab active>Forex Rebates</Tab>
            <Tab>Cryptocurrency Rebates</Tab>
          </Tabs>

          <FeatureBox>
            Featuring <Highlight>36,828</Highlight> brokers and{" "}
            <Highlight>48</Highlight> different regulatory bodies
          </FeatureBox>

          <Subtitle>How does forex cashback work for you?</Subtitle>

          <Description>
            Regardless of whether your trade wins or loses, every time you trade,
            a portion of your spread or commission is paid back to you as real
            cash — with no impact on your trading conditions. The more you trade,
            the more you earn! Earnings will depend on your broker's rebate rate,
            the instruments you trade, and your total trading volume.
          </Description>

          <Description>
            As a quick example, placing 15 trades per day at 0.2 lot size with a
            0.5 pip rebate. That could add up to $315 a month, or $3,780 a year,
            simply from cashback!
          </Description>

         
        </Left>

        <Right>
          <Image src={GirlImage} alt="Girl pointing" />
        </Right>
        
      </Content>
       <SearchBar>
            <SearchInput placeholder="Search Your Broker" />
            <CTAButton>
              Report <FaPen style={{ marginLeft: 6 }} />
            </CTAButton>
          </SearchBar>
    </Wrapper>
  );
};

export default RebatesBrokersSection;

const Wrapper = styled.section`
  padding: 4rem 2rem;
  margin-top: 70px;
  position: relative;
  background-color: #f9fafb;

  @media (max-width: 1024px) {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    margin-top: 0;
    padding: 2rem 1rem;
    margin-top: 0;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  max-width: 1400px;
  margin: auto;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 3rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const Left = styled.div`
  flex: 1;
  min-width: 350px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const Right = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f3b8c;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Tabs = styled.div`
  display: inline-flex;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  border: 2px solid ${({ active }) => (active ? "#fcd34d" : "#ffffff")};
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  color: #1f3b8c;
  background-color: #fff;
  box-shadow: ${({ active }) =>
    active ? "0px 4px 15px rgba(0,0,0,0.1)" : "none"};

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.7rem 1rem;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.8rem;
  }
`;

const FeatureBox = styled.div`
  background-color: #1f3b8c;
  color: white;
  padding: 1rem 2rem;
  border-radius: 24px 24px 0 24px;
  font-size: 24px;
  max-width: 500px;
  margin-bottom: 2rem;
  font-weight: 500;
  letter-spacing: 0.09em;
  position: absolute;
  top: 70px;
  left: 45%;
  transform: translateX(-20%);

  @media (max-width: 1200px) {
    position: static;
    transform: none;
    max-width: 100%;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 1rem 1.5rem;
    border-radius: 20px 20px 0 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    padding: 0.8rem 1.2rem;
    border-radius: 16px 16px 0 16px;
  }
`;

const Highlight = styled.span`
  color: #fcd34d;
  font-weight: 700;
`;

const Subtitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f3b8c;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #334155;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SearchBar = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;


  @media (max-width: 768px) {
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  min-width: 300px;
  border: 1px solid #132E58B2;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    min-width: 250px;
    padding: 0.9rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 100%;
    font-size: 15px;
  }
`;

const CTAButton = styled.button`
  background-color: #132e58;
  color: white;
  padding: 1rem 4rem;
  border: none;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 1rem;
    font-size: 15px;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 12px;

  @media (max-width: 1024px) {
    max-width: 400px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;