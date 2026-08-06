import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FiPlus, FiEdit2, FiTrash2, FiVideo, FiCalendar, FiUser, FiUsers, FiDollarSign, FiCheck,
} from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, FilterCount, Pill, adminColors,
} from '../../../components/AdminPanel/adminUi';

type WebinarStatus = 'live' | 'upcoming' | 'recorded';

type Webinar = {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  status: WebinarStatus;
  premium: boolean;
  price: number;
  participants: number;
};

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
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
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0;
  }
  .val { font-size: 1.25rem; font-weight: 800; color: ${adminColors.navy}; letter-spacing: -0.02em; }
  .lbl { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: ${adminColors.muted}; }
`;

const Tabs = styled.div` display: flex; gap: 0.4rem; flex-wrap: wrap; flex: 1; `;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? adminColors.navy : adminColors.border)};
  background: ${({ $active }) =>
    $active ? `linear-gradient(135deg, ${adminColors.navy}, ${adminColors.navyLight})` : 'white'};
  color: ${({ $active }) => ($active ? 'white' : adminColors.navy)};
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(19, 46, 88, 0.2)' : 'none')};
  &:hover { border-color: ${adminColors.navy}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

const Thumb = styled.div`
  height: 120px;
  background:
    radial-gradient(ellipse 80% 120% at 100% 0%, rgba(251, 191, 36, 0.2) 0%, transparent 55%),
    linear-gradient(125deg, #0c1f3d 0%, ${adminColors.navy} 50%, ${adminColors.navyLight} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.9);
  font-size: 2rem;
  position: relative;
`;

const BadgeFloat = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: space-between;
  gap: 0.35rem;
  pointer-events: none;
`;

const Body = styled.div` padding: 0.95rem 1rem 0.65rem; flex: 1; `;

const Title = styled.h3`
  margin: 0 0 0.65rem;
  font-size: 0.975rem;
  font-weight: 800;
  color: ${adminColors.navy};
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
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
  input, select {
    padding: 0.55rem 0.7rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; font-weight: 400; outline: none; background: #fafbfc;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); background: white; }
  }
`;

const CheckRow = styled.label`
  display: flex; align-items: center; gap: 0.55rem; font-weight: 600; color: ${adminColors.navy};
  font-size: 0.8125rem; margin-bottom: 0.75rem; cursor: pointer;
  input { accent-color: ${adminColors.navy}; }
`;

const statusVariant = (s: WebinarStatus) => {
  if (s === 'live') return 'rejected';
  if (s === 'upcoming') return 'approved';
  return 'incomplete';
};

const WebinarsManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formInstructor, setFormInstructor] = useState('');
  const [formDate, setFormDate] = useState('2024-01-20');
  const [formTime, setFormTime] = useState('14:00');
  const [formStatus, setFormStatus] = useState<WebinarStatus>('upcoming');
  const [formPremium, setFormPremium] = useState(false);
  const [formPrice, setFormPrice] = useState('49');

  const [webinars, setWebinars] = useState<Webinar[]>([
    { id: '1', title: 'Advanced Forex Trading Strategies', instructor: 'John Smith', date: '2024-01-20', time: '14:00', status: 'upcoming', premium: false, price: 0, participants: 45 },
    { id: '2', title: 'Crypto Market Analysis Masterclass', instructor: 'Jane Doe', date: '2024-01-18', time: '16:00', status: 'live', premium: true, price: 49, participants: 120 },
    { id: '3', title: 'Risk Management Fundamentals', instructor: 'Mike Johnson', date: '2024-01-15', time: '10:00', status: 'recorded', premium: false, price: 0, participants: 89 },
  ]);

  const filtered = webinars.filter((w) => activeFilter === 'all' || w.status === activeFilter);

  const counts = useMemo(() => ({
    all: webinars.length,
    upcoming: webinars.filter((w) => w.status === 'upcoming').length,
    live: webinars.filter((w) => w.status === 'live').length,
    recorded: webinars.filter((w) => w.status === 'recorded').length,
    seats: webinars.reduce((s, w) => s + w.participants, 0),
  }), [webinars]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiVideo /> Webinars</PageTitle>
          <PageSubtitle>Schedule live sessions, manage recordings, and premium access</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={() => {
          setModalMode('add'); setSelectedWebinarId(null);
          setFormTitle(''); setFormInstructor(''); setFormDate('2024-01-20'); setFormTime('14:00');
          setFormStatus('upcoming'); setFormPremium(false); setFormPrice('49'); setIsModalOpen(true);
        }}>
          <FiPlus /> Create webinar
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><FiVideo /></div>
          <div><div className="val">{counts.all}</div><div className="lbl">Total</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#d1fae5', color: '#059669' }}><FiCalendar /></div>
          <div><div className="val">{counts.upcoming}</div><div className="lbl">Upcoming</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#fee2e2', color: '#dc2626' }}><FiVideo /></div>
          <div><div className="val">{counts.live}</div><div className="lbl">Live now</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiUsers /></div>
          <div><div className="val">{counts.seats}</div><div className="lbl">Attendees</div></div>
        </MiniStat>
      </StatsRow>

      <FilterBar>
        <Tabs>
          {(['all', 'upcoming', 'live', 'recorded'] as const).map((f) => (
            <Tab key={f} type="button" $active={activeFilter === f} onClick={() => setActiveFilter(f)}>
              {f === 'all' ? `All (${counts.all})` : `${f[0].toUpperCase()}${f.slice(1)} (${counts[f]})`}
            </Tab>
          ))}
        </Tabs>
        <FilterCount>{filtered.length} shown</FilterCount>
      </FilterBar>

      <Grid>
        {filtered.map((w) => (
          <Card key={w.id}>
            <Thumb>
              <FiVideo />
              <BadgeFloat>
                {w.premium ? <Pill $variant="admin">Premium</Pill> : <span />}
                <Pill $variant={statusVariant(w.status)}>
                  {w.status === 'live' ? 'LIVE' : w.status === 'upcoming' ? 'Upcoming' : 'Recorded'}
                </Pill>
              </BadgeFloat>
            </Thumb>
            <Body>
              <Title>{w.title}</Title>
              <Metrics>
                <Metric><div className="k"><FiUser /> Instructor</div><div className="v">{w.instructor}</div></Metric>
                <Metric><div className="k"><FiUsers /> Seats</div><div className="v">{w.participants}</div></Metric>
                <Metric><div className="k"><FiCalendar /> Date</div><div className="v">{w.date}</div></Metric>
                <Metric>
                  <div className="k"><FiDollarSign /> Price</div>
                  <div className="v">{w.premium ? `$${w.price}` : 'Free'}</div>
                </Metric>
              </Metrics>
            </Body>
            <Footer>
              <GhostButton $sm type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setModalMode('edit'); setSelectedWebinarId(w.id);
                setFormTitle(w.title); setFormInstructor(w.instructor); setFormDate(w.date);
                setFormTime(w.time); setFormStatus(w.status); setFormPremium(w.premium);
                setFormPrice(String(w.price || 0)); setIsModalOpen(true);
              }}>
                <FiEdit2 /> Edit
              </GhostButton>
              <GhostButton $sm $danger type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setModalMode('delete'); setSelectedWebinarId(w.id); setIsModalOpen(true);
              }}>
                <FiTrash2 /> Delete
              </GhostButton>
            </Footer>
          </Card>
        ))}
      </Grid>

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === 'add' ? 'Create Webinar' : modalMode === 'edit' ? 'Edit Webinar' : 'Delete Webinar'}
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <GhostButton type="button" $danger onClick={() => {
                if (!selectedWebinarId) return;
                setWebinars((p) => p.filter((x) => x.id !== selectedWebinarId));
                setIsModalOpen(false);
              }}><FiTrash2 /> Delete</GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <PrimaryButton type="button" onClick={() => {
                if (modalMode === 'add') {
                  setWebinars((p) => [{
                    id: String(Date.now()),
                    title: formTitle || 'New Webinar',
                    instructor: formInstructor || 'Instructor',
                    date: formDate, time: formTime, status: formStatus,
                    premium: formPremium, price: formPremium ? Number(formPrice) || 0 : 0, participants: 0,
                  }, ...p]);
                } else if (modalMode === 'edit' && selectedWebinarId) {
                  setWebinars((p) => p.map((w) => w.id === selectedWebinarId ? {
                    ...w, title: formTitle, instructor: formInstructor, date: formDate, time: formTime,
                    status: formStatus, premium: formPremium, price: formPremium ? Number(formPrice) || 0 : 0,
                  } : w));
                }
                setIsModalOpen(false);
              }}><FiCheck /> Save</PrimaryButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>Delete this webinar permanently?</div>
        ) : (
          <div>
            <FormField>Title<input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} /></FormField>
            <FormField>Instructor<input value={formInstructor} onChange={(e) => setFormInstructor(e.target.value)} /></FormField>
            <FormField>Status
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as WebinarStatus)}>
                <option value="upcoming">upcoming</option>
                <option value="live">live</option>
                <option value="recorded">recorded</option>
              </select>
            </FormField>
            <CheckRow>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              Premium
            </CheckRow>
            <FormField>Price<input value={formPrice} onChange={(e) => setFormPrice(e.target.value)} /></FormField>
          </div>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default WebinarsManagement;
