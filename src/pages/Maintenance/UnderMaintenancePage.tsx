import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiTool, FiArrowLeft } from "react-icons/fi";
import { useSiteLogo } from "../../contexts/SiteConfigContext";

type Props = {
  /** `platform` = site-wide maintenance mode from admin settings */
  variant?: "platform" | "feature";
};

/**
 * Feature placeholder, or full-site notice when Platform Settings → Maintenance mode is on.
 */
const UnderMaintenancePage: React.FC<Props> = ({ variant = "feature" }) => {
  const { src, alt, siteName } = useSiteLogo();
  const isPlatform = variant === "platform";

  return (
    <Page $full={isPlatform}>
      <Card>
        {isPlatform ? (
          <Brand>
            <img src={src} alt={alt} />
            <span>{siteName}</span>
          </Brand>
        ) : (
          <IconWrap aria-hidden>
            <FiTool size={36} />
          </IconWrap>
        )}
        <Eyebrow>{isPlatform ? "Maintenance mode" : "Under maintenance"}</Eyebrow>
        <Title>
          {isPlatform ? "We'll be right back" : "This page is under maintenance"}
        </Title>
        <Body>
          {isPlatform
            ? "LegendPips is temporarily under maintenance. New registrations are paused and the public site is unavailable while we finish updates. Please check back soon."
            : "We're actively building this feature. It isn't available yet — please check back soon, or explore another section of LegendPips while we finish up."}
        </Body>
        {!isPlatform && (
          <>
            <Actions>
              <Primary to="/">Back to home</Primary>
              <Ghost to="/support">Contact support</Ghost>
            </Actions>
            <HomeLink to="/">
              <FiArrowLeft /> Return to homepage
            </HomeLink>
          </>
        )}
        {isPlatform && (
          <Actions>
            <Ghost to="/signin">Admin / staff sign in</Ghost>
            <Ghost to="/support">Contact support</Ghost>
          </Actions>
        )}
      </Card>
    </Page>
  );
};

export default UnderMaintenancePage;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div<{ $full?: boolean }>`
  min-height: ${({ $full }) => ($full ? "100vh" : "70vh")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem ${({ theme }) => theme.typography.pageGutter};
  background:
    radial-gradient(ellipse 55% 45% at 50% 0%, rgba(251, 193, 19, 0.12), transparent 55%),
    linear-gradient(180deg, #0b1b38 0%, #132e58 45%, #1a3a6a 100%);
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  text-align: center;
  padding: 2.25rem 1.75rem;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 16px 40px rgba(19, 46, 88, 0.18);
  animation: ${fadeIn} 0.45s ease;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  img {
    height: 44px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
  }

  span {
    font-size: 0.85rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const IconWrap = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(19, 46, 88, 0.08);
  color: ${({ theme }) => theme.colors.primary};
`;

const Eyebrow = styled.p`
  margin: 0 0 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const Title = styled.h1`
  margin: 0 0 0.65rem;
  font-size: clamp(1.35rem, 2vw, 1.65rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.primary};
`;

const Body = styled.p`
  margin: 0 0 1.35rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.15rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.Gold};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 800;
  text-decoration: none;
`;

const Ghost = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.15rem;
  border-radius: 10px;
  border: 1px solid #dbe3ef;
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
