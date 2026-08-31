import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, ErrorBanner, adminColors,
} from "../../../components/AdminPanel/adminUi";
import {
  adminCreateSignupBonus,
  adminDeleteSignupBonus,
  adminFetchSignupBonuses,
  adminUpdateSignupBonus,
  type SignupBonus,
  type SignupBonusType,
} from "../../../services/marketService";

const AdminSignupBonuses: React.FC = () => {
  const [items, setItems] = useState<SignupBonus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [bonusLabel, setBonusLabel] = useState("");
  const [bonusType, setBonusType] = useState<SignupBonusType>("welcome");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [showNewBadge, setShowNewBadge] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const load = useCallback(async () => {
    try {
      setItems(await adminFetchSignupBonuses());
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setEditId(null);
    setTitle("");
    setBrokerName("");
    setBrokerId("");
    setBonusLabel("");
    setBonusType("welcome");
    setDescription("");
    setTerms("");
    setCtaUrl("");
    setFeatured(false);
    setPublished(true);
    setShowNewBadge(true);
    setSortOrder("0");
  };

  const openAdd = () => {
    reset();
    setOpen(true);
  };

  const openEdit = (b: SignupBonus) => {
    setEditId(b._id);
    setTitle(b.title);
    setBrokerName(b.brokerName);
    setBrokerId(b.brokerId || "");
    setBonusLabel(b.bonusLabel);
    setBonusType(b.bonusType || "welcome");
    setDescription(b.description || "");
    setTerms(b.terms || "");
    setCtaUrl(b.ctaUrl || "");
    setFeatured(!!b.featured);
    setPublished(b.published !== false);
    setShowNewBadge(b.showNewBadge !== false);
    setSortOrder(String(b.sortOrder ?? 0));
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        brokerName: brokerName.trim(),
        brokerId: brokerId.trim(),
        bonusLabel: bonusLabel.trim(),
        bonusType,
        description: description.trim(),
        terms: terms.trim(),
        ctaUrl: ctaUrl.trim(),
        featured,
        published,
        showNewBadge,
        sortOrder: Number(sortOrder) || 0,
      };
      if (editId) await adminUpdateSignupBonus(editId, payload);
      else await adminCreateSignupBonus(payload);
      setOpen(false);
      await load();
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this bonus?")) return;
    try {
      await adminDeleteSignupBonus(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Broker Signup Bonuses</PageTitle>
          <PageSubtitle>Welcome / deposit bonuses shown on /broker-signup-bonuses</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> Add bonus
        </PrimaryButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((b) => (
          <div
            key={b._id}
            style={{
              background: "white",
              border: `1px solid ${adminColors.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: adminColors.navy }}>
                {b.brokerName} · {b.bonusLabel}
                {!b.published && <span style={{ color: adminColors.muted, fontWeight: 600 }}> (draft)</span>}
              </div>
              <div style={{ fontSize: 12, color: adminColors.muted }}>{b.title}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <GhostButton $sm type="button" onClick={() => openEdit(b)}>
                <FiEdit2 /> Edit
              </GhostButton>
              <GhostButton $sm $danger type="button" onClick={() => remove(b._id)}>
                <FiTrash2 />
              </GhostButton>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>No bonuses yet. Add the first offer.</div>
        )}
      </div>

      <SimpleModal
        isOpen={open}
        title={editId ? "Edit signup bonus" : "Add signup bonus"}
        onClose={() => !saving && setOpen(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={save} disabled={saving}>
              <FiCheck /> {saving ? "Saving…" : "Save"}
            </PrimaryButton>
          </>
        }
      >
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Broker name
            <input value={brokerName} onChange={(e) => setBrokerName(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Broker ID (optional)
            <input value={brokerId} onChange={(e) => setBrokerId(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Bonus label (e.g. 100% deposit bonus)
            <input value={bonusLabel} onChange={(e) => setBonusLabel(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Type
            <select value={bonusType} onChange={(e) => setBonusType(e.target.value as SignupBonusType)} style={{ width: "100%" }}>
              <option value="welcome">Welcome</option>
              <option value="deposit">Deposit</option>
              <option value="no_deposit">No deposit</option>
              <option value="cashback">Cashback</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: "100%" }} />
          </label>
          <label>
            Terms
            <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={2} style={{ width: "100%" }} />
          </label>
          <label>
            CTA URL
            <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Sort order
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </label>
          <label><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured</label>
          <label><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published</label>
          <label><input type="checkbox" checked={showNewBadge} onChange={(e) => setShowNewBadge(e.target.checked)} /> Show NEW badge</label>
        </div>
      </SimpleModal>
    </PageWrap>
  );
};

export default AdminSignupBonuses;
