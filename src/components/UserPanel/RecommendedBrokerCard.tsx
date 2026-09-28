import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiArrowRight, FiAward } from "react-icons/fi";
import type { RecommendedBroker } from "../../services/accountManagerService";
import { normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";

type Props = {
  broker: RecommendedBroker;
};

const RecommendedBrokerCard: React.FC<Props> = ({ broker }) => {
  const logo = normalizeBrokerLogoUrl(broker.logoUrl);
  const detailTo = `/rebates/broker/${broker.id}`;

  return (
    <Card>
      <Head>
        <LogoBox>
          {logo ? <img src={logo} alt="" /> : <span>{broker.name.slice(0, 2).toUpperCase()}</span>}
        </LogoBox>
        <HeadCopy>
          <Label>Recommended broker</Label>
          <Name>{broker.name}</Name>
          {(broker.cashbackRate || broker.verified) && (
            <Meta>
              {broker.verified ? <span className="ok">Verified</span> : null}
              {broker.cashbackRate ? <span>Cashback {broker.cashbackRate}</span> : null}
            </Meta>
          )}
        </HeadCopy>
        {broker.topCashback ? (
          <Badge>
            <FiAward /> Top
          </Badge>
        ) : null}
      </Head>

      {broker.description ? <Body>{broker.description}</Body> : null}

      <Facts>
        {broker.spreadFrom ? <span>Spreads {broker.spreadFrom}</span> : null}
        {broker.minDeposit != null ? <span>Min ${broker.minDeposit}</span> : null}
      </Facts>

      <Actions>
        <PrimaryLink to={detailTo}>
          View broker <FiArrowRight />
        </PrimaryLink>
        {broker.setupUrl ? (
          <GhostA href={broker.setupUrl} target="_blank" rel="noopener noreferrer">
            Open account
          </GhostA>
        ) : null}
      </Actions>
    </Card>
  );
};

export default RecommendedBrokerCard;

const Card = styled.article`
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.05);
  padding: 1.1rem 1.15rem 1.05rem;
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
`;

const LogoBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border: 1px solid #e8ecf1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-weight: 800;
  color: #132e58;
  font-size: 0.8rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
  }
`;

const HeadCopy = styled.div`
  flex: 1;
  min-width: 0;
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.15rem;
`;

const Name = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #334155;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.3rem;
  font-size: 0.75rem;
  color: #64748b;

  .ok {
    color: #059669;
    font-weight: 700;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: #fef3c7;
  color: #b45309;
  font-size: 0.6875rem;
  font-weight: 800;
`;

const Body = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Facts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
  margin-top: 0.65rem;
  font-size: 0.8rem;
  color: #475569;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.9rem;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  background: #132e58;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: #1a3d6e;
  }
`;

const GhostA = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  color: #132e58;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  background: #fff;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
`;
