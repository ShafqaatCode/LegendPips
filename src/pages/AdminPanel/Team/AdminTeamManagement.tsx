import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiPlus, FiEdit2, FiTrash2, FiUsers, FiShield, FiCheck, FiSearch,
} from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, SearchInput, FilterCount,
  ErrorBanner, adminColors, Pill,
} from "../../../components/AdminPanel/adminUi";
import {
  createAdminStaff,
  deleteAdminStaff,
  fetchAdminStaff,
  updateAdminStaff,
  type AdminStaffMember,
} from "../../../services/adminStaffService";
import {
  ADMIN_PERMISSION_META,
  type AdminPermission,
} from "../../../utils/adminPermissions";
import { useAuth } from "../../../contexts/AuthContext";
import { isFullAdmin } from "../../../utils/adminPermissions";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.9rem;
`;

const Card = styled.article`
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 16px;
  box-shadow: ${adminColors.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CardTop = styled.div`
  padding: 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, white 100%);
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(145deg, ${adminColors.navy}, ${adminColors.navyLight});
  color: ${adminColors.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  padding: 0.85rem 1rem;
  flex: 1;
`;

const PermChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const Chip = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
`;

const CardFoot = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.45rem;
  background: #fafbfc;
`;

const FormField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${adminColors.navy};
  margin-bottom: 0.7rem;
  input {
    padding: 0.55rem 0.7rem;
    border-radius: 9px;
    border: 1px solid ${adminColors.border};
    font-size: 0.8125rem;
    font-weight: 400;
    outline: none;
    background: #fafbfc;
    &:focus {
      border-color: ${adminColors.navy};
      box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08);
      background: white;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 0.65rem;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const PermGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  max-height: 280px;
  overflow-y: auto;
  padding: 0.35rem;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  background: #fafbfc;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const PermItem = styled.label<{ $on?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.55rem 0.6rem;
  border-radius: 10px;
  border: 1px solid ${({ $on }) => ($on ? adminColors.navy : "#e2e8f0")};
  background: ${({ $on }) => ($on ? "#eff6ff" : "white")};
  cursor: pointer;
  font-size: 0.75rem;
  input { margin-top: 0.15rem; accent-color: ${adminColors.navy}; }
  strong { display: block; color: ${adminColors.navy}; font-size: 0.75rem; }
  span { color: ${adminColors.muted}; font-size: 0.65rem; line-height: 1.3; }
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${adminColors.muted};
  border: 1px dashed ${adminColors.border};
  border-radius: 16px;
  background: white;
`;

type Mode = "add" | "edit" | "delete";

const AdminTeamManagement: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<AdminStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("add");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"active" | "blocked">("active");
  const [perms, setPerms] = useState<AdminPermission[]>(["kyc"]);

  const canManage = isFullAdmin(user);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStaff();
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const staffOnly = useMemo(
    () => items.filter((m) => !m.isFullAdmin),
    [items]
  );

  const filtered = staffOnly.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.email.toLowerCase().includes(q) ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setMode("add");
    setSelectedId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setStatus("active");
    setPerms(["kyc"]);
    setModalError(null);
    setOpen(true);
  };

  const openEdit = (m: AdminStaffMember) => {
    setMode("edit");
    setSelectedId(m.id);
    setFirstName(m.firstName);
    setLastName(m.lastName);
    setEmail(m.email);
    setPassword("");
    setPhone(m.phone || "");
    setStatus((m.status as "active" | "blocked") || "active");
    setPerms(
      (m.adminPermissions || []).filter((p) =>
        ADMIN_PERMISSION_META.some((x) => x.key === p)
      ) as AdminPermission[]
    );
    setModalError(null);
    setOpen(true);
  };

  const openDelete = (id: string) => {
    setMode("delete");
    setSelectedId(id);
    setModalError(null);
    setOpen(true);
  };

  const togglePerm = (key: AdminPermission) => {
    setPerms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const submit = async () => {
    if (!canManage) {
      setModalError("Only full administrators can manage the team");
      return;
    }
    if (mode === "delete" && selectedId) {
      setSaving(true);
      try {
        await deleteAdminStaff(selectedId);
        setOpen(false);
        await load();
      } catch (e) {
        setModalError(e instanceof Error ? e.message : "Delete failed");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setModalError("Name and email are required");
      return;
    }
    if (mode === "add" && password.trim().length < 6) {
      setModalError("Password must be at least 6 characters");
      return;
    }
    if (perms.length === 0) {
      setModalError("Select at least one access permission");
      return;
    }

    setSaving(true);
    setModalError(null);
    try {
      if (mode === "add") {
        await createAdminStaff({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password.trim(),
          phone: phone.trim() || undefined,
          permissions: perms,
        });
      } else if (mode === "edit" && selectedId) {
        await updateAdminStaff(selectedId, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          status,
          permissions: perms,
          password: password.trim() || undefined,
        });
      }
      setOpen(false);
      await load();
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!canManage) {
    return (
      <PageWrap>
        <ErrorBanner>Only full administrators can manage the admin team.</ErrorBanner>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiUsers /> Admin team</PageTitle>
          <PageSubtitle>
            Add staff accounts and choose which admin areas they can access
          </PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> Add team member
        </PrimaryButton>
      </PageHeader>

      <FilterBar>
        <SearchInput style={{ maxWidth: 320, flex: 1 }}>
          <FiSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team…"
          />
        </SearchInput>
        <FilterCount>
          {loading ? "Loading…" : `${filtered.length} staff · ${items.filter((i) => i.isFullAdmin).length} full admin(s)`}
        </FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Grid>
        {loading ? (
          <Empty>Loading team…</Empty>
        ) : filtered.length === 0 ? (
          <Empty>
            No limited staff yet. Add a team member and tick the modules they may use
            (e.g. only KYC).
          </Empty>
        ) : (
          filtered.map((m) => (
            <Card key={m.id}>
              <CardTop>
                <Avatar>
                  {(m.firstName[0] || "").toUpperCase()}
                  {(m.lastName[0] || "").toUpperCase()}
                </Avatar>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, color: adminColors.navy }}>
                    {m.firstName} {m.lastName}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: adminColors.muted }}>{m.email}</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Pill $variant={m.status === "active" ? "approved" : "rejected"}>
                      {m.status}
                    </Pill>
                    <Pill $variant="user">Staff</Pill>
                  </div>
                </div>
              </CardTop>
              <CardBody>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: adminColors.muted, marginBottom: 6, textTransform: "uppercase" }}>
                  Access
                </div>
                <PermChips>
                  {(m.adminPermissions || []).map((p) => (
                    <Chip key={p}>
                      {ADMIN_PERMISSION_META.find((x) => x.key === p)?.label || p}
                    </Chip>
                  ))}
                </PermChips>
              </CardBody>
              <CardFoot>
                <GhostButton $sm type="button" style={{ flex: 1, justifyContent: "center" }} onClick={() => openEdit(m)}>
                  <FiEdit2 /> Edit
                </GhostButton>
                <GhostButton $sm $danger type="button" style={{ flex: 1, justifyContent: "center" }} onClick={() => openDelete(m.id)}>
                  <FiTrash2 /> Remove
                </GhostButton>
              </CardFoot>
            </Card>
          ))
        )}
      </Grid>

      <SimpleModal
        isOpen={open}
        size="lg"
        title={
          mode === "add"
            ? "Add team member"
            : mode === "edit"
              ? "Edit team member"
              : "Remove team member"
        }
        onClose={() => !saving && setOpen(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={submit} disabled={saving}>
              {mode === "delete" ? (
                <><FiTrash2 /> {saving ? "Removing…" : "Remove"}</>
              ) : (
                <><FiCheck /> {saving ? "Saving…" : "Save"}</>
              )}
            </PrimaryButton>
          </>
        }
      >
        {modalError && (
          <div style={{ color: "#b91c1c", marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            {modalError}
          </div>
        )}
        {mode === "delete" ? (
          <div style={{ color: adminColors.muted, fontSize: 14 }}>
            Remove this staff account? They will no longer be able to sign in to the admin panel.
          </div>
        ) : (
          <>
            <FormGrid>
              <FormField>
                First name
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </FormField>
              <FormField>
                Last name
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </FormField>
              <FormField>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={mode === "edit"}
                />
              </FormField>
              <FormField>
                {mode === "add" ? "Password" : "New password (optional)"}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField>
                Phone (optional)
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </FormField>
              {mode === "edit" && (
                <FormField>
                  Status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "blocked")}
                    style={{
                      padding: "0.55rem 0.7rem",
                      borderRadius: 9,
                      border: `1px solid ${adminColors.border}`,
                    }}
                  >
                    <option value="active">active</option>
                    <option value="blocked">blocked</option>
                  </select>
                </FormField>
              )}
            </FormGrid>

            <div style={{ margin: "0.5rem 0 0.4rem", fontSize: "0.75rem", fontWeight: 800, color: adminColors.navy, display: "flex", alignItems: "center", gap: 6 }}>
              <FiShield /> Access permissions
            </div>
            <p style={{ margin: "0 0 0.65rem", fontSize: "0.75rem", color: adminColors.muted }}>
              Only checked areas appear in their sidebar and API. Example: enable only &quot;KYC records&quot; for a compliance reviewer.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <GhostButton
                $sm
                type="button"
                onClick={() => setPerms(ADMIN_PERMISSION_META.map((p) => p.key))}
              >
                Select all
              </GhostButton>
              <GhostButton $sm type="button" onClick={() => setPerms([])}>
                Clear
              </GhostButton>
            </div>
            <PermGrid>
              {ADMIN_PERMISSION_META.map((p) => (
                <PermItem key={p.key} $on={perms.includes(p.key)}>
                  <input
                    type="checkbox"
                    checked={perms.includes(p.key)}
                    onChange={() => togglePerm(p.key)}
                  />
                  <div>
                    <strong>{p.label}</strong>
                    <span>{p.description}</span>
                  </div>
                </PermItem>
              ))}
            </PermGrid>
          </>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default AdminTeamManagement;
