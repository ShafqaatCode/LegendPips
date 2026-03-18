import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchCompetitions, type Competition } from "../../services/contestService";
import ContestCard from "./ContestCard";
import TrophyImg from "../../assets/Group.png"
import { competitionsData } from "./mockCompetitions";
const filters = ["All", "Upcoming", "Ongoing", "Ended"];

const Competitions: React.FC = () => {
  // Demo mode: use mock data so the client can see the UI without needing backend.
  // Later, switch this to `false` to use the API again (we keep the API code intact).
  const useMockData = true;

  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadCompetitions = async () => {
      if (useMockData) {
        setCompetitions(competitionsData as unknown as Competition[]);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await fetchCompetitions(
          activeFilter === "All" ? undefined : activeFilter,
          currentPage,
          perPage
        );
        setCompetitions(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load competitions";
        setError(errorMessage);
        console.error("Error loading competitions:", err);
        // Set empty array on error so UI doesn't break
        setCompetitions([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompetitions();
  }, [activeFilter, currentPage]);

  const filteredData =
    activeFilter === "All"
      ? competitions
      : competitions.filter((c) => c.status === activeFilter);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <Wrapper>
      <Header>
        <Title> <img src={TrophyImg} alt="TrophyIcon" /> Competitions</Title>
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
        <Loading>Loading competitions...</Loading>
      ) : error ? (
        <Loading style={{ color: "#e74c3c" }}>{error}</Loading>
      ) : paginatedData.length === 0 ? (
        <Loading>No competitions found</Loading>
      ) : (
        <>
          <Grid>
            {paginatedData.map((comp) => (
              <ContestCard key={comp.id} comp={comp} />
            ))}
          </Grid>

          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => (
              <PageButton
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
          </Pagination>
        </>
      )}
    </Wrapper>
  );
};

export default Competitions;



const Wrapper = styled.div`
  padding: 2rem 4rem;
  @media (max-width: 768px) {
    padding:1rem;
  }

  
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
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
    background-color: #132E58;
    color: white;


   option {
    background-color: #fff;
    color: #333;
  }
   
  }

  @media (max-width: 768px) {
    /* width: 100%; */
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

const Grid = styled.div`
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  gap: 0.4rem;
`;

const PageButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: ${({ active }) => (active ? "#012d5c" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: ${({ active }) => (active ? "#013e7e" : "#f0f0f0")};
  }
`;
