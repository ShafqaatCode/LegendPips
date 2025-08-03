import React from "react";
import styled from "styled-components";
import { FaExclamationCircle } from "react-icons/fa";
import TrophyIcon from "../../assets/trophy-prize-medal 1.png";
import MoneyIcon from "../../assets/money-bag 2.png"
import StartIcon from "../../assets/interface-start-time 1.png"
import EndIcon from "../../assets/interface-end-time 1.png"
const ContestInfo: React.FC = () => {
    return (
        <Wrapper>
            <Heading>
                Compete in 16 exciting demo trading contests and win your share of a $100,000 prize pool!
                The top traders from the first 15 rounds will move on to the Final, where $30,000 is up for grabs.
            </Heading>

            <Details>
                <Item>
                    {/* <FaTrophy /> */}
                    <img src={TrophyIcon} alt="trophy" />
                    <Label>Prize Pool:</Label>
                    <Value>$9,000</Value>
                </Item>
                <Item>
                    {/* <FaMoneyBillWave /> */}
                    <img src={MoneyIcon} alt="Money" />
                    <Label>100 prizes:</Label>
                    <Value>$800 - $400 - $200×10 - $100×28 - $50×60</Value>
                </Item>
                <Item>
                    {/* <FaCalendarAlt /> */}
                    <img src={StartIcon} alt="Start" />
                    <Label>Start Date:</Label>
                    <Value>Jul 7, 2025, 01:00PM</Value>
                </Item>
                <Item>
                    {/* <FaClock /> */}
                    <img src={EndIcon} alt="End" />
                    <Label>Close Date:</Label>
                    <Value>Jul 19, 2025, 12:00PM</Value>
                </Item>
            </Details>

            <Buttons>
                <JoinButton>How to Join</JoinButton>
                <ChatButton>Chat Room ( Telegram app )</ChatButton>
            </Buttons>

            <SupportText>
                Have questions? Just tap the red “24/5 Live Chat” button – we’re here to assist you.
            </SupportText>

            <NoteBox>
                <NoteTitle><FaExclamationCircle color="#be1a07" /> Please Note:</NoteTitle>
                <NoteList>
                    <li>If you already have MT5 installed on your mobile device and need to find the broker/server, follow these steps:</li>
                    <li>1. Open the MT5 app and tap the ‘+’ symbol in the top-right corner.</li>
                    <li>2. In the search bar, start typing “Raw Trading...”</li>
                    <li>3. From the list of results, select “Raw Trading (Mauritius) Ltd.”</li>
                    <li>4. On the “Login to an existing account” screen, enter your contest login credentials.</li>
                    <li>5. Choose the server named “ICTrading-Demo”</li>
                </NoteList>
                <FooterNote>You're all set — best of luck in the contest :)</FooterNote>
            </NoteBox>
        </Wrapper>
    );
};

export default ContestInfo;

// Styled Components
const Wrapper = styled.div`
  padding: 2rem 3rem;
  background-color: #f9f9ff;
  font-family: 'Segoe UI', sans-serif;
`;

const Heading = styled.h2`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* border: 2px solid red; */
  margin: 0 4rem;
  @media (max-width: 786px)
  {
    margin: 0;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  color: #333;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  color: #555;
`;

const Buttons = styled.div`
  margin: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const JoinButton = styled.button`
  background-color: #012d5c;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #02427c;
  }
`;

const ChatButton = styled.button`
  background-color: transparent;
  border: 2px solid #012d5c;
  color: #012d5c;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #012d5c;
    color: white;
  }
`;

const SupportText = styled.p`
  color: #012d5c;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const NoteBox = styled.div`
  background-color: #DE992F26;
  /* border-left: 5px solid #e94e1b; */
  padding: 1rem;
  max-width: 800px;
  color: #3a2b00;
`;

const NoteTitle = styled.div`
  
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NoteList = styled.ul`
  margin-left: 1.5rem;
  list-style: none;
  line-height: 1.6;
 
  
  li{
    font-size: 1.2rem;
  }
`;

const FooterNote = styled.p`
  margin-top: 1rem;
  
`;
