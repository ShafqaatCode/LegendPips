import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAnalysis } from '../../services/analysisService';
import type { Analysis } from '../../types/analysis.types';
import AnalysisCard from './AnalysisCard';
import XMBanner from '../Signals/XMBanner';
import { ShimmerBar } from '../SharedComponents/Shimmer';
import ListPagination from '../SharedComponents/ListPagination';

const SectionWrapper = styled.section`
  background: #fafbfc;
  padding: 60px 3rem;
  min-height: 420px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 30px 1.5rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 30px;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: max-content;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#132E58' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#132E58')};
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${({ $active }) => ($active ? '#132E58' : 'rgba(19, 46, 88, 0.1)')};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const FeaturedSection = styled.div`
  margin-bottom: 2.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 2rem;
  }
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const ShimmerTabsOuter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 30px;
  }
`;

const ShimmerTabsInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const ShimmerTabPill = styled(ShimmerBar)<{ $w: number }>`
  height: 40px;
  border-radius: 6px;
  width: ${({ $w }) => `${$w}px`};
  margin-bottom: 0;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  min-height: 260px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SkeletonImage = styled(ShimmerBar)`
  width: 100%;
  height: 140px;
  border-radius: 0;
  margin-bottom: 0;
`;

const SkeletonBody = styled.div`
  padding: 1rem 1.25rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SkeletonLine = styled(ShimmerBar)<{ $lineH?: number; $mb?: number; $lw?: string }>`
  height: ${({ $lineH }) => ($lineH != null ? `${$lineH}px` : '14px')};
  margin-bottom: ${({ $mb }) => ($mb != null ? `${$mb}px` : '10px')};
  width: ${({ $lw }) => $lw || '100%'};
  border-radius: 6px;

  &:last-child {
    margin-bottom: 0;
    margin-top: auto;
  }
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 2rem;
  }
`;

const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: ${({ active }) => (active ? '#132E58' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#132E58')};
  border: 2px solid #132E58;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 8px;
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  
  &:hover:not(:disabled) {
    background: ${({ active }) => (active ? '#0b1b38' : '#f0f0f0')};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const categories = ['All', 'Market Outlook', 'Forex', 'Gold', 'Crypto', 'Indices', 'Stock'];

const TAB_SHIMMER_WIDTHS = [44, 112, 64, 52, 72, 76, 56];

const AnalysisListSkeleton: React.FC = () => (
  <SectionWrapper>
    <ContentWrapper>
      <ShimmerTabsOuter>
        <ShimmerTabsInner>
          {TAB_SHIMMER_WIDTHS.map((w, i) => (
            <ShimmerTabPill key={i} $w={w} />
          ))}
        </ShimmerTabsInner>
      </ShimmerTabsOuter>

      <GridSection>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonImage />
            <SkeletonBody>
              <SkeletonLine $lw="92%" />
              <SkeletonLine $lw="68%" $mb={14} />
              <SkeletonLine $lineH={12} $lw="55%" $mb={0} />
            </SkeletonBody>
          </SkeletonCard>
        ))}
      </GridSection>
    </ContentWrapper>
    <XMBanner />
  </SectionWrapper>
);

const AnalysisList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [analysis, setAnalysis] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadAnalysis();
  }, [activeCategory, currentPage]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const category = activeCategory === 'All' ? undefined : activeCategory;
      const response = await fetchAnalysis(category, currentPage, limit);
      
      // Show all items in grid (no separate featured section)
      setAnalysis(response.items);
      setTotalPages(Math.max(1, response.totalPages));
      setTotalItems(response.totalItems);
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis');
      console.error('Error loading analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  if (loading && analysis.length === 0) {
    return <AnalysisListSkeleton />;
  }

  if (error && analysis.length === 0) {
    return (
      <SectionWrapper>
        <ErrorWrapper>
          <div>
            <p>{error}</p>
            <PageButton onClick={loadAnalysis} style={{ marginTop: '1rem' }}>
              Try Again
            </PageButton>
          </div>
        </ErrorWrapper>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <ContentWrapper>
        <TabsContainer>
          <TabsWrapper>
            {categories.map((category) => (
              <Tab
                key={category}
                $active={activeCategory === category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Tab>
            ))}
          </TabsWrapper>
        </TabsContainer>

        {analysis.length > 0 && (
          <GridSection>
            {analysis.map((item) => (
              <AnalysisCard key={item._id} analysis={item} featured={item.isFeatured} />
            ))}
          </GridSection>
        )}

        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />

        {analysis.length === 0 && !loading && (
          <ErrorWrapper>
            <p>No analysis found for this category.</p>
          </ErrorWrapper>
        )}
      </ContentWrapper>
      
      <XMBanner />
    </SectionWrapper>
  );
};

export default AnalysisList;
