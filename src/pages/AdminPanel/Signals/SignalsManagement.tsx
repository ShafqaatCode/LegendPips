import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown, FiCheck } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  fetchAdminSignals,
  createAdminSignal,
  updateAdminSignal,
  deleteAdminSignal,
  fetchAdminTradingPairs,
  createAdminTradingPair,
  deleteAdminTradingPair,
  type TradingPairOption,
} from '../../../services/signalService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterCount, ErrorBanner,
  TableCard, DataTable, Th, Td, Tr, Pill, IconBtn, ActionGroup, adminColors,
} from '../../../components/AdminPanel/adminUi';

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
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
  }
  .val { font-size: 1.25rem; font-weight: 800; color: ${adminColors.navy}; }
  .lbl { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: ${adminColors.muted}; }
`;

const PairBadge = styled.span`
  display: inline-flex;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.75rem;
  background: linear-gradient(135deg, ${adminColors.navy}, ${adminColors.navyLight});
  color: white;
`;

const DirBadge = styled.span<{ $buy?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.6875rem;
  background: ${({ $buy }) => ($buy ? '#ecfdf5' : '#fef2f2')};
  color: ${({ $buy }) => ($buy ? '#059669' : '#dc2626')};
`;

const FormField = styled.label`
  display: flex; flex-direction: column; gap: 0.35rem;
  font-size: 0.6875rem; font-weight: 700; color: ${adminColors.navy}; margin-bottom: 0.7rem;
  input, select {
    width: 100%; padding: 0.55rem 0.7rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; outline: none; background: #fafbfc; box-sizing: border-box;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); background: white; }
  }
`;

const CheckRow = styled.label`
  display: flex; align-items: center; gap: 0.55rem; font-weight: 600; color: ${adminColors.navy};
  font-size: 0.8125rem; margin-bottom: 0.7rem; cursor: pointer;
  padding: 0.5rem 0.65rem; border-radius: 9px; background: #f8fafc; border: 1px solid #f1f5f9;
  input { accent-color: ${adminColors.navy}; }
`;

const PairCatalogBox = styled.div`
  margin: -0.15rem 0 0.85rem;
  padding: 0.65rem 0.7rem;
  border-radius: 10px;
  border: 1px dashed ${adminColors.border};
  background: #f8fafc;
`;

const PairCatalogRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.2fr auto;
  gap: 0.45rem;
  align-items: end;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
  input {
    width: 100%; padding: 0.5rem 0.65rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; outline: none; background: white; box-sizing: border-box;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); }
  }
  label {
    display: flex; flex-direction: column; gap: 0.3rem;
    font-size: 0.625rem; font-weight: 700; color: ${adminColors.muted}; text-transform: uppercase; letter-spacing: 0.03em;
  }
`;

const PairActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.55rem;
`;

const statusPill = (s: string) => {
  if (s === 'active' || s === 'open') return 'approved';
  if (s === 'pending') return 'pending';
  return 'incomplete';
};

const SignalsManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  const [formPair, setFormPair] = useState('');
  const [formType, setFormType] = useState<'buy' | 'sell'>('buy');
  const [formEntry, setFormEntry] = useState('1.0850');
  const [formTp, setFormTp] = useState('1.0900');
  const [formSl, setFormSl] = useState('1.0820');
  const [formStatus, setFormStatus] = useState<'active' | 'closed' | 'pending'>('active');
  const [formPremium, setFormPremium] = useState(false);
  const [formAssetClass, setFormAssetClass] = useState<'forex' | 'crypto' | 'commodities' | 'other'>('forex');
  const [pairOptions, setPairOptions] = useState<TradingPairOption[]>([]);
  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsError, setPairsError] = useState<string | null>(null);
  const [newPairSymbol, setNewPairSymbol] = useState('');
  const [newPairLabel, setNewPairLabel] = useState('');
  const [pairBusy, setPairBusy] = useState(false);

  type SignalRow = {
    id: string;
    pair: string;
    type: 'buy' | 'sell';
    entry: string;
    tp: string;
    sl: string;
    status: 'active' | 'closed' | 'pending';
    premium: boolean;
    createdAt: string;
    assetClass: 'forex' | 'crypto' | 'commodities' | 'other';
  };

  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await fetchAdminSignals(1, 100);
      setSignals(
        data.items.map((s) => ({
          id: s.id,
          pair: s.pair,
          type: s.direction,
          entry: s.entry,
          tp: s.tp,
          sl: s.sl,
          status: s.status,
          premium: s.premium,
          createdAt: s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : '',
          assetClass: (['forex', 'crypto', 'commodities', 'other'].includes(String(s.assetClass))
            ? s.assetClass
            : 'forex') as SignalRow['assetClass'],
        }))
      );
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load signals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const loadPairs = useCallback(async (assetClass: string) => {
    try {
      setPairsLoading(true);
      setPairsError(null);
      const items = await fetchAdminTradingPairs(assetClass);
      setPairOptions(items);
      return items;
    } catch (e) {
      setPairOptions([]);
      setPairsError(e instanceof Error ? e.message : 'Failed to load pairs');
      return [] as TradingPairOption[];
    } finally {
      setPairsLoading(false);
    }
  }, []);

  const openCreate = async () => {
    setModalMode('add');
    setSelectedSignalId(null);
    setFormType('buy');
    setFormEntry('1.0850');
    setFormTp('1.0900');
    setFormSl('1.0820');
    setFormStatus('active');
    setFormPremium(false);
    setFormAssetClass('forex');
    setNewPairSymbol('');
    setNewPairLabel('');
    setIsModalOpen(true);
    const items = await loadPairs('forex');
    setFormPair(items[0]?.symbol || '');
  };

  const filteredPairs = useMemo(
    () => pairOptions.filter((p) => p.assetClass === formAssetClass),
    [pairOptions, formAssetClass]
  );

  const selectedPair = useMemo(
    () => filteredPairs.find((p) => p.symbol === formPair) || null,
    [filteredPairs, formPair]
  );

  const handleAddPairToCatalog = async () => {
    const symbol = newPairSymbol.trim();
    if (!symbol) {
      alert('Enter a pair symbol, e.g. EUR/USD');
      return;
    }
    try {
      setPairBusy(true);
      setPairsError(null);
      const created = await createAdminTradingPair({
        symbol,
        label: newPairLabel.trim() || undefined,
        assetClass: formAssetClass,
      });
      const items = await loadPairs(formAssetClass);
      setFormPair(created.symbol);
      if (!items.some((p) => p.symbol === created.symbol)) {
        setPairOptions((prev) =>
          prev.some((p) => p.symbol === created.symbol) ? prev : [...prev, created]
        );
      }
      setNewPairSymbol('');
      setNewPairLabel('');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to add pair');
    } finally {
      setPairBusy(false);
    }
  };

  const handleDeleteSelectedPair = async () => {
    if (!selectedPair) {
      alert('Select a pair to delete.');
      return;
    }
    if (!window.confirm(`Remove ${selectedPair.symbol} from the catalog?`)) return;
    try {
      setPairBusy(true);
      setPairsError(null);
      await deleteAdminTradingPair(selectedPair.id);
      const items = await loadPairs(formAssetClass);
      setFormPair(items[0]?.symbol || '');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete pair');
    } finally {
      setPairBusy(false);
    }
  };

  const stats = useMemo(() => ({
    total: signals.length,
    active: signals.filter((s) => s.status === 'active').length,
    buy: signals.filter((s) => s.type === 'buy').length,
    premium: signals.filter((s) => s.premium).length,
  }), [signals]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiTrendingUp /> Signals</PageTitle>
          <PageSubtitle>Publish trading setups, TP/SL levels, and premium access control</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={() => { void openCreate(); }}>
          <FiPlus /> Create signal
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiTrendingUp /></div>
          <div><div className="val">{loading ? '…' : stats.total}</div><div className="lbl">Total</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#d1fae5', color: '#059669' }}><FiCheck /></div>
          <div><div className="val">{loading ? '…' : stats.active}</div><div className="lbl">Active</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#ecfdf5', color: '#059669' }}><FiTrendingUp /></div>
          <div><div className="val">{loading ? '…' : stats.buy}</div><div className="lbl">Buy</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiTrendingUp /></div>
          <div><div className="val">{loading ? '…' : stats.premium}</div><div className="lbl">Premium</div></div>
        </MiniStat>
      </StatsRow>

      {loadError && <ErrorBanner>{loadError}</ErrorBanner>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <FilterCount>{loading ? 'Loading…' : `${signals.length} signals`}</FilterCount>
      </div>

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>Asset</Th>
              <Th>Pair</Th>
              <Th>Type</Th>
              <Th>Entry / TP / SL</Th>
              <Th>Status</Th>
              <Th>Access</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && signals.length === 0 ? <TableBodySkeleton rows={6} cols={8} /> : null}
            {!loading && signals.length === 0 ? (
              <Tr><Td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>No signals yet. Create one to publish on the site.</Td></Tr>
            ) : null}
            {signals.map((signal) => (
              <Tr key={signal.id}>
                <Td style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.8125rem' }}>{signal.assetClass}</Td>
                <Td><PairBadge>{signal.pair}</PairBadge></Td>
                <Td>
                  <DirBadge $buy={signal.type === 'buy'}>
                    {signal.type === 'buy' ? <FiTrendingUp /> : <FiTrendingDown />}
                    {signal.type.toUpperCase()}
                  </DirBadge>
                </Td>
                <Td>
                  <div style={{ fontSize: '0.75rem', lineHeight: 1.45, color: adminColors.muted }}>
                    <div>Entry <strong style={{ color: adminColors.navy }}>{signal.entry}</strong></div>
                    <div>TP <strong style={{ color: '#059669' }}>{signal.tp}</strong></div>
                    <div>SL <strong style={{ color: '#dc2626' }}>{signal.sl}</strong></div>
                  </div>
                </Td>
                <Td><Pill $variant={statusPill(signal.status)}>{signal.status}</Pill></Td>
                <Td>
                  <Pill $variant={signal.premium ? 'admin' : 'approved'}>
                    {signal.premium ? 'Premium' : 'Free'}
                  </Pill>
                </Td>
                <Td style={{ fontSize: '0.75rem', color: adminColors.muted }}>{signal.createdAt}</Td>
                <Td>
                  <ActionGroup>
                    <IconBtn title="Edit" type="button" onClick={() => {
                      setModalMode('edit'); setSelectedSignalId(signal.id);
                      setFormPair(signal.pair); setFormType(signal.type);
                      setFormEntry(signal.entry); setFormTp(signal.tp); setFormSl(signal.sl);
                      setFormStatus(signal.status); setFormPremium(!!signal.premium);
                      setFormAssetClass(signal.assetClass); setIsModalOpen(true);
                      void loadPairs(signal.assetClass).then((items) => {
                        if (!items.some((p) => p.symbol === signal.pair)) {
                          // Keep current pair visible even if catalog filter is empty
                          setPairOptions((prev) =>
                            prev.some((p) => p.symbol === signal.pair)
                              ? prev
                              : [
                                  ...prev,
                                  {
                                    id: `legacy-${signal.pair}`,
                                    symbol: signal.pair,
                                    label: signal.pair,
                                    assetClass: signal.assetClass,
                                    active: true,
                                    sortOrder: 0,
                                  },
                                ]
                          );
                        }
                      });
                    }}><FiEdit2 /></IconBtn>
                    <IconBtn $danger title="Delete" type="button" onClick={() => {
                      setModalMode('delete'); setSelectedSignalId(signal.id); setIsModalOpen(true);
                    }}><FiTrash2 /></IconBtn>
                  </ActionGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </DataTable>
      </TableCard>

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === 'add' ? 'Create Signal' : modalMode === 'edit' ? 'Edit Signal' : 'Delete Signal'}
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <GhostButton $danger type="button" onClick={async () => {
                if (!selectedSignalId) return;
                try {
                  await deleteAdminSignal(selectedSignalId);
                  setIsModalOpen(false);
                  await refresh();
                } catch (e) {
                  alert(e instanceof Error ? e.message : 'Delete failed');
                }
              }}><FiTrash2 /> Delete</GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
              <PrimaryButton type="button" onClick={async () => {
                try {
                  if (!formPair) {
                    alert('Please select a pair from the list.');
                    return;
                  }
                  if (modalMode === 'add') {
                    await createAdminSignal({
                      pair: formPair, type: formType, entry: formEntry, tp: formTp, sl: formSl,
                      status: formStatus, premium: formPremium, assetClass: formAssetClass,
                    });
                  } else if (modalMode === 'edit' && selectedSignalId) {
                    await updateAdminSignal(selectedSignalId, {
                      pair: formPair, type: formType, entry: formEntry, tp: formTp, sl: formSl,
                      status: formStatus, premium: formPremium, assetClass: formAssetClass,
                    });
                  }
                  setIsModalOpen(false);
                  await refresh();
                } catch (e) {
                  alert(e instanceof Error ? e.message : 'Save failed');
                }
              }}><FiCheck /> Save</PrimaryButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>Delete this signal permanently?</div>
        ) : (
          <div>
            <FormField>Market
              <select
                value={formAssetClass}
                onChange={(e) => {
                  const next = e.target.value as typeof formAssetClass;
                  setFormAssetClass(next);
                  void loadPairs(next).then((items) => {
                    setFormPair((current) =>
                      items.some((p) => p.symbol === current) ? current : items[0]?.symbol || ''
                    );
                  });
                }}
              >
                <option value="forex">Forex</option>
                <option value="crypto">Crypto</option>
                <option value="commodities">Commodities</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField>
              Pair
              <select
                value={formPair}
                disabled={pairsLoading || filteredPairs.length === 0}
                onChange={(e) => setFormPair(e.target.value)}
              >
                {pairsLoading && <option value="">Loading pairs…</option>}
                {!pairsLoading && filteredPairs.length === 0 && (
                  <option value="">No pairs in catalog for this market</option>
                )}
                {filteredPairs.map((p) => (
                  <option key={p.id} value={p.symbol}>
                    {p.symbol}{p.label && p.label !== p.symbol ? ` — ${p.label}` : ''}
                  </option>
                ))}
              </select>
            </FormField>
            <PairCatalogBox>
              <PairCatalogRow>
                <label>
                  New symbol
                  <input
                    value={newPairSymbol}
                    placeholder="e.g. EUR/USD"
                    disabled={pairBusy}
                    onChange={(e) => setNewPairSymbol(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handleAddPairToCatalog();
                      }
                    }}
                  />
                </label>
                <label>
                  Label (optional)
                  <input
                    value={newPairLabel}
                    placeholder="Euro / US Dollar"
                    disabled={pairBusy}
                    onChange={(e) => setNewPairLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handleAddPairToCatalog();
                      }
                    }}
                  />
                </label>
                <PrimaryButton
                  type="button"
                  disabled={pairBusy || !newPairSymbol.trim()}
                  onClick={() => void handleAddPairToCatalog()}
                  style={{ height: 36, whiteSpace: 'nowrap' }}
                >
                  <FiPlus /> Add pair
                </PrimaryButton>
              </PairCatalogRow>
              <PairActionRow>
                <GhostButton
                  $danger
                  type="button"
                  disabled={pairBusy || !selectedPair}
                  onClick={() => void handleDeleteSelectedPair()}
                >
                  <FiTrash2 /> Delete selected pair
                </GhostButton>
              </PairActionRow>
            </PairCatalogBox>
            {pairsError && (
              <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{pairsError}</div>
            )}
            <FormField>Type
              <select value={formType} onChange={(e) => setFormType(e.target.value as 'buy' | 'sell')}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </FormField>
            <FormField>Entry<input value={formEntry} onChange={(e) => setFormEntry(e.target.value)} /></FormField>
            <FormField>TP<input value={formTp} onChange={(e) => setFormTp(e.target.value)} /></FormField>
            <FormField>SL<input value={formSl} onChange={(e) => setFormSl(e.target.value)} /></FormField>
            <FormField>Status
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as typeof formStatus)}>
                <option value="active">active</option>
                <option value="closed">closed</option>
                <option value="pending">pending</option>
              </select>
            </FormField>
            <CheckRow>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              Premium
            </CheckRow>
          </div>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default SignalsManagement;
