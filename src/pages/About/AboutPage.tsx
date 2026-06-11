import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SectionHeadingSet from '../../components/SharedComponents/SectionHeadingSet';
import { fetchPublicTeamMembers, type TeamMember } from '../../services/siteConfigService';

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.06);

  .photo {
    height: 200px;
    background: linear-gradient(135deg, #132E58, #1a4a7a);
    img { width: 100%; height: 100%; object-fit: cover; }
    .initials {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: #Fbbf24;
    }
  }

  .body { padding: 1.25rem; }
  h3 { margin: 0 0 0.35rem; color: #132E58; font-size: 1.125rem; }
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
  p { margin: 0; color: #64748b; font-size: 0.875rem; line-height: 1.55; }
`;

const AboutPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchPublicTeamMembers().then(setTeam).catch(() => setTeam([]));
  }, []);

  return (
    <Page>
      <SectionHeadingSet
        upperText="ABOUT US"
        mainHeading="Our Team"
        subText="Meet the people behind LegendPips — experienced traders, analysts, and operators dedicated to your success."
      />
      {team.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>Team information coming soon.</p>
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
                <p>{m.bio || ''}</p>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Page>
  );
};

export default AboutPage;
