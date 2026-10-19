import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BannerWrapper,
  HeroShell,
  HeroContent,
  SubheadingWrapper,
  HeroSubTitle,
  HeroTitle,
  HeroLead,
  ActionButtons,
  JoinButton,
  CompareButton,
  HeroTrustRow,
  HeroTrustItem,
  HeroVisual,
  VisualEyebrow,
  VisualTitle,
  LogoStack,
  LogoBubble,
  LogoFallback,
  MoreBubble,
  BrokerNameRow,
  BrokerChip,
  StatGrid,
  StatCell,
  VisualCta,
  VisualHint,
} from "./PromoBanner.styles";

import mathIcon from "../../assets/icons/all-svgrepo-com 1.svg";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import ArrowIcon2 from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 2.svg";

import type { Variants } from "framer-motion";
import { FiZap, FiDollarSign, FiArrowRight } from "react-icons/fi";
import LoginModal from "../../pages/Login/LoginModal";
import RegisterModal from "../../pages/Register/RegisterModal";
import { useAuth } from "../../contexts/AuthContext";
import { useLocale } from "../../contexts/LocaleContext";
import { comparePath } from "../../utils/compareBrokers";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import { resolveBrokerLogoUrl } from "../../utils/brokerLogoUrl";
import BrokerLogo from "../Broker/BrokerLogo";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.55,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

const LOGO_COUNT = 5;

const PromoBanner = () => {
  const [signinOpen, setSigninOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [totalBrokers, setTotalBrokers] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetchBrokersPage({ rebatesPage: true, page: 1, limit: 12 })
      .then((r) => {
        if (cancelled) return;
        const items = r.items || [];
        const pool = [...items].sort((a, b) => {
          const ao = a.rebatesListOrder ?? a.sortOrder ?? 0;
          const bo = b.rebatesListOrder ?? b.sortOrder ?? 0;
          return ao - bo;
        });
        setBrokers(pool.slice(0, LOGO_COUNT));
        setTotalBrokers(r.pagination?.totalItems ?? pool.length);
      })
      .catch(() => {
        if (!cancelled) {
          setBrokers([]);
          setTotalBrokers(0);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleJoinFree = () => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin-panel" : "/user-panel");
      return;
    }
    setSigninOpen(true);
  };

  const handleCompareBrokers = () => {
    navigate(comparePath());
  };

  const openBroker = (id: string) => navigate(`/rebates/broker/${id}`);

  const title = t("home.title");
  const titleParts = title.split(",");
  const titleNode =
    titleParts.length > 1 ? (
      <>
        {titleParts[0]},
        <br />
        <span>{titleParts.slice(1).join(",").trim()}</span>
      </>
    ) : (
      title
    );

  const shown = brokers.slice(0, LOGO_COUNT);
  const moreCount = Math.max(0, totalBrokers - shown.length);

  return (
    <>
      <BannerWrapper>
        <HeroShell>
          <HeroContent>
            <SubheadingWrapper
              custom={0}
              variants={fadeInDown}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src={mathIcon} alt="" />
              <HeroSubTitle>{t("home.kicker")}</HeroSubTitle>
            </SubheadingWrapper>

            <HeroTitle
              custom={1}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {titleNode}
            </HeroTitle>

            <HeroLead
              custom={2}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <strong>{t("home.trustedBy")}.</strong> {t("home.blurb")}
            </HeroLead>

            <ActionButtons
              custom={3}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <JoinButton type="button" onClick={handleJoinFree}>
                {t("home.joinFree")}
                <img src={ArrowIcon2} alt="" />
              </JoinButton>
              <CompareButton type="button" onClick={handleCompareBrokers}>
                {t("home.compareBrokers")}
                <img src={ArrowIcon} alt="" />
              </CompareButton>
            </ActionButtons>

            <HeroTrustRow
              custom={4}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <HeroTrustItem>
                <span className="icon" aria-hidden>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                {t("home.trustRegulated")}
              </HeroTrustItem>
              <HeroTrustItem>
                <span className="icon" aria-hidden>
                  <FiZap strokeWidth={1.75} />
                </span>
                {t("home.trustNoMarkups")}
              </HeroTrustItem>
              <HeroTrustItem>
                <span className="icon" aria-hidden>
                  <FiDollarSign strokeWidth={1.75} />
                </span>
                {t("home.trustPayouts")}
              </HeroTrustItem>
            </HeroTrustRow>
          </HeroContent>

          <HeroVisual
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
          >
            <VisualEyebrow>{t("home.topBrokers")}</VisualEyebrow>
            <VisualTitle>Partner brokers traders trust</VisualTitle>

            {shown.length > 0 ? (
              <>
                <LogoStack>
                  {shown.map((b, i) => (
                      <LogoBubble
                        key={b._id}
                        type="button"
                        title={b.name}
                        aria-label={b.name}
                        style={{ zIndex: shown.length - i }}
                        onClick={() => openBroker(b._id)}
                      >
                        {resolveBrokerLogoUrl(b.logoUrl, b.name, { preferBundled: true }) ? (
                          <BrokerLogo
                            src={b.logoUrl}
                            name={b.name}
                            alt={b.name}
                            preferBundled
                          />
                        ) : (
                          <LogoFallback>{b.name.slice(0, 2).toUpperCase()}</LogoFallback>
                        )}
                      </LogoBubble>
                    ))}
                  {moreCount > 0 && (
                    <MoreBubble
                      type="button"
                      onClick={() => navigate("/rebates")}
                      aria-label={`View ${moreCount} more brokers`}
                    >
                      +{moreCount > 99 ? "99" : moreCount}
                    </MoreBubble>
                  )}
                </LogoStack>
                <BrokerNameRow>
                  {shown.slice(0, 4).map((b) => (
                    <BrokerChip key={b._id} type="button" onClick={() => openBroker(b._id)}>
                      {b.name}
                    </BrokerChip>
                  ))}
                </BrokerNameRow>
              </>
            ) : (
              <BrokerNameRow>
                <BrokerChip type="button" onClick={() => navigate("/rebates")}>
                  Browse brokers
                </BrokerChip>
              </BrokerNameRow>
            )}

            <StatGrid>
              <StatCell>
                <strong>Up to 80%</strong>
                <span>Rebates back</span>
              </StatCell>
              <StatCell>
                <strong>10k+</strong>
                <span>Traders</span>
              </StatCell>
              <StatCell>
                <strong>5M+</strong>
                <span>Commission paid</span>
              </StatCell>
            </StatGrid>
            <VisualCta type="button" onClick={() => navigate("/find-broker")}>
              Find my broker <FiArrowRight />
            </VisualCta>
            <VisualHint>Answer a few questions · get a ranked toplist</VisualHint>
          </HeroVisual>
        </HeroShell>
      </BannerWrapper>

      <LoginModal
        isOpen={signinOpen}
        onClose={() => setSigninOpen(false)}
        onSwitchToRegister={() => {
          setSigninOpen(false);
          setSignupOpen(true);
        }}
      />
      <RegisterModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
};

export default PromoBanner;
