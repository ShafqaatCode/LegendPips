import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { type Competition } from '../ContestList/mockCompetitions';
import { fetchCompetitionById } from '../ContestList/mockApi';
import Spinner from '../Loaders/spinner';
import ContestHeaderWithModals from '../ContestList/ContestHeader';

import ContestCard from '../Contest/Contest';
import ContestTabs from './ContestTabs';
import Podium from '../Winnerpodium/Podium';
import LeaderBoard from '../Leaderboard/Leaderboard';

import ContestInfo from './ContestInstruction';



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
      <Podium first='shafqaat' second='tumhi' third='me dfds dfds' />
      <ContestInfo />
     
      <ContestCard
        imageSrc={contestData?.logo ?? ''}
        title={contestData?.title ?? ''}
        subtitle={contestData?.event ?? " "}
        eventInfo={contestData?.type ?? '' }
        endTime={contestData?.ends ? (typeof contestData.ends === 'string' ? new Date(contestData.ends) : contestData.ends) : new Date()}
        registrationDeadline={contestData?.ends ?? ''}
        sponsorUrl={''}
        sponsorText={contestData?.entry ?? ""}
      />
      {contestData && (
       <LeaderBoard />
      )}
       <ContestTabs />
    </Wrapper>
  );
};

export default ContestDetails;
