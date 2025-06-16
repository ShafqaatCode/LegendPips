import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import WorkBox from "./WorkBox";
import HandShake from "../../assets/icons/handshake-svgrepo-com 1.png";
import DBIcon from "../../assets/icons/earn-money-svgrepo-com 1.png";
import WoletCard from "../../assets/icons/cards-svgrepo-com 1.png";
import ManIcon from "../../assets/icons/trading-svgrepo-com 1.png";
import ButtonBase from "../SharedComponents/Button";

const WorkSectionWrapper = styled.section`
  padding: 3rem 1rem;
`;

const WorksWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  flex-wrap: wrap;
  gap: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    // flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const SignUpAction = styled.div`
  display: flex;
  margin: 3rem auto;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  border: 1px solid #1d4ed8;
  padding: 1rem 1.5rem;
  text-align: center;
  border-radius: 5px;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    //   border: 2px solid red;
    margin: 0 1rem;
    text-align: center;
  }

  img {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    //  flex-wrap: wrap;
    gap: 1rem;
    width: 80%;
    flex-direction: column;
  }
`;

const HowItWorks: React.FC = () => {
  return (
    <WorkSectionWrapper>
      <SectionHeadingSet
        upperText="All in one trading Platform"
        mainHeading="How it works"
        subText="Trade, earn, repeat. With rebates, expert tools, and a strong community, Legend Pips makes every trade more rewarding."
      />

      <WorksWrapper>
        <WorkBox
          index={1}
          icon={HandShake}
          title="Connect & Trade"
          description="Link your account through Legend Pips. No changes to your broker or spreads."
        />
        <WorkBox
          index={2}
          icon={DBIcon}
          title="Earn Rebates"
          description="Get cashback on every trade made with supported brokers through our platform."
        />
        <WorkBox
          index={3}
          icon={WoletCard}
          title="Grow Your Skills"
          description="We pay you back—fast, simple, and with no hidden fees."
        />
      </WorksWrapper>
      <SignUpAction>
        <div>
          <img src={ManIcon} alt="Icon" />
          <span>Don’t have an account? You can create account now.</span>
        </div>
        <ButtonBase bgColor="#1D4ED8" fontSize="20px">
          Signup For Free{" "}
        </ButtonBase>
      </SignUpAction>
    </WorkSectionWrapper>
  );
};

export default HowItWorks;
