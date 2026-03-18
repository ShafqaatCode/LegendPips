import React, { useState } from 'react';
import styled from 'styled-components';
import { FiFileText, FiCalendar, FiTag, FiBookmark, FiTrash2 } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #Fbbf24;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AnalysisTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fee2e2;
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #Fbbf2415;
  color: #Fbbf24;
  margin-bottom: 0.75rem;
`;

const AnalysisExcerpt = styled.p`
  color: #6b7280;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AnalysisMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
`;

const SavedAnalysis: React.FC = () => {
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      title: 'Gold Market Analysis: Q1 2024 Outlook',
      category: 'Forex',
      excerpt: 'Comprehensive analysis of the gold market trends and predictions for the first quarter of 2024...',
      date: '2024-01-15',
      author: 'John Smith',
    },
    {
      id: 2,
      title: 'EUR/USD Technical Breakdown',
      category: 'Forex',
      excerpt: 'Detailed technical analysis of EUR/USD pair with key support and resistance levels...',
      date: '2024-01-14',
      author: 'Jane Doe',
    },
    {
      id: 3,
      title: 'Bitcoin Price Prediction: Bull Run Ahead?',
      category: 'Crypto',
      excerpt: 'Analysis of Bitcoin price movements and potential for a new bull run in 2024...',
      date: '2024-01-13',
      author: 'Mike Johnson',
    },
  ]);

  const handleDelete = (id: number) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  return (
    <Container>
      <Header>
        <Title>Saved Analysis</Title>
      </Header>

      {savedItems.length > 0 ? (
        <AnalysisGrid>
          {savedItems.map((item) => (
            <AnalysisCard key={item.id}>
              <CardHeader>
                <AnalysisTitle>{item.title}</AnalysisTitle>
                <DeleteButton onClick={() => handleDelete(item.id)}>
                  <FiTrash2 />
                </DeleteButton>
              </CardHeader>
              <CategoryBadge>
                <FiTag style={{ marginRight: '0.25rem' }} />
                {item.category}
              </CategoryBadge>
              <AnalysisExcerpt>{item.excerpt}</AnalysisExcerpt>
              <AnalysisMeta>
                <span>
                  <FiCalendar />
                  {item.date}
                </span>
                <span>by {item.author}</span>
              </AnalysisMeta>
            </AnalysisCard>
          ))}
        </AnalysisGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>📄</EmptyIcon>
          <EmptyText>No saved analysis articles yet.</EmptyText>
        </EmptyState>
      )}
    </Container>
  );
};

export default SavedAnalysis;
