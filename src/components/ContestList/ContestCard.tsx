import React from "react";
import styled from "styled-components";
import { type Competition } from "./mockCompetitions";
import YellowCircleIcon from "../../assets/Ellipse_3955.svg";
import GreenCircleIcon from "../../assets/Ellipse3956.svg";

import EntryImg from "../../assets/tag1.png";
import PeopleImg from "../../assets/friend1.png";
import { useNavigate } from "react-router-dom";
interface ContestCardProps {
  comp: Competition;
}

const ContestCard: React.FC<ContestCardProps> = ({ comp }) => {

  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/contests/${comp.id}`);
  }

  return (
    <Card>
      <Header status={comp.status}>
        <span>{comp.status == "Upcoming" ? <img src={GreenCircleIcon} /> : <img src={YellowCircleIcon} />} {comp.status}</span>
        <small>Ends : {comp.ends}</small>
      </Header>

      <Body>
        <Image src={comp.logo} alt={comp.title} />
        <Content>
          <Title>{comp.title}</Title>
          <Type>{comp.type}</Type>
          {comp.event && <Event>{comp.event}</Event>}

          <MarketTag>Ic Markets</MarketTag>

        </Content>
        <Tags>
          <StatusTag status={comp.status}>{comp.status}</StatusTag>
          <JoinButton status={comp.status}>
            {comp.status === "Ended" ? "Closed" : "Join Now"}
          </JoinButton>
        </Tags>

      </Body>

      <Footer>
        <Info>
          <span><img src={EntryImg} alt="Entery Icon" /> Entery: <Highlight>{comp.entry}</Highlight></span>
          <span><img src={PeopleImg} alt="" /> Participants: <Highlight>{comp.participants}</Highlight></span>
        </Info>
        <DetailsButton onClick={handleViewDetails} >View Details ↗</DetailsButton>
      </Footer>
    </Card>
  );
};

export default ContestCard;

// Styled Components
const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  
  overflow: hidden;
  font-family: "Segoe UI", sans-serif;
  display: flex;
  flex-direction: column;
  border: 1px solid #00000040;
  // min-width: 500px;
`;

const Header = styled.div<{ status: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #012d5c;
  color: #fff;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-weight: 500;

  span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  small {
    font-size: 14px;
    color: #f0f0f0;
  }

  @media (max-width: 768px) { 

    span , small {

      font-size: 0.8rem;
    }
  }
`;
const Body = styled.div`

  flex: 1;
  display: flex;
  padding: 1rem 0;
  gap: 0.8rem;
  @media (max-width: 768px) { 
    
  } 
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #DE992F;
  line-height: 25px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Type = styled.p`
  font-size: 1rem;
  color: #DE992F;
  margin: 0.1rem 0;
  font-weight: 400;
  line-height: 25px;
`;

const Event = styled.small`
  display: block;
  font-size: 1rem;
  color: #DE992F;
  margin-bottom: 0.3rem;
  font-weight: 400;
  line-height: 25px;
  
`;

const Tags = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  margin-right: 1rem;
  // justify-content: center;
  
  
`;

const MarketTag = styled.span`
  background: #f2f2f2;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  line-height: 25px;
  border: 2px solid red;
  
`;

const StatusTag = styled.span<{ status: string }>`
  background: ${({ status }) =>
    status === "Upcoming"
      ? "#de992f"
      : status === "Ongoing"
        ? "#2ecc71"
        : "#95a5a6"};
  color: white;
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  
  min-width: 100px;
  text-align: center;
`;

const JoinButton = styled.button<{ status: string }>`
  background: ${({ status }) =>
    status === "Ended" ? "#ccc" : "#132e58"};
  color: #fff;
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: ${({ status }) => (status === "Ended" ? "not-allowed" : "pointer")};
  min-width: 100px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  border-top: 1px solid #eee;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #000000;
  font-weight: 300;
 
  span{
    display: flex;
    align-items: center;
    gap: 0.3rem;
    
   
  }
  
`;

const Highlight = styled.span`
  color: #e67e22;
  font-weight: 500;
`;

const DetailsButton = styled.button`
  background: #132e58;
  color: #fff;
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  min-width: 100px;

  &:hover {
    background: #013e7e;
  }
`;
