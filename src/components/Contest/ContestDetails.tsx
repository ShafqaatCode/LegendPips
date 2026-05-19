import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCompetitionById, type Competition } from '../../services/contestService';
import ContestHeaderWithModals from '../ContestList/BrodcumHeader';
import ContestHeader from './ContestHeader';
import Leaderboard from '../Leaderboard/LeaderboardTable';
import TabButtons from './TabButtons';
import ContestInfoTabs from './ContestInfoTabs';
import { CenteredBlockSkeleton } from '../SharedComponents/Shimmer';
// import Spinner from '../Loaders/spinner';






const Wrapper = styled.section`
  margin: 0;
  padding: 0.35rem 0 0;
  box-sizing: border-box;

  @media (max-width: 786px) {
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

    fetchCompetitionById(contestId)
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
        <CenteredBlockSkeleton />
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
      <Leaderboard contestId={contestId || ""} />
      <ContestInfoTabs />
    </Wrapper>
  );
};

export default ContestDetails;
