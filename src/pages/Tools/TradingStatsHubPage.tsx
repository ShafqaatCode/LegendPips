import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiBarChart2, FiTrendingUp, FiUsers } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useAuth } from "../../contexts/AuthContext";

const TradingStatsHubPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Tools</Eyebrow>
          <Title>Trading stats hub</Title>
          <Lead>
            Analyze and share your trading journey — browse verified trader profiles, publish your own stats, and
            connect with copy-trading opportunities on LegendPips.
          </Lead>
        </HeroInner>
      </Hero>

      <Page>
        <Grid>
          <Card to="/traders">
            <IconWrap>
              <FiUsers />
            </IconWrap>
            <h3>Browse verified traders</h3>
            <p>See performance highlights, win rates, and strategies from traders reviewed by our team.</p>
            <span>
              Open directory <FiArrowRight />
            </span>
          </Card>

          <Card to={isAuthenticated ? "/user-panel/trader-profile" : "/signin"}>
            <IconWrap>
              <FiBarChart2 />
            </IconWrap>
            <h3>Share your stats</h3>
            <p>
              {isAuthenticated
                ? "Complete your trader profile to showcase results and attract copy followers."
                : "Sign in to create your public trader profile and share verified stats."}
            </p>
            <span>
              {isAuthenticated ? "My trader profile" : "Sign in"} <FiArrowRight />
            </span>
          </Card>

          <Card to="/copy-trading">
            <IconWrap>
              <FiTrendingUp />
            </IconWrap>
            <h3>Copy trading requests</h3>
            <p>Request to follow verified traders or manage incoming copy requests from your profile.</p>
            <span>
              Copy trading <FiArrowRight />
            </span>
          </Card>
        </Grid>
      </Page>
    </>
  );
};

export default TradingStatsHubPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(240px, 32vh, 300px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(3rem, 7vw, 4rem) ${({ theme }) => theme.typography.pageGutter} 2rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${bannerBg});
  background-size: cover;
  opacity: 0.12;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbbf24;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Grid = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.05);
  transition: border-color 0.15s, transform 0.15s;
  &:hover {
    border-color: rgba(251, 191, 36, 0.55);
    transform: translateY(-2px);
  }
  h3 {
    margin: 0;
    font-size: 1rem;
    color: #132e58;
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.5;
    flex: 1;
  }
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8125rem;
    font-weight: 700;
    color: #132e58;
    margin-top: 0.35rem;
  }
`;

const IconWrap = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: #fffbeb;
  color: #132e58;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
`;
