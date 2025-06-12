
import {
  BannerWrapper,
  HeroContent,
  SubheadingWrapper,
  HeroSubTitle,
  HeroTitle,
  BrokersContainer,
  BrokerLeftSection,
  BrokerRightSection,
  ActionButtons,
  JoinButton,
  CompareButton,
} from "./PromoBanner.styles";


import mathIcon from "../../assets/icons/all-svgrepo-com 1.svg";
import brokersImg from "../../assets/icons/Group 19.svg";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import ArrowIcon2 from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 2.svg";

const PromoBanner = () => {
  return (
    <BannerWrapper>
      <HeroContent>
        <SubheadingWrapper>
          <img src={mathIcon} alt="Trading Icon" />
          <HeroSubTitle>ALL IN ONE TRADING PLATFORM</HeroSubTitle>
        </SubheadingWrapper>

        <HeroTitle>
          Compare Brokers, Earn <span>Cashback</span>, Get Signals
        </HeroTitle>

        <BrokersContainer>
          <BrokerLeftSection>
            <h4>Our Top Brokers</h4>
            <img src={brokersImg} alt="Top Broker Logos" />
          </BrokerLeftSection>
          <BrokerRightSection>
            <p>
              Whether you're buying or selling, we reward every move. No hidden
              fees, just real money back in your pocket, every single time you
              trade.
            </p>
          </BrokerRightSection>
        </BrokersContainer>

        <ActionButtons>
          <JoinButton>Join Free 
            <img src={ArrowIcon} alt="Arrow" />
          </JoinButton>
          <CompareButton>Compare Brokers 
            <img src={ArrowIcon2} alt="Arrow" />
          </CompareButton>
        </ActionButtons>
      </HeroContent>
    </BannerWrapper>
  );
};

export default PromoBanner;