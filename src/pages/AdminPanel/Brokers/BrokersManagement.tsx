import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck } from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import { CourseGridSkeleton } from "../../../components/SharedComponents/Shimmer";
import {
  adminCreateBroker,
  adminDeleteBroker,
  adminFetchBrokers,
  adminUpdateBroker,
  type ApiBroker,
} from "../../../services/brokerService";

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132e58;
  margin: 0;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $primary }) => ($primary ? "#132e58" : "white")};
  color: ${({ $primary }) => ($primary ? "white" : "#132e58")};
  border: 2px solid ${({ $primary }) => ($primary ? "#132e58" : "#e5e7eb")};

  &:hover {
    background: ${({ $primary }) => ($primary ? "#1a4a7a" : "#f9fafb")};
    border-color: ${({ $primary }) => ($primary ? "#1a4a7a" : "#132e58")};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  max-width: 400px;

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9375rem;
    color: #132e58;
    width: 100%;
  }

  svg {
    color: #9ca3af;
  }
`;

const BrokersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const BrokerCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #fbbf24;
  }
`;

const BrokerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const BrokerLogo = styled.div<{ $img?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover no-repeat` : "linear-gradient(135deg, #132e58 0%, #1a4a7a 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const BrokerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132e58;
  margin: 0 0 0.5rem 0;
`;

const BrokerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;

  strong {
    color: #132e58;
    font-weight: 600;
  }
`;

const Badge = styled.span<{ $type: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $type }) => {
    if ($type === "verified") return "#10b98115";
    if ($type === "top") return "#Fbbf2415";
    return "#6b728015";
  }};
  color: ${({ $type }) => {
    if ($type === "verified") return "#10b981";
    if ($type === "top") return "#Fbbf24";
    return "#6b7280";
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $danger }) => ($danger ? "#fee2e2" : "#f3f4f6")};
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#132e58")};

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fecaca" : "#e5e7eb")};
  }
`;

const ModalFooterBtn = styled.button<{ $danger?: boolean }>`
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: ${({ $danger }) => ($danger ? "#ef4444" : "#f3f4f6")};
  color: ${({ $danger }) => ($danger ? "white" : "#132e58")};

  &:hover {
    opacity: 0.92;
  }
`;

const ErrorBanner = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

type ModalMode = "add" | "edit" | "delete";

const defaultBrokerPayload = (): Partial<ApiBroker> => ({
  description: "",
  features: ["Regulated broker", "Competitive spreads"],
  accountTypes: [
    {
      name: "Standard",
      platform: "MT4 / MT5",
      minDeposit: "$100",
      spreadFrom: "From 0.6 pips",
      commission: "None",
      idealFor: "Most traders",
    },
  ],
  reviews: [{ name: "Trader", rating: 5, comment: "Solid execution." }],
  fundingMethods: ["Bank transfer", "Card"],
  published: true,
});

const BrokersManagement: React.FC = () => {
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formMinDeposit, setFormMinDeposit] = useState("100");
  const [formRegulation, setFormRegulation] = useState("");
  const [formSpreadFrom, setFormSpreadFrom] = useState("0.0 pips");
  const [formCashbackRate, setFormCashbackRate] = useState("0.35 pip");
  const [formTopCashback, setFormTopCashback] = useState(false);
  const [formVerified, setFormVerified] = useState(true);
  const [formCrypto, setFormCrypto] = useState("No");
  const [formDescription, setFormDescription] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");

  const loadBrokers = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const items = await adminFetchBrokers();
      setBrokers(items);
    } catch (e: any) {
      setListError(e.message || "Failed to load brokers");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrokers();
  }, [loadBrokers]);

  const openAdd = () => {
    setModalMode("add");
    setSelectedBrokerId(null);
    setFormName("");
    setFormMinDeposit("100");
    setFormRegulation("");
    setFormSpreadFrom("0.0 pips");
    setFormCashbackRate("0.35 pip");
    setFormTopCashback(false);
    setFormVerified(true);
    setFormCrypto("No");
    setFormDescription("");
    setFormLogoUrl("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEdit = (b: ApiBroker) => {
    setModalMode("edit");
    setSelectedBrokerId(b._id);
    setFormName(b.name);
    setFormMinDeposit(String(b.minDeposit));
    setFormRegulation(b.regulation);
    setFormSpreadFrom(b.spreadFrom);
    setFormCashbackRate(b.cashbackRate || "0.35 pip");
    setFormTopCashback(!!b.topCashback);
    setFormVerified(!!b.verified);
    setFormCrypto(b.crypto || "No");
    setFormDescription(b.description || "");
    setFormLogoUrl(b.logoUrl || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openDelete = (id: string) => {
    setModalMode("delete");
    setSelectedBrokerId(id);
    setModalError(null);
    setIsModalOpen(true);
  };

  const submitForm = async () => {
    const name = formName.trim();
    if (!name) {
      setModalError("Name is required");
      return;
    }
    const minDeposit = Number(formMinDeposit);
    if (Number.isNaN(minDeposit) || minDeposit < 0) {
      setModalError("Min deposit must be a valid number");
      return;
    }

    setSaving(true);
    setModalError(null);
    try {
      const base = {
        name,
        minDeposit,
        regulation: formRegulation.trim() || "—",
        spreadFrom: formSpreadFrom.trim(),
        cashbackRate: formCashbackRate.trim(),
        topCashback: formTopCashback,
        verified: formVerified,
        crypto: formCrypto,
        description: formDescription.trim(),
        logoUrl: formLogoUrl.trim() || undefined,
      };

      if (modalMode === "add") {
        await adminCreateBroker({ ...defaultBrokerPayload(), ...base, name, minDeposit });
      } else if (modalMode === "edit" && selectedBrokerId) {
        const existing = brokers.find((b) => b._id === selectedBrokerId);
        await adminUpdateBroker(selectedBrokerId, {
          ...existing,
          ...base,
        });
      }
      setIsModalOpen(false);
      await loadBrokers();
    } catch (e: any) {
      setModalError(e.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBrokerId) return;
    setSaving(true);
    setModalError(null);
    try {
      await adminDeleteBroker(selectedBrokerId);
      setIsModalOpen(false);
      await loadBrokers();
    } catch (e: any) {
      setModalError(e.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Brokers Management</Title>
        <Button $primary type="button" onClick={openAdd}>
          <FiPlus />
          Add New Broker
        </Button>
      </Header>

      <SearchBar>
        <FiSearch />
        <input
          type="text"
          placeholder="Search brokers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {listError && <ErrorBanner>{listError}</ErrorBanner>}

      {listLoading ? (
        <CourseGridSkeleton cards={6} />
      ) : (
        <BrokersGrid>
          {filteredBrokers.map((broker) => (
            <BrokerCard key={broker._id}>
              <BrokerHeader>
                <div>
                  <BrokerLogo $img={broker.logoUrl}>{broker.logoUrl ? "" : broker.name.slice(0, 2).toUpperCase()}</BrokerLogo>
                  <BrokerName>{broker.name}</BrokerName>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    {broker.verified && <Badge $type="verified">Verified</Badge>}
                    {broker.topCashback && <Badge $type="top">Top Cashback</Badge>}
                  </div>
                </div>
              </BrokerHeader>
              <BrokerInfo>
                <InfoItem>
                  <span>Min Deposit:</span>
                  <strong>${broker.minDeposit}</strong>
                </InfoItem>
                <InfoItem>
                  <span>Regulation:</span>
                  <strong>{broker.regulation}</strong>
                </InfoItem>
                <InfoItem>
                  <span>Spread From:</span>
                  <strong>{broker.spreadFrom}</strong>
                </InfoItem>
                <InfoItem>
                  <span>Cashback Rate:</span>
                  <strong>{broker.cashbackRate || "—"}</strong>
                </InfoItem>
              </BrokerInfo>
              <ActionButtons>
                <IconButton type="button" onClick={() => openEdit(broker)}>
                  <FiEdit2 />
                  Edit
                </IconButton>
                <IconButton type="button" $danger onClick={() => openDelete(broker._id)}>
                  <FiTrash2 />
                  Delete
                </IconButton>
              </ActionButtons>
            </BrokerCard>
          ))}
        </BrokersGrid>
      )}

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === "add" ? "Add New Broker" : modalMode === "edit" ? "Edit Broker" : "Delete Broker"}
        onClose={() => !saving && setIsModalOpen(false)}
        footer={
          modalMode === "delete" ? (
            <>
              <ModalFooterBtn type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </ModalFooterBtn>
              <ModalFooterBtn type="button" $danger onClick={confirmDelete} disabled={saving}>
                <FiTrash2 />
                {saving ? "…" : "Delete"}
              </ModalFooterBtn>
            </>
          ) : (
            <>
              <ModalFooterBtn type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </ModalFooterBtn>
              <ModalFooterBtn type="button" onClick={submitForm} disabled={saving}>
                <FiCheck />
                {saving ? "…" : "Save"}
              </ModalFooterBtn>
            </>
          )
        }
      >
        {modalError && <div style={{ color: "#b91c1c", marginBottom: 12, fontSize: 14 }}>{modalError}</div>}
        {modalMode === "delete" ? (
          <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete this broker?
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Broker Name</div>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Min Deposit (number)</div>
              <input
                value={formMinDeposit}
                onChange={(e) => setFormMinDeposit(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Regulation</div>
              <input
                value={formRegulation}
                onChange={(e) => setFormRegulation(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Spread From</div>
              <input
                value={formSpreadFrom}
                onChange={(e) => setFormSpreadFrom(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Cashback Rate</div>
              <input
                value={formCashbackRate}
                onChange={(e) => setFormCashbackRate(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Crypto</div>
              <select
                value={formCrypto}
                onChange={(e) => setFormCrypto(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Description</div>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: "#132E58", marginBottom: 6 }}>Logo URL (optional)</div>
              <input
                value={formLogoUrl}
                onChange={(e) => setFormLogoUrl(e.target.value)}
                placeholder="https://…"
                style={{ width: "100%", padding: "0.75rem 0.9rem", borderRadius: 10, border: "2px solid #e5e7eb" }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={formTopCashback} onChange={(e) => setFormTopCashback(e.target.checked)} />
              <span style={{ fontWeight: 600, color: "#132E58" }}>Top Cashback</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={formVerified} onChange={(e) => setFormVerified(e.target.checked)} />
              <span style={{ fontWeight: 600, color: "#132E58" }}>Verified</span>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default BrokersManagement;
