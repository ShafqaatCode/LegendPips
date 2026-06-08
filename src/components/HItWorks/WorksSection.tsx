import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import WorkBox from "./WorkBox";
import HandShake from "../../assets/icons/handshake-svgrepo-com 1.png";
import DBIcon from "../../assets/icons/earn-money-svgrepo-com 1.png";
import WoletCard from "../../assets/icons/cards-svgrepo-com 1.png";
import ManIcon from "../../assets/icons/trading-svgrepo-com 1.png";
import ArrowUp from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import RegisterModal from "../../pages/Register/RegisterModal";
import { useAuth } from "../../contexts/AuthContext";

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

const SignUpPanel = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  width: 100%;
  margin: 2rem auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
`;

const SignUpCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.25rem;
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid #e8eaef;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.05);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }
`;

const SignUpCopy = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const IconBadge = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(19, 46, 88, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }
`;

const SignUpText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
    align-items: center;
  }
`;

const SignUpTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.35;
`;

const SignUpSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.caption};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.45;
`;

const SignUpButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 1.15rem;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: #1a3d6e;
  }

  img {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
  }

  @media (max-width: 768px) {
    width: 100%;
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
  const [signupOpen, setSignupOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSignupClick = () => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin-panel" : "/user-panel");
      return;
    }
    setSignupOpen(true);
  };

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
      <SignUpPanel>
        <SignUpCard>
          <SignUpCopy>
            <IconBadge>
              <img src={ManIcon} alt="" aria-hidden />
            </IconBadge>
            <SignUpText>
              <SignUpTitle>Don&apos;t have an account?</SignUpTitle>
              <SignUpSubtitle>
                Create your free LegendPips account and start earning rebates today.
              </SignUpSubtitle>
            </SignUpText>
          </SignUpCopy>
          <SignUpButton type="button" onClick={handleSignupClick}>
            Signup For Free
            <img src={ArrowUp} alt="" aria-hidden />
          </SignUpButton>
        </SignUpCard>
      </SignUpPanel>

      <RegisterModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </WorkSectionWrapper>
  );
};

export default HowItWorks;
