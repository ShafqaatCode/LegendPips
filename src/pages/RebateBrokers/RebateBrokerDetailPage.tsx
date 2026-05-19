import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { fetchPublicBrokerById, type ApiBroker } from "../../services/brokerService";
import { mapApiBrokerToRebateCardRow } from "../../utils/rebatesBrokersDisplay";
import { BrokerDetailSkeleton } from "../../components/SharedComponents/Shimmer";

const Wrap = styled.main`
  max-width: 960px;
  margin: 100px auto 3rem;
  padding: 0 1.5rem 3rem;
  font-family: "Segoe UI", sans-serif;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #132e58;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Card = styled.article`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Head = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const TitleBlock = styled.div`
  flex: 1;
  min-width: 240px;
`;

const H1 = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #132e58;
`;

const Badge = styled.span`
  display: inline-block;
  background: #132e58;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 1rem;
`;

const Blurb = styled.p`
  margin: 0 0 1.5rem 0;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.85);
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: #132e58;
  margin: 1.5rem 0 0.75rem 0;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  color: #374151;
  line-height: 1.6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  th,
  td {
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #f3f4f6;
  }
  th {
    color: #6b7280;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.5rem;
`;

const Err = styled.p`
  color: #b91c1c;
`;

const RebateBrokerDetailPage: React.FC = () => {
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
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Broker not found.");
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

  if (loading) {
    return (
      <Wrap>
        <Back to="/rebates">← Back to Rebates Brokers</Back>
        <BrokerDetailSkeleton />
      </Wrap>
    );
  }

  if (error || !broker) {
    return (
      <Wrap>
        <Back to="/rebates">← Back to Rebates Brokers</Back>
        <Err>{error || "Broker not found."}</Err>
      </Wrap>
    );
  }

  const row = mapApiBrokerToRebateCardRow(broker);
  const rating = row.rating;

  return (
    <Wrap>
      <Back to="/rebates">← Back to Rebates Brokers</Back>
      <Card>
        <Head>
          <Logo src={row.logoSrc} alt="" />
          <TitleBlock>
            <H1>{broker.name}</H1>
            {broker.verified !== false && <Badge>Verified broker</Badge>}
            <Meta>
              <span>
                <strong>Min deposit</strong> ${broker.minDeposit}
              </span>
              <span>
                <strong>Regulation</strong> {broker.regulation || "—"}
              </span>
              <span>
                <strong>Spread from</strong> {broker.spreadFrom || "—"}
              </span>
              <span>
                <strong>Crypto</strong> {broker.crypto || "—"}
              </span>
              {broker.cashbackRate && (
                <span>
                  <strong>Cashback</strong> {broker.cashbackRate}
                </span>
              )}
            </Meta>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < rating ? "#FBAF00" : "#ccc"} />
              ))}
              {broker.rebatesReviewsLabel && (
                <span style={{ marginLeft: 8, color: "#374151", fontSize: "0.95rem" }}>
                  {broker.rebatesReviewsLabel} reviews
                </span>
              )}
            </Stars>
          </TitleBlock>
        </Head>
        {broker.description?.trim() && <Blurb>{broker.description}</Blurb>}

        {broker.features?.length ? (
          <>
            <SectionTitle>Highlights</SectionTitle>
            <List>
              {broker.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </List>
          </>
        ) : null}

        {broker.accountTypes?.length ? (
          <>
            <SectionTitle>Account types</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Spread</th>
                  <th>Min deposit</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {broker.accountTypes.map((a, i) => (
                  <tr key={i}>
                    <td>{a.name}</td>
                    <td>{a.spreadFrom || "—"}</td>
                    <td>{a.minDeposit || "—"}</td>
                    <td>{a.commission || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : null}

        {broker.reviews?.length ? (
          <>
            <SectionTitle>Sample reviews</SectionTitle>
            <List>
              {broker.reviews.map((r, i) => (
                <li key={i}>
                  <strong>{r.name}</strong> ({r.rating}/5) — {r.comment}
                </li>
              ))}
            </List>
          </>
        ) : null}
      </Card>
    </Wrap>
  );
};

export default RebateBrokerDetailPage;
