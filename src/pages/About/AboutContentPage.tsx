import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import type { AboutPageContent } from "../../data/aboutPages";
import { ABOUT_SUBMENU } from "../../data/aboutPages";

const Page = styled.main`
  max-width: 860px;
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
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.65;
`;

const Section = styled.section`
  margin-bottom: 1.5rem;

  h2 {
    margin: 0 0 0.55rem;
    color: #132e58;
    font-size: 1.1rem;
  }

  p {
    margin: 0 0 0.65rem;
    color: #334155;
    line-height: 1.65;
  }
`;

const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.7rem 1.15rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    filter: brightness(1.06);
  }
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

type Props = {
  content: AboutPageContent;
};

const AboutContentPage: React.FC<Props> = ({ content }) => {
  return (
    <Page>
      <Kicker>{content.kicker}</Kicker>
      <Title>{content.title}</Title>
      <Lead>{content.lead}</Lead>
      {content.sections.map((s) => (
        <Section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </Section>
      ))}
      {content.cta && <Cta to={content.cta.to}>{content.cta.label}</Cta>}
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

export default AboutContentPage;
