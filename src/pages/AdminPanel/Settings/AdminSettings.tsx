import React, { useCallback, useEffect, useState } from 'react';
import {
  FiSettings, FiGlobe, FiImage, FiMenu, FiShield, FiSearch,
  FiUsers, FiMessageSquare, FiSave, FiPlus, FiEdit2, FiTrash2,
  FiChevronUp, FiChevronDown, FiUpload,
} from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton,
} from '../../../components/AdminPanel/adminUi';
import {
  fetchAdminPlatformSettings, saveAdminPlatformSettings,
  uploadSiteLogo, removeSiteLogo, uploadOgImage,
  type PlatformSettings,
} from '../../../services/platformSettingsService';
import type { NavItem } from '../../../services/siteConfigService';
import {
  fetchAdminTeamMembers, createTeamMember, updateTeamMember,
  deleteTeamMember, reorderTeamMembers,
} from '../../../services/teamMemberService';
import type { TeamMember, ClientReview } from '../../../services/siteConfigService';
import {
  fetchAdminClientReviews, createClientReview, updateClientReview,
  deleteClientReview, reorderClientReviews,
} from '../../../services/clientReviewService';
import {
  SettingsShell, SettingsNav, SettingsNavBtn, SettingsPanel, PanelHead, PanelBody,
  FieldGrid, Field, ToggleRow, LogoPreview, NavItemRow, MemberCard, ReviewCard,
  ModalOverlay, ModalBox, StatusMsg, SectionTabs,
} from './settingsUi';

type Tab = 'overview' | 'branding' | 'navigation' | 'registration' | 'seo' | 'team' | 'reviews';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <FiGlobe /> },
  { id: 'branding', label: 'Branding', icon: <FiImage /> },
  { id: 'navigation', label: 'Navigation', icon: <FiMenu /> },
  { id: 'registration', label: 'Registration', icon: <FiShield /> },
  { id: 'seo', label: 'SEO', icon: <FiSearch /> },
  { id: 'team', label: 'Team Members', icon: <FiUsers /> },
  { id: 'reviews', label: 'Client Reviews', icon: <FiMessageSquare /> },
];

const AdminSettings: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [navSection, setNavSection] = useState<'main' | 'tools'>('main');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [memberModal, setMemberModal] = useState<TeamMember | 'new' | null>(null);
  const [reviewModal, setReviewModal] = useState<ClientReview | 'new' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t, r] = await Promise.all([
        fetchAdminPlatformSettings(),
        fetchAdminTeamMembers(),
        fetchAdminClientReviews(),
      ]);
      setSettings(s);
      setTeam(t);
      setReviews(r);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (ok: string) => { setMsg(ok); setErr(''); setTimeout(() => setMsg(''), 3000); };
  const flashErr = (e: string) => { setErr(e); setMsg(''); };

  const persistSettings = async (patch: Partial<PlatformSettings>) => {
    if (!settings) return;
    setSaving(true);
    try {
      const next = await saveAdminPlatformSettings(patch);
      setSettings(next);
      flash('Settings saved.');
    } catch (e: unknown) {
      flashErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const navForSection = (section: 'main' | 'tools') =>
    (settings?.navItems || [])
      .filter((n) => n.section === section)
      .sort((a, b) => a.order - b.order);

  const moveNavItem = (section: 'main' | 'tools', index: number, dir: -1 | 1) => {
    if (!settings) return;
    const items = navForSection(section);
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const swapped = [...items];
    [swapped[index], swapped[target]] = [swapped[target], swapped[index]];
    const reordered = swapped.map((n, i) => ({ ...n, order: i }));
    const other = settings.navItems.filter((n) => n.section !== section);
    setSettings({ ...settings, navItems: [...other, ...reordered] });
  };

  const updateNavItem = (key: string, patch: Partial<NavItem>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      navItems: settings.navItems.map((n) => (n.key === key ? { ...n, ...patch } : n)),
    });
  };

  if (loading || !settings) {
    return (
      <PageWrap>
        <PageSubtitle>Loading settings…</PageSubtitle>
        {err && <StatusMsg>{err}</StatusMsg>}
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiSettings /> Platform Settings</PageTitle>
          <PageSubtitle>Manage branding, navigation, SEO, team, and client reviews</PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      {msg && <StatusMsg $ok>{msg}</StatusMsg>}
      {err && <StatusMsg>{err}</StatusMsg>}

      <SettingsShell>
        <SettingsNav>
          {TABS.map((t) => (
            <SettingsNavBtn key={t.id} $active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.icon}{t.label}
            </SettingsNavBtn>
          ))}
        </SettingsNav>

        <SettingsPanel>
          {tab === 'overview' && (
            <>
              <PanelHead><div><h2>General Settings</h2><p>Site identity and contact details</p></div></PanelHead>
              <PanelBody>
                <FieldGrid>
                  <Field>Site Name<input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></Field>
                  <Field>Admin Email<input type="email" value={settings.siteEmail} onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })} /></Field>
                  <Field className="full">Tagline<input value={settings.siteTagline || ''} onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })} placeholder="Short site description" /></Field>
                  <Field>Default Language
                    <select value={settings.defaultLanguage} onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}>
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                      <option value="es">Spanish</option>
                      <option value="pt">Portuguese</option>
                      <option value="id">Indonesian</option>
                      <option value="vi">Vietnamese</option>
                      <option value="fr">French</option>
                      <option value="tr">Turkish</option>
                      <option value="ur">Urdu</option>
                    </select>
                  </Field>
                </FieldGrid>
                <p style={{ margin: '1rem 0 0.4rem', fontWeight: 700, color: '#132e58' }}>LegendScore weights (must add toward 100)</p>
                <FieldGrid>
                  {(['regulation','tradingConditions','withdrawals','userExperience','complaints','support'] as const).map((k) => (
                    <Field key={k}>{k}
                      <input
                        type="number"
                        value={settings.legendScoreWeights?.[k] ?? ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          legendScoreWeights: {
                            ...(settings.legendScoreWeights || {}),
                            [k]: Number(e.target.value),
                          },
                        })}
                      />
                    </Field>
                  ))}
                </FieldGrid>
                <div style={{ marginTop: '0.75rem' }}>
                  <PrimaryButton disabled={saving} onClick={() => persistSettings({
                    siteName: settings.siteName, siteEmail: settings.siteEmail,
                    siteTagline: settings.siteTagline, defaultLanguage: settings.defaultLanguage,
                    legendScoreWeights: settings.legendScoreWeights || {
                      regulation: 20, tradingConditions: 20, withdrawals: 20,
                      userExperience: 15, complaints: 15, support: 10,
                    },
                  })}><FiSave /> Save</PrimaryButton>
                </div>
              </PanelBody>
            </>
          )}

          {tab === 'branding' && (
            <>
              <PanelHead><div><h2>Branding</h2><p>Website logo shown in the navbar</p></div></PanelHead>
              <PanelBody>
                <LogoPreview>
                  {settings.siteLogoUrl ? <img src={settings.siteLogoUrl} alt="Site logo" /> : <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No logo uploaded</span>}
                </LogoPreview>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <label style={{ cursor: 'pointer' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 600,
                      borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: '#132E58', color: 'white',
                    }}>
                      <FiUpload /> Upload Logo
                    </span>
                    <input type="file" accept="image/*" hidden onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setSaving(true);
                      try {
                        const next = await uploadSiteLogo(f);
                        setSettings(next);
                        flash('Logo uploaded.');
                      } catch (ex: unknown) { flashErr(ex instanceof Error ? ex.message : 'Upload failed'); }
                      finally { setSaving(false); e.target.value = ''; }
                    }} />
                  </label>
                  {settings.siteLogoUrl && (
                    <GhostButton $sm onClick={async () => {
                      setSaving(true);
                      try { setSettings(await removeSiteLogo()); flash('Logo removed.'); }
                      catch (ex: unknown) { flashErr(ex instanceof Error ? ex.message : 'Failed'); }
                      finally { setSaving(false); }
                    }}>Remove</GhostButton>
                  )}
                </div>
              </PanelBody>
            </>
          )}

          {tab === 'navigation' && (
            <>
              <PanelHead>
                <div><h2>Navigation Menu</h2><p>Reorder items and show/hide links</p></div>
                <PrimaryButton $sm disabled={saving} onClick={() => persistSettings({ navItems: settings.navItems })}>
                  <FiSave /> Save Menu
                </PrimaryButton>
              </PanelHead>
              <PanelBody>
                <SectionTabs>
                  <button type="button" className={navSection === 'main' ? 'active' : ''} onClick={() => setNavSection('main')}>Main Menu</button>
                  <button type="button" className={navSection === 'tools' ? 'active' : ''} onClick={() => setNavSection('tools')}>Tools Submenu</button>
                </SectionTabs>
                {navForSection(navSection).map((item, i, arr) => (
                  <NavItemRow key={item.key}>
                    <div className="order-btns">
                      <button type="button" disabled={i === 0} onClick={() => moveNavItem(navSection, i, -1)}><FiChevronUp /></button>
                      <button type="button" disabled={i === arr.length - 1} onClick={() => moveNavItem(navSection, i, 1)}><FiChevronDown /></button>
                    </div>
                    <div className="fields">
                      <input value={item.label} onChange={(e) => updateNavItem(item.key, { label: e.target.value })} placeholder="Label" />
                      <input value={item.path} onChange={(e) => updateNavItem(item.key, { path: e.target.value })} placeholder="/path" />
                      <label className="vis"><input type="checkbox" checked={item.visible} onChange={(e) => updateNavItem(item.key, { visible: e.target.checked })} /> Visible</label>
                    </div>
                  </NavItemRow>
                ))}
              </PanelBody>
            </>
          )}

          {tab === 'registration' && (
            <>
              <PanelHead><div><h2>Registration & Access</h2><p>Control sign-ups and email verification</p></div></PanelHead>
              <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <ToggleRow>
                  <div className="info"><strong>Allow new registrations</strong><span>When off, the register form is blocked</span></div>
                  <input type="checkbox" checked={settings.allowRegistrations} onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })} />
                </ToggleRow>
                <ToggleRow>
                  <div className="info"><strong>Email verification on registration</strong><span>Require OTP code sent to email before account is created</span></div>
                  <input type="checkbox" checked={settings.emailVerificationEnabled} onChange={(e) => setSettings({ ...settings, emailVerificationEnabled: e.target.checked })} />
                </ToggleRow>
                <ToggleRow>
                  <div className="info"><strong>Maintenance mode</strong><span>Blocks registration and shows maintenance message</span></div>
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
                </ToggleRow>
                <PrimaryButton disabled={saving} style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }} onClick={() => persistSettings({
                  allowRegistrations: settings.allowRegistrations,
                  emailVerificationEnabled: settings.emailVerificationEnabled,
                  maintenanceMode: settings.maintenanceMode,
                })}><FiSave /> Save</PrimaryButton>
              </PanelBody>
            </>
          )}

          {tab === 'seo' && (
            <>
              <PanelHead><div><h2>SEO & Meta Tags</h2><p>Default and per-page search engine settings</p></div></PanelHead>
              <PanelBody>
                <FieldGrid>
                  <Field className="full">Default Meta Title<input value={settings.defaultMetaTitle || ''} onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })} /></Field>
                  <Field className="full">Default Meta Description<textarea value={settings.defaultMetaDescription || ''} onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })} /></Field>
                </FieldGrid>
                {settings.defaultOgImageUrl && (
                  <LogoPreview style={{ marginTop: '0.75rem' }}><img src={settings.defaultOgImageUrl} alt="OG" /></LogoPreview>
                )}
                <label style={{ display: 'inline-block', marginTop: '0.5rem', cursor: 'pointer' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.4rem 0.65rem', fontSize: '0.75rem', fontWeight: 600,
                    borderRadius: 7, border: '1px solid #e8ecf1', background: 'white', color: '#132E58',
                  }}>
                    <FiUpload /> Upload OG Image
                  </span>
                  <input type="file" accept="image/*" hidden onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    setSaving(true);
                    try { setSettings(await uploadOgImage(f)); flash('OG image uploaded.'); }
                    catch (ex: unknown) { flashErr(ex instanceof Error ? ex.message : 'Upload failed'); }
                    finally { setSaving(false); e.target.value = ''; }
                  }} />
                </label>

                <h4 style={{ margin: '1.25rem 0 0.5rem', fontSize: '0.8125rem', color: '#132E58' }}>Per-page SEO</h4>
                {(settings.pageMeta || []).map((p, i) => (
                  <div key={p.route} style={{ border: '1px solid #e8ecf1', borderRadius: 8, padding: '0.65rem', marginBottom: '0.5rem' }}>
                    <FieldGrid>
                      <Field>Route<input value={p.route} onChange={(e) => {
                        const pageMeta = [...settings.pageMeta];
                        pageMeta[i] = { ...pageMeta[i], route: e.target.value };
                        setSettings({ ...settings, pageMeta });
                      }} /></Field>
                      <Field>Page Title<input value={p.title} onChange={(e) => {
                        const pageMeta = [...settings.pageMeta];
                        pageMeta[i] = { ...pageMeta[i], title: e.target.value };
                        setSettings({ ...settings, pageMeta });
                      }} /></Field>
                      <Field className="full">Description<textarea value={p.description} onChange={(e) => {
                        const pageMeta = [...settings.pageMeta];
                        pageMeta[i] = { ...pageMeta[i], description: e.target.value };
                        setSettings({ ...settings, pageMeta });
                      }} /></Field>
                    </FieldGrid>
                  </div>
                ))}
                <GhostButton $sm onClick={() => setSettings({
                  ...settings,
                  pageMeta: [...settings.pageMeta, { route: '/', title: '', description: '', noIndex: false }],
                })}><FiPlus /> Add Page</GhostButton>
                <div style={{ marginTop: '0.75rem' }}>
                  <PrimaryButton disabled={saving} onClick={() => persistSettings({
                    defaultMetaTitle: settings.defaultMetaTitle,
                    defaultMetaDescription: settings.defaultMetaDescription,
                    pageMeta: settings.pageMeta,
                  })}><FiSave /> Save SEO</PrimaryButton>
                </div>
              </PanelBody>
            </>
          )}

          {tab === 'team' && (
            <>
              <PanelHead>
                <div><h2>Management Team</h2><p>Team members shown on the About page</p></div>
                <PrimaryButton $sm onClick={() => setMemberModal('new')}><FiPlus /> Add Member</PrimaryButton>
              </PanelHead>
              <PanelBody>
                {team.length === 0 && <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>No team members yet.</p>}
                {team.map((m, i) => (
                  <MemberCard key={m._id}>
                    <div className="avatar">{m.photoUrl ? <img src={m.photoUrl} alt={m.name} /> : m.name.charAt(0)}</div>
                    <div className="body">
                      <div className="top"><h3>{m.name}</h3><span className="role">{m.role}</span>{!m.published && <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>(hidden)</span>}</div>
                      <p>{m.bio || '—'}</p>
                    </div>
                    <div className="actions">
                      <GhostButton $sm onClick={() => moveTeam(i, -1)} disabled={i === 0}><FiChevronUp /></GhostButton>
                      <GhostButton $sm onClick={() => moveTeam(i, 1)} disabled={i === team.length - 1}><FiChevronDown /></GhostButton>
                      <GhostButton $sm onClick={() => setMemberModal(m)}><FiEdit2 /></GhostButton>
                      <GhostButton $sm $danger onClick={() => removeMember(m._id)}><FiTrash2 /></GhostButton>
                    </div>
                  </MemberCard>
                ))}
              </PanelBody>
            </>
          )}

          {tab === 'reviews' && (
            <>
              <PanelHead>
                <div><h2>Client Reviews</h2><p>Testimonials on the homepage</p></div>
                <PrimaryButton $sm onClick={() => setReviewModal('new')}><FiPlus /> Add Review</PrimaryButton>
              </PanelHead>
              <PanelBody>
                {reviews.length === 0 && <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>No reviews yet.</p>}
                {reviews.map((r, i) => (
                  <ReviewCard key={r._id}>
                    <div className="avatar">{r.avatarUrl ? <img src={r.avatarUrl} alt={r.name} /> : r.name.charAt(0)}</div>
                    <div className="body">
                      <div className="top"><h3>{r.name}</h3><span className="role">{r.role || 'Client'}</span><span className="role" style={{ background: '#fef3c7', color: '#b45309' }}>{'★'.repeat(r.rating)}</span></div>
                      <p>{r.body}</p>
                    </div>
                    <div className="actions">
                      <GhostButton $sm onClick={() => moveReview(i, -1)} disabled={i === 0}><FiChevronDown style={{ transform: 'rotate(180deg)' }} /></GhostButton>
                      <GhostButton $sm onClick={() => moveReview(i, 1)} disabled={i === reviews.length - 1}><FiChevronDown /></GhostButton>
                      <GhostButton $sm onClick={() => setReviewModal(r)}><FiEdit2 /></GhostButton>
                      <GhostButton $sm $danger onClick={() => removeReview(r._id)}><FiTrash2 /></GhostButton>
                    </div>
                  </ReviewCard>
                ))}
              </PanelBody>
            </>
          )}
        </SettingsPanel>
      </SettingsShell>

      {memberModal && (
        <TeamMemberModal
          member={memberModal === 'new' ? null : memberModal}
          onClose={() => setMemberModal(null)}
          onSaved={(m) => { setTeam((prev) => memberModal === 'new' ? [...prev, m] : prev.map((x) => x._id === m._id ? m : x)); setMemberModal(null); flash('Team member saved.'); }}
        />
      )}
      {reviewModal && (
        <ReviewModal
          review={reviewModal === 'new' ? null : reviewModal}
          onClose={() => setReviewModal(null)}
          onSaved={(r) => { setReviews((prev) => reviewModal === 'new' ? [...prev, r] : prev.map((x) => x._id === r._id ? r : x)); setReviewModal(null); flash('Review saved.'); }}
        />
      )}
    </PageWrap>
  );

  async function moveTeam(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= team.length) return;
    const ids = team.map((t) => t._id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setTeam(await reorderTeamMembers(ids));
  }

  async function removeMember(id: string) {
    if (!window.confirm('Delete this team member?')) return;
    await deleteTeamMember(id);
    setTeam((t) => t.filter((m) => m._id !== id));
    flash('Team member deleted.');
  }

  async function moveReview(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= reviews.length) return;
    const ids = reviews.map((r) => r._id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setReviews(await reorderClientReviews(ids));
  }

  async function removeReview(id: string) {
    if (!window.confirm('Delete this review?')) return;
    await deleteClientReview(id);
    setReviews((r) => r.filter((x) => x._id !== id));
    flash('Review deleted.');
  }
};

const TeamMemberModal: React.FC<{
  member: TeamMember | null;
  onClose: () => void;
  onSaved: (m: TeamMember) => void;
}> = ({ member, onClose, onSaved }) => {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [bio, setBio] = useState(member?.bio || '');
  const [linkedIn, setLinkedIn] = useState(member?.linkedIn || '');
  const [published, setPublished] = useState(member?.published !== false);
  const [photo, setPhoto] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim() || !role.trim()) return;
    setSaving(true);
    try {
      const result = member
        ? await updateTeamMember(member._id, { name, role, bio, linkedIn, published }, photo)
        : await createTeamMember({ name, role, bio, linkedIn, published }, photo);
      onSaved(result);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <div className="head"><h3>{member ? 'Edit Team Member' : 'Add Team Member'}</h3></div>
        <div className="content">
          <FieldGrid>
            <Field>Name<input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field>Role<input value={role} onChange={(e) => setRole(e.target.value)} placeholder="CEO, CTO…" /></Field>
            <Field className="full">Bio<textarea value={bio} onChange={(e) => setBio(e.target.value)} /></Field>
            <Field className="full">LinkedIn URL<input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} /></Field>
            <Field>Photo<input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0])} /></Field>
            <Field><span>Published</span><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: 'auto' }} /></Field>
          </FieldGrid>
        </div>
        <div className="foot">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton disabled={saving} onClick={submit}><FiSave /> {saving ? 'Saving…' : 'Save'}</PrimaryButton>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
};

const ReviewModal: React.FC<{
  review: ClientReview | null;
  onClose: () => void;
  onSaved: (r: ClientReview) => void;
}> = ({ review, onClose, onSaved }) => {
  const [name, setName] = useState(review?.name || '');
  const [role, setRole] = useState(review?.role || '');
  const [body, setBody] = useState(review?.body || '');
  const [rating, setRating] = useState(review?.rating || 5);
  const [featured, setFeatured] = useState(review?.featured || false);
  const [published, setPublished] = useState(review?.published !== false);
  const [avatar, setAvatar] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim() || !body.trim()) return;
    setSaving(true);
    try {
      const result = review
        ? await updateClientReview(review._id, { name, role, body, rating, featured, published }, avatar)
        : await createClientReview({ name, role, body, rating, featured, published }, avatar);
      onSaved(result);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <div className="head"><h3>{review ? 'Edit Review' : 'Add Review'}</h3></div>
        <div className="content">
          <FieldGrid>
            <Field>Name<input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field>Role<input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Trader, Investor…" /></Field>
            <Field>Rating
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </Field>
            <Field className="full">Review<textarea value={body} onChange={(e) => setBody(e.target.value)} /></Field>
            <Field>Avatar<input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0])} /></Field>
            <Field><span>Featured</span><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: 'auto' }} /></Field>
            <Field><span>Published</span><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: 'auto' }} /></Field>
          </FieldGrid>
        </div>
        <div className="foot">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton disabled={saving} onClick={submit}><FiSave /> {saving ? 'Saving…' : 'Save'}</PrimaryButton>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
};

export default AdminSettings;
