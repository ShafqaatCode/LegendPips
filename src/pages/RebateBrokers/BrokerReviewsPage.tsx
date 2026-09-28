import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiStar } from "react-icons/fi";
import { BrokerDetailSkeleton } from "../../components/SharedComponents/Shimmer";
import { fetchPublicBrokerById, type ApiBroker } from "../../services/brokerService";
import { REBATES_BROKER_FALLBACK_LOGOS } from "../../utils/rebatesBrokersDisplay";
import ICLogo from "../../assets/icons/Ellipse 2.png";
import BrokerReviewsSection from "../../components/Broker/BrokerReviewsSection";

const BrokerReviewsPage: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const [broker, setBroker] = useState<ApiBroker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brokerId) {
      setLoading(false);
      setError("Missing broker id.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const b = await fetchPublicBrokerById(brokerId);
        if (!cancelled) setBroker(b);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Broker not found.");
          setBroker(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brokerId]);

  const logoSrc = useMemo(() => {
    if (!broker) return ICLogo;
    return (
      (broker.logoUrl && broker.logoUrl.trim()) ||
      REBATES_BROKER_FALLBACK_LOGOS[broker.name] ||
      ICLogo
    );
  }, [broker]);

  if (loading) {
    return (
      <PageShell>
        <PageInner>
          <BrokerDetailSkeleton />
        </PageInner>
      </PageShell>
    );
  }

  if (error || !broker) {
    return (
      <PageShell>
        <PageInner>
          <Err>{error || "Broker not found."}</Err>
        </PageInner>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageInner>
        <BackLink to={`/rebates/broker/${broker._id}`}>
          <FiArrowLeft size={15} aria-hidden />
          Back to {broker.name} details
        </BackLink>

        <Hero>
          <Logo src={logoSrc} alt="" />
          <HeroCopy>
            <Eyebrow>
              <FiStar aria-hidden /> Broker reviews
            </Eyebrow>
            <Title>{broker.name} reviews</Title>
            <Lead>
              Trader feedback moderated by LegendPips. Read ratings, then open full broker details or
              start setup when you’re ready.
            </Lead>
            <HeroActions>
              <GhostLink to={`/rebates/broker/${broker._id}`}>View broker details</GhostLink>
              {!broker.temporarilyDisabled && (
                <PrimaryLink to={`/rebates/broker/${broker._id}?setup=1`}>Setup account</PrimaryLink>
              )}
            </HeroActions>
          </HeroCopy>
        </Hero>

        <BrokerReviewsSection
          brokerId={broker._id}
          brokerName={broker.name}
          allowPayoutReviews={broker.rebateCategory === "prop"}
        />
      </PageInner>
    </PageShell>
  );
};

export default BrokerReviewsPage;

const PageShell = styled.main`
  background: #f4f6fa;
  padding: 1.15rem 0 2.5rem;
  min-height: 60vh;
`;

const PageInner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;

  &:hover {
    color: #132e58;
  }
`;

const Hero = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  margin-bottom: 0.85rem;
  background: #fff;
  border: 1px solid rgba(19, 46, 88, 0.08);
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(19, 46, 88, 0.05);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e8eef6;
  padding: 5px;
  flex-shrink: 0;
`;

const HeroCopy = styled.div`
  min-width: 0;
  flex: 1;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #b45309;
`;

const Title = styled.h1`
  margin: 0 0 0.35rem;
  font-size: clamp(1.15rem, 1.5vw + 0.6rem, 1.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f1c46;
  line-height: 1.25;
`;

const Lead = styled.p`
  margin: 0;
  max-width: 40rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #64748b;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.75rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #132e58;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    border-color: #cbd5e1;
    background: #eef2f7;
  }
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  background: #132e58;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: #1a3d6e;
  }
`;

const Err = styled.p`
  color: #b91c1c;
  text-align: center;
  padding: 2rem;
`;
