import React from "react";
import styled, { keyframes } from "styled-components";

const shimmerMove = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const gradient = `linear-gradient(
  90deg,
  #e8ecf1 0%,
  #f4f6f9 42%,
  #eef1f5 55%,
  #e8ecf1 100%
)`;

/** Base animated bar — use for custom layouts */
export const ShimmerBar = styled.div<{
  $h?: string;
  $w?: string;
  $mb?: string;
  $radius?: string;
}>`
  height: ${({ $h }) => $h ?? "14px"};
  width: ${({ $w }) => $w ?? "100%"};
  margin-bottom: ${({ $mb }) => $mb ?? "0"};
  border-radius: ${({ $radius }) => $radius ?? "6px"};
  background: ${gradient};
  background-size: 200% 100%;
  animation: ${shimmerMove} 1.15s ease-in-out infinite;
`;

const BrokerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  min-height: 5.25rem;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8eaef;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  margin-bottom: 0.85rem;
  box-sizing: border-box;
`;

const BrokerCircle = styled(ShimmerBar)`
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 50%;
  margin-bottom: 0;
`;

const BrokerMid = styled.div`
  flex: 1;
  min-width: 0;
`;

const BrokerRight = styled.div`
  width: 7.5rem;
  flex-shrink: 0;
`;

/** Horizontal rows similar to rebate broker cards */
export const BrokerListSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div role="status" aria-label="Loading brokers">
    {Array.from({ length: rows }).map((_, i) => (
      <BrokerRow key={i}>
        <BrokerCircle />
        <BrokerMid>
          <ShimmerBar $h="18px" $w="38%" $mb="10px" />
          <ShimmerBar $h="12px" $w="92%" $mb="8px" />
          <ShimmerBar $h="12px" $w="64%" $mb="0" />
        </BrokerMid>
        <BrokerRight>
          <ShimmerBar $h="36px" $w="100%" $mb="8px" $radius="8px" />
          <ShimmerBar $h="11px" $w="75%" $mb="0" />
        </BrokerRight>
      </BrokerRow>
    ))}
  </div>
);

const AuthWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  background: #f8fafc;
`;

const AuthCard = styled.div`
  width: min(360px, 100%);
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
`;

export const AuthGateSkeleton: React.FC = () => (
  <AuthWrap role="status" aria-label="Loading session">
    <AuthCard>
      <ShimmerBar $h="22px" $w="55%" $mb="1.25rem" />
      <ShimmerBar $h="14px" $w="100%" $mb="10px" />
      <ShimmerBar $h="14px" $w="88%" $mb="10px" />
      <ShimmerBar $h="14px" $w="72%" $mb="0" />
    </AuthCard>
  </AuthWrap>
);

const DetailCard = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const DetailHead = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
`;

const LogoSk = styled(ShimmerBar)`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  margin-bottom: 0;
  flex-shrink: 0;
`;

export const BrokerDetailSkeleton: React.FC = () => (
  <DetailCard role="status" aria-label="Loading broker">
    <DetailHead>
      <LogoSk />
      <div style={{ flex: 1, minWidth: 0 }}>
        <ShimmerBar $h="26px" $w="45%" $mb="12px" />
        <ShimmerBar $h="14px" $w="80%" $mb="8px" />
        <ShimmerBar $h="14px" $w="60%" $mb="0" />
      </div>
    </DetailHead>
    <ShimmerBar $h="12px" $w="100%" $mb="8px" />
    <ShimmerBar $h="12px" $w="100%" $mb="8px" />
    <ShimmerBar $h="12px" $w="92%" $mb="0" />
  </DetailCard>
);

const ArticleHero = styled(ShimmerBar)`
  width: 100%;
  height: min(280px, 38vw);
  max-height: 360px;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

export const ArticleDetailSkeleton: React.FC = () => (
  <div role="status" aria-label="Loading article" style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
    <ArticleHero />
    <ShimmerBar $h="28px" $w="85%" $mb="12px" />
    <ShimmerBar $h="16px" $w="50%" $mb="1.25rem" />
    <ShimmerBar $h="14px" $w="100%" $mb="10px" />
    <ShimmerBar $h="14px" $w="100%" $mb="10px" />
    <ShimmerBar $h="14px" $w="96%" $mb="10px" />
    <ShimmerBar $h="14px" $w="100%" $mb="10px" />
    <ShimmerBar $h="14px" $w="88%" $mb="0" />
  </div>
);

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const CourseCardSk = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
`;

const CourseThumbSk = styled(ShimmerBar)`
  height: 160px;
  width: 100%;
  border-radius: 0;
  margin-bottom: 0;
`;

const CourseBody = styled.div`
  padding: 1rem 1.1rem 1.15rem;
`;

export const CourseGridSkeleton: React.FC<{ cards?: number }> = ({ cards = 8 }) => (
  <CourseGrid role="status" aria-label="Loading courses">
    {Array.from({ length: cards }).map((_, i) => (
      <CourseCardSk key={i}>
        <CourseThumbSk />
        <CourseBody>
          <ShimmerBar $h="18px" $w="88%" $mb="10px" />
          <ShimmerBar $h="12px" $w="100%" $mb="8px" />
          <ShimmerBar $h="12px" $w="72%" $mb="12px" />
          <ShimmerBar $h="36px" $w="100%" $mb="0" $radius="8px" />
        </CourseBody>
      </CourseCardSk>
    ))}
  </CourseGrid>
);

const CompGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompCard = styled.div`
  min-height: 220px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 1.25rem;
`;

export const CompetitionGridSkeleton: React.FC<{ cards?: number }> = ({ cards = 6 }) => (
  <CompGrid role="status" aria-label="Loading competitions">
    {Array.from({ length: cards }).map((_, i) => (
      <CompCard key={i}>
        <ShimmerBar $h="22px" $w="70%" $mb="1rem" />
        <ShimmerBar $h="14px" $w="100%" $mb="8px" />
        <ShimmerBar $h="14px" $w="90%" $mb="8px" />
        <ShimmerBar $h="14px" $w="55%" $mb="0" />
      </CompCard>
    ))}
  </CompGrid>
);

const ForumBlock = styled.div`
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8eaef;
`;

export const ForumBrowseSkeleton: React.FC = () => (
  <div role="status" aria-label="Loading forums" style={{ padding: "0 0 1rem" }}>
    {[0, 1, 2].map((i) => (
      <ForumBlock key={i}>
        <ShimmerBar $h="20px" $w="32%" $mb="1rem" />
        <ShimmerBar $h="14px" $w="100%" $mb="8px" />
        <ShimmerBar $h="14px" $w="95%" $mb="8px" />
        <ShimmerBar $h="14px" $w="88%" $mb="0" />
      </ForumBlock>
    ))}
  </div>
);

const ThreadCard = styled.div`
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8eaef;
  margin-bottom: 1rem;
`;

export const ForumThreadSkeleton: React.FC = () => (
  <div role="status" aria-label="Loading thread" style={{ padding: "1rem 0" }}>
    <ShimmerBar $h="28px" $w="75%" $mb="12px" />
    <ShimmerBar $h="14px" $w="40%" $mb="1.5rem" />
    <ThreadCard>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <ShimmerBar $h="48px" $w="48px" $radius="50%" $mb="0" />
        <div style={{ flex: 1 }}>
          <ShimmerBar $h="16px" $w="30%" $mb="8px" />
          <ShimmerBar $h="12px" $w="22%" $mb="0" />
        </div>
      </div>
      <ShimmerBar $h="14px" $w="100%" $mb="8px" />
      <ShimmerBar $h="14px" $w="100%" $mb="8px" />
      <ShimmerBar $h="14px" $w="78%" $mb="0" />
    </ThreadCard>
  </div>
);

const PanelCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.25rem 1.35rem;
  margin-bottom: 0.85rem;
`;

export const PanelCardListSkeleton: React.FC<{ cards?: number }> = ({ cards = 3 }) => (
  <div role="status" aria-label="Loading">
    {Array.from({ length: cards }).map((_, i) => (
      <PanelCard key={i}>
        <ShimmerBar $h="18px" $w="55%" $mb="12px" />
        <ShimmerBar $h="13px" $w="40%" $mb="10px" />
        <ShimmerBar $h="13px" $w="100%" $mb="8px" />
        <ShimmerBar $h="13px" $w="92%" $mb="0" />
      </PanelCard>
    ))}
  </div>
);

const TimeRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

const Dot = styled(ShimmerBar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 0;
  flex-shrink: 0;
`;

export const ActivityTimelineSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <div role="status" aria-label="Loading activity">
    {Array.from({ length: rows }).map((_, i) => (
      <TimeRow key={i}>
        <Dot />
        <div style={{ flex: 1, minWidth: 0 }}>
          <ShimmerBar $h="16px" $w="70%" $mb="8px" />
          <ShimmerBar $h="13px" $w="100%" $mb="6px" />
          <ShimmerBar $h="12px" $w="35%" $mb="0" />
        </div>
      </TimeRow>
    ))}
  </div>
);

const SigRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1fr 0.8fr 0.9fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  @media (max-width: 900px) {
    display: none;
  }
`;

export const SignalsTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div role="status" aria-label="Loading signals">
    {Array.from({ length: rows }).map((_, i) => (
      <SigRow key={i}>
        {Array.from({ length: 7 }).map((_, j) => (
          <ShimmerBar key={j} $h="14px" $w="90%" $mb="0" />
        ))}
      </SigRow>
    ))}
  </div>
);

/** Generic table body rows for admin `<tbody>` */
export const TableBodySkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, ri) => (
      <tr key={ri}>
        {Array.from({ length: cols }).map((_, ci) => (
          <td key={ci} style={{ padding: "0.65rem 0.75rem" }}>
            <ShimmerBar $h="13px" $w={ci === 0 ? "72%" : "92%"} $mb="0" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const CenterMin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  padding: 2rem;
`;

export const CenteredBlockSkeleton: React.FC = () => (
  <CenterMin role="status" aria-label="Loading">
    <div style={{ width: "min(480px, 100%)" }}>
      <ShimmerBar $h="24px" $w="50%" $mb="1rem" />
      <ShimmerBar $h="14px" $w="100%" $mb="8px" />
      <ShimmerBar $h="14px" $w="90%" $mb="0" />
    </div>
  </CenterMin>
);
