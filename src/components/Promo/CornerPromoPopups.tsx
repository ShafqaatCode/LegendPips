import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiCopy, FiCheck, FiX, FiArrowRight } from "react-icons/fi";
import { fetchActiveCornerPromos, type CornerPromo } from "../../services/cornerPromoService";
import { copyTextToClipboard } from "../../utils/propTradingDisplay";
import { normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";
import BrokerLogo from "../Broker/BrokerLogo";

const DISMISS_PROMO = "lp_corner_promo_dismiss_v2";
const DISMISS_BROKER = "lp_corner_broker_dismiss_v2";
const SHOW_DELAY_MS = 1200;
const ROTATE_MS = 7000;

function isDismissed(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function dismiss(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

function shouldHideOnPath(pathname: string) {
  return (
    pathname.startsWith("/user-panel") ||
    pathname.startsWith("/admin-panel") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password")
  );
}

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function CtaButton({
  url,
  label,
  variant,
}: {
  url: string;
  label: string;
  variant: "buy" | "view";
}) {
  const external = isExternal(url);
  if (external) {
    return variant === "buy" ? (
      <BuyA href={url} target="_blank" rel="noopener noreferrer">
        {label}
      </BuyA>
    ) : (
      <ViewA href={url} target="_blank" rel="noopener noreferrer">
        {label} <FiArrowRight />
      </ViewA>
    );
  }
  return variant === "buy" ? (
    <BuyLink to={url}>{label}</BuyLink>
  ) : (
    <ViewLink to={url}>
      {label} <FiArrowRight />
    </ViewLink>
  );
}

const CornerPromoPopups: React.FC = () => {
  const { pathname } = useLocation();
  const hidden = shouldHideOnPath(pathname);

  const [ready, setReady] = useState(false);
  const [leftItems, setLeftItems] = useState<CornerPromo[]>([]);
  const [rightItems, setRightItems] = useState<CornerPromo[]>([]);
  const [promoOpen, setPromoOpen] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [promoIdx, setPromoIdx] = useState(0);
  const [brokerIdx, setBrokerIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (hidden) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const data = await fetchActiveCornerPromos();
        if (cancelled) return;
        const left = data.left || [];
        const right = data.right || [];
        setLeftItems(left);
        setRightItems(right);
        timer = setTimeout(() => {
          if (cancelled) return;
          setReady(true);
          if (left.length && !isDismissed(DISMISS_PROMO)) setPromoOpen(true);
          if (right.length && !isDismissed(DISMISS_BROKER)) setBrokerOpen(true);
        }, SHOW_DELAY_MS);
      } catch {
        /* silent */
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [hidden]);

  useEffect(() => {
    if (!brokerOpen || rightItems.length < 2) return undefined;
    const id = window.setInterval(() => {
      setBrokerIdx((i) => (i + 1) % rightItems.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [brokerOpen, rightItems.length]);

  useEffect(() => {
    if (!promoOpen || leftItems.length < 2) return undefined;
    const id = window.setInterval(() => {
      setPromoIdx((i) => (i + 1) % leftItems.length);
    }, ROTATE_MS + 1500);
    return () => window.clearInterval(id);
  }, [promoOpen, leftItems.length]);

  const promo = leftItems[promoIdx] || leftItems[0];
  const slide = rightItems[brokerIdx] || rightItems[0];

  const onCopy = async () => {
    if (!promo?.discountCode) return;
    const ok = await copyTextToClipboard(promo.discountCode);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  if (hidden || !ready) return null;

  const promoHeadline =
    promo?.headline ||
    (promo?.discountPercent
      ? `${promo.discountPercent.replace(/\s*off$/i, "")} OFF — Cut costs from day one`
      : promo?.name);

  return (
    <Layer aria-live="polite">
      {promoOpen && promo && (
        <PromoCard>
          <CloseBtn type="button" onClick={() => { dismiss(DISMISS_PROMO); setPromoOpen(false); }} aria-label="Dismiss offer">
            <FiX />
          </CloseBtn>
          <PromoTop>
            <LogoBox>
              <BrokerLogo src={normalizeBrokerLogoUrl(promo.logoUrl)} name={promo.name} alt="" />
            </LogoBox>
            <div>
              <FirmName>{promo.name}</FirmName>
              <Headline>{promoHeadline}</Headline>
            </div>
          </PromoTop>
          <Body>{promo.body}</Body>
          <PromoActions>
            {promo.discountCode ? (
              <CodeBtn type="button" onClick={onCopy} title="Copy code">
                <span>Code</span>
                <em>{copied ? "Copied" : promo.discountCode}</em>
                {copied ? <FiCheck /> : <FiCopy />}
              </CodeBtn>
            ) : (
              <span />
            )}
            <CtaButton url={promo.ctaUrl} label={promo.ctaLabel || "Buy"} variant="buy" />
          </PromoActions>
          {leftItems.length > 1 && (
            <Dots>
              {leftItems.map((p, i) => (
                <Dot key={p.id} type="button" $active={i === promoIdx} onClick={() => setPromoIdx(i)} />
              ))}
            </Dots>
          )}
        </PromoCard>
      )}

      {brokerOpen && slide && (
        <BrokerCard>
          <CloseBtn
            type="button"
            $dark
            onClick={() => { dismiss(DISMISS_BROKER); setBrokerOpen(false); }}
            aria-label="Dismiss broker tip"
          >
            <FiX />
          </CloseBtn>
          <BrokerTop>
            <LogoBox $light>
              <BrokerLogo src={normalizeBrokerLogoUrl(slide.logoUrl)} name={slide.name} alt="" />
            </LogoBox>
            <FirmName $dark>{slide.name}</FirmName>
          </BrokerTop>
          <Body $dark>{slide.body}</Body>
          <CtaButton url={slide.ctaUrl} label={slide.ctaLabel || "View Broker"} variant="view" />
          {rightItems.length > 1 && (
            <Dots>
              {rightItems.map((s, i) => (
                <Dot key={s.id} type="button" $active={i === brokerIdx} $dark onClick={() => setBrokerIdx(i)} />
              ))}
            </Dots>
          )}
        </BrokerCard>
      )}
    </Layer>
  );
};

export default CornerPromoPopups;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Layer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1100;
`;

const PromoCard = styled.aside`
  pointer-events: auto;
  position: absolute;
  left: 1.1rem;
  bottom: 1.1rem;
  width: min(340px, calc(100vw - 1.5rem));
  background: linear-gradient(145deg, #0b1b38 0%, #132e58 55%, #1a3a6b 100%);
  color: #fff;
  border-radius: 14px;
  border: 1px solid rgba(251, 191, 36, 0.35);
  box-shadow: 0 16px 40px rgba(11, 27, 56, 0.45);
  padding: 0.95rem 1rem 0.85rem;
  animation: ${slideUp} 0.35s ease both;

  @media (max-width: 720px) {
    left: 0.65rem;
    bottom: 4.75rem;
  }
`;

const BrokerCard = styled.aside`
  pointer-events: auto;
  position: absolute;
  right: 1.1rem;
  bottom: 5.6rem;
  width: min(300px, calc(100vw - 1.5rem));
  background: #fff;
  color: #132e58;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.18);
  padding: 0.9rem 1rem 0.8rem;
  animation: ${slideUp} 0.4s ease 0.08s both;

  @media (max-width: 720px) {
    display: none;
  }
`;

const CloseBtn = styled.button<{ $dark?: boolean }>`
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  border: 0;
  background: transparent;
  color: ${({ $dark }) => ($dark ? "#94a3b8" : "rgba(255,255,255,0.75)")};
  cursor: pointer;
  display: inline-flex;
  padding: 0.2rem;
  border-radius: 6px;
  &:hover {
    color: ${({ $dark }) => ($dark ? "#132e58" : "#fff")};
  }
`;

const PromoTop = styled.div`
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding-right: 1.2rem;
  margin-bottom: 0.55rem;
`;

const BrokerTop = styled.div`
  display: flex;
  gap: 0.55rem;
  align-items: center;
  padding-right: 1.2rem;
  margin-bottom: 0.45rem;
`;

const LogoBox = styled.div<{ $light?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $light }) => ($light ? "#f8fafc" : "#fff")};
  border: 1px solid ${({ $light }) => ($light ? "#e2e8f0" : "rgba(255,255,255,0.2)")};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  img,
  span {
    width: 32px !important;
    height: 32px !important;
  }
`;

const FirmName = styled.div<{ $dark?: boolean }>`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ $dark }) => ($dark ? "#132e58" : "rgba(255,255,255,0.85)")};
`;

const Headline = styled.h3`
  margin: 0.15rem 0 0;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.3;
  color: #fbbf24;
`;

const Body = styled.p<{ $dark?: boolean }>`
  margin: 0 0 0.7rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ $dark }) => ($dark ? "#475569" : "rgba(255,255,255,0.82)")};
`;

const PromoActions = styled.div`
  display: flex;
  gap: 0.45rem;
  align-items: center;
`;

const CodeBtn = styled.button`
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(29, 78, 216, 0.35);
  color: #fff;
  border-radius: 999px;
  padding: 0.4rem 0.65rem;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  span {
    opacity: 0.75;
    font-weight: 600;
  }
  em {
    font-style: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.03em;
  }
  svg {
    flex-shrink: 0;
  }
`;

const BuyLink = styled(Link)`
  flex-shrink: 0;
  background: #fbbf24;
  color: #132e58;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.42rem 0.95rem;
`;

const BuyA = styled.a`
  flex-shrink: 0;
  background: #fbbf24;
  color: #132e58;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.42rem 0.95rem;
`;

const ViewLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  background: #132e58;
  color: #fff;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.55rem 0.85rem;
  margin-bottom: 0.55rem;
  &:hover {
    background: #1d4ed8;
  }
`;

const ViewA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  background: #132e58;
  color: #fff;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.55rem 0.85rem;
  margin-bottom: 0.55rem;
  &:hover {
    background: #1d4ed8;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  margin-top: 0.55rem;
`;

const Dot = styled.button<{ $active?: boolean; $dark?: boolean }>`
  width: ${({ $active }) => ($active ? "14px" : "6px")};
  height: 6px;
  border-radius: 999px;
  border: 0;
  padding: 0;
  cursor: pointer;
  background: ${({ $active, $dark }) =>
    $active ? ($dark ? "#132e58" : "#fbbf24") : $dark ? "#cbd5e1" : "rgba(255,255,255,0.35)"};
  transition: width 0.2s ease, background 0.2s ease;
`;
