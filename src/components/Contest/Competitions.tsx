import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchCompetitions } from "./mockApi";
import type { Competition } from "./mockCompetitions";
import ContestCard from "./ContestCard";
import TrophyImg from "../../assets/Group.png"
const filters = ["All", "Upcoming", "Ongoing", "Ended"];

const Competitions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions().then((data) => {
      setCompetitions(data);
      setLoading(false);
    });
  }, []);

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
  
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  
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
