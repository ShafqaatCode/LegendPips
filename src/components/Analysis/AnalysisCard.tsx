import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { Analysis } from '../../types/analysis.types';

const Card = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
    border-color: #e0e0e0;
  }
`;

const ImageWrapper = styled.div<{ $featured?: boolean }>`
  width: 100%;
  height: ${({ $featured }) => ($featured ? '200px' : '140px')};
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: ${({ $featured }) => ($featured ? '160px' : '120px')};
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: clamp(1.25rem, 1.2vw + 0.8rem, 1.6rem);
  font-weight: bold;
  opacity: 0.9;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const Content = styled.div`
  padding: 1rem 1.25rem 1.25rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.875rem 1rem 1rem 1rem;
  }
`;

const Title = styled.h3<{ $featured?: boolean }>`
  font-size: ${({ $featured }) => ($featured ? '18px' : '15px')};
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
  
  ${Card}:hover & {
    color: #Fbbf24;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ $featured }) => ($featured ? '16px' : '14px')};
    -webkit-line-clamp: 2;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-top: auto;
  padding-top: 0.875rem;
  border-top: 1px solid #f5f5f5;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const Author = styled.span`
  font-weight: 500;
  color: #132E58;
`;

const PublishedDate = styled.span`
  color: #999;
  font-size: 12px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  color: #132E58;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
  width: fit-content;
`;

interface AnalysisCardProps {
  analysis: Analysis;
  featured?: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, featured = false }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
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

  const handleClick = () => {
    if (!analysis._id) {
      console.error('Analysis ID is missing');
      return;
    }

    // `analysis.category` is already constrained by `Analysis['category']` (no "All" value).
    const safeCategory: Analysis["category"] = analysis.category ?? "Market Outlook";

    // Cache external article data on click so the detail page can render without needing the backend.
    if (analysis.isExternal) {
      try {
        localStorage.setItem(
          `legendpips_analysis_external_${analysis._id}`,
          JSON.stringify(analysis)
        );
      } catch {
        // Ignore storage failures (private mode, quota, etc).
      }
    }
    
    // For external articles, include category in the URL
    if (analysis._id.startsWith('external_')) {
      navigate(`/analysis/${analysis._id}?category=${encodeURIComponent(safeCategory)}`);
    } else {
      navigate(`/analysis/${analysis._id}`);
    }
  };

  return (
    <Card onClick={handleClick}>
      <ImageWrapper $featured={featured}>
        {analysis.featuredImage ? (
          <Image src={analysis.featuredImage} alt={analysis.title} />
        ) : (
          <PlaceholderImage>
            {analysis.category.charAt(0)}
          </PlaceholderImage>
        )}
      </ImageWrapper>
      <Content>
        <CategoryBadge>{analysis.category}</CategoryBadge>
        <Title $featured={featured}>{analysis.title}</Title>
        <Meta>
          <Author>By {analysis.author}</Author>
          <PublishedDate>{formatDate(analysis.publishedAt)}</PublishedDate>
        </Meta>
      </Content>
    </Card>
  );
};

export default AnalysisCard;
