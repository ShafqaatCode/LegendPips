import React, { useState } from 'react';
import BrokerListingPage from './BrokerListingPage';
import BrokerDetailPage from './BrokerDetailPage';
import BrokerSetupPage from './BrokerSetupPage';
import type { Broker } from './BrokerListingPage';
import TradeLogo from '../../assets/TradeMarketBrands/Ellipse 1-1.svg';

// DUMMY DATA - Replace this with your actual broker data
const DUMMY_BROKERS: Broker[] = [
  {
    id: '1',
    name: 'IC Markets',
    logo: TradeLogo,
    minDeposit: 100,
    regulation: 'ASIC, CySEC',
    spreadFrom: '0.0 pips',
    crypto: 'Yes',
    topCashback: true,
    verified: true,
    description: "Trade online with the world's largest True ECN forex broker",
    features: [
      'Regulated in Australia & globally',
      'Spreads from 0.0 pips',
      'Trusted by traders worldwide'
    ],
    accountTypes: [
      {
        name: 'Standard Account',
        platform: 'MT4 / MT5',
        minDeposit: '$200',
        spreadFrom: '~0.6-0.8 pips',
        commission: 'None',
        idealFor: 'Beginners, Discretionary traders'
      },
      {
        name: 'Raw Spread (MetaTrader)',
        platform: 'MT4 / MT5',
        minDeposit: '$200',
        spreadFrom: 'From 0.0 pips',
        commission: '+$3.5 per lot per side',
        idealFor: 'EAs, scalpers, active traders'
      },
      {
        name: 'cTrader Raw Spread',
        platform: 'cTrader / TradingView',
        minDeposit: '$200',
        spreadFrom: 'From 0.0 pips',
        commission: '+$10 per 100k per side',
        idealFor: 'Professional & algorithmic traders'
      }
    ],
    reviews: [
      { name: 'Jessica', rating: 5, comment: 'Outstanding spreads and super speedy execution.' },
      { name: 'David', rating: 4, comment: 'Excellent platform, highly reliable.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto'],
    cashbackRate: '0.40 pip'
  },
  {
    id: '2',
    name: 'XTREME Market',
   logo: TradeLogo,
    minDeposit: 5,
    regulation: 'IFSC, CySEC',
    spreadFrom: '0.6 pips',
    crypto: 'No',
    topCashback: true,
    verified: true,
    description: 'Award-winning forex broker with excellent execution',
    features: [
      'Regulated globally',
      'Low minimum deposit',
      'Fast execution'
    ],
    accountTypes: [
      {
        name: 'Micro Account',
        platform: 'MT4 / MT5',
        minDeposit: '$5',
        spreadFrom: '1 pip',
        commission: 'None',
        idealFor: 'Beginners'
      },
      {
        name: 'Standard Account',
        platform: 'MT4 / MT5',
        minDeposit: '$5',
        spreadFrom: '1 pip',
        commission: 'None',
        idealFor: 'All traders'
      }
    ],
    reviews: [
      { name: 'Michael', rating: 5, comment: 'Great for beginners with low deposit.' },
      { name: 'Sarah', rating: 4, comment: 'Reliable broker with good support.' },
      { name: 'Sarah', rating: 4, comment: 'Reliable broker with good support.' },
      { name: 'Sarah', rating: 4, comment: 'Reliable broker with good support.' },
      { name: 'Sarah', rating: 4, comment: 'Reliable broker with good support.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets'],
    cashbackRate: '0.35 pip'
  },
  {
    id: '3',
    name: 'Exness',
   logo: TradeLogo,
    minDeposit: 10,
    regulation: 'FCA, CySEC',
    spreadFrom: '0.3 pips',
    crypto: 'Yes',
    topCashback: true,
    verified: true,
    description: 'Professional trading with tight spreads',
    features: [
      'FCA Regulated',
      'Unlimited leverage',
      'Instant withdrawals'
    ],
    accountTypes: [
      {
        name: 'Standard Account',
        platform: 'MT4 / MT5',
        minDeposit: '$10',
        spreadFrom: '0.3 pips',
        commission: 'None',
        idealFor: 'All traders'
      },
      {
        name: 'Raw Spread',
        platform: 'MT4 / MT5',
        minDeposit: '$200',
        spreadFrom: '0.0 pips',
        commission: '$3.5 per lot',
        idealFor: 'Active traders'
      }
    ],
    reviews: [
      { name: 'Alex', rating: 5, comment: 'Best spreads in the industry!' },
      { name: 'Emma', rating: 5, comment: 'Lightning fast withdrawals.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto'],
    cashbackRate: '0.45 pip'
  },
  {
    id: '4',
    name: 'RoMarkets',
   logo: TradeLogo,
    minDeposit: 100,
    regulation: 'FSA',
    spreadFrom: '0.0 pips',
    crypto: 'Yes',
    topCashback: false,
    verified: true,
    description: 'Professional ECN broker with advanced tools',
    features: [
      'FSA Regulated',
      'ECN execution',
      'Advanced charting tools'
    ],
    accountTypes: [
      {
        name: 'Standard Account',
        platform: 'MT4 / MT5',
        minDeposit: '$100',
        spreadFrom: '0.5 pips',
        commission: 'None',
        idealFor: 'Standard traders'
      }
    ],
    reviews: [
      { name: 'John', rating: 4, comment: 'Great platform and reliable execution.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'Crypto'],
    cashbackRate: '0.30 pip'
  },
  {
    id: '5',
    name: 'Focus Markets',
   logo: TradeLogo,
    minDeposit: 100,
    regulation: 'ASIC',
    spreadFrom: '0.5 pips',
    crypto: 'No',
    topCashback: false,
    verified: true,
    description: 'Australian broker with local support',
    features: [
      'ASIC Regulated',
      'Local Australian support',
      'Competitive pricing'
    ],
    accountTypes: [
      {
        name: 'Standard Account',
        platform: 'MT4 / MT5',
        minDeposit: '$100',
        spreadFrom: '0.5 pips',
        commission: 'None',
        idealFor: 'All traders'
      }
    ],
    reviews: [
      { name: 'Sophie', rating: 4, comment: 'Good broker with excellent local support.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets'],
    cashbackRate: '0.25 pip'
  },
  {
    id: '6',
    name: 'Pepperstone',
    logo: TradeLogo,
    minDeposit: 200,
    regulation: 'ASIC, FCA',
    spreadFrom: '0.0 pips',
    crypto: 'Yes',
    topCashback: true,
    verified: true,
    description: 'Leading multi-asset broker with excellent execution',
    features: [
      'Dual regulated ASIC & FCA',
      'Raw spreads from 0.0',
      'cTrader & MT4/MT5'
    ],
    accountTypes: [
      {
        name: 'Razor Account',
        platform: 'MT4 / MT5 / cTrader',
        minDeposit: '$200',
        spreadFrom: '0.0 pips',
        commission: '$7 per lot',
        idealFor: 'Scalpers, professionals'
      }
    ],
    reviews: [
      { name: 'Oliver', rating: 5, comment: 'Amazing execution and customer service.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto'],
    cashbackRate: '0.50 pip'
  },
  {
    id: '7',
    name: 'FP Markets',
    logo: TradeLogo,
    minDeposit: 100,
    regulation: 'ASIC, CySEC',
    spreadFrom: '0.0 pips',
    crypto: 'No',
    topCashback: true,
    verified: true,
    description: 'Award-winning CFD and Forex broker',
    features: [
      'ASIC & CySEC regulated',
      'MT4, MT5 & IRESS',
      '10,000+ instruments'
    ],
    accountTypes: [
      {
        name: 'Raw Account',
        platform: 'MT4 / MT5',
        minDeposit: '$100',
        spreadFrom: '0.0 pips',
        commission: '$6 per lot',
        idealFor: 'Active traders'
      }
    ],
    reviews: [
      { name: 'Liam', rating: 5, comment: 'Excellent choice for trading.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets'],
    cashbackRate: '0.38 pip'
  },
  {
    id: '8',
    name: 'Admiral Markets',
   logo: TradeLogo,
    minDeposit: 100,
    regulation: 'FCA, ASIC',
    spreadFrom: '0.5 pips',
    crypto: 'Yes',
    topCashback: false,
    verified: true,
    description: 'Global broker with advanced trading tools',
    features: [
      'FCA & ASIC regulated',
      'MetaTrader Supreme Edition',
      'Wide range of instruments'
    ],
    accountTypes: [
      {
        name: 'Trade.MT5',
        platform: 'MT5',
        minDeposit: '$100',
        spreadFrom: '0.5 pips',
        commission: 'None',
        idealFor: 'All levels'
      }
    ],
    reviews: [
      { name: 'Isabella', rating: 4, comment: 'Very professional broker.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto'],
    cashbackRate: '0.28 pip'
  },
  {
    id: '9',
    name: 'Fusion Markets',
  logo: TradeLogo,
    minDeposit: 0,
    regulation: 'ASIC, FSA',
    spreadFrom: '0.0 pips',
    crypto: 'Yes',
    topCashback: true,
    verified: true,
    description: 'Zero minimum deposit broker with raw spreads',
    features: [
      'Zero minimum deposit',
      'Raw spreads from 0.0',
      'Copy trading available'
    ],
    accountTypes: [
      {
        name: 'Zero Account',
        platform: 'MT4 / MT5',
        minDeposit: '$0',
        spreadFrom: '0.0 pips',
        commission: '$4.50 per lot',
        idealFor: 'All traders'
      }
    ],
    reviews: [
      { name: 'Noah', rating: 5, comment: 'Love the zero minimum deposit!' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto'],
    cashbackRate: '0.42 pip'
  },
  {
    id: '10',
    name: 'Tickmill',
   logo: TradeLogo,
    minDeposit: 100,
    regulation: 'FCA, CySEC',
    spreadFrom: '0.0 pips',
    crypto: 'No',
    topCashback: false,
    verified: true,
    description: 'Institutional-grade trading conditions',
    features: [
      'FCA & CySEC regulated',
      'Tight spreads',
      'High leverage available'
    ],
    accountTypes: [
      {
        name: 'Pro Account',
        platform: 'MT4 / MT5',
        minDeposit: '$100',
        spreadFrom: '0.0 pips',
        commission: '$4 per lot',
        idealFor: 'Professional traders'
      }
    ],
    reviews: [
      { name: 'Ava', rating: 4, comment: 'Great for serious traders.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets'],
    cashbackRate: '0.32 pip'
  }
];

type PageType = 'listing' | 'detail' | 'setup';

const BrokerList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('listing');
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setCurrentPage('detail');
  };

  const handleSetupAccount = () => {
    setCurrentPage('setup');
  };

  const handleBackToListing = () => {
    setCurrentPage('listing');
    setSelectedBroker(null);
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
  };

  return (
    <>
      {currentPage === 'listing' && (
        <BrokerListingPage 
          brokers={DUMMY_BROKERS} 
          onBrokerSelect={handleBrokerSelect} 
        />
      )}

      {currentPage === 'detail' && selectedBroker && (
        <BrokerDetailPage 
          broker={selectedBroker} 
          onBack={handleBackToListing}
          onSetupAccount={handleSetupAccount}
        />
      )}

      {currentPage === 'setup' && selectedBroker && (
        <BrokerSetupPage 
          broker={selectedBroker} 
          onBack={handleBackToDetail}
        />
      )}
    </>
  );
};

export default BrokerList;

/* 
 * ============================================
 * HOW TO REPLACE WITH YOUR ACTUAL DATA:
 * ============================================
 * 
 * 1. Import your broker data:
 *    import { brokers_data } from '../../data/brokers_data';
 * 
 * 2. Replace DUMMY_BROKERS with brokers_data:
 *    <BrokerListingPage 
 *      brokers={brokers_data} 
 *      onBrokerSelect={handleBrokerSelect} 
 *    />
 * 
 * 3. Make sure your data structure matches the Broker type:
 *    - Each broker must have: id, name, logo, minDeposit, regulation, 
 *      spreadFrom, crypto, topCashback, verified, description, features,
 *      accountTypes, reviews, fundingMethods
 * 
 * 4. If your data structure is different, you can either:
 *    a) Transform your data to match the Broker type
 *    b) Modify the Broker type in BrokerListingPage.tsx
 * 
 * Example transformation:
 * const transformedData = your_data.map(broker => ({
 *   id: broker.broker_id,
 *   name: broker.broker_name,
 *   logo: broker.logo_text,
 *   // ... map other fields
 * }));
 */