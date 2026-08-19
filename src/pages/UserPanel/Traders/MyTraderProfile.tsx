import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiSave, FiSend, FiUser } from 'react-icons/fi';
import { getMyKyc } from '../../../services/kycService';
import {
  fetchMyTraderProfile, saveMyTraderProfile, submitMyTraderProfile, type TraderMarket, type TraderProfile,
} from '../../../services/traderService';
import { findContentSafetyIssue } from '../../../utils/contentSafety';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle, HintBar, ErrorBanner,
  SectionCard, SectionHead, SectionBody, FormGrid, Field, PrimaryButton, GhostButton, Pill,
} from '../../../components/UserPanel/userUi';

const MARKETS: TraderMarket[] = ['forex', 'crypto', 'indices', 'commodities'];

const MyTraderProfile: React.FC = () => {
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [kyc, setKyc] = useState<string>('incomplete');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [strategy, setStrategy] = useState('');
  const [markets, setMarkets] = useState<TraderMarket[]>([]);
  const [roiPercent, setRoi] = useState('');
  const [winRatePercent, setWin] = useState('');
  const [maxDrawdownPercent, setDd] = useState('');
  const [monthsActive, setMonths] = useState('');
  const [proofUrl, setProof] = useState('');
  const [copyEnabled, setCopyEnabled] = useState(false);
  const [copyFeePercent, setFee] = useState('');
  const [minCopyUsd, setMin] = useState('');
  const [maxCopiers, setMax] = useState('');
  const [copyTerms, setTerms] = useState('');

  const apply = (p: TraderProfile | null) => {
    setProfile(p);
    if (!p) return;
    setDisplayName(p.displayName || '');
    setBio(p.bio || '');
    setStrategy(p.strategy || '');
    setMarkets(p.markets || []);
    setRoi(p.roiPercent != null ? String(p.roiPercent) : '');
    setWin(p.winRatePercent != null ? String(p.winRatePercent) : '');
    setDd(p.maxDrawdownPercent != null ? String(p.maxDrawdownPercent) : '');
    setMonths(p.monthsActive != null ? String(p.monthsActive) : '');
    setProof(p.proofUrl || '');
    setCopyEnabled(!!p.copyEnabled);
    setFee(p.copyFeePercent != null ? String(p.copyFeePercent) : '');
    setMin(p.minCopyUsd != null ? String(p.minCopyUsd) : '');
    setMax(p.maxCopiers != null ? String(p.maxCopiers) : '');
    setTerms(p.copyTerms || '');
  };

  const load = useCallback(async () => {
    try {
      const [p, k] = await Promise.all([fetchMyTraderProfile(), getMyKyc().catch(() => null)]);
      apply(p);
      setKyc(k?.kycStatus || 'incomplete');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const body = () => ({
    displayName,
    bio,
    strategy,
    markets,
    roiPercent: roiPercent === '' ? undefined : Number(roiPercent),
    winRatePercent: winRatePercent === '' ? undefined : Number(winRatePercent),
    maxDrawdownPercent: maxDrawdownPercent === '' ? undefined : Number(maxDrawdownPercent),
    monthsActive: monthsActive === '' ? undefined : Number(monthsActive),
    proofUrl,
    copyEnabled,
    copyFeePercent: copyFeePercent === '' ? undefined : Number(copyFeePercent),
    minCopyUsd: minCopyUsd === '' ? undefined : Number(minCopyUsd),
    maxCopiers: maxCopiers === '' ? undefined : Number(maxCopiers),
    copyTerms,
  });

  const onSave = async () => {
    setError(null); setOk(null);
    const safety = findContentSafetyIssue(`${displayName}\n${bio}\n${strategy}\n${copyTerms}`);
    if (safety) { setError(safety); return; }
    setSaving(true);
    try {
      apply(await saveMyTraderProfile(body()));
      setOk('Profile saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const onSubmit = async () => {
    setError(null); setOk(null);
    setSaving(true);
    try {
      apply(await saveMyTraderProfile(body()));
      apply(await submitMyTraderProfile());
      setOk('Submitted for verification.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submit failed');
    } finally { setSaving(false); }
  };

  const toggleMarket = (m: TraderMarket) => {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiUser /> Trader profile</PageTitle>
        <PageSubtitle>Publish verified performance. Changing ROI / win rate / drawdown after verification sends you back to review.</PageSubtitle>
      </PageHeader>
      <HintBar>
        Complete <Link to="/user-panel/verification">identity verification</Link> before requesting a verified badge.
        Stats are self-reported — LegendPips does not sync MT4/MT5.
      </HintBar>
      {profile?.verificationStatus && (
        <p style={{ marginTop: 0 }}>
          Status: <Pill $variant={profile.verificationStatus === 'verified' ? 'approved' : profile.verificationStatus}>{profile.verificationStatus}</Pill>
          {profile.adminNote ? ` · ${profile.adminNote}` : ''}
        </p>
      )}
      {kyc !== 'approved' && <HintBar>KYC status: {kyc}. Verification requires an approved identity check.</HintBar>}
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {ok && <HintBar>{ok}</HintBar>}

      <SectionCard>
        <SectionHead>Public profile</SectionHead>
        <SectionBody>
          <FormGrid>
            <Field>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></Field>
            <Field>Strategy<input value={strategy} onChange={(e) => setStrategy(e.target.value)} placeholder="Swing, ICT, scalping…" /></Field>
            <Field className="full">Bio<textarea value={bio} onChange={(e) => setBio(e.target.value)} /></Field>
            <Field className="full">
              Markets
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MARKETS.map((m) => (
                  <GhostButton $sm key={m} type="button" onClick={() => toggleMarket(m)} style={markets.includes(m) ? { background: '#132E58', color: '#fff' } : undefined}>
                    {m}
                  </GhostButton>
                ))}
              </div>
            </Field>
            <Field>ROI %<input value={roiPercent} onChange={(e) => setRoi(e.target.value)} /></Field>
            <Field>Win rate %<input value={winRatePercent} onChange={(e) => setWin(e.target.value)} /></Field>
            <Field>Max drawdown %<input value={maxDrawdownPercent} onChange={(e) => setDd(e.target.value)} /></Field>
            <Field>Months active<input value={monthsActive} onChange={(e) => setMonths(e.target.value)} /></Field>
            <Field className="full">Proof URL (MyFxBook, FXBlue, etc.)<input value={proofUrl} onChange={(e) => setProof(e.target.value)} placeholder="https://" /></Field>
          </FormGrid>
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead>Copy trading offer</SectionHead>
        <SectionBody>
          <Field>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={copyEnabled} onChange={(e) => setCopyEnabled(e.target.checked)} />
              Accept copy requests (only after you are verified)
            </span>
          </Field>
          <FormGrid>
            <Field>Performance fee %<input value={copyFeePercent} onChange={(e) => setFee(e.target.value)} /></Field>
            <Field>Min allocation USD<input value={minCopyUsd} onChange={(e) => setMin(e.target.value)} /></Field>
            <Field>Max copiers<input value={maxCopiers} onChange={(e) => setMax(e.target.value)} /></Field>
            <Field className="full">Copy terms<textarea value={copyTerms} onChange={(e) => setTerms(e.target.value)} placeholder="How you will share signals / allocation instructions" /></Field>
          </FormGrid>
        </SectionBody>
      </SectionCard>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <PrimaryButton type="button" onClick={onSave} disabled={saving}><FiSave /> Save draft</PrimaryButton>
        <PrimaryButton type="button" onClick={onSubmit} disabled={saving}><FiSend /> Submit for verification</PrimaryButton>
        {profile?.verificationStatus === 'verified' && (
          <GhostButton $sm type="button" onClick={() => { window.location.href = `/traders/${profile.id}`; }}>
            <FiCheckCircle /> View public page
          </GhostButton>
        )}
      </div>
    </PageWrap>
  );
};

export default MyTraderProfile;
