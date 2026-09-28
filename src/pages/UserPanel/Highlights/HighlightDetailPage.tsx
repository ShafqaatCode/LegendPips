import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiAlertCircle, FiArrowLeft, FiBell, FiStar } from "react-icons/fi";
import {
  contentToParagraphs,
  fetchPanelHighlight,
  getHighlightTheme,
  type PanelHighlight,
} from "../../../services/panelHighlightService";
import { ErrorBanner, userColors } from "../../../components/UserPanel/userUi";

const Page = styled.div`
  max-width: 760px;
  margin: 0 auto;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${userColors.muted};
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 0.85rem;

  &:hover {
    color: ${userColors.navy};
  }
`;

const Card = styled.article`
  background: #fff;
  border: 1px solid ${userColors.border};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
`;

const Hero = styled.div<{ $bg: string }>`
  position: relative;
  padding: 1.75rem 1.5rem 1.5rem;
  background: ${({ $bg }) => $bg};
  color: #fff;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: auto -20% -40% auto;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    pointer-events: none;
  }
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  position: relative;
  z-index: 1;
`;

const Badge = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  backdrop-filter: blur(6px);
`;

const Eyebrow = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 0.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const Body = styled.div`
  padding: 1.35rem 1.5rem 1.65rem;
`;

const Paragraph = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #334155;
  white-space: pre-wrap;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FooterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: 1px solid ${userColors.border};
`;

const PrimaryBtn = styled.button`
  padding: 0.55rem 1.1rem;
  border: none;
  border-radius: 999px;
  background: ${userColors.navy};
  color: #fff;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover {
    background: ${userColors.navyLight};
  }
`;

const Ghost = styled(Link)`
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid ${userColors.border};
  color: ${userColors.navy};
  font-weight: 600;
  font-size: 0.8125rem;
  text-decoration: none;
  background: #fff;

  &:hover {
    background: #f8fafc;
  }
`;

const HighlightDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PanelHighlight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetchPanelHighlight(id)
      .then((row) => {
        if (!cancelled) setItem(row);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Page>
        <p style={{ color: userColors.muted, fontSize: "0.875rem" }}>Loading…</p>
      </Page>
    );
  }

  if (error || !item) {
    return (
      <Page>
        <Back to="/user-panel">
          <FiArrowLeft size={14} /> Back to dashboard
        </Back>
        <ErrorBanner>{error || "Highlight not found"}</ErrorBanner>
      </Page>
    );
  }

  const theme = getHighlightTheme(item.theme);
  const paragraphs = contentToParagraphs(item.content);

  return (
    <Page>
      <Back to="/user-panel">
        <FiArrowLeft size={14} /> Back to dashboard
      </Back>
      <Card>
        <Hero $bg={theme.detailHero}>
          <HeroTop>
            <Badge>
              {item.iconStyle === "bell" ? (
                <FiBell size={22} />
              ) : item.iconStyle === "alert" ? (
                <FiAlertCircle size={22} />
              ) : item.iconStyle === "star" ? (
                <FiStar size={22} />
              ) : (
                item.initials || "LP"
              )}
            </Badge>
            <div>
              {item.eyebrow ? <Eyebrow>{item.eyebrow}</Eyebrow> : <Eyebrow>Highlight</Eyebrow>}
              <Title>{item.title}</Title>
            </div>
          </HeroTop>
        </Hero>
        <Body>
          {paragraphs.map((p, i) => (
            <Paragraph key={i}>{p}</Paragraph>
          ))}
          <FooterRow>
            <PrimaryBtn type="button" onClick={() => navigate(-1)}>
              Got it
            </PrimaryBtn>
            <Ghost to="/user-panel/live-accounts">My live accounts</Ghost>
            <Ghost to="/rebates">Browse brokers</Ghost>
          </FooterRow>
        </Body>
      </Card>
    </Page>
  );
};

export default HighlightDetailPage;
