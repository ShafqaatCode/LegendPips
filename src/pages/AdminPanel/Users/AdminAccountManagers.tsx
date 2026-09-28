import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FiPlus, FiTrash2, FiEdit2, FiUserCheck } from "react-icons/fi";
import {
  adminCreateAccountManager,
  adminDeleteAccountManager,
  adminListAccountManagers,
  adminUpdateAccountManager,
  type AccountManager,
} from "../../../services/accountManagerService";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import {
  PageWrap,
  PageHeader,
  SectionCard,
  SectionHead,
  SectionBody,
  PrimaryButton,
  GhostButton,
  ErrorBanner,
  DataTable,
  Th,
  Td,
  Tr,
  Pill,
  adminColors,
} from "../../../components/AdminPanel/adminUi";

const emptyForm = {
  name: "",
  email: "",
  telegram: "",
  whatsapp: "",
  avatarUrl: "",
  online: true,
  active: true,
  sortOrder: "0",
  notes: "",
};

const AdminAccountManagers: React.FC = () => {
  const [items, setItems] = useState<AccountManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AccountManager | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await adminListAccountManagers(false));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load managers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (m: AccountManager) => {
    setEditing(m);
    setForm({
      name: m.name || "",
      email: m.email || "",
      telegram: m.telegram || "",
      whatsapp: m.whatsapp || "",
      avatarUrl: m.avatarUrl || "",
      online: m.online !== false,
      active: m.active !== false,
      sortOrder: String(m.sortOrder ?? 0),
      notes: m.notes || "",
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        telegram: form.telegram.trim(),
        whatsapp: form.whatsapp.trim(),
        avatarUrl: form.avatarUrl.trim(),
        online: form.online,
        active: form.active,
        sortOrder: Number(form.sortOrder) || 0,
        notes: form.notes.trim(),
      };
      if (editing) await adminUpdateAccountManager(editing.id, payload);
      else await adminCreateAccountManager(payload);
      setModalOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      await adminDeleteAccountManager(deleteId);
      setDeleteId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <h1>
            <FiUserCheck style={{ marginRight: 8, verticalAlign: -3 }} />
            Account managers
          </h1>
          <p>Create manager profiles, then assign them to members from the user detail page.</p>
        </div>
        <PrimaryButton type="button" onClick={openCreate}>
          <FiPlus /> Add manager
        </PrimaryButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SectionCard>
        <SectionHead>
          <h2>{loading ? "Loading…" : `${items.length} manager${items.length === 1 ? "" : "s"}`}</h2>
        </SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <DataTable>
            <thead>
              <tr>
                <Th>Manager</Th>
                <Th>Contacts</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 ? (
                <Tr>
                  <Td colSpan={4} style={{ padding: "1.25rem", color: "#64748b" }}>
                    No managers yet. Add one to assign to members.
                  </Td>
                </Tr>
              ) : (
                items.map((m) => (
                  <Tr key={m.id}>
                    <Td>
                      <ManagerCell>
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt="" />
                        ) : (
                          <span className="fallback">{m.name.slice(0, 2).toUpperCase()}</span>
                        )}
                        <div>
                          <strong>{m.name}</strong>
                          {m.notes ? <small>{m.notes}</small> : null}
                        </div>
                      </ManagerCell>
                    </Td>
                    <Td style={{ fontSize: "0.8125rem", color: "#475569" }}>
                      <div>{m.email || "—"}</div>
                      <div>{m.telegram || "—"}</div>
                      <div>{m.whatsapp || "—"}</div>
                    </Td>
                    <Td>
                      <Pill $variant={m.active === false ? "rejected" : "approved"}>
                        {m.active === false ? "Inactive" : m.online === false ? "Offline" : "Online"}
                      </Pill>
                    </Td>
                    <Td>
                      <RowActions>
                        <GhostButton type="button" onClick={() => openEdit(m)}>
                          <FiEdit2 /> Edit
                        </GhostButton>
                        <GhostButton type="button" onClick={() => setDeleteId(m.id)}>
                          <FiTrash2 /> Delete
                        </GhostButton>
                      </RowActions>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </DataTable>
        </SectionBody>
      </SectionCard>

      <SimpleModal
        isOpen={modalOpen}
        title={editing ? "Edit account manager" : "Add account manager"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </PrimaryButton>
          </>
        }
      >
        <FormGrid>
          <label>
            Name *
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Fedor Vorobev"
            />
          </label>
          <label>
            Avatar URL
            <input
              value={form.avatarUrl}
              onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              placeholder="https://…"
            />
          </label>
          <label>
            E-mail
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="manager@legendpips.com"
            />
          </label>
          <label>
            Telegram
            <input
              value={form.telegram}
              onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
              placeholder="@username"
            />
          </label>
          <label>
            WhatsApp
            <input
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              placeholder="+1234567890"
            />
          </label>
          <label>
            Sort order
            <input
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            />
          </label>
          <label className="full">
            Notes
            <input
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </label>
          <CheckRow>
            <label>
              <input
                type="checkbox"
                checked={form.online}
                onChange={(e) => setForm((f) => ({ ...f, online: e.target.checked }))}
              />
              Show online
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active
            </label>
          </CheckRow>
        </FormGrid>
      </SimpleModal>

      <SimpleModal
        isOpen={Boolean(deleteId)}
        title="Delete manager?"
        onClose={() => setDeleteId(null)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setDeleteId(null)}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={confirmDelete} disabled={saving}>
              {saving ? "Deleting…" : "Delete"}
            </PrimaryButton>
          </>
        }
      >
        <p style={{ margin: 0, color: adminColors.muted, fontSize: "0.875rem" }}>
          This removes the manager profile and clears it from any assigned members.
        </p>
      </SimpleModal>
    </PageWrap>
  );
};

export default AdminAccountManagers;

const ManagerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  img,
  .fallback {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #132e58;
    color: #fff;
    font-size: 0.6875rem;
    font-weight: 800;
  }

  strong {
    display: block;
    color: #132e58;
    font-size: 0.875rem;
  }

  small {
    display: block;
    color: #94a3b8;
    font-size: 0.75rem;
  }
`;

const RowActions = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
  }

  label.full {
    grid-column: 1 / -1;
  }

  input[type="text"],
  input:not([type]) {
    border: 1px solid #e8ecf1;
    border-radius: 8px;
    padding: 0.55rem 0.65rem;
    font-size: 0.875rem;
    font-family: inherit;
    color: #132e58;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CheckRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  label {
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
    color: #334155;
  }

  input {
    accent-color: #132e58;
  }
`;
