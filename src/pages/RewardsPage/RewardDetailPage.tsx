import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiCheck, FiChevronRight } from "react-icons/fi";
import { getRewardDetail, REWARD_LIST } from "../../data/rewardsDetails";
import SubscriptionModal from "../../components/Signals/SubscriptionModal";

const Page = styled.div`
  max-width: 1120px;
  margin: 12px auto 48px;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
`;

const BackRow = styled.div`
  margin-bottom: 1rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  color: white;
  background:
    radial-gradient(ellipse 55% 90% at 100% 0%, rgba(251, 191, 36, 0.28) 0%, transparent 55%),
    linear-gradient(128deg, #0a1830 0%, ${({ theme }) => theme.colors.primary} 55%, #1a4a7a 100%);
  box-shadow: 0 14px 36px rgba(12, 31, 61, 0.22);
  margin-bottom: 1.25rem;
`;

const Kicker = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 800;
`;

const HeroIcon = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;

const HeroTitle = styled.h1`
  margin: 1rem 0 0.5rem;
  font-size: ${({ theme }) => theme.typography.bannerTitle};
  line-height: ${({ theme }) => theme.typography.bannerTitleLh};
  font-weight: 800;
  letter-spacing: -0.02em;
  max-width: 36rem;
`;

const HeroSub = styled.p`
  margin: 0;
  max-width: 38rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.35rem;
`;

const PrimaryBtn = styled.button`
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  font-weight: 700;
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.font.family};

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

const GhostBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: white;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.65rem 1.15rem;
  font-weight: 600;
  font-size: 0.875rem;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  box-shadow: 0 8px 20px rgba(19, 46, 88, 0.04);
`;

const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatValue = styled.div`
  margin-top: 0.35rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.15rem 1.2rem 1.25rem;
  box-shadow: 0 10px 24px rgba(19, 46, 88, 0.05);
`;

const SectionPill = styled.div`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  margin-bottom: 0.9rem;
`;

const StepList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const StepItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
`;

const StepBadge = styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.gold};
  font-size: 0.6875rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StepTitle = styled.h3`
  margin: 0 0 0.25rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const StepBody = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;

  li {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.8125rem;
    line-height: 1.65;
    margin: 0.55rem 0;
  }
`;

const CheckList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const CheckItem = styled.li`
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};

  svg {
    flex-shrink: 0;
    margin-top: 0.15rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-bottom: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ExampleCard = styled(Card)`
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
`;

const ExampleTitle = styled.h3`
  margin: 0 0 0.45rem;
  font-size: 0.9375rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const FaqItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  background: white;
`;

const FaqQ = styled.h3`
  margin: 0 0 0.35rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const FaqA = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const OtherRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const OtherCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.55);
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(19, 46, 88, 0.08);
  }
`;

const OtherIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const OtherTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const OtherMeta = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
`;

const BottomCta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 1.25rem;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
`;

const BottomText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
`;

const RewardDetailPage: React.FC = () => {
  const { rewardId } = useParams<{ rewardId: string }>();
  const detail = getRewardDetail(rewardId);
  const [showModal, setShowModal] = useState(false);

  if (!detail) {
    return <Navigate to="/rewards" replace />;
  }

  const others = REWARD_LIST.filter((r) => r.id !== detail.id);

  return (
    <Page>
      <BackRow>
        <BackLink to="/rewards">
          <FiArrowLeft /> Back to Rewards
        </BackLink>
      </BackRow>

      <Hero>
        <Kicker>
          <HeroIcon src={detail.iconSrc} alt="" />
          {detail.heroKicker} · {detail.title}
        </Kicker>
        <HeroTitle>{detail.heroTitle}</HeroTitle>
        <HeroSub>{detail.heroSubtitle}</HeroSub>
        <HeroActions>
          <PrimaryBtn type="button" onClick={() => setShowModal(true)}>
            Join Now
          </PrimaryBtn>
          <GhostBtn to="/rewards">
            All rewards <FiChevronRight />
          </GhostBtn>
        </HeroActions>
      </Hero>

      <StatGrid>
        {detail.highlights.map((h) => (
          <StatCard key={h.label}>
            <StatLabel>{h.label}</StatLabel>
            <StatValue>{h.value}</StatValue>
          </StatCard>
        ))}
      </StatGrid>

      <TwoCol>
        <Card>
          <SectionPill>How it works</SectionPill>
          <StepList>
            {detail.howItWorks.map((s) => (
              <StepItem key={s.step}>
                <StepBadge>{s.step}</StepBadge>
                <div>
                  <StepTitle>{s.title}</StepTitle>
                  <StepBody>{s.body}</StepBody>
                </div>
              </StepItem>
            ))}
          </StepList>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card>
            <SectionPill>What you get</SectionPill>
            <CheckList>
              {detail.benefits.map((b) => (
                <CheckItem key={b}>
                  <FiCheck size={16} />
                  <span>{b}</span>
                </CheckItem>
              ))}
            </CheckList>
          </Card>
          <Card>
            <SectionPill>Eligibility</SectionPill>
            <BulletList>
              {detail.eligibility.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </BulletList>
          </Card>
        </div>
      </TwoCol>

      <SectionPill style={{ marginBottom: "0.75rem" }}>Real-world paths</SectionPill>
      <ExampleGrid>
        {detail.examples.map((ex) => (
          <ExampleCard key={ex.title}>
            <ExampleTitle>{ex.title}</ExampleTitle>
            <StepBody>{ex.body}</StepBody>
          </ExampleCard>
        ))}
      </ExampleGrid>

      <SectionPill style={{ marginBottom: "0.75rem" }}>FAQ</SectionPill>
      <FaqList>
        {detail.faq.map((item) => (
          <FaqItem key={item.q}>
            <FaqQ>{item.q}</FaqQ>
            <FaqA>{item.a}</FaqA>
          </FaqItem>
        ))}
      </FaqList>

      <SectionPill style={{ marginBottom: "0.75rem" }}>Explore other rewards</SectionPill>
      <OtherRow>
        {others.map((r) => (
          <OtherCard key={r.id} to={`/rewards/${r.id}`}>
            <OtherIcon src={r.iconSrc} alt="" />
            <div>
              <OtherTitle>{r.title}</OtherTitle>
              <OtherMeta>
                View details <FiChevronRight size={12} />
              </OtherMeta>
            </div>
          </OtherCard>
        ))}
      </OtherRow>

      <BottomCta>
        <BottomText>{detail.ctaLine}</BottomText>
        <PrimaryBtn type="button" onClick={() => setShowModal(true)}>
          Join Now
        </PrimaryBtn>
      </BottomCta>

      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </Page>
  );
};

export default RewardDetailPage;
