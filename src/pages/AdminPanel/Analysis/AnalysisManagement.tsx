import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFileText, FiStar, FiCalendar } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';

const Container = styled.div`
  max-width: 1600px;
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

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $primary }) => ($primary ? '#132E58' : 'white')};
  color: ${({ $primary }) => ($primary ? 'white' : '#132E58')};
  border: 2px solid ${({ $primary }) => ($primary ? '#132E58' : '#e5e7eb')};
  
  &:hover {
    background: ${({ $primary }) => ($primary ? '#1a4a7a' : '#f9fafb')};
    border-color: ${({ $primary }) => ($primary ? '#1a4a7a' : '#132E58')};
    transform: translateY(-2px);
  }
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f3f4f6')};
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#132E58')};
  
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fecaca' : '#e5e7eb')};
  }
`;

const FeaturedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #Fbbf2415;
  color: #Fbbf24;
  margin-left: 0.5rem;
`;

const AnalysisManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Forex');
  const [formAuthor, setFormAuthor] = useState('John Smith');
  const [formPublishedAt, setFormPublishedAt] = useState('2024-01-15');

  const [analysis, setAnalysis] = useState([
    {
      id: '1',
      title: 'Gold Market Analysis: Q1 2024 Outlook',
      category: 'Forex',
      author: 'John Smith',
      publishedAt: '2024-01-15',
      featured: true,
      excerpt: 'Comprehensive analysis of the gold market trends and predictions for the first quarter of 2024...',
    },
    {
      id: '2',
      title: 'EUR/USD Technical Breakdown',
      category: 'Forex',
      author: 'Jane Doe',
      publishedAt: '2024-01-14',
      featured: false,
      excerpt: 'Detailed technical analysis of EUR/USD pair with key support and resistance levels...',
    },
    {
      id: '3',
      title: 'Bitcoin Price Prediction: Bull Run Ahead?',
      category: 'Crypto',
      author: 'Mike Johnson',
      publishedAt: '2024-01-13',
      featured: true,
      excerpt: 'Analysis of Bitcoin price movements and potential for a new bull run in 2024...',
    },
  ]);

  return (
    <Container>
      <Header>
        <Title>Analysis Management</Title>
        <Button
          $primary
          onClick={() => {
            setModalMode('add');
            setSelectedAnalysisId(null);
            setFormTitle('');
            setFormCategory('Forex');
            setFormAuthor('John Smith');
            setFormPublishedAt('2024-01-15');
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Create Analysis
        </Button>
      </Header>

      <AnalysisGrid>
        {analysis.map((item) => (
          <AnalysisCard key={item.id}>
            <CardHeader>
              <AnalysisTitle>
                {item.title}
                {item.featured && (
                  <FeaturedBadge>
                    <FiStar />
                    Featured
                  </FeaturedBadge>
                )}
              </AnalysisTitle>
            </CardHeader>
            <CategoryBadge>{item.category}</CategoryBadge>
            <AnalysisExcerpt>{item.excerpt}</AnalysisExcerpt>
            <AnalysisMeta>
              <span>
                <FiFileText />
                by {item.author}
              </span>
              <span>
                <FiCalendar />
                {item.publishedAt}
              </span>
            </AnalysisMeta>
            <ActionButtons>
              <IconButton
                onClick={() => {
                  setModalMode('edit');
                  setSelectedAnalysisId(item.id);
                  setFormTitle(item.title);
                  setFormCategory(item.category);
                  setFormAuthor(item.author);
                  setFormPublishedAt(typeof item.publishedAt === 'string' ? item.publishedAt : new Date(item.publishedAt).toISOString().slice(0, 10));
                  setIsModalOpen(true);
                }}
              >
                <FiEdit2 />
                Edit
              </IconButton>
              <IconButton
                $danger
                onClick={() => {
                  setModalMode('delete');
                  setSelectedAnalysisId(item.id);
                  setIsModalOpen(true);
                }}
              >
                <FiTrash2 />
                Delete
              </IconButton>
            </ActionButtons>
          </AnalysisCard>
        ))}
      </AnalysisGrid>

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === 'add' ? 'Create Analysis' : modalMode === 'edit' ? 'Edit Analysis' : 'Delete Analysis'}
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedAnalysisId) return;
                  setAnalysis((prev) => prev.filter((a) => a.id !== selectedAnalysisId));
                  setIsModalOpen(false);
                }}
              >
                <FiTrash2 />
                Delete
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                onClick={() => {
                  const title = formTitle.trim();
                  if (!title) return;

                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setAnalysis((prev) => [
                      {
                        id,
                        title,
                        category: formCategory,
                        author: formAuthor,
                        publishedAt: formPublishedAt,
                        featured: false,
                        excerpt: 'New analysis excerpt...',
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedAnalysisId) {
                    setAnalysis((prev) =>
                      prev.map((a) =>
                        a.id === selectedAnalysisId
                          ? {
                              ...a,
                              title,
                              category: formCategory,
                              author: formAuthor,
                              publishedAt: formPublishedAt,
                            }
                          : a
                      )
                    );
                  }

                  setIsModalOpen(false);
                }}
              >
                <FiEdit2 />
                Save
              </IconButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>Are you sure?</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Title</div>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Category</div>
              <input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Author</div>
              <input
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Published At</div>
              <input
                value={formPublishedAt}
                onChange={(e) => setFormPublishedAt(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default AnalysisManagement;
