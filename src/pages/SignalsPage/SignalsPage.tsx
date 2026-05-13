import React, { useEffect, useState } from 'react';
import SignalsHero from '../../components/Signals/SignalsHero';
import LiveSignalsSection from '../../components/Signals/LiveSignalsSection';
import SignalsSection from '../../components/Signals/SignalsSection';
import XMBanner from '../../components/Signals/XMBanner';
import Testimonials from '../../components/Testimonials/Testimonials';
import SubscriptionModal from '../../components/Signals/SubscriptionModal';
import { fetchPublicSignals, toSignalListRow, type ApiSignal } from '../../services/signalService';

type Row = ReturnType<typeof toSignalListRow>;

const mapRows = (items: ApiSignal[]): Row[] => items.map(toSignalListRow);

const fallbackForex: Row[] = [
  { pair: 'EUR/USD', entry: '1.0845', tp: '1.0875', sl: '1.0825', status: 'buy' },
  { pair: 'GBP/USD', entry: '1.2645', tp: '1.2675', sl: '1.2625', status: 'buy' },
];

const fallbackCrypto: Row[] = [
  { pair: 'BTC/USD', entry: '43250', tp: '44500', sl: '42500', status: 'buy' },
  { pair: 'ETH/USD', entry: '2650', tp: '2750', sl: '2600', status: 'buy' },
];

const SignalsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [forexSignals, setForexSignals] = useState<Row[]>(fallbackForex);
  const [cryptoSignals, setCryptoSignals] = useState<Row[]>(fallbackCrypto);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fx, cr] = await Promise.all([
          fetchPublicSignals({ assetClass: 'forex', limit: 8, tradeStatus: 'active' }),
          fetchPublicSignals({ assetClass: 'crypto', limit: 8, tradeStatus: 'active' }),
        ]);
        if (cancelled) return;
        if (fx.items?.length) setForexSignals(mapRows(fx.items));
        if (cr.items?.length) setCryptoSignals(mapRows(cr.items));
      } catch {
        /* keep fallbacks */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SignalsHero />
      <LiveSignalsSection
        onCtaClick={() => setShowModal(true)}
        forexSignals={forexSignals}
        cryptoSignals={cryptoSignals}
      />
      <SignalsSection title="Forex Signals" signals={forexSignals} onCtaClick={() => setShowModal(true)} />
      <XMBanner />
      <SignalsSection title="Crypto signals" signals={cryptoSignals} onCtaClick={() => setShowModal(true)} />
      <Testimonials />
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default SignalsPage;
