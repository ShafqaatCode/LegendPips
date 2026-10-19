// Header.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HeaderWrapper,
  Topbar,
  Navbar,
  Logo,
  NavList,
  NavItem,
  LinkGroup,
  HeaderItem,
  TopbarDivider,
  SignInButton,
  UserPanelButton,
  PortalOutlineButton,
  AccountMenuWrap,
  AccountDropdown,
  AccountDropdownItem,
  MobileBar,
  MobileMenu,
  Backdrop,
  SubmenuWrapper,
  SubmenuToggle,
  ToolsMegaMenu,
  ToolsMegaColumn,
  ToolsMegaLabel,
  ToolsMegaGrid,
  ToolsMegaLink,
  BrokersDropMenu,
  BrokersDropLink,
  DropSectionLabel,
  MobileToolsGroup,
  MobileToolsHeading,
} from "./Navbar.styles";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaWhatsapp } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiUser,
  FiLogOut,
  FiGrid,
  FiBell,
  FiMessageCircle,
  FiLifeBuoy,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../UserPanel/NotificationBell";
import { useSiteConfig, useSiteLogo } from "../../contexts/SiteConfigContext";

import { useAuthModal } from "../../contexts/AuthModalContext";
import { useLocale } from "../../contexts/LocaleContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { BROKER_NESTED_PATHS, BROKER_SUBMENU } from "../../data/brokerNav";
import { FORUM_NESTED_PATHS, FORUM_SUBMENU } from "../../data/forumNav";
import { HELP_NESTED_PATHS, HELP_SUBMENU } from "../../data/helpNav";
import { NEWS_NESTED_PATHS, NEWS_SUBMENU } from "../../data/newsNav";
import {
  WHATSAPP_SUPPORT_NUMBER_DISPLAY,
  WHATSAPP_SUPPORT_URL,
} from "../../utils/whatsappSupport";

const FALLBACK_NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contests", label: "Contests" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/signals", label: "Signals" },
  { to: "/rewards", label: "Rewards" },
  { to: "/news", label: "News" },
  { to: "/forum", label: "Forum" },
  { to: "/traders", label: "Traders" },
  { to: "/strategies", label: "Strategies" },
];

const EDUCATION_PATHS = new Set([
  "/copy-trading",
  "/courses",
  "/trading-videos",
  "/webinars",
]);

const MARKET_TOOL_PATHS = new Set([
  "/spread-comparison",
  "/swaps-comparison",
  "/live-charts",
  "/economic-calendar",
  "/currency-converter",
  "/trading-stats",
  "/broker-signup-bonuses",
  "/best-performing-stocks",
]);

const CALCULATOR_TOOL_INJECT = [
  "/spread-comparison",
  "/swaps-comparison",
  "/live-charts",
  "/economic-calendar",
  "/currency-converter",
  "/trading-stats",
  "/risk-of-ruin-calculator",
  "/crypto-exchange-fees-calculator",
];

const FALLBACK_TOOLS = [
  { to: "/spread-comparison", label: "Spread Comparison" },
  { to: "/swaps-comparison", label: "Swaps Comparison" },
  { to: "/live-charts", label: "Live Forex Charts" },
  { to: "/economic-calendar", label: "Economic Calendar" },
  { to: "/currency-converter", label: "Currency Converter" },
  { to: "/trading-stats", label: "Trading Stats Hub" },
  { to: "/broker-signup-bonuses", label: "Broker Signup Bonuses", badge: "NEW" },
  { to: "/best-performing-stocks", label: "Best Performing Stocks", badge: "NEW" },
  { to: "/copy-trading", label: "Copy Trading" },
  { to: "/courses", label: "Courses" },
  { to: "/trading-videos", label: "Trading Videos" },
  { to: "/webinars", label: "Webinars" },
  { to: "/calculators", label: "All Calculators" },
  { to: "/pip-calculator", label: "Pip Calculator" },
  { to: "/position-size-calculator", label: "Position Size Calculator" },
  { to: "/margin-calculator", label: "Margin Calculator" },
  { to: "/rebate-calculator", label: "Rebate Calculator" },
  { to: "/pivot-point-calculator", label: "Pivot Point Calculator" },
  { to: "/fibonacci-calculator", label: "Fibonacci Calculator" },
  { to: "/profit-calculator", label: "Profit Calculator" },
  { to: "/account-risk-calculator", label: "Risk Calculator" },
  { to: "/break-even-calculator", label: "Break-Even Calculator" },
  { to: "/risk-reward-calculator", label: "Risk / Reward" },
  { to: "/drawdown-calculator", label: "Drawdown Calculator" },
  { to: "/compound-calculator", label: "Compound Calculator" },
  { to: "/crypto-profit-calculator", label: "Crypto Profit" },
  { to: "/risk-of-ruin-calculator", label: "Risk of Ruin Calculator" },
  { to: "/crypto-exchange-fees-calculator", label: "Crypto Exchange Fees" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [brokersMenuOpen, setBrokersMenuOpen] = useState(false);
  const [forumMenuOpen, setForumMenuOpen] = useState(false);
  const [newsMenuOpen, setNewsMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [mobileBrokersOpen, setMobileBrokersOpen] = useState(false);
  const [mobileForumOpen, setMobileForumOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [mobileHelpOpen, setMobileHelpOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const desktopAccountRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountRef = useRef<HTMLDivElement | null>(null);
  const toolsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brokersCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const forumCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const helpCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { openSignIn } = useAuthModal();
  const { mainNav, toolsNav } = useSiteConfig();
  const { t, labelForPath } = useLocale();

  const navLinks = (
    mainNav.length
      ? mainNav.map((n) => ({ to: n.path, label: labelForPath(n.path, n.label), end: n.end }))
      : FALLBACK_NAV.map((n) => ({ ...n, label: labelForPath(n.to, n.label) }))
  ).filter(
    (n) =>
      !BROKER_NESTED_PATHS.has(n.to) &&
      !HELP_NESTED_PATHS.has(n.to) &&
      !FORUM_NESTED_PATHS.has(n.to) &&
      !NEWS_NESTED_PATHS.has(n.to)
  );

  const navSourcePaths = mainNav.length
    ? mainNav.map((n) => n.path)
    : FALLBACK_NAV.map((n) => n.to);

  const isHiddenNavPath = (path: string) =>
    BROKER_NESTED_PATHS.has(path) ||
    HELP_NESTED_PATHS.has(path) ||
    FORUM_NESTED_PATHS.has(path) ||
    NEWS_NESTED_PATHS.has(path);

  const newsInsertAt = (() => {
    const newsIdx = navSourcePaths.findIndex((p) => p === "/news" || p === "/analysis");
    if (newsIdx < 0) return -1;
    let visibleBefore = 0;
    for (let i = 0; i < newsIdx; i++) {
      if (!isHiddenNavPath(navSourcePaths[i])) visibleBefore++;
    }
    return visibleBefore;
  })();

  const forumInsertAt = (() => {
    const forumIdx = navSourcePaths.indexOf("/forum");
    if (forumIdx < 0) return -1;
    let visibleBefore = 0;
    for (let i = 0; i < forumIdx; i++) {
      if (!isHiddenNavPath(navSourcePaths[i])) visibleBefore++;
    }
    return visibleBefore;
  })();

  const brokersInsertAt = (() => {
    const howIdx = navLinks.findIndex((l) => l.to === "/how-it-works");
    if (howIdx >= 0) return howIdx + 1;
    const homeIdx = navLinks.findIndex((l) => l.to === "/");
    return homeIdx >= 0 ? homeIdx + 1 : 1;
  })();

  const toolsSubmenu = useMemo(() => {
    const fallback = FALLBACK_TOOLS.map((n) => ({ ...n, label: labelForPath(n.to, n.label) }));
    if (!toolsNav.length) return fallback;

    const fromConfig = toolsNav.map((n) => ({ to: n.path, label: labelForPath(n.path, n.label) }));
    const paths = new Set(fromConfig.map((n) => n.to));
    const missing = fallback.filter((n) => !paths.has(n.to));
    const merged = [...fromConfig];
    let insertAt = merged.findIndex((n) => n.to === "/calculators");
    insertAt = insertAt >= 0 ? insertAt + 1 : merged.length;

    for (const path of CALCULATOR_TOOL_INJECT) {
      if (paths.has(path)) continue;
      const item = missing.find((n) => n.to === path);
      if (!item) continue;
      merged.splice(insertAt, 0, item);
      insertAt += 1;
      paths.add(path);
    }

    const restMissing = missing.filter((n) => !paths.has(n.to));
    return [...merged, ...restMissing];
  }, [toolsNav, labelForPath]);
  const educationTools = toolsSubmenu.filter((n) => EDUCATION_PATHS.has(n.to));
  const marketTools = toolsSubmenu.filter((n) => MARKET_TOOL_PATHS.has(n.to));
  const calculatorTools = toolsSubmenu.filter(
    (n) => !EDUCATION_PATHS.has(n.to) && !MARKET_TOOL_PATHS.has(n.to)
  );
  const { src: logoSrc, alt: logoAlt, height: logoHeight, maxWidth: logoMaxWidth } = useSiteLogo();

  const portalPath = user?.role === "admin" ? "/admin-panel" : "/user-panel";
  const isAdmin = user?.role === "admin";
  const accountLabel = isAdmin ? t("header.adminPanel") : t("header.myAccount");

  useEffect(() => {
    return () => {
      if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current);
      if (brokersCloseTimer.current) clearTimeout(brokersCloseTimer.current);
      if (forumCloseTimer.current) clearTimeout(forumCloseTimer.current);
      if (newsCloseTimer.current) clearTimeout(newsCloseTimer.current);
      if (helpCloseTimer.current) clearTimeout(helpCloseTimer.current);
    };
  }, []);

  const openToolsMenu = () => {
    if (toolsCloseTimer.current) {
      clearTimeout(toolsCloseTimer.current);
      toolsCloseTimer.current = null;
    }
    setBrokersMenuOpen(false);
    setForumMenuOpen(false);
    setNewsMenuOpen(false);
    setHelpMenuOpen(false);
    setSubmenuOpen(true);
  };

  const closeToolsMenu = () => {
    if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current);
    toolsCloseTimer.current = setTimeout(() => setSubmenuOpen(false), 180);
  };

  const openBrokersMenu = () => {
    if (brokersCloseTimer.current) {
      clearTimeout(brokersCloseTimer.current);
      brokersCloseTimer.current = null;
    }
    setSubmenuOpen(false);
    setForumMenuOpen(false);
    setNewsMenuOpen(false);
    setHelpMenuOpen(false);
    setBrokersMenuOpen(true);
  };

  const closeBrokersMenu = () => {
    if (brokersCloseTimer.current) clearTimeout(brokersCloseTimer.current);
    brokersCloseTimer.current = setTimeout(() => setBrokersMenuOpen(false), 180);
  };

  const openForumMenu = () => {
    if (forumCloseTimer.current) {
      clearTimeout(forumCloseTimer.current);
      forumCloseTimer.current = null;
    }
    setSubmenuOpen(false);
    setBrokersMenuOpen(false);
    setNewsMenuOpen(false);
    setHelpMenuOpen(false);
    setForumMenuOpen(true);
  };

  const closeForumMenu = () => {
    if (forumCloseTimer.current) clearTimeout(forumCloseTimer.current);
    forumCloseTimer.current = setTimeout(() => setForumMenuOpen(false), 180);
  };

  const openNewsMenu = () => {
    if (newsCloseTimer.current) {
      clearTimeout(newsCloseTimer.current);
      newsCloseTimer.current = null;
    }
    setSubmenuOpen(false);
    setBrokersMenuOpen(false);
    setForumMenuOpen(false);
    setHelpMenuOpen(false);
    setNewsMenuOpen(true);
  };

  const closeNewsMenu = () => {
    if (newsCloseTimer.current) clearTimeout(newsCloseTimer.current);
    newsCloseTimer.current = setTimeout(() => setNewsMenuOpen(false), 180);
  };

  const openHelpMenu = () => {
    if (helpCloseTimer.current) {
      clearTimeout(helpCloseTimer.current);
      helpCloseTimer.current = null;
    }
    setSubmenuOpen(false);
    setBrokersMenuOpen(false);
    setForumMenuOpen(false);
    setNewsMenuOpen(false);
    setHelpMenuOpen(true);
  };

  const closeHelpMenu = () => {
    if (helpCloseTimer.current) clearTimeout(helpCloseTimer.current);
    helpCloseTimer.current = setTimeout(() => setHelpMenuOpen(false), 180);
  };

  useEffect(() => {
    if (!accountOpen) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = desktopAccountRef.current?.contains(target);
      const inMobile = mobileAccountRef.current?.contains(target);
      if (!inDesktop && !inMobile) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [accountOpen]);

  const goPortal = () => {
    setAccountOpen(false);
    setMenuOpen(false);
    navigate(portalPath);
  };

  const handleLogout = () => {
    setAccountOpen(false);
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  const renderAccountMenu = (
    outline: boolean,
    wrapRef: React.RefObject<HTMLDivElement | null>
  ) => {
    const Trigger = outline ? PortalOutlineButton : UserPanelButton;
    return (
      <AccountMenuWrap ref={wrapRef}>
        <Trigger
          type="button"
          aria-haspopup="menu"
          aria-expanded={accountOpen}
          title="Account menu"
          onClick={() => setAccountOpen((v) => !v)}
        >
          {isAdmin ? <FiShield size={14} aria-hidden /> : <FiUser size={14} aria-hidden />}
          <span>{outline ? (isAdmin ? t("header.admin") : user?.firstName || t("header.account")) : accountLabel}</span>
          {accountOpen ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
        </Trigger>
        {accountOpen && (
          <AccountDropdown role="menu">
            <AccountDropdownItem type="button" role="menuitem" onClick={goPortal}>
              <FiGrid size={15} />
              {t("header.portal")}
            </AccountDropdownItem>
            <AccountDropdownItem
              type="button"
              role="menuitem"
              onClick={() => {
                setAccountOpen(false);
                navigate("/user-panel/alerts");
              }}
            >
              <FiBell size={15} />
              My alerts
            </AccountDropdownItem>
            <AccountDropdownItem
              type="button"
              role="menuitem"
              className="danger"
              onClick={handleLogout}
            >
              <FiLogOut size={15} />
              {t("header.logout")}
            </AccountDropdownItem>
          </AccountDropdown>
        )}
      </AccountMenuWrap>
    );
  };

  return (
    <>
      <HeaderWrapper>
        {menuOpen && (
          <Backdrop
            onClick={() => {
              setMenuOpen(false);
              setMobileSubmenuOpen(false);
              setMobileBrokersOpen(false);
              setMobileForumOpen(false);
              setMobileNewsOpen(false);
              setMobileHelpOpen(false);
            }}
          />
        )}

        <Topbar>
          <NavLink to="/">
            <Logo src={logoSrc} alt={logoAlt} $height={logoHeight} $maxWidth={logoMaxWidth} />
          </NavLink>

          <LinkGroup>
            <NavLink to="/live-chat" aria-label={t("header.liveChat")}>
              <HeaderItem>
                <FiMessageCircle size={15} aria-hidden />
                <span>{t("header.liveChat")}</span>
              </HeaderItem>
            </NavLink>
            <NavLink to="/support/tickets" aria-label={t("header.supportTickets")}>
              <HeaderItem>
                <FiLifeBuoy size={15} aria-hidden />
                <span>{t("header.supportTickets")}</span>
              </HeaderItem>
            </NavLink>
            <a
              href={WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${WHATSAPP_SUPPORT_NUMBER_DISPLAY}`}
              style={{ textDecoration: "none" }}
            >
              <HeaderItem>
                <FaWhatsapp size={15} color="#25D366" aria-hidden />
                <span>WhatsApp</span>
              </HeaderItem>
            </a>
            {!isAuthenticated && (
              <NavLink to="/alerts" aria-label="Alerts">
                <HeaderItem>
                  <FiBell size={15} aria-hidden />
                  <span>Alerts</span>
              </HeaderItem>
            </NavLink>
            )}
            <TopbarDivider aria-hidden />
            {isAuthenticated ? (
              <>
                <NotificationBell variant="navbar" />
                {renderAccountMenu(false, desktopAccountRef)}
              </>
            ) : (
              <SignInButton onClick={() => openSignIn()}>{t("header.signIn")}</SignInButton>
            )}
            <LanguageSwitcher />
          </LinkGroup>
        </Topbar>

        <Navbar>
          <NavList>
            {navLinks.slice(0, brokersInsertAt).map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}

            <SubmenuWrapper onMouseEnter={openBrokersMenu} onMouseLeave={closeBrokersMenu}>
              <SubmenuToggle data-open={brokersMenuOpen ? "true" : "false"}>
                {t("nav.brokers")} {brokersMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {brokersMenuOpen && (
                <BrokersDropMenu role="menu" aria-label={t("nav.brokers")}>
                  {BROKER_SUBMENU.map((item, idx) =>
                    item.kind === "label" ? (
                      <DropSectionLabel key={`broker-label-${idx}`}>{item.label}</DropSectionLabel>
                    ) : (
                      <BrokersDropLink
                        to={item.to}
                        key={item.to}
                        end={item.end ?? false}
                        role="menuitem"
                      >
                        {item.label}
                      </BrokersDropLink>
                    )
                  )}
                </BrokersDropMenu>
              )}
            </SubmenuWrapper>

            {navLinks.slice(brokersInsertAt, newsInsertAt >= 0 ? newsInsertAt : forumInsertAt >= 0 ? forumInsertAt : undefined).map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}

            {newsInsertAt >= 0 && (
              <SubmenuWrapper onMouseEnter={openNewsMenu} onMouseLeave={closeNewsMenu}>
                <SubmenuToggle data-open={newsMenuOpen ? "true" : "false"}>
                  {labelForPath("/news", "News")} {newsMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                </SubmenuToggle>
                {newsMenuOpen && (
                  <BrokersDropMenu role="menu" aria-label="News">
                    {NEWS_SUBMENU.map((item) => (
                      <BrokersDropLink
                        to={item.to}
                        key={item.to}
                        end={"end" in item ? Boolean(item.end) : false}
                        role="menuitem"
                      >
                        {item.label}
                      </BrokersDropLink>
                    ))}
                  </BrokersDropMenu>
                )}
              </SubmenuWrapper>
            )}

            {navLinks
              .slice(
                newsInsertAt >= 0 ? newsInsertAt : brokersInsertAt,
                forumInsertAt >= 0 ? forumInsertAt : undefined
              )
              .map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}

            {forumInsertAt >= 0 && (
              <SubmenuWrapper onMouseEnter={openForumMenu} onMouseLeave={closeForumMenu}>
                <SubmenuToggle data-open={forumMenuOpen ? "true" : "false"}>
                  Forum {forumMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                </SubmenuToggle>
                {forumMenuOpen && (
                  <BrokersDropMenu role="menu" aria-label="Forum">
                    {FORUM_SUBMENU.map((item) => (
                      <BrokersDropLink
                        to={item.to}
                        key={item.to}
                        end={"end" in item ? Boolean(item.end) : false}
                        role="menuitem"
                      >
                        {item.label}
                      </BrokersDropLink>
                    ))}
                  </BrokersDropMenu>
                )}
              </SubmenuWrapper>
            )}

            {navLinks.slice(forumInsertAt >= 0 ? forumInsertAt : brokersInsertAt).map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}

            <SubmenuWrapper onMouseEnter={openHelpMenu} onMouseLeave={closeHelpMenu}>
              <SubmenuToggle data-open={helpMenuOpen ? "true" : "false"}>
                Help {helpMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {helpMenuOpen && (
                <BrokersDropMenu role="menu" aria-label="Help">
                  {HELP_SUBMENU.map((item, idx) =>
                    item.kind === "label" ? (
                      <DropSectionLabel key={`help-label-${idx}`}>{item.label}</DropSectionLabel>
                    ) : (
                      <BrokersDropLink
                        to={item.to}
                        key={item.to}
                        end={item.end ?? false}
                        role="menuitem"
                      >
                        {item.label}
                      </BrokersDropLink>
                    )
                  )}
                </BrokersDropMenu>
              )}
            </SubmenuWrapper>

            <SubmenuWrapper onMouseEnter={openToolsMenu} onMouseLeave={closeToolsMenu}>
              <SubmenuToggle data-open={submenuOpen ? "true" : "false"}>
                {t("header.tools")} {submenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>

              {submenuOpen && (
                <ToolsMegaMenu role="menu" aria-label={t("header.tools")}>
                  {marketTools.length > 0 && (
                    <ToolsMegaColumn>
                      <ToolsMegaLabel>Market tools</ToolsMegaLabel>
                      {marketTools.map((tool) => (
                        <ToolsMegaLink to={tool.to} key={tool.to} role="menuitem">
                          <span>{tool.label}</span>
                          {"badge" in tool && typeof (tool as { badge?: unknown }).badge === "string" ? (
                            <span
                              style={{
                                marginLeft: 8,
                                padding: "1px 7px",
                                borderRadius: 999,
                                background: "#fbc113",
                                color: "#111",
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: "0.04em",
                              }}
                            >
                              {(tool as { badge: string }).badge}
                            </span>
                          ) : null}
                        </ToolsMegaLink>
                      ))}
                    </ToolsMegaColumn>
                  )}
                  {educationTools.length > 0 && (
                    <ToolsMegaColumn>
                      <ToolsMegaLabel>{t("header.education")}</ToolsMegaLabel>
                      {educationTools.map((tool) => (
                        <ToolsMegaLink to={tool.to} key={tool.to} role="menuitem">
                          <span>{tool.label}</span>
                        </ToolsMegaLink>
                      ))}
                    </ToolsMegaColumn>
                  )}
                  {calculatorTools.length > 0 && (
                    <ToolsMegaColumn>
                      <ToolsMegaLabel>{t("header.calculators")}</ToolsMegaLabel>
                      <ToolsMegaGrid>
                        {calculatorTools.map((tool) => (
                          <ToolsMegaLink to={tool.to} key={tool.to} role="menuitem">
                            {tool.label}
                          </ToolsMegaLink>
                        ))}
                      </ToolsMegaGrid>
                    </ToolsMegaColumn>
                  )}
                </ToolsMegaMenu>
              )}
            </SubmenuWrapper>
          </NavList>
        </Navbar>

        <MobileBar>
          <NavLink to="/">
            <Logo src={logoSrc} alt={logoAlt} $height={logoHeight} $maxWidth={logoMaxWidth} />
          </NavLink>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <LanguageSwitcher compact />
            {isAuthenticated ? (
              renderAccountMenu(false, mobileAccountRef)
            ) : (
              <SignInButton onClick={() => openSignIn()}>{t("header.signIn")}</SignInButton>
            )}
            <FaBars
              size={22}
              color="white"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </MobileBar>

        {menuOpen && (
          <MobileMenu>
            {isAuthenticated && (
              <>
                <NavItem
                  to="/user-panel/alerts"
                  onClick={() => {
                    setMenuOpen(false);
                    setAccountOpen(false);
                  }}
                >
                  My alerts
                </NavItem>
                <NavItem
                  to={portalPath}
                  onClick={() => {
                    setMenuOpen(false);
                    setAccountOpen(false);
                  }}
                >
                  {t("header.portal")}
                </NavItem>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fecaca",
                    fontWeight: 600,
                    fontSize: 14,
                    textAlign: "left",
                    padding: "0.5rem 0",
                    cursor: "pointer",
                  }}
                >
                  {t("header.logout")}
                </button>
              </>
            )}
            {navLinks.slice(0, brokersInsertAt).map((link) => (
              <NavItem
                to={link.to}
                key={link.to}
                end={link.end || false}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavItem>
            ))}
            <NavItem to="/alerts" onClick={() => setMenuOpen(false)}>
              Alerts
            </NavItem>

            <div>
              <SubmenuToggle onClick={() => setMobileBrokersOpen(!mobileBrokersOpen)}>
                {t("nav.brokers")} {mobileBrokersOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {mobileBrokersOpen && (
                <MobileToolsGroup>
                  {BROKER_SUBMENU.map((item, idx) =>
                    item.kind === "label" ? (
                      <MobileToolsHeading key={`mobile-broker-label-${idx}`}>{item.label}</MobileToolsHeading>
                    ) : (
                      <NavItem
                        to={item.to}
                        key={item.to}
                        end={item.end ?? false}
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileBrokersOpen(false);
                        }}
                      >
                        {item.label}
                      </NavItem>
                    )
                  )}
                </MobileToolsGroup>
              )}
            </div>

            {navLinks.slice(brokersInsertAt, newsInsertAt >= 0 ? newsInsertAt : forumInsertAt >= 0 ? forumInsertAt : undefined).map((link) => (
              <NavItem
                to={link.to}
                key={link.to}
                end={link.end || false}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavItem>
            ))}

            {newsInsertAt >= 0 && (
              <div>
                <SubmenuToggle onClick={() => setMobileNewsOpen(!mobileNewsOpen)}>
                  {labelForPath("/news", "News")} {mobileNewsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </SubmenuToggle>
                {mobileNewsOpen && (
                  <MobileToolsGroup>
                    {NEWS_SUBMENU.map((item) => (
                      <NavItem
                        to={item.to}
                        key={item.to}
                        end={"end" in item ? Boolean(item.end) : false}
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileNewsOpen(false);
                        }}
                      >
                        {item.label}
                      </NavItem>
                    ))}
                  </MobileToolsGroup>
                )}
              </div>
            )}

            {navLinks
              .slice(
                newsInsertAt >= 0 ? newsInsertAt : brokersInsertAt,
                forumInsertAt >= 0 ? forumInsertAt : undefined
              )
              .map((link) => (
              <NavItem
                to={link.to}
                key={link.to}
                end={link.end || false}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavItem>
            ))}

            {forumInsertAt >= 0 && (
              <div>
                <SubmenuToggle onClick={() => setMobileForumOpen(!mobileForumOpen)}>
                  Forum {mobileForumOpen ? <FiChevronUp /> : <FiChevronDown />}
                </SubmenuToggle>
                {mobileForumOpen && (
                  <MobileToolsGroup>
                    {FORUM_SUBMENU.map((item) => (
                      <NavItem
                        to={item.to}
                        key={item.to}
                        end={"end" in item ? Boolean(item.end) : false}
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileForumOpen(false);
                        }}
                      >
                        {item.label}
                      </NavItem>
                    ))}
                  </MobileToolsGroup>
                )}
              </div>
            )}

            {navLinks.slice(forumInsertAt >= 0 ? forumInsertAt : brokersInsertAt).map((link) => (
              <NavItem
                to={link.to}
                key={link.to}
                end={link.end || false}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavItem>
            ))}

            <div>
              <SubmenuToggle onClick={() => setMobileHelpOpen(!mobileHelpOpen)}>
                Help {mobileHelpOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {mobileHelpOpen && (
                <MobileToolsGroup>
                  {HELP_SUBMENU.map((item, idx) =>
                    item.kind === "label" ? (
                      <MobileToolsHeading key={`mobile-help-label-${idx}`}>{item.label}</MobileToolsHeading>
                    ) : (
                      <NavItem
                        to={item.to}
                        key={item.to}
                        end={item.end ?? false}
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileHelpOpen(false);
                        }}
                      >
                        {item.label}
                      </NavItem>
                    )
                  )}
                </MobileToolsGroup>
              )}
            </div>

            <div>
              <SubmenuToggle onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}>
                {t("header.tools")} {mobileSubmenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>

              {mobileSubmenuOpen && (
                <MobileToolsGroup>
                  {marketTools.length > 0 && (
                    <>
                      <MobileToolsHeading>Market tools</MobileToolsHeading>
                      {marketTools.map((tool) => (
                        <NavItem
                          to={tool.to}
                          key={tool.to}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileSubmenuOpen(false);
                          }}
                        >
                          {tool.label}
                          {"badge" in tool && typeof (tool as { badge?: unknown }).badge === "string"
                            ? ` · ${(tool as { badge: string }).badge}`
                            : ""}
                        </NavItem>
                      ))}
                    </>
                  )}
                  {educationTools.length > 0 && (
                    <>
                      <MobileToolsHeading>{t("header.education")}</MobileToolsHeading>
                      {educationTools.map((tool) => (
                        <NavItem
                          to={tool.to}
                          key={tool.to}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileSubmenuOpen(false);
                          }}
                        >
                          {tool.label}
                        </NavItem>
                      ))}
                    </>
                  )}
                  {calculatorTools.length > 0 && (
                    <>
                      <MobileToolsHeading>{t("header.calculators")}</MobileToolsHeading>
                      {calculatorTools.map((tool) => (
                        <NavItem
                          to={tool.to}
                          key={tool.to}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileSubmenuOpen(false);
                          }}
                        >
                          {tool.label}
                        </NavItem>
                      ))}
                    </>
                  )}
                </MobileToolsGroup>
              )}
            </div>
          </MobileMenu>
        )}
      </HeaderWrapper>
    </>
  );
};

export default Header;
