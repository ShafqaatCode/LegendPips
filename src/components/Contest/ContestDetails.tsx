import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiAward, FiCalendar, FiUsers, FiZap } from "react-icons/fi";
import {
  fetchCompetitionById,
  fetchLeaderboard,
  type Competition,
  type LeaderboardEntry,
} from "../../services/contestService";
import defaultContestLogo from "../../assets/Contest_Images/wmug5dukcys 1-1.png";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../../pages/Login/LoginModal";
import RegisterModal from "../../pages/Register/RegisterModal";
import JoinContestModal from "../ContestList/JoinContestModal";
import { CenteredBlockSkeleton } from "../SharedComponents/Shimmer";

function formatDate(raw?: string): string {
  if (!raw?.trim()) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw.slice(0, 10);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ContestDetails: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const { isAuthenticated } = useAuth();
  const [contest, setContest] = useState<Competition | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoSrc, setLogoSrc] = useState(defaultContestLogo);
  const [joinOpen, setJoinOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [pendingJoin, setPendingJoin] = useState(false);

  const load = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompetitionById(id);
      if (!data) {
        setError("Contest not found.");
        setContest(null);
        setBoard([]);
        return;
      }
      setContest(data);
      setLogoSrc(data.logo?.trim() ? data.logo : defaultContestLogo);
      try {
        setBoard(await fetchLeaderboard(id));
      } catch {
        setBoard([]);
      }
    } catch {
      setError("Failed to load contest details.");
      setContest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contestId) return;
    load(contestId);
  }, [contestId]);

  const onJoin = () => {
    if (!contest || contest.status === "Ended" || !contestId) return;
    if (!isAuthenticated) {
      setPendingJoin(true);
      setLoginOpen(true);
      return;
    }
    setJoinOpen(true);
  };

  if (loading) {
    return (
      <Centered>
        <CenteredBlockSkeleton />
      </Centered>
    );
  }

  if (error || !contest) {
    return (
      <Page>
        <Empty>
          <h2>{error || "Contest not found"}</h2>
          <BackLink to="/contests">
            <FiArrowLeft /> Back to contests
          </BackLink>
        </Empty>
      </Page>
    );
  }

  const id = String(contest.id ?? contest._id ?? contestId ?? "");
  const prizes = [...(contest.prizes || [])].sort((a, b) => a.position - b.position);
  const rules = contest.rules || [];
  const canJoin = contest.status !== "Ended";

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <BackLink to="/contests">
            <FiArrowLeft /> All contests
          </BackLink>
          <Status $status={contest.status}>{contest.status}</Status>
          <h1>{contest.title}</h1>
          <p>
            {[contest.subtitle, contest.event, contest.type].filter(Boolean).join(" · ") ||
              "Compete free on LegendPips with a demo account."}
          </p>
        </HeroInner>
      </Hero>

      <Page>
        <SummaryCard>
          <LogoWrap>
            <img
              src={logoSrc}
              alt=""
              onError={() => setLogoSrc(defaultContestLogo)}
            />
          </LogoWrap>
          <SummaryBody>
            <MetaRow>
              <Meta>
                <FiUsers />
                <div>
                  <span>Participants</span>
                  <strong>{(contest.participants || 0).toLocaleString()}</strong>
                </div>
              </Meta>
              <Meta>
                <FiCalendar />
                <div>
                  <span>Ends</span>
                  <strong>{formatDate(contest.ends || contest.endDate)}</strong>
                </div>
              </Meta>
              <Meta>
                <FiZap />
                <div>
                  <span>Entry</span>
                  <strong>{contest.entry || "Free"}</strong>
                </div>
              </Meta>
            </MetaRow>
            {contest.description ? <Lead>{contest.description}</Lead> : null}
            {contest.sponsorText ? (
              <Sponsor>
                Sponsored by{" "}
                {contest.sponsorUrl ? (
                  <a href={contest.sponsorUrl} target="_blank" rel="noopener noreferrer">
                    {contest.sponsorText}
                  </a>
                ) : (
                  contest.sponsorText
                )}
              </Sponsor>
            ) : (
              <Sponsor>Demo contest — no real-money deposit required to join.</Sponsor>
            )}
          </SummaryBody>
          <Actions>
            <PrimaryBtn type="button" disabled={!canJoin} onClick={onJoin}>
              {canJoin ? "Join contest" : "Contest closed"}
            </PrimaryBtn>
            <GhostBtn to="/leaderboard">View leaderboards</GhostBtn>
          </Actions>
        </SummaryCard>

        <Grid>
          <Column>
            <Panel>
              <PanelTitle>
                <FiAward /> Prize pool
              </PanelTitle>
              {prizes.length === 0 ? (
                <Muted>Prize details will be announced by the contest host.</Muted>
              ) : (
                <PrizeList>
                  {prizes.map((p) => (
                    <PrizeRow key={`${p.position}-${p.prize}`}>
                      <Rank>#{p.position}</Rank>
                      <div>
                        <strong>{p.prize}</strong>
                        {p.description ? <span>{p.description}</span> : null}
                      </div>
                    </PrizeRow>
                  ))}
                </PrizeList>
              )}
            </Panel>

            <Panel>
              <PanelTitle>Rules</PanelTitle>
              {rules.length === 0 ? (
                <Muted>
                  Trade fairly on a LegendPips-linked demo account. Multiple opposing accounts or coordinated
                  abuse will be removed.
                </Muted>
              ) : (
                <RuleList>
                  {rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </RuleList>
              )}
            </Panel>
          </Column>

          <Panel>
            <PanelTitle>Competition leaderboard</PanelTitle>
            {board.length === 0 ? (
              <Muted>No rankings yet. Be the first to join and climb the board.</Muted>
            ) : (
              <TableWrap>
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Trader</th>
                      <th>Profit %</th>
                      <th>Trades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {board.map((row) => (
                      <tr key={row.id || `${row.rank}-${row.name}`}>
                        <td>
                          <RankBadge>{row.rank}</RankBadge>
                        </td>
                        <td>
                          <strong>{row.name}</strong>
                          <small>{row.accountNumber || row.account}</small>
                        </td>
                        <td>{row.profit}</td>
                        <td>{row.trades}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Panel>
        </Grid>
      </Page>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setPendingJoin(false);
        }}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onLoginSuccess={() => {
          setLoginOpen(false);
          if (pendingJoin) {
            setPendingJoin(false);
            setJoinOpen(true);
          }
        }}
      />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
      <JoinContestModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
        comp={contest}
        contestId={id}
        onJoined={() => {
          if (contestId) load(contestId);
        }}
      />
    </>
  );
};

export default ContestDetails;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem ${({ theme }) => theme.typography.pageGutter};
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(2rem, 5vw, 3rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.5rem, 3vw, 2.25rem);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, rgba(11, 27, 56, 0.75), rgba(19, 46, 88, 0.35));
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  color: #fff;

  h1 {
    margin: 0.65rem 0 0.45rem;
    font-size: clamp(1.45rem, 2.2vw + 0.7rem, 2.1rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  p {
    margin: 0;
    max-width: 40rem;
    font-size: 0.92rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.78);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.85rem;

  &:hover {
    color: #fbc113;
  }
`;

const Status = styled.span<{ $status: Competition["status"] }>`
  display: inline-flex;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === "Upcoming" ? "rgba(59,130,246,0.2)" : $status === "Ongoing" ? "rgba(16,185,129,0.2)" : "rgba(148,163,184,0.2)"};
  color: ${({ $status }) =>
    $status === "Upcoming" ? "#93c5fd" : $status === "Ongoing" ? "#6ee7b7" : "#cbd5e1"};
`;

const Page = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Empty = styled.div`
  text-align: center;
  padding: 3rem 1rem;

  h2 {
    color: #132e58;
    margin: 0 0 1rem;
  }

  ${BackLink} {
    color: #132e58;
  }
`;

const SummaryCard = styled.section`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  margin-bottom: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    justify-items: start;
  }
`;

const LogoWrap = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
  }
`;

const SummaryBody = styled.div`
  min-width: 0;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin-bottom: 0.75rem;
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #132e58;

  svg {
    color: #fbc113;
    flex-shrink: 0;
  }

  span {
    display: block;
    font-size: 0.68rem;
    color: #64748b;
    font-weight: 600;
  }

  strong {
    display: block;
    font-size: 0.9rem;
    font-weight: 800;
  }
`;

const Lead = styled.p`
  margin: 0 0 0.55rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #475569;
`;

const Sponsor = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;

  a {
    color: #132e58;
    font-weight: 700;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 160px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const PrimaryBtn = styled.button`
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.1rem;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  background: linear-gradient(90deg, #fbc113 0%, #f4b400 100%);
  color: #132e58;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const GhostBtn = styled(Link)`
  text-align: center;
  text-decoration: none;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-weight: 700;
  font-size: 0.8rem;
  color: #132e58;
  border: 1px solid #dbe3ef;
  background: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  padding: 1.15rem 1.2rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.03);
`;

const PanelTitle = styled.h2`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.85rem;
  font-size: 1rem;
  font-weight: 800;
  color: #132e58;
`;

const Muted = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #64748b;
`;

const PrizeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const PrizeRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #eef2f7;

  strong {
    display: block;
    color: #132e58;
    font-size: 0.88rem;
  }

  span {
    display: block;
    margin-top: 0.15rem;
    font-size: 0.75rem;
    color: #64748b;
  }
`;

const Rank = styled.div`
  flex-shrink: 0;
  min-width: 2.2rem;
  height: 2.2rem;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #132e58;
  color: #fbc113;
  font-size: 0.72rem;
  font-weight: 800;
`;

const RuleList = styled.ol`
  margin: 0;
  padding-left: 1.15rem;
  color: #475569;
  font-size: 0.85rem;
  line-height: 1.55;

  li + li {
    margin-top: 0.45rem;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }

  th {
    text-align: left;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    padding: 0.45rem 0.5rem;
    border-bottom: 1px solid #e8ecf1;
  }

  td {
    padding: 0.7rem 0.5rem;
    border-bottom: 1px solid #f1f5f9;
    color: #132e58;
    vertical-align: middle;
  }

  strong {
    display: block;
    font-size: 0.85rem;
  }

  small {
    display: block;
    margin-top: 0.1rem;
    color: #94a3b8;
    font-size: 0.7rem;
  }
`;

const RankBadge = styled.span`
  display: inline-flex;
  min-width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(251, 193, 19, 0.16);
  color: #132e58;
  font-weight: 800;
  font-size: 0.75rem;
`;
