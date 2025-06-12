import React from "react";
import {
  HeroContent,
  HeroTitle,
  HeroSubTitle,
  BannerWrapper,
  ActionButtons,
  JoinButton,
  CompareButton
} from "./PromoBanner.styles";
import MathIcon from "../../assets/icons/all-svgrepo-com 1.svg";
import styled from "styled-components";
import BrokersImg from "../../assets/icons/Group 19.svg";

const SubheadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    height: 30px;
  }
`;

const BrokersContainer = styled.div`
  
  display:flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;

 

  .left{
    flex:1;
    border-right:1px dashed ${({ theme }) => theme.colors.WHITE};
    h4{
    
      font-size: 15px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.WHITE};
      line-height: 35px;
    }


  }

  .right{

    flex:2;
    p{
    width: 313px;
      font-size: 13px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.colors.WHITE};
      text-align: left;
      margin:auto;
    }


  `;

const PromoBanner: React.FC = () => {
  return (
    <BannerWrapper>
      <HeroContent>
        <SubheadingWrapper>
          <img src={MathIcon} alt="TRADING ICON" />
          <HeroSubTitle>ALL IN ONE TRADING PLATFORM</HeroSubTitle>
        </SubheadingWrapper>
        <HeroTitle>
          Compare Brokers, Earn <span>Cashback</span>, Get Signals
        </HeroTitle>
        <BrokersContainer>
          <div className="left">
            <h4>Our Top Brokers</h4>
            <img src={BrokersImg} alt="" />
          </div>
          <div className="right">
            <p>
              Whether you're buying or selling, we reward every move. No hidden
              fees, just real money back in your pocket, every single time you
              trade.
            </p>
          </div>
        </BrokersContainer>

        <ActionButtons>
          <JoinButton>Join Free ➝</JoinButton>
          <CompareButton>Compare Brokers ➝</CompareButton>
        </ActionButtons>
      </HeroContent>
    </BannerWrapper>
  );
};

export default PromoBanner;
