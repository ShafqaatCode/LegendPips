import React from 'react';
import {
  BannerWrapper,
  Title,
  Highlight,
  Description,
  ActionButtons,
  JoinButton,
  CompareButton,
  BrokersRow,
} from './PromoBanner.styles.tsx';

const PromoBanner: React.FC = () => {
  return (
    <BannerWrapper>
      <p>ALL IN ONE TRADING PLATFORM</p>
      <Title>
        Compare Brokers, Earn <Highlight>Cashback</Highlight>, Get Signals
      </Title>

      <BrokersRow>
        <div>
          <strong>Our Top Brokers</strong>
          {/* Avatars can be mapped here */}
        </div>
        <Description>
          Whether you’re buying or selling, we reward every move. No hidden fees,
          just real money back in your pocket, every single time you trade.
        </Description>
      </BrokersRow>

      <ActionButtons>
        <JoinButton>Join Free ➝</JoinButton>
        <CompareButton>Compare Brokers ➝</CompareButton>
      </ActionButtons>
    </BannerWrapper>
  );
};

export default PromoBanner;
