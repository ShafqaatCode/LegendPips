import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiDatabase,
  FiShield, FiStar, FiDollarSign, FiTrendingUp, FiGlobe, FiCpu, FiAward,
} from "react-icons/fi";
import SimpleModal from "../../../components/AdminPanel/SimpleModal";
import { CourseGridSkeleton } from "../../../components/SharedComponents/Shimmer";
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, SearchInput, FilterCount,
  ErrorBanner, Pill, adminColors,
} from "../../../components/AdminPanel/adminUi";
import {
  adminCreateBroker,
  adminDeleteBroker,
  adminFetchBrokers,
  adminUpdateBroker,
  type ApiBroker,
  type PropCashbackOffer,
  type PropPromoCode,
} from "../../../services/brokerService";
import {
  BROKER_KIND_COLORS,
  BROKER_KIND_DESCRIPTIONS,
  BROKER_KIND_LABELS,
  BROKER_KIND_ORDER,
  brokerKindLabel,
  matchesBrokerKind,
  type BrokerCategoryValue,
  type BrokerKind,
} from "../../../utils/brokerTypes";

const emptyPropOffer = (): PropCashbackOffer => ({
  label: "Standard",
  firstPurchaseCashback: "",
  repeatPurchaseCashback: "",
  discountPercent: "",
  discountCode: "",
  evaluationType: undefined,
  profitSplit: "",
  accountSize: "",
  challengeFee: "",
  profitTarget: "",
  dailyDrawdown: "",
  maxDrawdown: "",
  minTradingDays: "",
  payoutCycle: "",
  scalingPlan: "",
  rulesUrl: "",
});

const emptyPromo = () => ({ code: "", label: "", percent: "", expiresAt: "", active: true });

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
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

const TypeFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1rem;
`;

const TypeFilterBtn = styled.button<{ $active?: boolean; $tone?: BrokerKind }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.48rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid
    ${({ $active, $tone }) =>
      $active
        ? $tone
          ? BROKER_KIND_COLORS[$tone].border
          : adminColors.navy
        : adminColors.border};
  background: ${({ $active, $tone }) =>
    $active
      ? $tone
        ? BROKER_KIND_COLORS[$tone].soft
        : adminColors.navy
      : "white"};
  color: ${({ $active, $tone }) =>
    $active
      ? $tone
        ? BROKER_KIND_COLORS[$tone].color
        : "white"
      : adminColors.navy};
  transition: all 0.12s;

  &:hover {
    border-color: ${({ $tone }) =>
      $tone ? BROKER_KIND_COLORS[$tone].border : adminColors.navy};
  }
`;

const TypeBadge = styled.span<{ $kind: BrokerKind | "both" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${({ $kind }) =>
    $kind === "both"
      ? "#e0f2fe"
      : BROKER_KIND_COLORS[$kind].bg};
  color: ${({ $kind }) =>
    $kind === "both" ? "#0369a1" : BROKER_KIND_COLORS[$kind].color};
`;

const TypePicker = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.55rem;
  margin-bottom: 0.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TypeCard = styled.button<{ $active?: boolean; $kind: BrokerKind }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0.85rem 0.9rem;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  border: 2px solid
    ${({ $active, $kind }) =>
      $active ? BROKER_KIND_COLORS[$kind].border : adminColors.border};
  background: ${({ $active, $kind }) =>
    $active ? BROKER_KIND_COLORS[$kind].soft : "white"};
  transition: all 0.12s;
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 14px rgba(15, 23, 42, 0.08)" : "none"};

  &:hover {
    border-color: ${({ $kind }) => BROKER_KIND_COLORS[$kind].border};
  }

  .icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $kind }) => BROKER_KIND_COLORS[$kind].bg};
    color: ${({ $kind }) => BROKER_KIND_COLORS[$kind].color};
    font-size: 1rem;
  }

  .title {
    font-size: 0.8125rem;
    font-weight: 800;
    color: ${adminColors.navy};
  }

  .desc {
    font-size: 0.6875rem;
    color: ${adminColors.muted};
    line-height: 1.35;
  }
`;

const BothOption = styled.label`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${adminColors.muted};
  cursor: pointer;
  padding: 0.35rem 0.15rem;

  input { accent-color: ${adminColors.navy}; }
`;

const KIND_ICONS: Record<BrokerKind, React.ReactNode> = {
  forex: <FiGlobe />,
  crypto: <FiCpu />,
  prop: <FiAward />,
};

const BrokersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.9rem;
`;

const BrokerCard = styled.article`
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
    radial-gradient(ellipse 80% 100% at 100% 0%, rgba(251, 191, 36, 0.1) 0%, transparent 55%),
    linear-gradient(180deg, #f8fafc 0%, white 100%);
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
`;

const LogoBox = styled.div<{ $img?: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  flex-shrink: 0;
  background: ${({ $img }) =>
    $img
      ? `url(${$img}) center/contain no-repeat #fff`
      : `linear-gradient(145deg, ${adminColors.navy} 0%, ${adminColors.navyLight} 100%)`};
  border: 1px solid ${adminColors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(19, 46, 88, 0.12);
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.label<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
  min-width: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${adminColors.navy};

  input, select, textarea {
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

  textarea { min-height: 72px; resize: vertical; }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  grid-column: 1 / -1;
  font-weight: 600;
  color: ${adminColors.navy};
  font-size: 0.8125rem;
  padding: 0.5rem 0.65rem;
  border-radius: 9px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  cursor: pointer;

  input { accent-color: ${adminColors.navy}; width: 16px; height: 16px; }
`;

const PropTiersBox = styled.div`
  grid-column: 1 / -1;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  padding: 0.85rem;
  background: #fafbfc;
`;

const TypeSectionTitle = styled.div`
  grid-column: 1 / -1;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${adminColors.navy};
  margin-bottom: -0.15rem;
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
  const [listTypeFilter, setListTypeFilter] = useState<"all" | BrokerKind>("all");

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
  const [formRebateCategory, setFormRebateCategory] = useState<BrokerCategoryValue>("forex");
  const [formBothTabs, setFormBothTabs] = useState(false);
  const [formRebatesListOrder, setFormRebatesListOrder] = useState("1");
  const [formSetupUrl, setFormSetupUrl] = useState("");
  const [formRebatesStarRating, setFormRebatesStarRating] = useState("4");
  const [formRebatesReviewsLabel, setFormRebatesReviewsLabel] = useState("");
  const [formRebatesFeatured, setFormRebatesFeatured] = useState(false);
  const [formPropOffers, setFormPropOffers] = useState<PropCashbackOffer[]>([emptyPropOffer()]);
  const [formPropPromoCodes, setFormPropPromoCodes] = useState<PropPromoCode[]>([emptyPromo()]);
  const [formCountry, setFormCountry] = useState("");
  const [formLeverage, setFormLeverage] = useState("");
  const [formPlatforms, setFormPlatforms] = useState("");
  const [formCommission, setFormCommission] = useState("");
  const [formScoreReg, setFormScoreReg] = useState("");
  const [formScoreCond, setFormScoreCond] = useState("");
  const [formScoreWd, setFormScoreWd] = useState("");
  const [formScoreUx, setFormScoreUx] = useState("");
  const [formScoreComp, setFormScoreComp] = useState("");
  const [formScoreSup, setFormScoreSup] = useState("");

  const setPrimaryType = (kind: BrokerKind) => {
    setFormBothTabs(false);
    setFormRebateCategory(kind);
    if (kind === "crypto") setFormCrypto("Yes");
  };

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
    setFormRebateCategory("forex");
    setFormBothTabs(false);
    setFormRebatesListOrder("1");
    setFormSetupUrl("");
    setFormRebatesStarRating("4");
    setFormRebatesReviewsLabel("");
    setFormRebatesFeatured(false);
    setFormPropOffers([emptyPropOffer()]);
    setFormPropPromoCodes([emptyPromo()]);
    setFormCountry("");
    setFormLeverage("");
    setFormPlatforms("");
    setFormCommission("");
    setFormScoreReg("");
    setFormScoreCond("");
    setFormScoreWd("");
    setFormScoreUx("");
    setFormScoreComp("");
    setFormScoreSup("");
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
    const cat = b.rebateCategory || "forex";
    setFormBothTabs(cat === "both");
    setFormRebateCategory(cat === "both" ? "forex" : cat);
    setFormRebatesListOrder(String(b.rebatesListOrder ?? 0));
    setFormSetupUrl(b.setupUrl || "");
    setFormRebatesStarRating(String(b.rebatesStarRating ?? 4));
    setFormRebatesReviewsLabel(b.rebatesReviewsLabel || "");
    setFormRebatesFeatured(!!b.rebatesFeatured);
    setFormPropOffers(
      b.propOffers?.length ? b.propOffers.map((o) => ({ ...emptyPropOffer(), ...o })) : [emptyPropOffer()]
    );
    setFormPropPromoCodes(
      b.propPromoCodes?.length ? b.propPromoCodes.map((p) => ({ ...emptyPromo(), ...p })) : [emptyPromo()]
    );
    setFormCountry(b.country || "");
    setFormLeverage(b.leverage || "");
    setFormPlatforms(b.platforms || "");
    setFormCommission(b.commission || "");
    setFormScoreReg(b.legendScoreParts?.regulation != null ? String(b.legendScoreParts.regulation) : "");
    setFormScoreCond(b.legendScoreParts?.tradingConditions != null ? String(b.legendScoreParts.tradingConditions) : "");
    setFormScoreWd(b.legendScoreParts?.withdrawals != null ? String(b.legendScoreParts.withdrawals) : "");
    setFormScoreUx(b.legendScoreParts?.userExperience != null ? String(b.legendScoreParts.userExperience) : "");
    setFormScoreComp(b.legendScoreParts?.complaints != null ? String(b.legendScoreParts.complaints) : "");
    setFormScoreSup(b.legendScoreParts?.support != null ? String(b.legendScoreParts.support) : "");
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
    const rebatesListOrder = Number(formRebatesListOrder);
    if (Number.isNaN(rebatesListOrder) || rebatesListOrder < 0) {
      setModalError("Rebates list order must be 0 or greater");
      return;
    }

    setSaving(true);
    setModalError(null);
    try {
      const rebateCategory: BrokerCategoryValue =
        formBothTabs && formRebateCategory !== "prop" ? "both" : formRebateCategory;

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
        rebateCategory,
        rebatesListOrder: rebatesListOrder > 0 ? rebatesListOrder : 0,
        setupUrl: formSetupUrl.trim() || undefined,
        country: formCountry.trim(),
        leverage: formLeverage.trim(),
        platforms: formPlatforms.trim(),
        commission: formCommission.trim(),
        legendScoreParts: {
          regulation: formScoreReg ? Number(formScoreReg) : undefined,
          tradingConditions: formScoreCond ? Number(formScoreCond) : undefined,
          withdrawals: formScoreWd ? Number(formScoreWd) : undefined,
          userExperience: formScoreUx ? Number(formScoreUx) : undefined,
          complaints: formScoreComp ? Number(formScoreComp) : undefined,
          support: formScoreSup ? Number(formScoreSup) : undefined,
        },
        rebatesStarRating: Number(formRebatesStarRating) || undefined,
        rebatesReviewsLabel: formRebatesReviewsLabel.trim() || undefined,
        rebatesFeatured: formRebatesFeatured,
        propOffers:
          rebateCategory === "prop"
            ? formPropOffers
                .filter((o) => o.label.trim())
                .map((o) => ({
                  label: o.label.trim(),
                  firstPurchaseCashback: o.firstPurchaseCashback?.trim() || undefined,
                  repeatPurchaseCashback: o.repeatPurchaseCashback?.trim() || undefined,
                  discountPercent: o.discountPercent?.trim() || undefined,
                  discountCode: o.discountCode?.trim() || undefined,
                  evaluationType: o.evaluationType || undefined,
                  profitSplit: o.profitSplit?.trim() || undefined,
                  accountSize: o.accountSize?.trim() || undefined,
                  challengeFee: o.challengeFee?.trim() || undefined,
                  profitTarget: o.profitTarget?.trim() || undefined,
                  dailyDrawdown: o.dailyDrawdown?.trim() || undefined,
                  maxDrawdown: o.maxDrawdown?.trim() || undefined,
                  minTradingDays: o.minTradingDays?.trim() || undefined,
                  payoutCycle: o.payoutCycle?.trim() || undefined,
                  scalingPlan: o.scalingPlan?.trim() || undefined,
                  rulesUrl: o.rulesUrl?.trim() || undefined,
                }))
            : [],
        propPromoCodes:
          rebateCategory === "prop"
            ? formPropPromoCodes
                .filter((p) => p.code.trim())
                .map((p) => ({
                  code: p.code.trim(),
                  label: p.label?.trim() || undefined,
                  percent: p.percent?.trim() || undefined,
                  expiresAt: p.expiresAt?.trim() || undefined,
                  active: p.active !== false,
                }))
            : [],
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

  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      listTypeFilter === "all" || matchesBrokerKind(broker.rebateCategory, listTypeFilter);
    return matchesSearch && matchesType;
  });

  const countByKind = (kind: BrokerKind) =>
    brokers.filter((b) => matchesBrokerKind(b.rebateCategory, kind)).length;

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiDatabase /> Brokers</PageTitle>
          <PageSubtitle>
            Manage Forex brokers, Crypto exchanges, and Prop firms — shown on matching website tabs
          </PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> Add broker
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: "#dbeafe", color: "#2563eb" }}><FiDatabase /></div>
          <div>
            <div className="val">{listLoading ? "…" : brokers.length}</div>
            <div className="lbl">Total</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: BROKER_KIND_COLORS.forex.bg, color: BROKER_KIND_COLORS.forex.color }}><FiGlobe /></div>
          <div>
            <div className="val">{listLoading ? "…" : countByKind("forex")}</div>
            <div className="lbl">Forex</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: BROKER_KIND_COLORS.crypto.bg, color: BROKER_KIND_COLORS.crypto.color }}><FiCpu /></div>
          <div>
            <div className="val">{listLoading ? "…" : countByKind("crypto")}</div>
            <div className="lbl">Crypto</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: BROKER_KIND_COLORS.prop.bg, color: BROKER_KIND_COLORS.prop.color }}><FiAward /></div>
          <div>
            <div className="val">{listLoading ? "…" : countByKind("prop")}</div>
            <div className="lbl">Prop firms</div>
          </div>
        </MiniStat>
      </StatsRow>

      <TypeFilterBar>
        <TypeFilterBtn
          type="button"
          $active={listTypeFilter === "all"}
          onClick={() => setListTypeFilter("all")}
        >
          All types
        </TypeFilterBtn>
        {BROKER_KIND_ORDER.map((kind) => (
          <TypeFilterBtn
            key={kind}
            type="button"
            $active={listTypeFilter === kind}
            $tone={kind}
            onClick={() => setListTypeFilter(kind)}
          >
            {KIND_ICONS[kind]}
            {BROKER_KIND_LABELS[kind]}
            <span style={{ opacity: 0.7 }}>({listLoading ? "…" : countByKind(kind)})</span>
          </TypeFilterBtn>
        ))}
      </TypeFilterBar>

      <FilterBar>
        <SearchInput style={{ maxWidth: 320, flex: 1 }}>
          <FiSearch />
          <input
            type="text"
            placeholder="Search brokers…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterCount>
          {listLoading ? "Loading…" : `${filteredBrokers.length} shown`}
        </FilterCount>
      </FilterBar>

      {listError && <ErrorBanner>{listError}</ErrorBanner>}

      {listLoading ? (
        <CourseGridSkeleton cards={6} />
      ) : (
        <BrokersGrid>
          {filteredBrokers.length === 0 ? (
            <EmptyState>
              <strong>No brokers found</strong>
              {searchTerm ? "Try a different search." : "Add your first broker to get started."}
            </EmptyState>
          ) : (
            filteredBrokers.map((broker) => (
              <BrokerCard key={broker._id}>
                <CardTop>
                  <LogoBox $img={broker.logoUrl || undefined}>
                    {!broker.logoUrl && broker.name.slice(0, 2).toUpperCase()}
                  </LogoBox>
                  <CardTitle>
                    <h3 title={broker.name}>{broker.name}</h3>
                    <BadgeRow>
                      <TypeBadge
                        $kind={
                          broker.rebateCategory === "both"
                            ? "both"
                            : broker.rebateCategory === "crypto" ||
                                broker.rebateCategory === "prop"
                              ? broker.rebateCategory
                              : "forex"
                        }
                      >
                        {brokerKindLabel(broker.rebateCategory)}
                      </TypeBadge>
                      {broker.verified && <Pill $variant="approved">Verified</Pill>}
                      {broker.topCashback && <Pill $variant="pending">Top cashback</Pill>}
                      {broker.rebatesFeatured && <Pill $variant="admin">Featured</Pill>}
                    </BadgeRow>
                  </CardTitle>
                </CardTop>

                <CardBody>
                  <Metric>
                    <div className="k"><FiDollarSign style={{ display: "inline", marginRight: 2 }} />Min deposit</div>
                    <div className="v">${broker.minDeposit}</div>
                  </Metric>
                  <Metric>
                    <div className="k"><FiShield style={{ display: "inline", marginRight: 2 }} />Regulation</div>
                    <div className="v">{broker.regulation || "—"}</div>
                  </Metric>
                  <Metric>
                    <div className="k"><FiTrendingUp style={{ display: "inline", marginRight: 2 }} />Spread</div>
                    <div className="v">{broker.spreadFrom || "—"}</div>
                  </Metric>
                  <Metric>
                    <div className="k"><FiStar style={{ display: "inline", marginRight: 2 }} />Cashback</div>
                    <div className="v">{broker.cashbackRate || "—"}</div>
                  </Metric>
                  <Metric>
                    <div className="k">Rebates order</div>
                    <div className="v">{broker.rebatesListOrder ?? "—"}</div>
                  </Metric>
                  <Metric>
                    <div className="k">Crypto</div>
                    <div className="v">{broker.crypto || "No"}</div>
                  </Metric>
                </CardBody>

                <CardFooter>
                  <GhostButton $sm type="button" onClick={() => openEdit(broker)} style={{ flex: 1, justifyContent: "center" }}>
                    <FiEdit2 /> Edit
                  </GhostButton>
                  <GhostButton $sm $danger type="button" onClick={() => openDelete(broker._id)} style={{ flex: 1, justifyContent: "center" }}>
                    <FiTrash2 /> Delete
                  </GhostButton>
                </CardFooter>
              </BrokerCard>
            ))
          )}
        </BrokersGrid>
      )}

      <SimpleModal
        isOpen={isModalOpen}
        size="lg"
        title={modalMode === "add" ? "Add New Broker" : modalMode === "edit" ? "Edit Broker" : "Delete Broker"}
        onClose={() => !saving && setIsModalOpen(false)}
        footer={
          modalMode === "delete" ? (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </GhostButton>
              <GhostButton type="button" $danger onClick={confirmDelete} disabled={saving}>
                <FiTrash2 />
                {saving ? "Deleting…" : "Delete"}
              </GhostButton>
            </>
          ) : (
            <>
              <GhostButton type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </GhostButton>
              <PrimaryButton type="button" onClick={submitForm} disabled={saving}>
                <FiCheck />
                {saving ? "Saving…" : "Save broker"}
              </PrimaryButton>
            </>
          )
        }
      >
        {modalError && (
          <div style={{ color: "#b91c1c", marginBottom: 12, fontSize: 13, fontWeight: 600 }}>{modalError}</div>
        )}
        {modalMode === "delete" ? (
          <div style={{ color: adminColors.muted, fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to permanently delete this broker? This cannot be undone.
          </div>
        ) : (
          <FormGrid>
            <TypeSectionTitle>Broker type</TypeSectionTitle>
            <TypePicker>
              {BROKER_KIND_ORDER.map((kind) => (
                <TypeCard
                  key={kind}
                  type="button"
                  $kind={kind}
                  $active={
                    formBothTabs
                      ? kind === "forex" || kind === "crypto"
                      : formRebateCategory === kind
                  }
                  onClick={() => setPrimaryType(kind)}
                >
                  <span className="icon">{KIND_ICONS[kind]}</span>
                  <span className="title">{BROKER_KIND_LABELS[kind]}</span>
                  <span className="desc">{BROKER_KIND_DESCRIPTIONS[kind]}</span>
                </TypeCard>
              ))}
            </TypePicker>
            {formRebateCategory !== "prop" && (
              <BothOption>
                <input
                  type="checkbox"
                  checked={formBothTabs}
                  onChange={(e) => setFormBothTabs(e.target.checked)}
                />
                Also show on both Forex and Crypto website tabs
              </BothOption>
            )}
            <FormField>
              Broker Name
              <input value={formName} onChange={(e) => setFormName(e.target.value)} />
            </FormField>
            <FormField>
              Min Deposit (number)
              <input value={formMinDeposit} onChange={(e) => setFormMinDeposit(e.target.value)} />
            </FormField>
            <FormField>
              Regulation
              <input value={formRegulation} onChange={(e) => setFormRegulation(e.target.value)} />
            </FormField>
            <FormField>
              Country
              <input value={formCountry} onChange={(e) => setFormCountry(e.target.value)} placeholder="Cyprus, St. Vincent…" />
            </FormField>
            <FormField>
              Leverage
              <input value={formLeverage} onChange={(e) => setFormLeverage(e.target.value)} placeholder="1:500" />
            </FormField>
            <FormField>
              Platforms
              <input value={formPlatforms} onChange={(e) => setFormPlatforms(e.target.value)} placeholder="MT4, MT5, cTrader" />
            </FormField>
            <FormField>
              Commission
              <input value={formCommission} onChange={(e) => setFormCommission(e.target.value)} placeholder="$3.5 / lot" />
            </FormField>
            <FormField>
              LegendScore regulation 0–10 (blank = auto)
              <input value={formScoreReg} onChange={(e) => setFormScoreReg(e.target.value)} />
            </FormField>
            <FormField>
              LegendScore conditions 0–10
              <input value={formScoreCond} onChange={(e) => setFormScoreCond(e.target.value)} />
            </FormField>
            <FormField>
              LegendScore withdrawals 0–10
              <input value={formScoreWd} onChange={(e) => setFormScoreWd(e.target.value)} />
            </FormField>
            <FormField>
              LegendScore UX 0–10
              <input value={formScoreUx} onChange={(e) => setFormScoreUx(e.target.value)} />
            </FormField>
            <FormField>
              LegendScore complaints 0–10
              <input value={formScoreComp} onChange={(e) => setFormScoreComp(e.target.value)} />
            </FormField>
            <FormField>
              LegendScore support 0–10
              <input value={formScoreSup} onChange={(e) => setFormScoreSup(e.target.value)} />
            </FormField>
            <FormField>
              Spread From
              <input value={formSpreadFrom} onChange={(e) => setFormSpreadFrom(e.target.value)} />
            </FormField>
            <FormField>
              Cashback Rate
              <input value={formCashbackRate} onChange={(e) => setFormCashbackRate(e.target.value)} />
            </FormField>
            <FormField>
              Crypto instruments
              <select value={formCrypto} onChange={(e) => setFormCrypto(e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </FormField>
            <FormField $full>
              Description
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} />
            </FormField>
            <FormField>
              Website list order (1+ shows on /rebates; 0 = hide from rebates)
              <input
                value={formRebatesListOrder}
                onChange={(e) => setFormRebatesListOrder(e.target.value)}
                type="number"
                min={0}
              />
            </FormField>
            <FormField>
              Logo URL (optional)
              <input
                value={formLogoUrl}
                onChange={(e) => setFormLogoUrl(e.target.value)}
                placeholder="https://…"
              />
            </FormField>
            <FormField>
              Challenge / signup URL
              <input
                value={formSetupUrl}
                onChange={(e) => setFormSetupUrl(e.target.value)}
                placeholder="https://partner-link…"
              />
            </FormField>
            <FormField>
              Star rating (1–5)
              <input
                type="number"
                min={1}
                max={5}
                value={formRebatesStarRating}
                onChange={(e) => setFormRebatesStarRating(e.target.value)}
              />
            </FormField>
            <FormField>
              Reviews label (e.g. 52 traders)
              <input
                value={formRebatesReviewsLabel}
                onChange={(e) => setFormRebatesReviewsLabel(e.target.value)}
              />
            </FormField>
            {formRebateCategory === "prop" && !formBothTabs && (
              <PropTiersBox>
                <div style={{ fontWeight: 800, color: adminColors.navy, fontSize: "0.8125rem", marginBottom: 10 }}>
                  Prop cashback tiers
                </div>
                {formPropOffers.map((offer, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gap: 8,
                      marginBottom: 12,
                      paddingBottom: 12,
                      borderBottom: idx < formPropOffers.length - 1 ? `1px solid ${adminColors.border}` : "none",
                    }}
                  >
                    <input
                      placeholder="Program label (e.g. 1 Phase)"
                      value={offer.label}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], label: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="First purchase (e.g. 7%)"
                      value={offer.firstPurchaseCashback || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], firstPurchaseCashback: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Repeat purchase (e.g. 3.5%)"
                      value={offer.repeatPurchaseCashback || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], repeatPurchaseCashback: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Discount (e.g. 25%)"
                      value={offer.discountPercent || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], discountPercent: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Discount code (e.g. LEGEND25)"
                      value={offer.discountCode || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], discountCode: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <select
                      value={offer.evaluationType || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = {
                          ...next[idx],
                          evaluationType: (e.target.value || undefined) as PropCashbackOffer["evaluationType"],
                        };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    >
                      <option value="">Evaluation type</option>
                      <option value="1-step">1-step</option>
                      <option value="2-step">2-step</option>
                      <option value="instant">Instant funded</option>
                      <option value="funded">Funded account</option>
                    </select>
                    <input
                      placeholder="Profit split (e.g. 80%)"
                      value={offer.profitSplit || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], profitSplit: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Account size (e.g. $100k)"
                      value={offer.accountSize || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], accountSize: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Challenge fee (e.g. $99)"
                      value={offer.challengeFee || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], challengeFee: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Profit target (e.g. 8%)"
                      value={offer.profitTarget || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], profitTarget: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Daily drawdown (e.g. 5%)"
                      value={offer.dailyDrawdown || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], dailyDrawdown: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Max drawdown (e.g. 10%)"
                      value={offer.maxDrawdown || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], maxDrawdown: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Min trading days"
                      value={offer.minTradingDays || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], minTradingDays: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Payout cycle (e.g. Bi-weekly)"
                      value={offer.payoutCycle || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], payoutCycle: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Scaling plan"
                      value={offer.scalingPlan || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], scalingPlan: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Rules URL"
                      value={offer.rulesUrl || ""}
                      onChange={(e) => {
                        const next = [...formPropOffers];
                        next[idx] = { ...next[idx], rulesUrl: e.target.value };
                        setFormPropOffers(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    {formPropOffers.length > 1 && (
                      <GhostButton
                        $sm
                        $danger
                        type="button"
                        onClick={() => setFormPropOffers(formPropOffers.filter((_, i) => i !== idx))}
                      >
                        Remove tier
                      </GhostButton>
                    )}
                  </div>
                ))}
                <GhostButton type="button" $sm onClick={() => setFormPropOffers([...formPropOffers, emptyPropOffer()])}>
                  <FiPlus /> Add tier
                </GhostButton>
                <div style={{ fontWeight: 800, color: adminColors.navy, fontSize: "0.8125rem", margin: "14px 0 10px" }}>
                  Promo / discount codes
                </div>
                {formPropPromoCodes.map((promo, idx) => (
                  <div
                    key={`promo-${idx}`}
                    style={{
                      display: "grid",
                      gap: 8,
                      marginBottom: 12,
                      paddingBottom: 12,
                      borderBottom: idx < formPropPromoCodes.length - 1 ? `1px solid ${adminColors.border}` : "none",
                    }}
                  >
                    <input
                      placeholder="Code (e.g. LEGEND25)"
                      value={promo.code}
                      onChange={(e) => {
                        const next = [...formPropPromoCodes];
                        next[idx] = { ...next[idx], code: e.target.value };
                        setFormPropPromoCodes(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Label"
                      value={promo.label || ""}
                      onChange={(e) => {
                        const next = [...formPropPromoCodes];
                        next[idx] = { ...next[idx], label: e.target.value };
                        setFormPropPromoCodes(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Percent (e.g. 25%)"
                      value={promo.percent || ""}
                      onChange={(e) => {
                        const next = [...formPropPromoCodes];
                        next[idx] = { ...next[idx], percent: e.target.value };
                        setFormPropPromoCodes(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <input
                      placeholder="Expires (optional)"
                      value={promo.expiresAt || ""}
                      onChange={(e) => {
                        const next = [...formPropPromoCodes];
                        next[idx] = { ...next[idx], expiresAt: e.target.value };
                        setFormPropPromoCodes(next);
                      }}
                      style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                    />
                    <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.8rem" }}>
                      <input
                        type="checkbox"
                        checked={promo.active !== false}
                        onChange={(e) => {
                          const next = [...formPropPromoCodes];
                          next[idx] = { ...next[idx], active: e.target.checked };
                          setFormPropPromoCodes(next);
                        }}
                      />
                      Active
                    </label>
                    {formPropPromoCodes.length > 1 && (
                      <GhostButton
                        $sm
                        $danger
                        type="button"
                        onClick={() => setFormPropPromoCodes(formPropPromoCodes.filter((_, i) => i !== idx))}
                      >
                        Remove code
                      </GhostButton>
                    )}
                  </div>
                ))}
                <GhostButton type="button" $sm onClick={() => setFormPropPromoCodes([...formPropPromoCodes, emptyPromo()])}>
                  <FiPlus /> Add promo code
                </GhostButton>
              </PropTiersBox>
            )}
            <CheckboxRow>
              <input
                type="checkbox"
                checked={formRebatesFeatured}
                onChange={(e) => setFormRebatesFeatured(e.target.checked)}
              />
              <span>Featured on rebates list</span>
            </CheckboxRow>
            <CheckboxRow>
              <input type="checkbox" checked={formTopCashback} onChange={(e) => setFormTopCashback(e.target.checked)} />
              <span>Top Cashback</span>
            </CheckboxRow>
            <CheckboxRow>
              <input type="checkbox" checked={formVerified} onChange={(e) => setFormVerified(e.target.checked)} />
              <span>Verified</span>
            </CheckboxRow>
          </FormGrid>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default BrokersManagement;
