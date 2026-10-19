import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiDatabase,
  FiShield, FiStar, FiDollarSign, FiTrendingUp, FiGlobe, FiCpu, FiAward, FiTarget, FiCreditCard, FiEyeOff, FiEye,
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
  adminUploadBrokerLogo,
  type ApiBroker,
  type PropCashbackOffer,
  type PropPromoCode,
} from "../../../services/brokerService";
import {
  BROKER_KIND_COLORS,
  BROKER_KIND_DESCRIPTIONS,
  BROKER_KIND_LABELS,
  BROKER_KIND_SHORT,
  brokerKindLabel,
  matchesBrokerKind,
  type BrokerCategoryValue,
  type BrokerKind,
} from "../../../utils/brokerTypes";
import { normalizeBrokerLogoUrl } from "../../../utils/brokerLogoUrl";
import BrokerLogo from "../../../components/Broker/BrokerLogo";

/** Admin “Brokers” panel kinds (prop firms have their own panel). */
const BROKER_PANEL_KINDS: BrokerKind[] = ["forex", "crypto", "binary", "ewallet"];

export type BrokersPanelMode = "brokers" | "prop";

type VisibilityFilter = "all" | "visible" | "hidden" | "disabled";

type BrokersManagementProps = {
  /** `brokers` = forex/crypto/binary/ewallet; `prop` = prop firms only */
  panelMode?: BrokersPanelMode;
};

function isPropBroker(b: Pick<ApiBroker, "rebateCategory">): boolean {
  return matchesBrokerKind(b.rebateCategory, "prop");
}

function brokerRegulationsToInput(b: ApiBroker): string {
  if (Array.isArray(b.regulations) && b.regulations.length) return b.regulations.join(", ");
  const r = (b.regulation || "").trim();
  return r === "—" ? "" : r;
}

function parseRegulationsInput(raw: string): string[] {
  return raw
    .split(/[,;|]/)
    .map((r) => r.trim())
    .filter(Boolean);
}

function displayBrokerRegulations(b: ApiBroker): string {
  const regs =
    Array.isArray(b.regulations) && b.regulations.length
      ? b.regulations
      : parseRegulationsInput(b.regulation || "");
  return regs.length ? regs.join(", ") : "—";
}

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
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 700px) { grid-template-columns: repeat(2, 1fr); }
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
  grid-template-columns: repeat(2, 1fr);
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
  binary: <FiTarget />,
  ewallet: <FiCreditCard />,
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

const CompareHint = styled.p`
  grid-column: 1 / -1;
  margin: 0 0 0.15rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.45;
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
  temporarilyDisabled: false,
});

const BrokersManagement: React.FC<BrokersManagementProps> = ({ panelMode = "brokers" }) => {
  const isPropPanel = panelMode === "prop";
  const panelKinds = isPropPanel ? (["prop"] as BrokerKind[]) : BROKER_PANEL_KINDS;

  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [listTypeFilter, setListTypeFilter] = useState<"all" | BrokerKind>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formMinDeposit, setFormMinDeposit] = useState("100");
  const [formRegulations, setFormRegulations] = useState("");
  const [formSpreadFrom, setFormSpreadFrom] = useState("0.0 pips");
  const [formCashbackRate, setFormCashbackRate] = useState("0.35 pip");
  const [formTopCashback, setFormTopCashback] = useState(false);
  const [formVerified, setFormVerified] = useState(true);
  const [formTemporarilyDisabled, setFormTemporarilyDisabled] = useState(false);
  const [formPublished, setFormPublished] = useState(true);
  const [formForBeginners, setFormForBeginners] = useState(false);
  const [formBeginnerBlurb, setFormBeginnerBlurb] = useState("");
  const [formBeginnerSortOrder, setFormBeginnerSortOrder] = useState("0");
  const [formBlacklisted, setFormBlacklisted] = useState(false);
  const [formBlacklistReason, setFormBlacklistReason] = useState("");
  const [formCrypto, setFormCrypto] = useState("No");
  const [programFilter, setProgramFilter] = useState<"all" | "beginners" | "shield">("all");
  const [formDescription, setFormDescription] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
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
  const [formServedCountries, setFormServedCountries] = useState("");
  const [formLeverage, setFormLeverage] = useState("");
  const [formPlatforms, setFormPlatforms] = useState("");
  const [formCommission, setFormCommission] = useState("");
  const [formSwapFrom, setFormSwapFrom] = useState("");
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
    setFormRegulations("");
    setFormSpreadFrom("0.0 pips");
    setFormCashbackRate("0.35 pip");
    setFormTopCashback(false);
    setFormVerified(true);
    setFormTemporarilyDisabled(false);
    setFormPublished(true);
    setFormForBeginners(false);
    setFormBeginnerBlurb("");
    setFormBeginnerSortOrder("0");
    setFormBlacklisted(false);
    setFormBlacklistReason("");
    setFormCrypto("No");
    setFormDescription("");
    setFormLogoUrl("");
    setFormRebateCategory(isPropPanel ? "prop" : "forex");
    setFormBothTabs(false);
    setFormRebatesListOrder("1");
    setFormSetupUrl("");
    setFormRebatesStarRating("4");
    setFormRebatesReviewsLabel("");
    setFormRebatesFeatured(false);
    setFormPropOffers([emptyPropOffer()]);
    setFormPropPromoCodes([emptyPromo()]);
    setFormCountry("");
    setFormServedCountries("");
    setFormLeverage("");
    setFormPlatforms("");
    setFormCommission("");
    setFormSwapFrom("");
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
    setFormRegulations(brokerRegulationsToInput(b));
    setFormSpreadFrom(b.spreadFrom);
    setFormCashbackRate(b.cashbackRate || "0.35 pip");
    setFormTopCashback(!!b.topCashback);
    setFormVerified(!!b.verified);
    setFormTemporarilyDisabled(!!b.temporarilyDisabled);
    setFormPublished(b.published !== false);
    setFormForBeginners(!!b.forBeginners);
    setFormBeginnerBlurb(b.beginnerBlurb || "");
    setFormBeginnerSortOrder(String(b.beginnerSortOrder ?? 0));
    setFormBlacklisted(!!b.blacklisted);
    setFormBlacklistReason(b.blacklistReason || "");
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
    setFormServedCountries(Array.isArray(b.servedCountries) ? b.servedCountries.join(", ") : "");
    setFormLeverage(b.leverage || "");
    setFormPlatforms(b.platforms || "");
    setFormCommission(b.commission || "");
    setFormSwapFrom(b.swapFrom || "");
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

  const onBrokerLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setModalError("Logo must be 5 MB or smaller");
      return;
    }
    setLogoUploading(true);
    setModalError(null);
    try {
      const brokerId = modalMode === "edit" ? selectedBrokerId || undefined : undefined;
      const { url, broker } = await adminUploadBrokerLogo(file, brokerId);
      setFormLogoUrl(url);
      if (broker) {
        setBrokers((prev) => prev.map((b) => (b._id === broker._id ? broker : b)));
      }
    } catch (err: any) {
      setModalError(err.message || "Logo upload failed");
    } finally {
      setLogoUploading(false);
    }
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
      const rebateCategory: BrokerCategoryValue = isPropPanel
        ? "prop"
        : formBothTabs && (formRebateCategory === "forex" || formRebateCategory === "crypto")
          ? "both"
          : formRebateCategory === "both"
            ? "forex"
            : formRebateCategory === "prop"
              ? "forex"
              : formRebateCategory;

      const base = {
        name,
        minDeposit,
        regulations: parseRegulationsInput(formRegulations),
        spreadFrom: formSpreadFrom.trim(),
        cashbackRate: formCashbackRate.trim(),
        topCashback: formTopCashback,
        verified: formVerified,
        temporarilyDisabled: formTemporarilyDisabled,
        published: formPublished,
        forBeginners: formForBeginners && !formBlacklisted,
        beginnerBlurb: formBeginnerBlurb.trim(),
        beginnerSortOrder: Number(formBeginnerSortOrder) || 0,
        blacklisted: formBlacklisted,
        blacklistReason: formBlacklistReason.trim(),
        crypto: formCrypto,
        description: formDescription.trim(),
        logoUrl: normalizeBrokerLogoUrl(formLogoUrl) || undefined,
        rebateCategory,
        rebatesListOrder: rebatesListOrder > 0 ? rebatesListOrder : 0,
        setupUrl: formSetupUrl.trim() || undefined,
        country: formCountry.trim(),
        servedCountries: formServedCountries
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        leverage: formLeverage.trim(),
        platforms: formPlatforms.trim(),
        commission: formCommission.trim(),
        swapFrom: formSwapFrom.trim(),
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

  const scopedBrokers = brokers.filter((b) => (isPropPanel ? isPropBroker(b) : !isPropBroker(b)));

  const filteredBrokers = scopedBrokers
    .filter((broker) => {
      const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        isPropPanel ||
        listTypeFilter === "all" ||
        matchesBrokerKind(broker.rebateCategory, listTypeFilter);
      const matchesProgram =
        programFilter === "all" ||
        (programFilter === "beginners" && !!broker.forBeginners) ||
        (programFilter === "shield" && !!broker.blacklisted);
      const isHidden = broker.published === false;
      const isDisabled = !!broker.temporarilyDisabled;
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && !isHidden) ||
        (visibilityFilter === "hidden" && isHidden) ||
        (visibilityFilter === "disabled" && isDisabled);
      return matchesSearch && matchesType && matchesProgram && matchesVisibility;
    })
    .sort((a, b) => {
      const ah = a.published === false ? 1 : 0;
      const bh = b.published === false ? 1 : 0;
      if (ah !== bh) return ah - bh;
      return a.name.localeCompare(b.name);
    });

  const beginnersCount = scopedBrokers.filter((b) => b.forBeginners).length;
  const shieldCount = scopedBrokers.filter((b) => b.blacklisted).length;
  const hiddenCount = scopedBrokers.filter((b) => b.published === false).length;
  const disabledCount = scopedBrokers.filter((b) => b.temporarilyDisabled).length;
  const visibleCount = scopedBrokers.filter((b) => b.published !== false).length;

  const countByKind = (kind: BrokerKind) =>
    scopedBrokers.filter((b) => matchesBrokerKind(b.rebateCategory, kind)).length;

  const entityLabel = isPropPanel ? "prop firm" : "broker";
  const entityLabelPlural = isPropPanel ? "prop firms" : "brokers";

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>
            {isPropPanel ? <FiAward /> : <FiDatabase />} {isPropPanel ? "Prop Firms" : "Brokers"}
          </PageTitle>
          <PageSubtitle>
            {isPropPanel
              ? "Manage prop trading firms, challenge cashback tiers, and promo codes — hidden firms stay listed here so you can find them again"
              : "Manage Forex, Crypto, Binary, and E-wallet listings — hidden brokers stay listed here so you can find them again"}
          </PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={openAdd}>
          <FiPlus /> {isPropPanel ? "Add prop firm" : "Add broker"}
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            {isPropPanel ? <FiAward /> : <FiDatabase />}
          </div>
          <div>
            <div className="val">{listLoading ? "…" : scopedBrokers.length}</div>
            <div className="lbl">Total</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: "#dcfce7", color: "#15803d" }}><FiEye /></div>
          <div>
            <div className="val">{listLoading ? "…" : visibleCount}</div>
            <div className="lbl">On website</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: "#fef3c7", color: "#b45309" }}><FiEyeOff /></div>
          <div>
            <div className="val">{listLoading ? "…" : hiddenCount}</div>
            <div className="lbl">Hidden</div>
          </div>
        </MiniStat>
        {!isPropPanel &&
          BROKER_PANEL_KINDS.map((kind) => (
            <MiniStat key={kind}>
              <div
                className="icon"
                style={{ background: BROKER_KIND_COLORS[kind].bg, color: BROKER_KIND_COLORS[kind].color }}
              >
                {KIND_ICONS[kind]}
              </div>
              <div>
                <div className="val">{listLoading ? "…" : countByKind(kind)}</div>
                <div className="lbl">{BROKER_KIND_SHORT[kind]}</div>
              </div>
            </MiniStat>
          ))}
        {isPropPanel && (
          <MiniStat>
            <div className="icon" style={{ background: "#fee2e2", color: "#b91c1c" }}><FiShield /></div>
            <div>
              <div className="val">{listLoading ? "…" : disabledCount}</div>
              <div className="lbl">Disabled</div>
            </div>
          </MiniStat>
        )}
      </StatsRow>

      {!isPropPanel && (
        <TypeFilterBar>
          <TypeFilterBtn
            type="button"
            $active={listTypeFilter === "all"}
            onClick={() => setListTypeFilter("all")}
          >
            All types
          </TypeFilterBtn>
          {panelKinds.map((kind) => (
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
      )}

      <TypeFilterBar>
        <TypeFilterBtn
          type="button"
          $active={visibilityFilter === "all"}
          onClick={() => setVisibilityFilter("all")}
        >
          All visibility
        </TypeFilterBtn>
        <TypeFilterBtn
          type="button"
          $active={visibilityFilter === "visible"}
          onClick={() => setVisibilityFilter("visible")}
        >
          <FiEye /> On website ({listLoading ? "…" : visibleCount})
        </TypeFilterBtn>
        <TypeFilterBtn
          type="button"
          $active={visibilityFilter === "hidden"}
          onClick={() => setVisibilityFilter("hidden")}
        >
          <FiEyeOff /> Hidden ({listLoading ? "…" : hiddenCount})
        </TypeFilterBtn>
        <TypeFilterBtn
          type="button"
          $active={visibilityFilter === "disabled"}
          onClick={() => setVisibilityFilter("disabled")}
        >
          <FiShield /> Disabled ({listLoading ? "…" : disabledCount})
        </TypeFilterBtn>
      </TypeFilterBar>

      <TypeFilterBar>
        <TypeFilterBtn type="button" $active={programFilter === "all"} onClick={() => setProgramFilter("all")}>
          All programs
        </TypeFilterBtn>
        <TypeFilterBtn
          type="button"
          $active={programFilter === "beginners"}
          onClick={() => setProgramFilter("beginners")}
        >
          <FiAward /> New traders ({listLoading ? "…" : beginnersCount})
        </TypeFilterBtn>
        <TypeFilterBtn
          type="button"
          $active={programFilter === "shield"}
          onClick={() => setProgramFilter("shield")}
        >
          <FiShield /> Scam Shield ({listLoading ? "…" : shieldCount})
        </TypeFilterBtn>
      </TypeFilterBar>

      <FilterBar>
        <SearchInput style={{ maxWidth: 320, flex: 1 }}>
          <FiSearch />
          <input
            type="text"
            placeholder={`Search ${entityLabelPlural}…`}
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
              <strong>No {entityLabelPlural} found</strong>
              {visibilityFilter === "hidden"
                ? "No hidden listings — use Hide from website on a listing to move it here."
                : searchTerm
                  ? "Try a different search."
                  : `Add your first ${entityLabel} to get started.`}
            </EmptyState>
          ) : (
            filteredBrokers.map((broker) => (
              <BrokerCard
                key={broker._id}
                style={
                  broker.published === false
                    ? { opacity: 0.88, borderStyle: "dashed" }
                    : undefined
                }
              >
                <CardTop>
                  <LogoBox $img={normalizeBrokerLogoUrl(broker.logoUrl) || undefined}>
                    {!normalizeBrokerLogoUrl(broker.logoUrl) && broker.name.slice(0, 2).toUpperCase()}
                  </LogoBox>
                  <CardTitle>
                    <h3 title={broker.name}>{broker.name}</h3>
                    <BadgeRow>
                      {!isPropPanel && (
                        <TypeBadge
                          $kind={
                            broker.rebateCategory === "both"
                              ? "both"
                              : broker.rebateCategory === "crypto" ||
                                  broker.rebateCategory === "prop" ||
                                  broker.rebateCategory === "binary" ||
                                  broker.rebateCategory === "ewallet"
                                ? broker.rebateCategory
                                : "forex"
                          }
                        >
                          {brokerKindLabel(broker.rebateCategory)}
                        </TypeBadge>
                      )}
                      {broker.verified && <Pill $variant="approved">Verified</Pill>}
                      {broker.temporarilyDisabled && <Pill $variant="rejected">Disabled</Pill>}
                      {broker.published === false && <Pill $variant="incomplete">Hidden</Pill>}
                      {(broker.rebatesListOrder == null || broker.rebatesListOrder <= 0) &&
                        broker.published !== false && (
                          <Pill $variant="incomplete">Off rebates</Pill>
                        )}
                      {broker.topCashback && <Pill $variant="pending">Top cashback</Pill>}
                      {broker.forBeginners && <Pill $variant="admin">New traders</Pill>}
                      {broker.blacklisted && <Pill $variant="rejected">Scam Shield</Pill>}
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
                    <div className="v">{displayBrokerRegulations(broker)}</div>
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
                    <div className="k">{isPropPanel ? "Tiers" : "Crypto"}</div>
                    <div className="v">
                      {isPropPanel
                        ? `${broker.propOffers?.length || 0} offer(s)`
                        : broker.crypto || "No"}
                    </div>
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
        title={
          modalMode === "add"
            ? isPropPanel
              ? "Add Prop Firm"
              : "Add New Broker"
            : modalMode === "edit"
              ? isPropPanel
                ? "Edit Prop Firm"
                : "Edit Broker"
              : isPropPanel
                ? "Delete Prop Firm"
                : "Delete Broker"
        }
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
                {saving ? "Saving…" : isPropPanel ? "Save prop firm" : "Save broker"}
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
            Are you sure you want to permanently delete this {entityLabel}? This cannot be undone.
          </div>
        ) : (
          <FormGrid>
            {!isPropPanel && (
              <>
                <TypeSectionTitle>Broker type</TypeSectionTitle>
                <TypePicker>
                  {panelKinds.map((kind) => (
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
                {(formRebateCategory === "forex" || formRebateCategory === "crypto") && (
                  <BothOption>
                    <input
                      type="checkbox"
                      checked={formBothTabs}
                      onChange={(e) => setFormBothTabs(e.target.checked)}
                    />
                    Also show on both Forex and Crypto website tabs
                  </BothOption>
                )}
              </>
            )}
            {isPropPanel && <TypeSectionTitle>Prop firm details</TypeSectionTitle>}
            <FormField>
              {isPropPanel ? "Prop firm name" : "Broker Name"}
              <input value={formName} onChange={(e) => setFormName(e.target.value)} />
            </FormField>
            <FormField>
              Broker icon
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                disabled={logoUploading}
                onChange={onBrokerLogoFile}
              />
              <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>
                Upload PNG, JPG, WebP, or SVG (max 5 MB). When editing an existing broker, upload saves the icon immediately.
              </span>
              <input
                value={formLogoUrl}
                onChange={(e) => setFormLogoUrl(e.target.value)}
                onBlur={() => setFormLogoUrl((v) => normalizeBrokerLogoUrl(v) || v.trim())}
                placeholder="Or paste image URL"
                style={{ marginTop: 8 }}
                disabled={logoUploading}
              />
              {logoUploading && (
                <span style={{ fontSize: "0.75rem", color: adminColors.navy, marginTop: 6 }}>Uploading…</span>
              )}
              <div style={{
                marginTop: 10,
                width: 72,
                height: 72,
                borderRadius: 16,
                border: `1px solid ${adminColors.border}`,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: 8,
              }}>
                <BrokerLogo
                  src={formLogoUrl}
                  name={formName || "Broker"}
                  alt="Logo preview"
                  style={{ width: "100%", height: "100%", objectFit: "contain" } as React.CSSProperties}
                />
              </div>
            </FormField>

            <TypeSectionTitle>Broker comparison fields</TypeSectionTitle>
            <CompareHint>
              These values appear on the public <strong>/compare</strong> page when traders pick this{" "}
              {isPropPanel ? "prop firm" : "broker"}. Edit here → save → comparison updates automatically.
              Star rating below is also used on compare when live review averages are not available.
            </CompareHint>
            <FormField>
              Min deposit (number) — compare
              <input value={formMinDeposit} onChange={(e) => setFormMinDeposit(e.target.value)} />
            </FormField>
            <FormField>
              Spread from — compare
              <input
                value={formSpreadFrom}
                onChange={(e) => setFormSpreadFrom(e.target.value)}
                placeholder="From 0.0 pips"
              />
            </FormField>
            <FormField>
              Cashback rate — compare
              <input
                value={formCashbackRate}
                onChange={(e) => setFormCashbackRate(e.target.value)}
                placeholder="0.35 pip / lot"
              />
            </FormField>
            <FormField>
              Commission — compare
              <input
                value={formCommission}
                onChange={(e) => setFormCommission(e.target.value)}
                placeholder="$3.5 / lot"
              />
            </FormField>
            <FormField $full>
              Regulation (comma-separated) — compare
              <input
                value={formRegulations}
                onChange={(e) => setFormRegulations(e.target.value)}
                placeholder="FCA, CySEC, ASIC, FSC…"
              />
            </FormField>
            <FormField>
              Country (HQ / primary) — compare
              <input value={formCountry} onChange={(e) => setFormCountry(e.target.value)} placeholder="Cyprus, St. Vincent…" />
            </FormField>
            <FormField>
              Leverage — compare
              <input value={formLeverage} onChange={(e) => setFormLeverage(e.target.value)} placeholder="1:500" />
            </FormField>
            <FormField>
              Platforms — compare
              <input value={formPlatforms} onChange={(e) => setFormPlatforms(e.target.value)} placeholder="MT4, MT5, cTrader" />
            </FormField>
            <FormField>
              Crypto instruments — compare
              <select value={formCrypto} onChange={(e) => setFormCrypto(e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </FormField>
            <FormField>
              Star rating 1–5 — compare fallback
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

            <TypeSectionTitle>More listing details</TypeSectionTitle>
            <FormField $full>
              Served countries (for country matcher — comma-separated)
              <input
                value={formServedCountries}
                onChange={(e) => setFormServedCountries(e.target.value)}
                placeholder="Pakistan, United Kingdom, India…"
              />
            </FormField>
            <FormField>
              Overnight swap
              <input value={formSwapFrom} onChange={(e) => setFormSwapFrom(e.target.value)} placeholder="Swap-free or From -1.2 pips" />
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
              Challenge / signup URL
              <input
                value={formSetupUrl}
                onChange={(e) => setFormSetupUrl(e.target.value)}
                placeholder="https://partner-link…"
              />
            </FormField>
            {(isPropPanel || (formRebateCategory === "prop" && !formBothTabs)) && (
              <PropTiersBox>
                <div style={{ fontWeight: 800, color: adminColors.navy, fontSize: "0.8125rem", marginBottom: 10 }}>
                  Prop cashback tiers (shown on /compare for prop firms)
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
            <CheckboxRow>
              <input
                type="checkbox"
                checked={formTemporarilyDisabled}
                onChange={(e) => setFormTemporarilyDisabled(e.target.checked)}
              />
              <span>{isPropPanel ? "Temporarily disable prop firm" : "Temporarily disable broker"}</span>
            </CheckboxRow>
            {formTemporarilyDisabled && (
              <FormField $full>
                Visibility while disabled
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 400 }}>
                    <input
                      type="radio"
                      name="brokerVisibility"
                      checked={formPublished}
                      onChange={() => setFormPublished(true)}
                    />
                    Keep on website (shows as Disabled — no new setups)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 400 }}>
                    <input
                      type="radio"
                      name="brokerVisibility"
                      checked={!formPublished}
                      onChange={() => setFormPublished(false)}
                    />
                    Hide from website
                  </label>
                </div>
              </FormField>
            )}
            {!formTemporarilyDisabled && (
              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                />
                <span>Show on website</span>
              </CheckboxRow>
            )}
            <CheckboxRow>
              <input
                type="checkbox"
                checked={formForBeginners}
                disabled={formBlacklisted}
                onChange={(e) => setFormForBeginners(e.target.checked)}
              />
              <span>Best for new traders (shows on /brokers/beginners)</span>
            </CheckboxRow>
            {formForBeginners && !formBlacklisted && (
              <>
                <FormField $full>
                  Beginner blurb (optional)
                  <textarea
                    value={formBeginnerBlurb}
                    onChange={(e) => setFormBeginnerBlurb(e.target.value)}
                    rows={2}
                    placeholder="Why this broker suits new traders…"
                  />
                </FormField>
                <FormField>
                  Beginner list order
                  <input
                    type="number"
                    min={0}
                    value={formBeginnerSortOrder}
                    onChange={(e) => setFormBeginnerSortOrder(e.target.value)}
                  />
                </FormField>
              </>
            )}
            <CheckboxRow>
              <input
                type="checkbox"
                checked={formBlacklisted}
                onChange={(e) => {
                  const on = e.target.checked;
                  setFormBlacklisted(on);
                  if (on) setFormForBeginners(false);
                }}
              />
              <span>Scam Broker Shield (public warning list)</span>
            </CheckboxRow>
            {formBlacklisted && (
              <FormField $full>
                Shield reason
                <textarea
                  value={formBlacklistReason}
                  onChange={(e) => setFormBlacklistReason(e.target.value)}
                  rows={2}
                  placeholder="Why this broker is listed on Scam Broker Shield…"
                />
              </FormField>
            )}
          </FormGrid>
        )}
      </SimpleModal>
    </PageWrap>
  );
};

export default BrokersManagement;
