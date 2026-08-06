import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiStar, FiCalendar, FiCheck, FiUser, FiSearch } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, FilterCount, SearchInput, Pill, adminColors,
} from '../../../components/AdminPanel/adminUi';

type AnalysisItem = {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  excerpt: string;
};

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const MiniStat = styled.div`
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  padding: 0.85rem 1rem;
  box-shadow: ${adminColors.shadow};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  .icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
  }
  .val { font-size: 1.25rem; font-weight: 800; color: ${adminColors.navy}; }
  .lbl { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: ${adminColors.muted}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.9rem;
`;

const Card = styled.article`
  background: white;
  border-radius: 16px;
  border: 1px solid ${adminColors.border};
  box-shadow: ${adminColors.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${adminColors.shadowHover};
    border-color: rgba(251, 191, 36, 0.45);
  }
`;

const CardTop = styled.div`
  padding: 1rem 1rem 0.75rem;
  background:
    radial-gradient(ellipse 80% 100% at 100% 0%, rgba(251, 191, 36, 0.1) 0%, transparent 55%),
    linear-gradient(180deg, #f8fafc 0%, white 100%);
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
`;

const Mark = styled.div`
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(145deg, ${adminColors.navy}, ${adminColors.navyLight});
  color: ${adminColors.gold};
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
`;

const Head = styled.div`
  flex: 1; min-width: 0;
  h3 {
    margin: 0 0 0.4rem; font-size: 0.95rem; font-weight: 800; color: ${adminColors.navy};
    letter-spacing: -0.02em; line-height: 1.3;
  }
`;

const Badges = styled.div` display: flex; flex-wrap: wrap; gap: 0.3rem; `;

const Excerpt = styled.p`
  margin: 0;
  padding: 0.85rem 1rem 0.5rem;
  font-size: 0.8125rem;
  color: ${adminColors.muted};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0 1rem 0.85rem;
`;

const Metric = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 0.45rem 0.55rem;
  .k {
    font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    color: ${adminColors.muted}; margin-bottom: 0.1rem; display: flex; align-items: center; gap: 0.2rem;
    svg { color: ${adminColors.gold}; font-size: 0.7rem; }
  }
  .v { font-size: 0.78rem; font-weight: 700; color: ${adminColors.navy}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

const Footer = styled.div`
  padding: 0.7rem 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.45rem;
  background: #fafbfc;
`;

const FormField = styled.label`
  display: flex; flex-direction: column; gap: 0.35rem;
  font-size: 0.6875rem; font-weight: 700; color: ${adminColors.navy}; margin-bottom: 0.75rem;
  input {
    padding: 0.55rem 0.7rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; outline: none; background: #fafbfc;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); background: white; }
  }
`;

const Empty = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;
  background: white; border: 1px dashed ${adminColors.border}; border-radius: 16px; color: ${adminColors.muted};
  strong { display: block; color: ${adminColors.navy}; margin-bottom: 0.35rem; }
`;

const AnalysisManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Forex');
  const [formAuthor, setFormAuthor] = useState('John Smith');
  const [formPublishedAt, setFormPublishedAt] = useState('2024-01-15');

  const [analysis, setAnalysis] = useState<AnalysisItem[]>([
    { id: '1', title: 'Gold Market Analysis: Q1 2024 Outlook', category: 'Forex', author: 'John Smith', publishedAt: '2024-01-15', featured: true, excerpt: 'Comprehensive analysis of the gold market trends and predictions for the first quarter of 2024...' },
    { id: '2', title: 'EUR/USD Technical Breakdown', category: 'Forex', author: 'Jane Doe', publishedAt: '2024-01-14', featured: false, excerpt: 'Detailed technical analysis of EUR/USD pair with key support and resistance levels...' },
    { id: '3', title: 'Bitcoin Price Prediction: Bull Run Ahead?', category: 'Crypto', author: 'Mike Johnson', publishedAt: '2024-01-13', featured: true, excerpt: 'Analysis of Bitcoin price movements and potential for a new bull run in 2024...' },
  ]);

  const filtered = analysis.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
  });

  const stats = useMemo(() => ({
    total: analysis.length,
    featured: analysis.filter((a) => a.featured).length,
    categories: new Set(analysis.map((a) => a.category)).size,
  }), [analysis]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiFileText /> Analysis</PageTitle>
          <PageSubtitle>Publish market insights, technical reports, and featured research</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={() => {
          setModalMode('add'); setSelectedAnalysisId(null);
          setFormTitle(''); setFormCategory('Forex'); setFormAuthor('John Smith');
          setFormPublishedAt('2024-01-15'); setIsModalOpen(true);
        }}>
          <FiPlus /> Create analysis
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiFileText /></div>
          <div><div className="val">{stats.total}</div><div className="lbl">Articles</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiStar /></div>
          <div><div className="val">{stats.featured}</div><div className="lbl">Featured</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#d1fae5', color: '#059669' }}><FiFileText /></div>
          <div><div className="val">{stats.categories}</div><div className="lbl">Categories</div></div>
        </MiniStat>
      </StatsRow>

      <FilterBar>
        <SearchInput style={{ maxWidth: 320, flex: 1 }}>
          <FiSearch />
          <input placeholder="Search analysis…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </SearchInput>
        <FilterCount>{filtered.length} shown</FilterCount>
      </FilterBar>

      <Grid>
        {filtered.length === 0 ? (
          <Empty><strong>No analysis found</strong>Try another search or create a new post.</Empty>
        ) : filtered.map((item) => (
          <Card key={item.id}>
            <CardTop>
              <Mark><FiFileText /></Mark>
              <Head>
                <h3>{item.title}</h3>
                <Badges>
                  <Pill $variant="pending">{item.category}</Pill>
                  {item.featured && <Pill $variant="admin"><FiStar style={{ marginRight: 2 }} /> Featured</Pill>}
                </Badges>
              </Head>
            </CardTop>
            <Excerpt>{item.excerpt}</Excerpt>
            <Meta>
              <Metric><div className="k"><FiUser /> Author</div><div className="v">{item.author}</div></Metric>
              <Metric><div className="k"><FiCalendar /> Published</div><div className="v">{item.publishedAt}</div></Metric>
            </Meta>
            <Footer>
              <GhostButton $sm type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setModalMode('edit'); setSelectedAnalysisId(item.id);
                setFormTitle(item.title); setFormCategory(item.category); setFormAuthor(item.author);
                setFormPublishedAt(item.publishedAt); setIsModalOpen(true);
              }}><FiEdit2 /> Edit</GhostButton>
              <GhostButton $sm $danger type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setModalMode('delete'); setSelectedAnalysisId(item.id); setIsModalOpen(true);
              }}><FiTrash2 /> Delete</GhostButton>
            </Footer>
          </Card>
        ))}
      </Grid>

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === 'add' ? 'Create Analysis' : modalMode === 'edit' ? 'Edit Analysis' : 'Delete Analysis'}
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <GhostButton type="button" $danger onClick={() => {
                if (!selectedAnalysisId) return;
                setAnalysis((p) => p.filter((a) => a.id !== selectedAnalysisId));
                setIsModalOpen(false);
              }}><FiTrash2 /> Delete</GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <PrimaryButton type="button" onClick={() => {
                const title = formTitle.trim();
                if (!title) return;
                if (modalMode === 'add') {
                  setAnalysis((p) => [{
                    id: String(Date.now()), title, category: formCategory, author: formAuthor,
                    publishedAt: formPublishedAt, featured: false, excerpt: 'New analysis excerpt...',
                  }, ...p]);
                } else if (modalMode === 'edit' && selectedAnalysisId) {
                  setAnalysis((p) => p.map((a) => a.id === selectedAnalysisId
                    ? { ...a, title, category: formCategory, author: formAuthor, publishedAt: formPublishedAt }
                    : a));
                }
                setIsModalOpen(false);
              }}><FiCheck /> Save</PrimaryButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>Delete this analysis article?</div>
        ) : (
          <div>
            <FormField>Title<input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} /></FormField>
            <FormField>Category<input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} /></FormField>
            <FormField>Author<input value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} /></FormField>
            <FormField>Published At<input value={formPublishedAt} onChange={(e) => setFormPublishedAt(e.target.value)} /></FormField>
          </div>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default AnalysisManagement;
