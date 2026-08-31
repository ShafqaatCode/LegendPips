import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchPublicTeamMembers, type TeamMember } from "../../services/siteConfigService";
import { ABOUT_SUBMENU } from "../../data/aboutPages";

const Page = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem ${({ theme }) => theme.typography.pageGutter} 3.5rem;
`;

const Kicker = styled.p`
  margin: 0 0 0.45rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  color: #132e58;
  font-size: clamp(1.6rem, 2.5vw, 2.15rem);
  line-height: 1.2;
`;

const Lead = styled.p`
  margin: 0 0 1.75rem;
  max-width: 640px;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.65;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.06);

  .photo {
    height: 200px;
    background: linear-gradient(135deg, #132e58, #1a4a7a);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .initials {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: #fbbf24;
    }
  }

  .body {
    padding: 1.25rem;
  }
  h3 {
    margin: 0 0 0.35rem;
    color: #132e58;
    font-size: 1.125rem;
  }
  .role {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    margin-bottom: 0.75rem;
  }
  p {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
    line-height: 1.55;
  }
`;

const Empty = styled.p`
  text-align: center;
  color: #64748b;
  margin: 2rem 0;
`;

const Related = styled.nav`
  margin-top: 2.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;

  h3 {
    margin: 0 0 0.65rem;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: #132e58;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPublicTeamMembers()
      .then((rows) => {
        if (!cancelled) setTeam(rows);
      })
      .catch(() => {
        if (!cancelled) setTeam([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Page>
      <Kicker>Behind the scenes</Kicker>
      <Title>The team</Title>
      <Lead>
        Meet the people behind LegendPips — traders, analysts, and operators focused on clearer broker
        research, rebates, and trader support.
      </Lead>

      {loading ? (
        <Empty>Loading team…</Empty>
      ) : team.length === 0 ? (
        <Empty>Team profiles coming soon. Check back shortly.</Empty>
      ) : (
        <Grid>
          {team.map((m) => (
            <Card key={m._id}>
              <div className="photo">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} />
                ) : (
                  <div className="initials">{m.name.charAt(0)}</div>
                )}
              </div>
              <div className="body">
                <h3>{m.name}</h3>
                <span className="role">{m.role}</span>
                <p>{m.bio || ""}</p>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      <Related aria-label="About pages">
        <h3>Behind the scenes</h3>
        <ul>
          {ABOUT_SUBMENU.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </Related>
    </Page>
  );
};

export default TeamPage;
