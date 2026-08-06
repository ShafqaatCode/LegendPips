import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUsers, FiAward, FiCheck,
} from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, FilterCount, Pill, adminColors,
} from '../../../components/AdminPanel/adminUi';

type ContestStatus = 'Upcoming' | 'Ongoing' | 'Ended';

type Contest = {
  id: string;
  title: string;
  type: string;
  status: ContestStatus;
  participants: number;
  entry: string;
  startDate: string;
  endDate: string;
  prize: string;
};

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
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
    width: 40px;
    height: 40px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    flex-shrink: 0;
  }
  .val {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .lbl {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${adminColors.muted};
    margin-top: 0.1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  flex: 1;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? adminColors.navy : adminColors.border)};
  background: ${({ $active }) =>
    $active
      ? `linear-gradient(135deg, ${adminColors.navy}, ${adminColors.navyLight})`
      : 'white'};
  color: ${({ $active }) => ($active ? 'white' : adminColors.navy)};
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(19, 46, 88, 0.2)' : 'none')};
  transition: all 0.15s;

  &:hover {
    border-color: ${adminColors.navy};
    background: ${({ $active }) => ($active ? undefined : '#f8fafc')};
  }
`;

const ContestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.9rem;
`;

const ContestCard = styled.article`
  background: white;
  border-radius: 16px;
  border: 1px solid ${adminColors.border};
  box-shadow: ${adminColors.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${adminColors.shadowHover};
    border-color: rgba(251, 191, 36, 0.45);
  }
`;

const CardTop = styled.div`
  padding: 1rem 1rem 0.85rem;
  background:
    radial-gradient(ellipse 80% 100% at 100% 0%, rgba(251, 191, 36, 0.12) 0%, transparent 55%),
    linear-gradient(180deg, #f8fafc 0%, white 100%);
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
`;

const IconMark = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  flex-shrink: 0;
  background: linear-gradient(145deg, ${adminColors.gold}, #f59e0b);
  color: ${adminColors.navy};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  box-shadow: 0 4px 14px rgba(251, 191, 36, 0.35);
`;

const CardTitle = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.02em;
    line-height: 1.25;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const CardBody = styled.div`
  padding: 0.85rem 1rem;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
`;

const Metric = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 0.5rem 0.6rem;

  .k {
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${adminColors.muted};
    margin-bottom: 0.15rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    svg { color: ${adminColors.gold}; font-size: 0.75rem; }
  }
  .v {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${adminColors.navy};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CardFooter = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.45rem;
  background: #fafbfc;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border: 1px dashed ${adminColors.border};
  border-radius: 16px;
  color: ${adminColors.muted};

  strong {
    display: block;
    color: ${adminColors.navy};
    font-size: 1rem;
    margin-bottom: 0.35rem;
  }
`;

const FormField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${adminColors.navy};
  margin-bottom: 0.75rem;

  input, select {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border-radius: 9px;
    border: 1px solid ${adminColors.border};
    font-size: 0.8125rem;
    font-weight: 400;
    box-sizing: border-box;
    outline: none;
    background: #fafbfc;
    transition: border-color 0.12s, box-shadow 0.12s;

    &:focus {
      border-color: ${adminColors.navy};
      box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08);
      background: white;
    }
  }
`;

const statusPill = (status: ContestStatus) => {
  if (status === 'Ongoing') return 'approved';
  if (status === 'Upcoming') return 'pending';
  return 'incomplete';
};

const ContestsManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const [contests, setContests] = useState<Contest[]>([
    {
      id: '1',
      title: 'Forex Trading Championship',
      type: 'Monthly',
      status: 'Ongoing',
      participants: 1250,
      entry: 'Free',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      prize: '$50,000',
    },
    {
      id: '2',
      title: 'Crypto Master Challenge',
      type: 'Weekly',
      status: 'Ongoing',
      participants: 890,
      entry: 'Free',
      startDate: '2024-01-15',
      endDate: '2024-02-20',
      prize: '$25,000',
    },
    {
      id: '3',
      title: 'Gold Rush Competition',
      type: 'Special',
      status: 'Upcoming',
      participants: 0,
      entry: 'Free',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      prize: '$15,000',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Monthly');
  const [formStatus, setFormStatus] = useState<ContestStatus>('Upcoming');

  const filteredContests = contests.filter((contest) => {
    if (activeFilter === 'all') return true;
    return contest.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const counts = useMemo(() => ({
    all: contests.length,
    ongoing: contests.filter((c) => c.status === 'Ongoing').length,
    upcoming: contests.filter((c) => c.status === 'Upcoming').length,
    ended: contests.filter((c) => c.status === 'Ended').length,
    participants: contests.reduce((s, c) => s + c.participants, 0),
  }), [contests]);

  const openAdd = () => {
    setModalMode('add');
    setSelectedContestId(null);
    setFormTitle('');
    setFormType('Monthly');
    setFormStatus('Upcoming');
    setIsModalOpen(true);
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiAward /> Contests</PageTitle>
          <PageSubtitle>Create and manage trading competitions, prizes, and participant status</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> Create contest
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiAward /></div>
          <div>
            <div className="val">{counts.all}</div>
            <div className="lbl">Total contests</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#d1fae5', color: '#059669' }}><FiAward /></div>
          <div>
            <div className="val">{counts.ongoing}</div>
            <div className="lbl">Ongoing</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiCalendar /></div>
          <div>
            <div className="val">{counts.upcoming}</div>
            <div className="lbl">Upcoming</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><FiUsers /></div>
          <div>
            <div className="val">{counts.participants.toLocaleString()}</div>
            <div className="lbl">Participants</div>
          </div>
        </MiniStat>
      </StatsRow>

      <FilterBar>
        <Tabs>
          <Tab type="button" $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
            All ({counts.all})
          </Tab>
          <Tab type="button" $active={activeFilter === 'ongoing'} onClick={() => setActiveFilter('ongoing')}>
            Ongoing ({counts.ongoing})
          </Tab>
          <Tab type="button" $active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')}>
            Upcoming ({counts.upcoming})
          </Tab>
          <Tab type="button" $active={activeFilter === 'ended'} onClick={() => setActiveFilter('ended')}>
            Ended ({counts.ended})
          </Tab>
        </Tabs>
        <FilterCount>{filteredContests.length} shown</FilterCount>
      </FilterBar>

      <ContestsGrid>
        {filteredContests.length === 0 ? (
          <EmptyState>
            <strong>No contests in this filter</strong>
            Create a contest or switch tabs to see others.
          </EmptyState>
        ) : (
          filteredContests.map((contest) => (
            <ContestCard key={contest.id}>
              <CardTop>
                <IconMark><FiAward /></IconMark>
                <CardTitle>
                  <h3>{contest.title}</h3>
                  <BadgeRow>
                    <Pill $variant={statusPill(contest.status)}>{contest.status}</Pill>
                    <Pill $variant="user">{contest.type}</Pill>
                    <Pill $variant="admin">{contest.entry}</Pill>
                  </BadgeRow>
                </CardTitle>
              </CardTop>

              <CardBody>
                <Metric>
                  <div className="k"><FiUsers /> Participants</div>
                  <div className="v">{contest.participants.toLocaleString()}</div>
                </Metric>
                <Metric>
                  <div className="k"><FiAward /> Prize pool</div>
                  <div className="v">{contest.prize}</div>
                </Metric>
                <Metric>
                  <div className="k"><FiCalendar /> Starts</div>
                  <div className="v">{contest.startDate}</div>
                </Metric>
                <Metric>
                  <div className="k"><FiCalendar /> Ends</div>
                  <div className="v">{contest.endDate}</div>
                </Metric>
              </CardBody>

              <CardFooter>
                <GhostButton
                  $sm
                  type="button"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setModalMode('edit');
                    setSelectedContestId(contest.id);
                    setFormTitle(contest.title);
                    setFormType(contest.type);
                    setFormStatus(contest.status);
                    setIsModalOpen(true);
                  }}
                >
                  <FiEdit2 /> Edit
                </GhostButton>
                <GhostButton
                  $sm
                  $danger
                  type="button"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setModalMode('delete');
                    setSelectedContestId(contest.id);
                    setIsModalOpen(true);
                  }}
                >
                  <FiTrash2 /> Delete
                </GhostButton>
              </CardFooter>
            </ContestCard>
          ))
        )}
      </ContestsGrid>

      <SimpleModal
        isOpen={isModalOpen}
        title={
          modalMode === 'add'
            ? 'Create Contest'
            : modalMode === 'edit'
              ? 'Edit Contest'
              : 'Delete Contest'
        }
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <GhostButton
                type="button"
                $danger
                onClick={() => {
                  if (!selectedContestId) return;
                  setContests((prev) => prev.filter((c) => c.id !== selectedContestId));
                  setIsModalOpen(false);
                }}
              >
                <FiTrash2 /> Delete
              </GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <PrimaryButton
                type="button"
                onClick={() => {
                  const title = formTitle.trim();
                  if (!title) return;

                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setContests((prev) => [
                      {
                        id,
                        title,
                        type: formType,
                        status: formStatus,
                        participants: 0,
                        entry: 'Free',
                        startDate: new Date().toISOString().slice(0, 10),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
                          .toISOString()
                          .slice(0, 10),
                        prize: '$10,000',
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedContestId) {
                    setContests((prev) =>
                      prev.map((c) =>
                        c.id === selectedContestId
                          ? { ...c, title, type: formType, status: formStatus }
                          : c
                      )
                    );
                  }

                  setIsModalOpen(false);
                }}
              >
                <FiCheck /> Save contest
              </PrimaryButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: adminColors.muted, fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to permanently delete this contest?
          </div>
        ) : (
          <div>
            <FormField>
              Contest Title
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Spring Trading Cup" />
            </FormField>
            <FormField>
              Type
              <input value={formType} onChange={(e) => setFormType(e.target.value)} placeholder="Monthly, Weekly…" />
            </FormField>
            <FormField>
              Status
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as ContestStatus)}>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Ended">Ended</option>
              </select>
            </FormField>
          </div>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default ContestsManagement;
