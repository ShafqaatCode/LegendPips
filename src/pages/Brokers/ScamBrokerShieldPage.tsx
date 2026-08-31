import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiAlertTriangle, FiSearch, FiShield } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchScamShieldBrokers, type ApiBroker } from "../../services/brokerService";
import { fetchComplaintBlacklist, type BlacklistWarning } from "../../services/complaintService";

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(2.25rem, 5vw, 3.25rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.5rem);
  background: linear-gradient(135deg, #1a0b0b 0%, #3f1212 45%, #132e58 100%);
  color: white;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  filter: blur(2px);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(60, 10, 10, 0.75) 0%, rgba(19, 46, 88, 0.7) 100%);
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const Kicker = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fecaca;
`;

const Title = styled.h1`
  margin: 0.4rem 0 0.65rem;
  font-size: ${({ theme }) => theme.typography.heroTitle};
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  font-weight: 800;

  span {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const Lead = styled.p`
  margin: 0;
  max-width: 42rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const Page = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.95rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 20px rgba(19, 46, 88, 0.05);

  svg {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.9375rem;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultBanner = styled.div<{ $safe?: boolean }>`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.95rem 1.1rem;
  border-radius: 12px;
  margin-bottom: 1.25rem;
  background: ${({ $safe }) => ($safe ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  border: 1px solid ${({ $safe }) => ($safe ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)")};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  line-height: 1.5;

  strong {
    display: block;
    margin-bottom: 0.15rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: white;
  border: 1px solid #fecaca;
  border-radius: 14px;
  padding: 1rem 1.1rem;
  box-shadow: 0 10px 24px rgba(127, 29, 29, 0.05);
`;

const CardName = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 800;
  color: #991b1b;
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const Reason = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
`;

const Meta = styled.div`
  margin-top: 0.55rem;
  font-size: 0.7rem;
  color: #9ca3af;
`;

const SectionTitle = styled.h3`
  margin: 1.5rem 0 0.75rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 700;

  &:hover {
    opacity: 0.92;
  }
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 700;
  background: white;
`;

const Empty = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
`;

const ScamBrokerShieldPage: React.FC = () => {
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [warnings, setWarnings] = useState<BlacklistWarning[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchScamShieldBrokers({ page: 1, limit: 100 }),
      fetchComplaintBlacklist().catch(() => ({ brokers: [], warnings: [] as BlacklistWarning[] })),
    ])
      .then(([shield, bl]) => {
        if (cancelled) return;
        setBrokers(shield.items || []);
        setWarnings(bl.warnings || []);
      })
      .catch(() => {
        if (!cancelled) {
          setBrokers([]);
          setWarnings([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return brokers;
    return brokers.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.blacklistReason || "").toLowerCase().includes(q) ||
        (b.regulation || "").toLowerCase().includes(q)
    );
  }, [brokers, q]);

  const filteredWarnings = useMemo(() => {
    if (!q) return warnings;
    return warnings.filter((w) => w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q));
  }, [warnings, q]);

  const exactHit = useMemo(() => {
    if (!q) return null;
    return brokers.find((b) => b.name.toLowerCase() === q) || null;
  }, [brokers, q]);

  const softHit = filtered.length > 0 && q.length >= 2;

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Kicker>
            <FiShield /> Protection layer
          </Kicker>
          <Title>
            Scam Broker <span>Shield</span>
          </Title>
          <Lead>
            Search our warning list before you deposit. LegendPips flags brokers after trader complaints and internal
            review. This is a protection tool — not financial advice.
          </Lead>
        </HeroInner>
      </Hero>

      <Page>
        <SearchWrap>
          <FiSearch size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a broker name…"
            aria-label="Search Scam Broker Shield"
          />
        </SearchWrap>

        {q.length >= 2 && (
          <ResultBanner $safe={!exactHit && !softHit}>
            <FiAlertTriangle size={20} />
            <div>
              {exactHit ? (
                <>
                  <strong>Flagged on Scam Broker Shield</strong>
                  {exactHit.name} appears on our list. Reason: {exactHit.blacklistReason || "Under review after complaints."}
                </>
              ) : softHit ? (
                <>
                  <strong>Possible matches found</strong>
                  Review the results below carefully — names can be similar to legitimate brands.
                </>
              ) : (
                <>
                  <strong>No exact shield match</strong>
                  “{search.trim()}” is not on our current shield list. Still verify regulation and withdrawals yourself,
                  and report issues via Complaints.
                </>
              )}
            </div>
          </ResultBanner>
        )}

        <SectionTitle>Shield list ({loading ? "…" : filtered.length})</SectionTitle>
        {loading ? (
          <Empty>Loading shield list…</Empty>
        ) : filtered.length === 0 ? (
          <Empty>
            {q
              ? "No matching flagged brokers."
              : "No brokers on Scam Broker Shield yet. Admins can flag brokers from Brokers management or Complaints."}
          </Empty>
        ) : (
          <Grid>
            {filtered.map((b) => (
              <Card key={b._id}>
                <CardName>
                  <FiAlertTriangle /> {b.name}
                </CardName>
                <Reason>{b.blacklistReason || "Listed after trader complaints and internal review."}</Reason>
                <Meta>
                  {b.blacklistedAt
                    ? `Listed ${new Date(b.blacklistedAt).toLocaleDateString()}`
                    : "Listed date unavailable"}
                  {b.regulation ? ` · ${b.regulation}` : ""}
                </Meta>
              </Card>
            ))}
          </Grid>
        )}

        {filteredWarnings.length > 0 && (
          <>
            <SectionTitle>Additional public warnings</SectionTitle>
            <Grid>
              {filteredWarnings.map((w, i) => (
                <Card key={`${w.name}-${i}`}>
                  <CardName>
                    <FiAlertTriangle /> {w.name}
                  </CardName>
                  <Reason>Category: {w.category}</Reason>
                  <Meta>{w.since ? `Since ${new Date(w.since).toLocaleDateString()}` : "Warning entry"}</Meta>
                </Card>
              ))}
            </Grid>
          </>
        )}

        <Actions>
          <ActionLink to="/complaints">Report a broker</ActionLink>
          <GhostLink to="/brokers/beginners">Best brokers for new traders</GhostLink>
          <GhostLink to="/brokers">All brokers</GhostLink>
        </Actions>
      </Page>
    </>
  );
};

export default ScamBrokerShieldPage;
