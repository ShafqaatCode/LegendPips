import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiStar, FiCalendar, FiCheck, FiUser, FiSearch, FiRefreshCw } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, FilterCount, SearchInput, Pill, adminColors, ErrorBanner,
} from '../../../components/AdminPanel/adminUi';
import {
  createAnalysisAdmin,
  deleteAnalysisAdmin,
  fetchAnalysis,
  updateAnalysisAdmin,
  type Analysis,
} from '../../../services/analysisService';

const CATEGORIES: Analysis['category'][] = [
  'Market Outlook',
  'Market News',
  'Market Analysis',
  'Prop Firm News',
  'Industry News',
  'Press Releases',
  'Forex',
  'Gold',
  'Crypto',
  'Indices',
  'Stock',
];

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
`;

const CardTop = styled.div`
  padding: 1rem 1rem 0.75rem;
  background: linear-gradient(180deg, #f8fafc 0%, white 100%);
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
    line-height: 1.3;
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
  input, select, textarea {
    padding: 0.55rem 0.7rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; outline: none; background: #fafbfc; font: inherit;
    &:focus { border-color: ${adminColors.navy}; background: white; }
  }
  textarea { min-height: 180px; resize: vertical; line-height: 1.5; }
`;

const CheckRow = styled.label`
  display: flex; align-items: center; gap: 0.45rem;
  font-size: 0.8125rem; font-weight: 600; color: ${adminColors.navy}; margin-bottom: 0.75rem;
`;

const Empty = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;
  background: white; border: 1px dashed ${adminColors.border}; border-radius: 16px; color: ${adminColors.muted};
  strong { display: block; color: ${adminColors.navy}; margin-bottom: 0.35rem; }
`;

const todayIso = () => new Date().toISOString().slice(0, 10);

const AnalysisManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<Analysis['category']>('Market Analysis');
  const [formAuthor, setFormAuthor] = useState('LegendPips Research');
  const [formPublishedAt, setFormPublishedAt] = useState(todayIso());
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formFeaturedImage, setFormFeaturedImage] = useState('');
  const [formChartImage, setFormChartImage] = useState('');
  const [formChartTitle, setFormChartTitle] = useState('');
  const [formFeaturedFile, setFormFeaturedFile] = useState<File | null>(null);
  const [formChartFile, setFormChartFile] = useState<File | null>(null);
  const [formFeatured, setFormFeatured] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAnalysis(undefined, 1, 100);
      setItems((data.items || []).filter((a) => !a.isExternal && a._id && !String(a._id).startsWith('external_')));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = items.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q)
    );
  });

  const stats = useMemo(() => ({
    total: items.length,
    featured: items.filter((a) => a.isFeatured).length,
    categories: new Set(items.map((a) => a.category)).size,
  }), [items]);

  const openAdd = () => {
    setModalMode('add');
    setSelectedId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('Market Analysis');
    setFormAuthor('LegendPips Research');
    setFormPublishedAt(todayIso());
    setFormExcerpt('');
    setFormContent('');
    setFormFeaturedImage('');
    setFormChartImage('');
    setFormChartTitle('');
    setFormFeaturedFile(null);
    setFormChartFile(null);
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const openEdit = (item: Analysis) => {
    setModalMode('edit');
    setSelectedId(item._id);
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle || '');
    setFormCategory(item.category);
    setFormAuthor(item.author);
    setFormPublishedAt(
      item.publishedAt
        ? new Date(item.publishedAt).toISOString().slice(0, 10)
        : todayIso()
    );
    setFormExcerpt(item.excerpt || '');
    setFormContent(item.content || '');
    setFormFeaturedImage(item.featuredImage || '');
    setFormChartImage(item.chartImage || '');
    setFormChartTitle(item.chartTitle || '');
    setFormFeaturedFile(null);
    setFormChartFile(null);
    setFormFeatured(Boolean(item.isFeatured));
    setIsModalOpen(true);
  };

  const save = async () => {
    const title = formTitle.trim();
    const content = formContent.trim();
    if (!title || !content) {
      setError('Title and full analysis content are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        subtitle: formSubtitle.trim() || undefined,
        category: formCategory,
        author: formAuthor.trim() || 'LegendPips Research',
        content,
        excerpt: formExcerpt.trim() || content.slice(0, 180),
        featuredImage: formFeaturedImage.trim() || undefined,
        chartImage: formChartImage.trim() || undefined,
        chartTitle: formChartTitle.trim() || undefined,
        featuredImageFile: formFeaturedFile,
        chartImageFile: formChartFile,
        isFeatured: formFeatured,
        publishedAt: formPublishedAt ? new Date(formPublishedAt).toISOString() : new Date().toISOString(),
      };
      if (modalMode === 'add') {
        await createAnalysisAdmin(payload);
      } else if (modalMode === 'edit' && selectedId) {
        await updateAnalysisAdmin(selectedId, payload);
      }
      setIsModalOpen(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save analysis');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await deleteAnalysisAdmin(selectedId);
      setIsModalOpen(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiFileText /> Analysis</PageTitle>
          <PageSubtitle>Publish full market insights with detailed content</PageSubtitle>
        </PageTitleGroup>
        <div style={{ display: 'flex', gap: 8 }}>
          <GhostButton type="button" onClick={() => void refresh()} disabled={loading}>
            <FiRefreshCw /> Refresh
          </GhostButton>
          <PrimaryButton type="button" onClick={openAdd}>
            <FiPlus /> Create analysis
          </PrimaryButton>
        </div>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

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
        <FilterCount>{loading ? 'Loading…' : `${filtered.length} shown`}</FilterCount>
      </FilterBar>

      <Grid>
        {!loading && filtered.length === 0 ? (
          <Empty><strong>No analysis yet</strong>Create a detailed post to publish on the site.</Empty>
        ) : filtered.map((item) => (
          <Card key={item._id}>
            <CardTop>
              <Mark><FiFileText /></Mark>
              <Head>
                <h3>{item.title}</h3>
                <Badges>
                  <Pill $variant="pending">{item.category}</Pill>
                  {item.isFeatured && <Pill $variant="admin"><FiStar style={{ marginRight: 2 }} /> Featured</Pill>}
                </Badges>
              </Head>
            </CardTop>
            <Excerpt>{item.excerpt || item.content}</Excerpt>
            <Meta>
              <Metric><div className="k"><FiUser /> Author</div><div className="v">{item.author}</div></Metric>
              <Metric>
                <div className="k"><FiCalendar /> Published</div>
                <div className="v">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'}</div>
              </Metric>
            </Meta>
            <Footer>
              <GhostButton $sm type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(item)}>
                <FiEdit2 /> Edit
              </GhostButton>
              <GhostButton $sm $danger type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setModalMode('delete'); setSelectedId(item._id); setIsModalOpen(true);
              }}>
                <FiTrash2 /> Delete
              </GhostButton>
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
              <GhostButton type="button" $danger disabled={saving} onClick={() => void remove()}>
                <FiTrash2 /> {saving ? 'Deleting…' : 'Delete'}
              </GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <PrimaryButton type="button" disabled={saving} onClick={() => void save()}>
                <FiCheck /> {saving ? 'Saving…' : 'Publish'}
              </PrimaryButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>Delete this analysis article permanently?</div>
        ) : (
          <div>
            <FormField>Title<input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required /></FormField>
            <FormField>Subtitle<input value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} placeholder="Optional" /></FormField>
            <FormField>
              Category
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as Analysis['category'])}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField>Author<input value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} /></FormField>
            <FormField>Published date<input type="date" value={formPublishedAt} onChange={(e) => setFormPublishedAt(e.target.value)} /></FormField>
            <FormField>Excerpt<input value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)} placeholder="Short summary for cards" /></FormField>
            <FormField>
              Featured image URL
              <input value={formFeaturedImage} onChange={(e) => setFormFeaturedImage(e.target.value)} placeholder="https://…" />
            </FormField>
            <FormField>
              Or upload featured image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFormFeaturedFile(e.target.files?.[0] || null)}
              />
              {formFeaturedFile ? <small style={{ color: adminColors.muted }}>Selected: {formFeaturedFile.name}</small> : null}
            </FormField>
            <FormField>
              Chart image URL
              <input value={formChartImage} onChange={(e) => setFormChartImage(e.target.value)} placeholder="https://…" />
            </FormField>
            <FormField>
              Or upload chart image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFormChartFile(e.target.files?.[0] || null)}
              />
              {formChartFile ? <small style={{ color: adminColors.muted }}>Selected: {formChartFile.name}</small> : null}
            </FormField>
            <FormField>
              Chart title
              <input value={formChartTitle} onChange={(e) => setFormChartTitle(e.target.value)} placeholder="Optional chart caption" />
            </FormField>
            <FormField>
              Full analysis content
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Write the full analysis. Separate paragraphs with a blank line."
                required
              />
            </FormField>
            <CheckRow>
              <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} />
              Featured on homepage / analysis hub
            </CheckRow>
          </div>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default AnalysisManagement;
