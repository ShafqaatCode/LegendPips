import React, { useState } from 'react';
import SignalsHero from '../../components/Signals/SignalsHero';
import LiveSignalsSection from '../../components/Signals/LiveSignalsSection';
import SignalsSection from '../../components/Signals/SignalsSection';
import XMBanner from '../../components/Signals/XMBanner';
import Testimonials from '../../components/Testimonials/Testimonials';
import SubscriptionModal from '../../components/Signals/SubscriptionModal';

const SignalsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const forexSignals = [
    { pair: 'EUR/USD', entry: '1.0845', tp: '1.0875', sl: '1.0825', status: 'buy' as const },
    { pair: 'GBP/USD', entry: '1.2645', tp: '1.2675', sl: '1.2625', status: 'buy' as const },
    { pair: 'AUD/USD', entry: '0.6545', tp: '0.6575', sl: '0.6525', status: 'buy' as const },
    { pair: 'CAD/JPY', entry: '110.45', tp: '110.75', sl: '110.25', status: 'buy' as const },
  ];

  const cryptoSignals = [
    { pair: 'BTC/USD', entry: '43250', tp: '44500', sl: '42500', status: 'buy' as const },
    { pair: 'ETH/USD', entry: '2650', tp: '2750', sl: '2600', status: 'buy' as const },
    { pair: 'XRP/USD', entry: '0.65', tp: '0.68', sl: '0.63', status: 'buy' as const },
    { pair: 'LTC/USD', entry: '98', tp: '105', sl: '95', status: 'buy' as const },
  ];

  return (
    <>
      <SignalsHero />
      <LiveSignalsSection onCtaClick={() => setShowModal(true)} />
      <SignalsSection title="Forex Signals" signals={forexSignals} onCtaClick={() => setShowModal(true)} />
      <XMBanner />
      <SignalsSection title="Crypto signals" signals={cryptoSignals} onCtaClick={() => setShowModal(true)} />
      <Testimonials />
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default SignalsPage;
