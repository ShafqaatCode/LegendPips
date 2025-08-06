
import React from 'react';
import styled from 'styled-components';
import { FaExclamationCircle } from 'react-icons/fa';

const Note: React.FC = () => {
    return (
        <NoteBox>
            <NoteTitle><FaExclamationCircle color="#be1a07" /> Please Note:</NoteTitle>
            <NoteList>
                <li>If you already have MT5 installed on your mobile device and need to find the broker/server, follow these steps:</li>
                <li>1. Open the <b>MT5 app</b> and tap the ‘+’ symbol in the top-right corner.</li>
                <li>2. In the search bar, start typing <b>“Raw Trading...”</b></li>
                <li>3. From the list of results, select “Raw Trading (Mauritius) Ltd.”</li>
                <li>4. On the <b>“Login to an existing account”</b> screen, enter your contest login credentials.</li>
                <li>5. Choose the server named <b>“ICTrading-Demo”</b></li>
            </NoteList>
            <FooterNote>You're all set — best of luck in the contest :)</FooterNote>
        </NoteBox>
    )
}

export default Note;

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

  
  @media (max-width: 768px)
  {
    font-size: 20px;
  }
`;

const NoteList = styled.ul`
  margin-left: 1.5rem;
  list-style: none;
  line-height: 1.6;
 
  
  li{
    font-size: 1.2rem;
  }

  
  @media (max-width: 768px)
  {
    font-size: 16px;
margin-left: 0.5rem;
    li{
        font-size: 16px;
        
    }
  }
`;

const FooterNote = styled.p`
  margin-top: 1rem;
  
`;
