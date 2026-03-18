import React from "react";
import styled from "styled-components";
import HandIcon from "../../assets/icons/handshake-svgrepo-com 1.png";

const Wrapper = styled.section`
  padding: 26px 16px 18px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(19, 46, 88, 0.1);
  padding: 22px 18px 18px;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 26px;
  font-weight: 900;
  margin: 0;
  color: #132e58;
`;

const Icon = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  margin: 10px auto 10px;
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #1d4ed8;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
`;

const RewardsJoinClub: React.FC = () => {
  return (
    <Wrapper>
      <Card>
        <Title>Join the club</Title>
        <Icon src={HandIcon} alt="Join club icon" />
        <Subtitle>Turn trades into unforgettable rewards.</Subtitle>
        <Text>
          Become a loyal member of our exclusive trading community.
          <br />
          Fulfill our desired trading lots and unlock premium rewards designed to elevate your journey.
        </Text>
      </Card>
    </Wrapper>
  );
};

export default RewardsJoinClub;

