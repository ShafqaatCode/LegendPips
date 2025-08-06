// import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { useParams } from "react-router-dom";
// import { fetchCompetitionById } from "../ContestList/mockApi";
import { type Competition } from "../ContestList/mockCompetitions";

// import Spinner from "../Loaders/spinner";
import CountDown from "../CountdownTimer/CountdownTimer";
import Podium from "../Winnerpodium/Podium";
import TrophyImg from "../../assets/icons/Trophy.svg";
import PeopleIcon from "../../assets/friend1.png";

interface ContestHeaderProps {
  contestData: Competition | null;
}

const ContestHeader: React.FC<ContestHeaderProps> = ({contestData}) => {


  if (!contestData) {
    return <ErrorMessage>Contest data not found.</ErrorMessage>;
  }

  const endDate = new Date(contestData.ends); 

  const formattedDate = endDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <CardContainer>
      {/* Left Section */}
      <LeftSection>
        <TopTitle>
          <img src={TrophyImg} alt="Trophy" />
          <h2>Competition</h2>
        </TopTitle>

        <ContentWrapper>
          <BannerImage src={contestData.logo} alt={contestData.title} />
          <TextInfo>
            <Title title={contestData.title}>{contestData.title}</Title>
            <Subtitle>{contestData.type || "IC Trading Contest"}</Subtitle>
            <EventInfo>{contestData.event || "Special Contest Event"}</EventInfo>
            <ParticipantInfo>
              <span>Participants:</span>
              <span>
                <img src={PeopleIcon} alt="People" /> {contestData.participants}
              </span>
            </ParticipantInfo>
          </TextInfo>
        </ContentWrapper>
      </LeftSection>

      
      <MiddleSection>
        <Podium first="Vie" second="Mohmi" third="Taj Wali..." />
      </MiddleSection>

      {/* Right Sectioddn */}
      <RightSection>
        {contestData.status !== "Ended" && (
          <>
            <CountdownLabel>This contest ends in:</CountdownLabel>
            <CountDown endTime={endDate} />
          </>
        )}
        <RegisterText>
          Registration Ends: <strong>{formattedDate}</strong>
        </RegisterText>

        {contestData.sponsorText && contestData.sponsorUrl && (
          <SponsorText>
            Sponsored by:{" "}
            <a
              href={contestData.sponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contestData.sponsorText}
            </a>
          </SponsorText>
        )}
      </RightSection>
    </CardContainer>
  );
};

export default ContestHeader;

// Styled Components
const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  margin-top: 2rem;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  
  background: #ffffff;
  padding: 1.5rem 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  margin: 0.5rem;
  
  /* gap: 1rem; */

  
  @media (max-width: 768px)
  {
    font-size: 20px;
    padding: 1rem 1rem;
  }
`;

const LeftSection = styled.div``

const TopTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  img {
    width: 48px;
    height: 48px;
    margin-right: 0.5rem;
  }

  h2 {
    font-size: 32px;
    color: #132e58;
    font-weight: bold;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* min-width: 250px; */

  


  
`;

const BannerImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;

  
  @media (max-width: 768px)
  {
    width: 100px;
    height: 100px;
  }
`;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-transform: uppercase;
  font-size: 24px;
  font-weight: 500;
  max-width: 350px;
  overflow-wrap: break-word; 
  word-break: break-word;

  @media (max-width: 768px)
  {
    font-size: 20px;
  }
`;

const Subtitle = styled.h3`
  font-size: 20px;
  color: #132e58;
  margin: 0;
  font-weight: 300;
`;

const EventInfo = styled.p`
  color: #132e58;
  font-size: 18px;
  margin: 0.3rem 0;
`;

const ParticipantInfo = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  span {
    display: flex;
    align-items: center;
  }
`;

const MiddleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  

  @media (max-width: 968px) {
    /* display: none; */

    justify-content: left;
    align-items: left;
    padding: 0;
    margin: 1rem 0;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  max-width: 280px;

  @media (max-width: 768px) {
    
    text-align: left;
    
  }
`;

const CountdownLabel = styled.span`
  font-size: 18px;
  color: #132e58;
  margin-bottom: 0.4rem;
`;

const RegisterText = styled.div`
  font-size: 18px;
  color: #1b2a47;
`;

const SponsorText = styled.div`
  font-size: 18px;
  color: #132e58;

  a {
    color: #f5a623;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
