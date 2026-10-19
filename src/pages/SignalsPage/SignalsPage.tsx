import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiBell, FiLock, FiShield, FiZap } from "react-icons/fi";
import SignalsHero from "../../components/Signals/SignalsHero";
import LiveSignalsSection from "../../components/Signals/LiveSignalsSection";
import XMBanner from "../../components/Signals/XMBanner";
import Testimonials from "../../components/Testimonials/Testimonials";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { fetchPublicSignals, toSignalListRow, type ApiSignal } from "../../services/signalService";

type Row = ReturnType<typeof toSignalListRow>;

const mapRows = (items: ApiSignal[]): Row[] => items.map(toSignalListRow);

const fallbackForex: Row[] = [
  { pair: "EUR/USD", entry: "1.0845", tp: "1.0875", sl: "1.0825", status: "buy" },
  { pair: "GBP/USD", entry: "1.2645", tp: "1.2675", sl: "1.2625", status: "buy" },
  { pair: "USD/JPY", entry: "149.85", tp: "150.40", sl: "149.20", status: "sell" },
  { pair: "AUD/USD", entry: "0.6545", tp: "0.6575", sl: "0.6525", status: "buy" },
];

const fallbackCryptoGold: Row[] = [
  { pair: "XAU/USD", entry: "2340", tp: "2365", sl: "2320", status: "buy" },
  { pair: "BTC/USD", entry: "43250", tp: "44500", sl: "42500", status: "buy" },
  { pair: "ETH/USD", entry: "2650", tp: "2750", sl: "2600", status: "buy" },
  { pair: "XAG/USD", entry: "28.40", tp: "29.10", sl: "27.80", status: "sell" },
];

const VALUE_POINTS = [
  {
    icon: FiZap,
    title: "Real-time entries",
    body: "Active setups across Forex, Gold, and Crypto — refreshed as the market moves.",
  },
  {
    icon: FiBell,
    title: "Multi-channel alerts",
    body: "Get notified by email, SMS, or Telegram so you never miss a premium call.",
  },
  {
    icon: FiShield,
    title: "Risk defined",
    body: "Every idea ships with entry, take-profit, and stop-loss so risk stays clear.",
  },
  {
    icon: FiLock,
    title: "Member access",
    body: "Link your account and unlock the full live feed inside your trader panel.",
  },
];

const SignalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { openRegister } = useAuthModal();
  const [forexSignals, setForexSignals] = useState<Row[]>([]);
  const [cryptoGoldSignals, setCryptoGoldSignals] = useState<Row[]>([]);
  const [premiumAccess, setPremiumAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fx, crypto, commodities] = await Promise.all([
          fetchPublicSignals({ assetClass: "forex", limit: 8, tradeStatus: "active" }),
          fetchPublicSignals({ assetClass: "crypto", limit: 8, tradeStatus: "active" }),
          fetchPublicSignals({ assetClass: "commodities", limit: 8, tradeStatus: "active" }),
        ]);
        if (cancelled) return;
        setPremiumAccess(!!(fx.premiumAccess || crypto.premiumAccess || commodities.premiumAccess));
        setForexSignals(mapRows(fx.items || []));
        const merged = [...(commodities.items || []), ...(crypto.items || [])];
        setCryptoGoldSignals(mapRows(merged).slice(0, 8));
      } catch {
        if (!cancelled) {
          setForexSignals(fallbackForex);
          setCryptoGoldSignals(fallbackCryptoGold);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleJoin = () => {
    if (isAuthenticated) {
      if (premiumAccess || user?.hasPremiumSignals || user?.premiumSignalsAccess) {
        navigate("/user-panel/signals");
        return;
      }
      navigate("/user-panel/live-accounts");
      return;
    }
    openRegister({ returnTo: "/user-panel/signals", redirectAfterLogin: true });
  };

  return (
    <Page>
      <SignalsHero onCtaClick={handleJoin} />
      <LiveSignalsSection
        onCtaClick={handleJoin}
        forexSignals={forexSignals}
        cryptoSignals={cryptoGoldSignals}
        loading={loading}
        ctaText={
          premiumAccess || user?.hasPremiumSignals || user?.premiumSignalsAccess
            ? "Open my signals"
            : "Unlock premium signals"
        }
      />
      <ValueStrip>
        <ValueInner>
          <ValueHead>
            <Eyebrow>Why traders use LegendPips signals</Eyebrow>
            <h2>One clean board. Clear risk. Faster decisions.</h2>
            <p>
              Browse the live feed above, then unlock alerts and the full archive from your member panel —
              no duplicated lists, no noise.
            </p>
          </ValueHead>
          <ValueGrid>
            {VALUE_POINTS.map((item) => {
              const Icon = item.icon;
              return (
                <ValueCard key={item.title}>
                  <span className="icon">
                    <Icon />
                  </span>
                  <strong>{item.title}</strong>
                  <em>{item.body}</em>
                </ValueCard>
              );
            })}
          </ValueGrid>
        </ValueInner>
      </ValueStrip>
      <BannerWrap>
        <XMBanner />
      </BannerWrap>
      <Testimonials />
    </Page>
  );
};

export default SignalsPage;

const Page = styled.div`
  background: #f7f9fc;
`;

const ValueStrip = styled.section`
  padding: 2.5rem ${({ theme }) => theme.typography.pageGutter} 1rem;
`;

const ValueInner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const ValueHead = styled.div`
  max-width: 40rem;
  margin-bottom: 1.35rem;

  h2 {
    margin: 0.35rem 0 0.55rem;
    font-size: ${({ theme }) => theme.typography.sectionTitle};
    line-height: ${({ theme }) => theme.typography.sectionTitleLh};
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #132e58;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.55;
    color: #64748b;
  }
`;

const Eyebrow = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbc113;
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.article`
  padding: 1.1rem 1.05rem;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e8ecf1;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    margin-bottom: 0.7rem;
    background: linear-gradient(145deg, #132e58, #1a3d6e);
    color: #fbc113;
    font-size: 1.05rem;
  }

  strong {
    display: block;
    font-size: 0.92rem;
    font-weight: 800;
    color: #132e58;
    margin-bottom: 0.35rem;
  }

  em {
    display: block;
    font-style: normal;
    font-size: 0.8rem;
    line-height: 1.5;
    color: #64748b;
  }
`;

const BannerWrap = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0.5rem auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter} 2rem;
`;
