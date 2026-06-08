import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchCompetitions, type Competition } from "../../services/contestService";
import ContestCard from "./ContestCard";
import TrophyImg from "../../assets/Group.png";
import { BrokerListSkeleton } from "../SharedComponents/Shimmer";
import ListPagination from "../SharedComponents/ListPagination";

const filters = ["All", "Upcoming", "Ongoing", "Ended"];

const Competitions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refetchTick, setRefetchTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadCompetitions = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchCompetitions(
          activeFilter === "All" ? undefined : activeFilter,
          currentPage,
          perPage
        );
        if (!cancelled) {
          setCompetitions(result.items);
          setTotalPages(Math.max(1, result.totalPages));
          setTotalItems(result.totalItems);
        }
      } catch (err: any) {
        if (!cancelled) {
          const errorMessage = err.message || "Failed to load competitions";
          setError(errorMessage);
          console.error("Error loading competitions:", err);
          setCompetitions([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCompetitions();
    return () => {
      cancelled = true;
    };
  }, [activeFilter, currentPage, refetchTick]);

  const bumpContests = () => setRefetchTick((t) => t + 1);
  return (
    <Wrapper>
      <Header>
        <Title>
          <img src={TrophyImg} alt="TrophyIcon" /> Competitions
        </Title>
        <Filter>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {filters.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Filter>
      </Header>

      {loading ? (
        <BrokerListSkeleton rows={perPage} />
      ) : error ? (
        <Loading style={{ color: "#e74c3c" }}>{error}</Loading>
      ) : competitions.length === 0 ? (
        <Loading>No competitions found</Loading>
      ) : (
        <>
          <CardStack>
            {competitions.map((comp, idx) => (
              <ContestCard
                key={String(comp.id ?? comp._id ?? "")}
                comp={comp}
                index={(currentPage - 1) * perPage + idx + 1}
                onJoined={bumpContests}
              />
            ))}
          </CardStack>

          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Competitions;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter} 1.5rem;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.85rem 0 1.1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #012d5c;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Filter = styled.div`
  select {
    padding: 0.4rem 0.8rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #050505;
    background-color: #132e58;
    color: white;

    option {
      background-color: #fff;
      color: #333;
    }
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    text-align: right;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #555;
`;

/** Same vertical rhythm as rebate broker cards (`AllBrokersList`). */
const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

