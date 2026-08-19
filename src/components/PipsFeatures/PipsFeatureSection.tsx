import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";

import clockIcon from "../../assets/FeaturesIcon/clock.png";
import speedIcon from "../../assets/FeaturesIcon/speed.png";
import checkIcon from "../../assets/FeaturesIcon/check.png";
import networkIcon from "../../assets/FeaturesIcon/network.png";
import chartIcon from "../../assets/FeaturesIcon/award.png";
import contestIcon from "../../assets/FeaturesIcon/position.png";
import headsetIcon from "../../assets/FeaturesIcon/headset.png";
import complaintIcon from "../../assets/FeaturesIcon/complain.png";

const FeaturesWrapper = styled.section`
  padding: 2rem 0 2.25rem;
  background-color: #fff;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.85rem 0.9rem;
  background: #fff;
  border: 1px solid #e8eaef;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #d0d7e2;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.07);
  }

  @media (max-width: 520px) {
    align-items: center;
    text-align: center;
  }
`;

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.85rem 0.9rem;
  background: #fff;
  border: 1px solid #e8eaef;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #fbbf24;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.07);
  }

  @media (max-width: 520px) {
    align-items: center;
    text-align: center;
  }
`;

const IconBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(19, 46, 88, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
`;

const Heading = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.cardTitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.35;
  letter-spacing: -0.01em;
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.caption};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const LegendPipsFeatures: React.FC = () => {
  const features = [
    {
      icon: clockIcon,
      title: "Live Reporting",
      desc: "See your cashback update instantly as you trade.",
    },
    {
      icon: speedIcon,
      title: "Premium Rebate Offers",
      desc: "Enjoy the most competitive rates in the industry.",
    },
    {
      icon: checkIcon,
      title: "Handpicked Trusted Brokers",
      desc: "Trade with only fully verified brokers.",
    },
    {
      icon: networkIcon,
      title: "Join Our Community",
      desc: "Chat, learn, and succeed with like-minded people.",
    },
    {
      icon: chartIcon,
      title: "Signals & Expert Analysis",
      desc: "Receive top-notch signals and timely insights.",
    },
    {
      icon: contestIcon,
      title: "Exciting Trading Contests",
      desc: "Compete for prizes and showcase your skills.",
    },
    {
      icon: headsetIcon,
      title: "Quick & Helpful Support",
      desc: "Get fast, friendly help whenever you need it.",
    },
    {
      icon: complaintIcon,
      title: "Raise a Complaint",
      desc: "Help us improve by reporting any concerns you have.",
      to: "/complaints",
    },
  ];

  return (
    <FeaturesWrapper>
      <Inner>
        <SectionHeadingSet
          upperText="Why traders choose us"
          mainHeading="Legend Pips Features"
          subText="Everything you need to trade smarter, earn rebates, and grow with a trusted community."
        />

        <Grid>
          {features.map(({ icon, title, desc, to }) => {
            const inner = (
              <>
              <IconBadge>
                <img src={icon} alt="" aria-hidden />
              </IconBadge>
              <Heading>{title}</Heading>
              <Description>{desc}</Description>
              </>
            );
            return to ? (
              <CardLink key={title} to={to}>{inner}</CardLink>
            ) : (
              <Card key={title}>{inner}</Card>
            );
          })}
        </Grid>
      </Inner>
    </FeaturesWrapper>
  );
};

export default LegendPipsFeatures;
