import React, { useState } from 'react';
import { FiFileText, FiCalendar, FiTag, FiTrash2 } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  CardsGrid, ListCard, CardTitle, MetaLine, CardFooter,
  Pill, EmptyState, GhostButton,
} from '../../../components/UserPanel/userUi';

const SavedAnalysis: React.FC = () => {
  const [savedItems, setSavedItems] = useState([
    { id: 1, title: 'Gold Market Analysis: Q1 2024 Outlook', category: 'Forex', excerpt: 'Comprehensive analysis of gold market trends and predictions for Q1 2024…', date: '2024-01-15', author: 'John Smith' },
    { id: 2, title: 'EUR/USD Technical Breakdown', category: 'Forex', excerpt: 'Detailed technical analysis with key support and resistance levels…', date: '2024-01-14', author: 'Jane Doe' },
    { id: 3, title: 'Bitcoin Price Prediction', category: 'Crypto', excerpt: 'Analysis of Bitcoin price movements and potential bull run in 2024…', date: '2024-01-13', author: 'Mike Johnson' },
  ]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiFileText /> Saved Analysis</PageTitle>
        <PageSubtitle>Articles you bookmarked for later</PageSubtitle>
      </PageHeader>

      {savedItems.length === 0 ? (
        <EmptyState>No saved analysis articles yet.</EmptyState>
      ) : (
        <CardsGrid>
          {savedItems.map((item) => (
            <ListCard key={item.id} style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                <CardTitle style={{ flex: 1 }}>{item.title}</CardTitle>
                <GhostButton $sm type="button" onClick={() => setSavedItems((s) => s.filter((x) => x.id !== item.id))} style={{ color: '#dc2626', borderColor: '#fecaca', padding: '0.3rem' }}>
                  <FiTrash2 />
                </GhostButton>
              </div>
              <Pill $variant="pending"><FiTag style={{ marginRight: 4 }} />{item.category}</Pill>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.excerpt}
              </p>
              <CardFooter>
                <MetaLine><FiCalendar />{item.date} · {item.author}</MetaLine>
              </CardFooter>
            </ListCard>
          ))}
        </CardsGrid>
      )}
    </PageWrap>
  );
};

export default SavedAnalysis;
