import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchAnalysisById, fetchLatestAnalysis } from '../../services/analysisService';
import type { Analysis } from '../../types/analysis.types';
import XMBanner from '../Signals/XMBanner';
import ArrowRight from '../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg';

const DetailWrapper = styled.section`
  background: #fafbfc;
  padding: 60px 3rem 40px 3rem;
  min-height: 600px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 2rem 30px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 30px 1.5rem 20px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

const HeaderImage = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  position: relative;
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 280px;
    margin-bottom: 2rem;
    border-radius: 12px;
  }
`;

const HeaderImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderHeader = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 72px;
  font-weight: bold;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 48px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.25rem;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
    margin-bottom: 1rem;
  }
`;

const Snippet = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #555;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e8e8e8;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  font-size: 14px;
  color: #666;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e8e8e8;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1.25rem;
  }
`;

const Author = styled.span`
  font-weight: 500;
  color: #132E58;
`;

const PublishedDate = styled.span`
  color: #999;
  font-size: 13px;
`;

const Content = styled.div`
  font-size: 17px;
  line-height: 1.85;
  color: #333;
  margin-bottom: 3rem;
  
  p {
    margin-bottom: 1.75rem;
    text-align: justify;
  }
  
  h3 {
    font-size: 26px;
    font-weight: 700;
    color: #132E58;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.4;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
    line-height: 1.75;
    
    p {
      margin-bottom: 1.5rem;
    }
    
    h3 {
      font-size: 22px;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
  }
`;

const ChartSection = styled.div`
  margin: 3rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 2rem 0;
  }
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 1rem;
`;

const ChartImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PlaceholderChart = styled.div`
  width: 100%;
  height: 400px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 300px;
    font-size: 16px;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 100px;
  align-self: start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    top: 0;
    order: -1;
  }
`;

const SidebarSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const SidebarTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NewsTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #444;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    padding-left: 8px;
    
    ${NewsTitle} {
      color: #132E58;
    }
  }
`;

const NewsDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const PromoBanner = styled.div<{ bgColor?: string }>`
  background: ${({ bgColor }) => bgColor || '#132E58'};
  border-radius: 12px;
  padding: 2rem;
  color: white;
  text-align: center;
`;

const PromoTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const PromoText = styled.p`
  font-size: 14px;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const PromoButton = styled.button`
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
  
  img {
    width: 20px;
    height: 20px;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
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

const AnalysisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category from URL params if it's an external article
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'Market Outlook';

  useEffect(() => {
    if (id) {
      loadAnalysis();
      loadLatestAnalysis();
    }
  }, [id, category]);

  const loadAnalysis = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      // Pass category for external articles
      const data = await fetchAnalysisById(id, category);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis');
      console.error('Error loading analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestAnalysis = async () => {
    try {
      const data = await fetchLatestAnalysis(10);
      setLatestAnalysis(data);
    } catch (err) {
      console.error('Error loading latest analysis:', err);
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const handleNewsClick = (item: Analysis) => {
    if (!item._id) return;

    // `item.category` is already constrained by `Analysis['category']` (no "All" value).
    const safeCategory: Analysis["category"] = item.category ?? "Market Outlook";

    // Demo mode helper: for external articles, cache the clicked article so the detail page can render
    // even if the backend isn't available or NewsAPI returns a different set.
    if (item._id.startsWith("external_")) {
      try {
        localStorage.setItem(
          `legendpips_analysis_external_${item._id}`,
          JSON.stringify(item)
        );
      } catch {
        // Ignore storage failures.
      }
    }
    
    // For external articles, include category in the URL
    if (item._id.startsWith('external_')) {
      navigate(`/analysis/${item._id}?category=${encodeURIComponent(safeCategory)}`);
    } else {
      navigate(`/analysis/${item._id}`);
    }
  };

  if (loading) {
    return (
      <DetailWrapper>
        <LoadingWrapper>Loading analysis...</LoadingWrapper>
      </DetailWrapper>
    );
  }

  if (error || !analysis) {
    return (
      <DetailWrapper>
        <ErrorWrapper>
          <div>
            <p>{error || 'Analysis not found'}</p>
            <PromoButton onClick={() => navigate('/analysis')} style={{ marginTop: '1rem' }}>
              Back to Analysis
            </PromoButton>
          </div>
        </ErrorWrapper>
      </DetailWrapper>
    );
  }

  return (
    <>
      <DetailWrapper>
        <ContentWrapper>
          <MainContent>
            <HeaderImage>
              {analysis.featuredImage ? (
                <HeaderImageContent src={analysis.featuredImage} alt={analysis.title} />
              ) : (
                <PlaceholderHeader>{analysis.category.charAt(0)}</PlaceholderHeader>
              )}
            </HeaderImage>

            <Title>{analysis.title}</Title>
            
            {(analysis.subtitle || analysis.excerpt) && (
              <Snippet>{analysis.subtitle || analysis.excerpt}</Snippet>
            )}

            <Meta>
              <Author>By: {analysis.author}</Author>
              <PublishedDate>{formatDate(analysis.publishedAt)}</PublishedDate>
            </Meta>

            <Content>
              {analysis.content.split('\n\n').map((paragraph, index) => (
                <p key={`paragraph-${index}`}>{paragraph}</p>
              ))}
            </Content>

            {analysis.chartImage && (
              <ChartSection>
                {analysis.chartTitle && <ChartTitle>{analysis.chartTitle}</ChartTitle>}
                <ChartImage src={analysis.chartImage} alt={analysis.chartTitle || 'Chart'} />
              </ChartSection>
            )}

            {!analysis.chartImage && analysis.chartTitle && (
              <ChartSection>
                <ChartTitle>{analysis.chartTitle}</ChartTitle>
                <PlaceholderChart>Chart will be displayed here</PlaceholderChart>
              </ChartSection>
            )}
          </MainContent>

          <Sidebar>
            <SidebarSection>
              <SidebarTitle>Latest market news</SidebarTitle>
              <NewsList>
                {latestAnalysis.slice(0, 10).map((item) => (
                  <NewsItem key={item._id} onClick={() => handleNewsClick(item)}>
                    <NewsTitle>{item.title}</NewsTitle>
                    <NewsDate>{formatDate(item.publishedAt)}</NewsDate>
                  </NewsItem>
                ))}
              </NewsList>
            </SidebarSection>

            <PromoBanner>
              <PromoTitle>Join LegendPips in Minutes</PromoTitle>
              <PromoText>
                Empower your trading with expert insights and premium market tools.
              </PromoText>
              <PromoButton onClick={() => navigate('/register')}>
                Join Now <img src={ArrowRight} alt="Arrow" />
              </PromoButton>
            </PromoBanner>

            <PromoBanner bgColor="#1a4d8c">
              <PromoTitle>XM 15 Years of Award-Winning Trading</PromoTitle>
              <PromoText>
                Experience award-winning trading with XM. Trusted by millions worldwide.
              </PromoText>
            </PromoBanner>
          </Sidebar>
        </ContentWrapper>
      </DetailWrapper>
      
      <XMBanner />
    </>
  );
};

export default AnalysisDetail;
