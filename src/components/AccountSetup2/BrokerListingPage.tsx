import React, { useState } from 'react';
import BrokerListingPage, { Broker } from './BrokerListingPage';
import BrokerDetailPage from './BrokerDetailPage';
import BrokerSetupPage from './BrokerSetupPage';

// Sample broker data - replace with your actual data import
const sampleBrokers: Broker[] = [
  {
    id: '1',
    name: 'IC Markets',
    logo: 'IC',
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
    logo: 'XM',
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
      { name: 'Sarah', rating: 4, comment: 'Reliable broker with good support.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets'],
    cashbackRate: '0.35 pip'
  },
  {
    id: '3',
    name: 'Exness',
    logo: 'EX',
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
    logo: 'RO',
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
    accountTypes: [],
    reviews: [],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'Crypto'],
    cashbackRate: '0.30 pip'
  },
  {
    id: '5',
    name: 'Focus Markets',
    logo: 'FM',
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
    accountTypes: [],
    reviews: [],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets'],
    cashbackRate: '0.25 pip'
  }
];

type PageType = 'listing' | 'detail' | 'setup';

export default function App() {
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
          brokers={sampleBrokers} 
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
}

// ----- USAGE WITH YOUR EXISTING DATA -----
// Replace the sampleBrokers with your actual data:
//
// import { brokers_data } from '../../data/brokers_data';
//
// Then use it in the App component:
// <BrokerListingPage brokers={brokers_data} onBrokerSelect={handleBrokerSelect} />
//
// Make sure your brokers_data matches the Broker type structure!