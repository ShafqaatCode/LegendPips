import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RecentSignals from './SignalList';
import SignalPerformance from './SignalPerformance';

import SectionHeadingSet from '../../SharedComponents/SectionHeadingSet';
import { useLocale } from '../../../contexts/LocaleContext';
import { fetchPublicSignals, toSignalListRow, type ApiSignal } from '../../../services/signalService';

type SignalRow = ReturnType<typeof toSignalListRow>;
type MarketTab = 'forex' | 'cryptoGold';

const Container = styled.div`
  background-color: #F3F4F7;
  font-family: 'Segoe UI', sans-serif;
  padding: 60px 20px;
  text-align: center;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  overflow-x: auto;
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  padding-bottom: 8px;

  @media (max-width: 600px) {
    gap: 16px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  color: ${({ active }) => (active ? '#132E58' : '#444')};
  border-bottom: ${({ active }) =>
    active ? '2px solid #132E58' : '2px solid transparent'};

  &:hover {
    color: #132E58;
  }

  @media (max-width: 600px) {
    font-size: 14px;
    padding: 10px 8px;
  }
`;

const MarketTabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
`;

const MarketTabsWrapper = styled.div`
  display: flex;
  gap: 0;
  background: #ffffff;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
`;

const MarketTabBtn = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? '#132E58' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#132E58')};
  border: none;
  padding: 10px 28px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ active }) => (active ? '#132E58' : 'rgba(19, 46, 88, 0.08)')};
  }

  @media (max-width: 600px) {
    padding: 9px 18px;
    font-size: 13px;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const mapRows = (items: ApiSignal[]): SignalRow[] => items.map(toSignalListRow);

const fallbackForex: SignalRow[] = [
  { pair: 'EUR/USD', entry: '1.0845', tp: '1.0875', sl: '1.0825', status: 'buy' },
  { pair: 'GBP/USD', entry: '1.2645', tp: '1.2675', sl: '1.2625', status: 'buy' },
  { pair: 'AUD/USD', entry: '0.6545', tp: '0.6575', sl: '0.6525', status: 'buy' },
  { pair: 'CAD/JPY', entry: '110.45', tp: '110.75', sl: '110.25', status: 'buy' },
];

const fallbackCryptoGold: SignalRow[] = [
  { pair: 'XAU/USD', entry: '2340', tp: '2365', sl: '2320', status: 'buy' },
  { pair: 'BTC/USD', entry: '43250', tp: '44500', sl: '42500', status: 'buy' },
  { pair: 'ETH/USD', entry: '2650', tp: '2750', sl: '2600', status: 'buy' },
  { pair: 'XAG/USD', entry: '28.40', tp: '29.10', sl: '27.80', status: 'buy' },
];

const RewardsAndBenefits: React.FC = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('Signals');
  const [marketTab, setMarketTab] = useState<MarketTab>('forex');
  const [forexSignals, setForexSignals] = useState<SignalRow[]>([]);
  const [cryptoGoldSignals, setCryptoGoldSignals] = useState<SignalRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fx, crypto, commodities] = await Promise.all([
          fetchPublicSignals({ assetClass: 'forex', limit: 8, tradeStatus: 'active' }),
          fetchPublicSignals({ assetClass: 'crypto', limit: 8, tradeStatus: 'active' }),
          fetchPublicSignals({ assetClass: 'commodities', limit: 8, tradeStatus: 'active' }),
        ]);
        if (cancelled) return;
        setForexSignals(fx.items?.length ? mapRows(fx.items) : fallbackForex);
        const merged = [...(commodities.items || []), ...(crypto.items || [])];
        setCryptoGoldSignals(merged.length ? mapRows(merged).slice(0, 8) : fallbackCryptoGold);
      } catch {
        if (!cancelled) {
          setForexSignals(fallbackForex);
          setCryptoGoldSignals(fallbackCryptoGold);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = [
    { id: 'Signals', label: t('signals.tab1') },
    { id: 'Rewards', label: t('signals.tab2') },
    { id: 'Stats', label: t('signals.tab3') },
    { id: 'Performance', label: t('signals.tab4') },
  ];

  const activeSignals = marketTab === 'forex' ? forexSignals : cryptoGoldSignals;
  const showMarketTabs = activeTab === 'Signals' || activeTab === 'Rewards' || activeTab === 'Performance';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Signals':
        return (
          <CardsWrapper>
            <RecentSignals
              title={t('signals.recent')}
              isLive
              signals={activeSignals}
              ctaText="Get Premium Signals"
            />
            <SignalPerformance />
          </CardsWrapper>
        );
      case 'Rewards':
        return (
          <CardsWrapper>
            <RecentSignals
              title={t('signals.recent')}
              isLive
              signals={activeSignals}
              ctaText="Get Premium Signals"
            />
          </CardsWrapper>
        );
      case 'Stats':
        return (
          <CardsWrapper>
            <SignalPerformance />
          </CardsWrapper>
        );
      case 'Performance':
        return (
          <CardsWrapper>
            <RecentSignals
              title={t('signals.recent')}
              isLive
              signals={activeSignals}
              ctaText="Get Premium Signals"
            />
            <SignalPerformance />
          </CardsWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <SectionHeadingSet
        upperText={t("common.allInOne")}
        mainHeading={t("signals.title")}
        subText={t("signals.body")}
      />

      <TabsWrapper>
        <Tabs>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </Tabs>
      </TabsWrapper>

      {showMarketTabs && (
        <MarketTabsContainer>
          <MarketTabsWrapper>
            <MarketTabBtn
              active={marketTab === 'forex'}
              onClick={() => setMarketTab('forex')}
              type="button"
            >
              Forex
            </MarketTabBtn>
            <MarketTabBtn
              active={marketTab === 'cryptoGold'}
              onClick={() => setMarketTab('cryptoGold')}
              type="button"
            >
              Crypto
            </MarketTabBtn>
          </MarketTabsWrapper>
        </MarketTabsContainer>
      )}

      {renderTabContent()}
    </Container>
  );
};

export default RewardsAndBenefits;
