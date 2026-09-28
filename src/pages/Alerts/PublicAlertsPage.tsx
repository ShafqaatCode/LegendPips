import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiBell, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPublicAnnouncements, type PublicAnnouncement } from "../../services/announcementService";
import bannerBg from "../../assets/banner/BannerBg.jpg";

const PublicAlertsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<PublicAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicAnnouncements(1, 30)
      .then((data) => setItems(data.items))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiBell aria-hidden /> Platform alerts
          </Eyebrow>
          <Title>Alerts & announcements</Title>
          <Lead>
            Official updates from LegendPips — contests, platform news, and important notices.
          </Lead>
          {isAuthenticated && (
            <PanelLink to="/user-panel/alerts">Open your personal inbox & price alerts →</PanelLink>
          )}
        </HeroInner>
      </Hero>

      <Page>
        {error && <ErrorBox>{error}</ErrorBox>}
        {loading && <Muted>Loading alerts…</Muted>}
        {!loading && items.length === 0 && (
          <Empty>No public alerts yet. Check back soon or sign in for personal notifications.</Empty>
        )}
        <List>
          {items.map((a) => (
            <Card key={a.id}>
              <CardTitle>{a.title}</CardTitle>
              {a.body && <CardBody>{a.body}</CardBody>}
              <CardMeta>{a.time}</CardMeta>
              {a.link && (
                <CardLink href={a.link.startsWith("http") ? a.link : a.link} target={a.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  View details <FiExternalLink size={14} />
                </CardLink>
              )}
            </Card>
          ))}
        </List>
      </Page>
    </>
  );
};

const Hero = styled.section`
  position: relative;
  background: url(${bannerBg}) center/cover no-repeat;
  padding: 3rem 1.25rem 2.5rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(19, 46, 88, 0.92) 0%, rgba(19, 46, 88, 0.75) 100%);
`;

const HeroInner = styled.div`
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  color: #fff;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #fbbf24;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
`;

const Lead = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.55;
  max-width: 560px;
`;

const PanelLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: #fbbf24;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Card = styled.article`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: #fff;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.05);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  color: #132e58;
`;

const CardBody = styled.p`
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CardMeta = styled.div`
  margin-top: 0.5rem;
  font-size: 0.6875rem;
  color: #94a3b8;
  font-weight: 600;
`;

const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.65rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #132e58;
  text-decoration: none;
  &:hover {
    color: #f59e0b;
  }
`;

const Empty = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #94a3b8;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
`;

const Muted = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
`;

const ErrorBox = styled.div`
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
`;

export default PublicAlertsPage;
