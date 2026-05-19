import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { type Competition } from "../../services/contestService";
import defaultContestLogo from "../../assets/Contest_Images/wmug5dukcys 1-1.png";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import {
  Container,
  CardContainer,
  LogoSection,
  LogoImg,
  InfoSection,
  TitleRow,
  RatingBox,
  StarRow,
  ReviewText,
  ActionSection,
  PrimaryButton,
  SecondaryButton,
  TermsText,
  TopIndex,
} from "../Broker/BrokerCard.styles";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../../pages/Login/LoginModal";
import RegisterModal from "../../pages/Register/RegisterModal";
import JoinContestModal from "./JoinContestModal";

interface ContestCardProps {
  comp: Competition;
  index: number;
  onJoined?: () => void;
}

function formatContestEnd(raw?: string): string {
  if (!raw?.trim()) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw.slice(0, 10);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const StatusBadge = styled.span<{ $status: Competition["status"] }>`
  background-color: ${({ $status }) =>
    $status === "Upcoming" ? "#1d4ed8" : $status === "Ongoing" ? "#059669" : "#64748b"};
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
  letter-spacing: 0.02em;
`;

const MetaGrid = styled.div`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.72);
  margin: 0;
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  row-gap: 0.65rem;

  h4 {
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0 0.15rem 0;
    color: #0f1c46;
  }

  p {
    font-size: 0.7rem;
    font-weight: 400;
    margin: 0;
    color: rgba(15, 23, 42, 0.65);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    justify-content: center;
    gap: 1rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.75rem;
  }
`;

const BodyBlurb = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.75);
  margin: 0 0 0.6rem 0;
  width: 100%;
  max-width: 36rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContestCard: React.FC<ContestCardProps> = ({ comp, index, onJoined }) => {
  const { isAuthenticated } = useAuth();
  const contestId = String(comp.id ?? comp._id ?? "");
  const initialLogo = comp.logo?.trim() ? comp.logo : defaultContestLogo;
  const [logoSrc, setLogoSrc] = useState(initialLogo);

  const [joinOpen, setJoinOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [pendingJoinAfterAuth, setPendingJoinAfterAuth] = useState(false);

  useEffect(() => {
    setLogoSrc(comp.logo?.trim() ? comp.logo! : defaultContestLogo);
  }, [comp.logo]);

  const handleJoinClick = () => {
    if (comp.status === "Ended" || !contestId) return;
    if (!isAuthenticated) {
      setPendingJoinAfterAuth(true);
      setLoginOpen(true);
      return;
    }
    setJoinOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginOpen(false);
    setPendingJoinAfterAuth(false);
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    if (pendingJoinAfterAuth) {
      setPendingJoinAfterAuth(false);
      setJoinOpen(true);
    }
  };

  const endLabel = formatContestEnd(comp.ends || comp.endDate);
  const blurb = [comp.subtitle, comp.event].filter(Boolean).join(" · ");

  return (
    <Container>
      <CardContainer>
        <TopIndex>{index}</TopIndex>

        <LogoSection>
          <LogoImg
            src={logoSrc}
            alt=""
            onError={() => setLogoSrc(defaultContestLogo)}
          />
        </LogoSection>

        <InfoSection>
          <TitleRow>
            <h2>{comp.title}</h2>
            <StatusBadge $status={comp.status}>{comp.status}</StatusBadge>
          </TitleRow>
          {blurb ? <BodyBlurb>{blurb}</BodyBlurb> : null}
          <MetaGrid>
            <div>
              <h4>Entry</h4>
              <p>{comp.entry || "—"}</p>
            </div>
            <div>
              <h4>Deadline</h4>
              <p>{endLabel}</p>
            </div>
            <div>
              <h4>Format</h4>
              <p>{comp.type || "—"}</p>
            </div>
          </MetaGrid>
        </InfoSection>

        <RatingBox>
          <StarRow>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color="#d1d5db" />
            ))}
          </StarRow>
          <ReviewText>
            <strong>{comp.participants.toLocaleString()}</strong>
            <span>Participants</span>
          </ReviewText>
        </RatingBox>

        <ActionSection>
          <TermsText>{comp.sponsorText?.trim() || "Demo contest — no real-money entry"}</TermsText>
          <PrimaryButton
            type="button"
            disabled={comp.status === "Ended"}
            onClick={comp.status === "Ended" ? undefined : handleJoinClick}
          >
            {comp.status === "Ended" ? "Closed" : "Join now"}
          </PrimaryButton>
          {contestId ? (
            <SecondaryButton as={Link} to={`/contests/${contestId}`}>
              View details <img src={ArrowIcon} alt="" />
            </SecondaryButton>
          ) : (
            <SecondaryButton as="span" style={{ opacity: 0.55, pointerEvents: "none" }}>
              View details
            </SecondaryButton>
          )}
        </ActionSection>
      </CardContainer>

      <LoginModal
        isOpen={loginOpen}
        onClose={handleLoginModalClose}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
      <JoinContestModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
        comp={comp}
        contestId={contestId}
        onJoined={onJoined}
      />
    </Container>
  );
};

export default ContestCard;
