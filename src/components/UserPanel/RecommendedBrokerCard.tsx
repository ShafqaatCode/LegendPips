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
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
  border: 1px solid rgba(19, 46, 88, 0.08);
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.055);
  padding: 1.15rem 1.2rem 1.1rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #132e58, rgba(19, 46, 88, 0));
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
`;

const LogoBox = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 14px;
  border: 1px solid rgba(19, 46, 88, 0.08);
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-weight: 800;
  color: #132e58;
  font-size: 0.8rem;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 5px;
  }
`;

const HeadCopy = styled.div`
  flex: 1;
  min-width: 0;
`;

const Label = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.2rem;
`;

const Name = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: #132e58;
  letter-spacing: -0.02em;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
  font-size: 0.72rem;
  color: #64748b;

  span {
    display: inline-flex;
    padding: 0.18rem 0.5rem;
    border-radius: 999px;
    background: #f1f5f9;
    font-weight: 700;
  }

  .ok {
    background: rgba(5, 150, 105, 0.12);
    color: #059669;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #fff8e1, #fef3c7);
  color: #92400e;
  font-size: 0.6875rem;
  font-weight: 800;
  border: 1px solid rgba(251, 193, 19, 0.45);
`;

const Body = styled.p`
  margin: 0.8rem 0 0;
  font-size: 0.84rem;
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
  gap: 0.45rem;
  margin-top: 0.75rem;
  font-size: 0.74rem;
  color: #334155;
  font-weight: 700;

  span {
    padding: 0.28rem 0.55rem;
    border-radius: 999px;
    background: rgba(19, 46, 88, 0.05);
    border: 1px solid rgba(19, 46, 88, 0.08);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1rem;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.95rem;
  border-radius: 11px;
  background: linear-gradient(145deg, #132e58, #1a3d6e);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 8px 16px rgba(19, 46, 88, 0.2);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(19, 46, 88, 0.28);
  }
`;

const GhostA = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 0.95rem;
  border-radius: 11px;
  border: 1px solid rgba(251, 193, 19, 0.45);
  color: #132e58;
  font-size: 0.8125rem;
  font-weight: 800;
  text-decoration: none;
  background: linear-gradient(180deg, #fffdf5, #fff);

  &:hover {
    border-color: #fbc113;
    background: #fff8e1;
  }
`;
