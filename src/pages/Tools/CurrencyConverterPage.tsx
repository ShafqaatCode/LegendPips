import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiRefreshCw, FiShuffle } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import {
  CONVERTER_CURRENCIES,
  convertAmount,
  fetchFxRates,
  type FxRateMap,
} from "../../utils/marketTools";

const CurrencyConverterPage: React.FC = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [rates, setRates] = useState<FxRateMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRates = async (base: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetchFxRates(base);
      setRates(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load rates");
      setRates({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRates(from);
  }, [from]);

  const converted = useMemo(() => {
    const n = parseFloat(amount);
    return convertAmount(n, from, to, rates, from);
  }, [amount, from, to, rates]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiShuffle aria-hidden /> Tools
          </Eyebrow>
          <Title>Currency converter</Title>
          <Lead>
            Convert between major fiat currencies using live mid-market rates — handy for position sizing and
            cross-border deposits.
          </Lead>
          <HeroLinks>
            <HeroLink to="/pip-calculator">
              Pip calculator <FiArrowRight />
            </HeroLink>
            <HeroLink to="/margin-calculator">Margin calculator</HeroLink>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <Page>
        <Card>
          <Row>
            <Field>
              <span>Amount</span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field>
              <span>From</span>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                {CONVERTER_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <SwapBtn type="button" onClick={swapCurrencies} aria-label="Swap currencies">
              <FiShuffle />
            </SwapBtn>
            <Field>
              <span>To</span>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {CONVERTER_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </Row>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Result>
            {loading ? (
              "Loading rates…"
            ) : converted === null ? (
              "Enter a valid amount"
            ) : (
              <>
                <strong>
                  {parseFloat(amount || "0").toLocaleString(undefined, { maximumFractionDigits: 4 })} {from}
                </strong>
                <span>=</span>
                <strong>
                  {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {to}
                </strong>
              </>
            )}
          </Result>

          <RefreshRow>
            <GhostBtn type="button" onClick={() => void loadRates(from)} disabled={loading}>
              <FiRefreshCw /> Refresh rates
            </GhostBtn>
            <small>Mid-market rates via Frankfurter — for reference only.</small>
          </RefreshRow>
        </Card>
      </Page>
    </>
  );
};

export default CurrencyConverterPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(240px, 32vh, 300px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(3rem, 7vw, 4rem) ${({ theme }) => theme.typography.pageGutter} 2rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${bannerBg});
  background-size: cover;
  opacity: 0.12;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fbbf24;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const HeroLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const HeroLink = styled(Link)`
  color: #fbbf24;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Card = styled.section`
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr;
  gap: 0.75rem;
  align-items: end;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  input,
  select {
    padding: 0.65rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9375rem;
    font-family: inherit;
  }
`;

const SwapBtn = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #132e58;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 640px) {
    justify-self: center;
  }
`;

const Result = styled.div`
  margin-top: 1.25rem;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #132e58 0%, #1a4a7a 100%);
  color: #fff;
  text-align: center;
  font-size: 1.1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 0.75rem;
  strong {
    color: #fbbf24;
  }
`;

const RefreshRow = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  small {
    color: #94a3b8;
    font-size: 0.75rem;
  }
`;

const GhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  color: #132e58;
  &:disabled {
    opacity: 0.6;
  }
`;

const ErrorBox = styled.div`
  margin-top: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.8125rem;
`;
