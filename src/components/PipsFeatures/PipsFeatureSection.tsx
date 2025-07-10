import React from "react";
import styled from "styled-components";

// Import PNGs from your assets folder
import clockIcon from "../../assets/FeaturesIcon/clock.png";
import speedIcon from "../../assets/FeaturesIcon/speed.png";
import checkIcon from "../../assets/FeaturesIcon/check.png";
import networkIcon from "../../assets/FeaturesIcon/network.png";
import chartIcon from "../../assets/FeaturesIcon/award.png";
import contestIcon from "../../assets/FeaturesIcon/position.png";
import headsetIcon from "../../assets/FeaturesIcon/headset.png";
import complaintIcon from "../../assets/FeaturesIcon/complain.png";

const FeaturesWrapper = styled.section`
  border: 2px solid red;
  padding: 30px 20px;
  background-color: #fff;
  margin: auto;
  max-width: 1280px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 3rem;
  color: {({theme}) => theme.colors.primary};
  margin-bottom: 50px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 40px;
`;

const Card = styled.div`
  // text-align: center;
  border: 2px solid green;
`;

const IconWrapper = styled.div`
  margin-bottom: 0.2rem;
  text-align: center;
  img {
    width: 100px;
  }
`;

const Heading = styled.h3`
  font-size: 1rem;
  color: {({theme}) => theme.colors.primary};
  font-weight: 500;
  // line-height: 30px;
  // margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 13px;
  font-weight: 300;
  color: #{({ theme }) => theme.colors.primary};
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
    },
  ];

  return (
    <FeaturesWrapper>
      <Title>Legend Pips Features</Title>
      <Grid>
        {features.map(({ icon, title, desc }) => (
          <Card key={title}>
            <IconWrapper>
              <img src={icon} alt={title} />
            </IconWrapper>
            <Heading>{title}</Heading>
            <Description>{desc}</Description>
          </Card>
        ))}
      </Grid>
    </FeaturesWrapper>
  );
};

export default LegendPipsFeatures;
