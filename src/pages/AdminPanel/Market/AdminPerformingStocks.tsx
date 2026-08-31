import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, ErrorBanner, adminColors,
} from "../../../components/AdminPanel/adminUi";
import {
  adminCreatePerformingStock,
  adminDeletePerformingStock,
  adminFetchPerformingStocks,
  adminUpdatePerformingStock,
  type PerformingStock,
} from "../../../services/marketService";

const AdminPerformingStocks: React.FC = () => {
  const [items, setItems] = useState<PerformingStock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [sector, setSector] = useState("");
  const [price, setPrice] = useState("");
  const [changePercent, setChangePercent] = useState("");
  const [changeValue, setChangeValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [note, setNote] = useState("");
  const [published, setPublished] = useState(true);
  const [showNewBadge, setShowNewBadge] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const load = useCallback(async () => {
    try {
      setItems(await adminFetchPerformingStocks());
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
    setSymbol("");
    setName("");
    setExchange("");
    setSector("");
    setPrice("");
    setChangePercent("");
    setChangeValue("");
    setCurrency("USD");
    setNote("");
    setPublished(true);
    setShowNewBadge(true);
    setSortOrder("0");
  };

  const openAdd = () => {
    reset();
    setOpen(true);
  };

  const openEdit = (s: PerformingStock) => {
    setEditId(s._id);
    setSymbol(s.symbol);
    setName(s.name);
    setExchange(s.exchange || "");
    setSector(s.sector || "");
    setPrice(String(s.price ?? ""));
    setChangePercent(String(s.changePercent ?? ""));
    setChangeValue(String(s.changeValue ?? ""));
    setCurrency(s.currency || "USD");
    setNote(s.note || "");
    setPublished(s.published !== false);
    setShowNewBadge(s.showNewBadge !== false);
    setSortOrder(String(s.sortOrder ?? 0));
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        symbol: symbol.trim().toUpperCase(),
        name: name.trim(),
        exchange: exchange.trim(),
        sector: sector.trim(),
        price: Number(price),
        changePercent: Number(changePercent),
        changeValue: Number(changeValue) || 0,
        currency: currency.trim() || "USD",
        note: note.trim(),
        published,
        showNewBadge,
        sortOrder: Number(sortOrder) || 0,
        asOf: new Date().toISOString(),
      };
      if (editId) await adminUpdatePerformingStock(editId, payload);
      else await adminCreatePerformingStock(payload);
      setOpen(false);
      await load();
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this stock row?")) return;
    try {
      await adminDeletePerformingStock(id);
      await load();
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Best Performing Stocks</PageTitle>
          <PageSubtitle>Editorial movers shown on /best-performing-stocks</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> Add stock
        </PrimaryButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((s) => (
          <div
            key={s._id}
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
                {s.symbol} · {Number(s.changePercent) >= 0 ? "+" : ""}
                {Number(s.changePercent).toFixed(2)}%
                {!s.published && <span style={{ color: adminColors.muted, fontWeight: 600 }}> (draft)</span>}
              </div>
              <div style={{ fontSize: 12, color: adminColors.muted }}>
                {s.name} · {s.currency || "USD"} {Number(s.price).toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <GhostButton $sm type="button" onClick={() => openEdit(s)}>
                <FiEdit2 /> Edit
              </GhostButton>
              <GhostButton $sm $danger type="button" onClick={() => remove(s._id)}>
                <FiTrash2 />
              </GhostButton>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>No stocks yet. Add the first mover.</div>
        )}
      </div>

      <SimpleModal
        isOpen={open}
        title={editId ? "Edit stock" : "Add stock"}
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
            Symbol
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Company name
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Exchange
            <input value={exchange} onChange={(e) => setExchange(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Sector
            <input value={sector} onChange={(e) => setSector(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Price
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Change %
            <input type="number" step="0.01" value={changePercent} onChange={(e) => setChangePercent(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Change value
            <input type="number" step="0.01" value={changeValue} onChange={(e) => setChangeValue(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Currency
            <input value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: "100%" }} />
          </label>
          <label>
            Note
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} style={{ width: "100%" }} />
          </label>
          <label>
            Sort order
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </label>
          <label><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published</label>
          <label><input type="checkbox" checked={showNewBadge} onChange={(e) => setShowNewBadge(e.target.checked)} /> Show NEW badge</label>
        </div>
      </SimpleModal>
    </PageWrap>
  );
};

export default AdminPerformingStocks;
