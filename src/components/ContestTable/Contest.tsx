import React from "react";
import {
  CardContainer,
  Image,
  Content,
  Title,
  SubTitle,
  EventText,
  RightSection,
  CountdownBox,
  CountdownTitle,
//   CountdownTimer,
  Label,
  RegistrationInfo,
  SponsorText,
  Highlight
} from "./ContestTable.styles";
import CountdownTimer from "../CountdownTimer/CountdownTimer";

const ContestCard: React.FC = () => {
  return (
    <CardContainer>
      <Image src="/images/contest-poster.png" alt="Contest Poster" />
      <Content>
        
        <Title>Q2 Special – The Major's Mix II</Title>
        <SubTitle>IC TRADING CUP 2025</SubTitle>
        <EventText>Traders Cup Event 7 of 16</EventText>
      </Content>
      <RightSection>
        <CountdownTitle>This contest ends in:</CountdownTitle>
        <div>
            <CountdownTimer days={9} hours={20} minutes={29} seconds={30} />
        </div>
        <RegistrationInfo>
          Registration Ends: <Highlight>Jul 18, 2025, 01:00 PM</Highlight>
        </RegistrationInfo>
        <SponsorText>
          Sponsored by: <span>ictrading.com</span>
        </SponsorText>
      </RightSection>
    </CardContainer>
  );
};

export default ContestCard;
