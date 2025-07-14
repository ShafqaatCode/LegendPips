import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import WorkBox from "./WorkBox";
import HandShake from "../../assets/icons/handshake-svgrepo-com 1.png";
import DBIcon from "../../assets/icons/earn-money-svgrepo-com 1.png";
import WoletCard from "../../assets/icons/cards-svgrepo-com 1.png";
import ManIcon from "../../assets/icons/trading-svgrepo-com 1.png";
import ButtonBase from "../SharedComponents/Button";
import ArrowUp from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg"

const WorkSectionWrapper = styled.section`
  padding: 3rem 1rem;
  // background-color: #fff;

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
  color: #1d4ed8;
  border-radius: 5px;
  background: #1d4fd811;

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
const InstructionList = styled.div`
  width: 80%;
  margin: 3rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 300;
  // text-align: center;
  ul {
   display: flex;
   max-width: 800px;
   flex-direction: column;
   justify-content: center;
   gap:0.5rem;
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

      <InstructionList>
        <ul>
          <li>
            Register for free and connect your existing tradinga ccount with one
            of our partnered brokers.
          </li>
          <li>
           Keep trading as you normally do  we’ll return a portion of the spread or commission on every trade.
          </li>
          <li>
           Check your rewards in real-time  stay up to date with live statistics and see your cashback grow.
          </li>
          <li>
           Take part in exciting competitions, leverage premium trading tools and signals, and benefit from daily market analysis.
          </li>
          <li>
           Participate in our active forum  share tips, ask questions, and learn alongside other traders.
          </li>
        </ul>
      </InstructionList>

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
          <img style={{width: "24px"}} src={ArrowUp} alt="Arrow" />
        </ButtonBase>
      </SignUpAction>
    </WorkSectionWrapper>
  );
};

export default HowItWorks;
