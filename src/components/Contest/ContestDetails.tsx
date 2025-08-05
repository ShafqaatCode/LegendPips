import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { type Competition } from '../ContestList/mockCompetitions';
import { fetchCompetitionById } from '../ContestList/mockApi';
import Spinner from '../Loaders/spinner';
import ContestHeaderWithModals from '../ContestList/ContestHeader';

const Wrapper = styled.section`
  margin-top: 135px;
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
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
      <h1>Contest Details</h1>
      <div>Contest ID: {contestId}</div>

      {contestData && (
        <div style={{ marginTop: "1rem" }}>
          <h2>{contestData.title}</h2>
          <p>Status: {contestData.status}</p>
          <p>Type: {contestData.type}</p>
          <p>Event: {contestData.event}</p>
          <p>Entry Fee: {contestData.entry}</p>
          <p>Participants: {contestData.participants}</p>
          {contestData.logo && (
            <img
              src={contestData.logo}
              alt={contestData.title}
              style={{ width: '200px', height: 'auto', marginTop: '1rem' }}
            />
          )}
          <p>Ends: {contestData.ends}</p>
        </div>
      )}
    </Wrapper>
  );
};

export default ContestDetails;
