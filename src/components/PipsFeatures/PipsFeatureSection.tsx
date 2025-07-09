import React from 'react';
import styled from 'styled-components';

// Import PNGs from your assets folder
import clockIcon from '../../assets/FeaturesIcon/clock.png';
import speedIcon from '../../assets/FeaturesIcon/clock.png';
import checkIcon from '../../assets/FeaturesIcon/clock.png';
import networkIcon from '../../assets/FeaturesIcon/clock.png';
import chartIcon from '../../assets/FeaturesIcon/clock.png';
import contestIcon from '../../assets/FeaturesIcon/clock.png';
import headsetIcon from '../../assets/FeaturesIcon/clock.png';
import complaintIcon from '../../assets/FeaturesIcon/clock.png';

const FeaturesWrapper = styled.section`
border: 2px solid red;
  padding: 60px 20px;
  background-color: #fff;
  margin:auto;
  max-width: 1280px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #0e1b4d;
  margin-bottom: 50px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const Card = styled.div`
  text-align: center;
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
`;

const Heading = styled.h3`
  font-size: 1.2rem;
  color: #0e1b4d;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #667085;
`;

const LegendPipsFeatures: React.FC = () => {
  const features = [
    { icon: clockIcon, title: 'Live Reporting', desc: 'See your cashback update instantly as you trade.' },
    { icon: speedIcon, title: 'Premium Rebate Offers', desc: 'Enjoy the most competitive rates in the industry.' },
    { icon: checkIcon, title: 'Handpicked Trusted Brokers', desc: 'Trade with only fully verified brokers.' },
    { icon: networkIcon, title: 'Join Our Community', desc: 'Chat, learn, and succeed with like-minded people.' },
    { icon: chartIcon, title: 'Signals & Expert Analysis', desc: 'Receive top-notch signals and timely insights.' },
    { icon: contestIcon, title: 'Exciting Trading Contests', desc: 'Compete for prizes and showcase your skills.' },
    { icon: headsetIcon, title: 'Quick & Helpful Support', desc: 'Get fast, friendly help whenever you need it.' },
    { icon: complaintIcon, title: 'Raise a Complaint', desc: 'Help us improve by reporting any concerns you have.' },
  ];

  return (
    <FeaturesWrapper>
      <Title>Legend Pips Features</Title>
      <Grid>
        {features.map(({ icon, title, desc }) => (
          <Card key={title}>
            <IconWrapper>
              <img style={{width: "300px"}} src={icon} alt={title} />
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
