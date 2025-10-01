import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { type Competition } from '../ContestList/mockCompetitions';
import { fetchCompetitionById } from '../ContestList/mockApi';
import ContestHeaderWithModals from '../ContestList/BrodcumHeader';
import ContestHeader from './ContestHeader';
import Leaderboard from '../Leaderboard/LeaderboardTable';
import TabButtons from './TabButtons';
import ContestInfoTabs from './ContestInfoTabs';
// import Spinner from '../Loaders/spinner';






const Wrapper = styled.section`
  margin-top: 85px;
  /* padding: 2rem; */
  
  

  @media (max-width: 786px)
  {
    /* margin-top: 80px; */
    margin: 0;
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
        ...Loading...
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
      <ContestHeader contestData={contestData} />
      {/* <ContestInfo /> */}
      <TabButtons />
      <Leaderboard />
      <ContestInfoTabs />
    </Wrapper>
  );
};

export default ContestDetails;
