import React, { useState, useMemo } from "react"; 
import styled from "styled-components";
import { brokers_data } from "../../data/brokers_data";
import BrokerCard3 from "./BrokerCard3";


const BrokerSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* gap: 2rem; */
  padding: 1rem 0;
  margin: 3rem auto;
  
  
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;


  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

// Use a CSS-valid selector structure
const PageButton = styled.button<{ $isActive?: boolean }>`
  background-color: ${props => (props.$isActive ? "#132E58" : "transparent")};
  color: ${props => (props.$isActive ? "white" : "#132E58")};
  border: 1px solid #132E58;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled):not([aria-current="page"]) {
    background-color: #f0f0f0;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
// ---------------------------------------------

const ITEMS_PER_PAGE = 5; // Cards per page

const AllBrokersList: React.FC = () => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = brokers_data.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Logic to calculate which subset of brokers to display
  const visiableBrokers = useMemo(() => {
    // Calculate indices for the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Return the slice of data
    return brokers_data.slice(startIndex, endIndex);
  }, [currentPage, totalItems]); 

  // Page change handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to render page number buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PageButton
          key={i}
          $isActive={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    return buttons;
  };
  
  // Show pagination only if there is more than one page
  const shouldShowPagination = totalPages > 1;

  return (
    <BrokerSectionWrapper>
      
      <BrokerWrapper>
        {visiableBrokers.map((broker, idx) => {
            // FIX: Use a safe, unique key without assuming 'id' exists.
            // We use the index relative to the *whole* data set for a better key,
            // or fall back to the local index + page number.
            const uniqueKey = (currentPage - 1) * ITEMS_PER_PAGE + idx;
            
            return (
                <BrokerCard3 
                    // Using a unique index derived from its position in the full dataset
                    key={uniqueKey} 
                    {...broker} 
                />
            );
        })}
      </BrokerWrapper>
      
      {/* Render Pagination Controls */}
      {shouldShowPagination && (
        <PaginationContainer>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>

          {renderPaginationButtons()}
          
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </PaginationContainer>
      )}
    </BrokerSectionWrapper>
  );
};

export default AllBrokersList;