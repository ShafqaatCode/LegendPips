import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { type Competition } from '../ContestList/mockCompetitions';
import { fetchCompetitionById } from '../ContestList/mockApi';
import Spinner from '../Loaders/spinner';
import ContestHeaderWithModals from '../ContestList/BrodcumHeader';
import ContestHeader from './ContestHeader';
import ContestInfo from './ContestInstruction';
import PrizePoolCard from './PrizePool';
import Leaderboard from '../Leaderboard/LeaderBoard';




const Wrapper = styled.section`
  margin-top: 135px;
  /* padding: 2rem; */
  font-family: "Segoe UI", sans-serif;
  

  @media (max-width: 786px)
  {
    margin-top: 80px;
  }
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
`;

const ContestDetails: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [contestData, setContestData] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contestId) return;

    fetchCompetitionById(parseInt(contestId))
      .then((data) => {
        if (data) {
          setContestData(data);
        } else {
          setError("Contest not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch contest details.");
        setLoading(false);
      });
  }, [contestId]);

  if (loading)
    return (
      <Centered>
        <Spinner />
      </Centered>
    );

  if (error)
    return (
      <Centered>
        <p style={{ color: "red" }}>{error}</p>
      </Centered>
    );

  return (
    <Wrapper>
      <ContestHeaderWithModals />


      <ContestHeader contestData={contestData}/>
      
      <PrizePoolCard
  description="Test your trading skills in Forex and Metals—risk-free, reward real! Compete in the zForex Demo Contest and prove you're the sharpest trader in the market."
  prizes={[
    "1st place: $300",
    "2nd place: $250",
    "3rd place: $200",
    "4th place: $150",
    "5th place: $125",
    "6th place: $100",
    "7th place: $90",
    "8th place: $80",
    "9th place: $70",
    "10th place: $60",
    "11th–12th place: $50 each",
    "13th–14th place: $45 each",
    "15th–16th place: $40 each",
    "17th–18th place: $35 each",
    "19th–20th place: $30 each",
  ]}
  startDate="Jul 7, 2025, 01:00 PM"
  closeDate="Jul 19, 2025, 12:00 PM"
  totalPrize="$2,000"
/>


      <ContestInfo />

      <Leaderboard />
     


    </Wrapper>
  );
};

export default ContestDetails;
