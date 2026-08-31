// Header.tsx
import React, { useEffect, useRef, useState } from "react";
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
import { FaBars } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiUser,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useSiteConfig } from "../../contexts/SiteConfigContext";
import LogoImg from "../../assets/icons/image 2.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";

import { useAuthModal } from "../../contexts/AuthModalContext";
import { useLocale } from "../../contexts/LocaleContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { ABOUT_NESTED_PATHS, ABOUT_SUBMENU } from "../../data/aboutPages";

const FALLBACK_NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works?" },
  { to: "/rebates", label: "Rebates Brokers" },
  { to: "/prop-firms", label: "Prop Firms" },
  { to: "/contests", label: "Contests" },
  { to: "/compare", label: "Compare" },
  { to: "/complaints", label: "Complaints" },
  { to: "/signals", label: "Signals" },
  { to: "/rewards", label: "Rewards" },
  { to: "/analysis", label: "Analysis" },
  { to: "/forum", label: "Forum" },
  { to: "/traders", label: "Traders" },
];

/** Broker-related paths belong under the Brokers submenu, not the top bar. */
const BROKER_NESTED_PATHS = new Set([
  "/brokers",
  "/brokers/beginners",
  "/find-broker",
  "/brokers/match",
  "/scam-broker-shield",
]);

const BROKER_SUBMENU = [
  { to: "/brokers", label: "All Brokers", end: true },
  { to: "/brokers/beginners", label: "Best for New Traders" },
  { to: "/find-broker", label: "Find My Broker" },
  { to: "/scam-broker-shield", label: "Scam Broker Shield" },
];

const EDUCATION_PATHS = new Set([
  "/copy-trading",
  "/courses",
  "/trading-videos",
  "/webinars",
  "/broker-signup-bonuses",
  "/best-performing-stocks",
]);

const FALLBACK_TOOLS = [
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
  { to: "/risk-reward-calculator", label: "Risk / Reward" },
  { to: "/drawdown-calculator", label: "Drawdown Calculator" },
  { to: "/compound-calculator", label: "Compound Calculator" },
  { to: "/crypto-profit-calculator", label: "Crypto Profit" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [brokersMenuOpen, setBrokersMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [mobileBrokersOpen, setMobileBrokersOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const desktopAccountRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountRef = useRef<HTMLDivElement | null>(null);
  const toolsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brokersCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { openSignIn } = useAuthModal();
  const { mainNav, toolsNav, config } = useSiteConfig();
  const { t, labelForPath } = useLocale();

  const navLinks = (
    mainNav.length
      ? mainNav.map((n) => ({ to: n.path, label: labelForPath(n.path, n.label), end: n.end }))
      : FALLBACK_NAV.map((n) => ({ ...n, label: labelForPath(n.to, n.label) }))
  ).filter((n) => !BROKER_NESTED_PATHS.has(n.to) && !ABOUT_NESTED_PATHS.has(n.to));

  const brokersInsertAt = (() => {
    const compareIdx = navLinks.findIndex((l) => l.to === "/compare");
    if (compareIdx >= 0) return compareIdx;
    const contestsIdx = navLinks.findIndex((l) => l.to === "/contests");
    if (contestsIdx >= 0) return contestsIdx + 1;
    return Math.min(5, navLinks.length);
  })();

  const toolsSubmenu = toolsNav.length
    ? toolsNav.map((n) => ({ to: n.path, label: labelForPath(n.path, n.label) }))
    : FALLBACK_TOOLS.map((n) => ({ ...n, label: labelForPath(n.to, n.label) }));
  const educationTools = toolsSubmenu.filter((n) => EDUCATION_PATHS.has(n.to));
  const calculatorTools = toolsSubmenu.filter((n) => !EDUCATION_PATHS.has(n.to));
  const logoSrc = config?.siteLogoUrl || LogoImg;

  const portalPath = user?.role === "admin" ? "/admin-panel" : "/user-panel";
  const isAdmin = user?.role === "admin";
  const accountLabel = isAdmin ? t("header.adminPanel") : t("header.myAccount");

  useEffect(() => {
    return () => {
      if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current);
      if (brokersCloseTimer.current) clearTimeout(brokersCloseTimer.current);
      if (aboutCloseTimer.current) clearTimeout(aboutCloseTimer.current);
    };
  }, []);

  const openToolsMenu = () => {
    if (toolsCloseTimer.current) {
      clearTimeout(toolsCloseTimer.current);
      toolsCloseTimer.current = null;
    }
    setBrokersMenuOpen(false);
    setAboutMenuOpen(false);
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
    setAboutMenuOpen(false);
    setBrokersMenuOpen(true);
  };

  const closeBrokersMenu = () => {
    if (brokersCloseTimer.current) clearTimeout(brokersCloseTimer.current);
    brokersCloseTimer.current = setTimeout(() => setBrokersMenuOpen(false), 180);
  };

  const openAboutMenu = () => {
    if (aboutCloseTimer.current) {
      clearTimeout(aboutCloseTimer.current);
      aboutCloseTimer.current = null;
    }
    setSubmenuOpen(false);
    setBrokersMenuOpen(false);
    setAboutMenuOpen(true);
  };

  const closeAboutMenu = () => {
    if (aboutCloseTimer.current) clearTimeout(aboutCloseTimer.current);
    aboutCloseTimer.current = setTimeout(() => setAboutMenuOpen(false), 180);
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
              setMobileAboutOpen(false);
            }}
          />
        )}

        <Topbar>
          <NavLink to="/">
            <Logo src={logoSrc} alt={`${config?.siteName || "LegendPips"} Logo`} />
          </NavLink>

          <LinkGroup>
            <NavLink to="/live-chat">
              <HeaderItem>
                <img src={SupportIcon} alt="Live Chat" />
                <span>{t("header.liveChat")}</span>
              </HeaderItem>
            </NavLink>
            <NavLink to="/rebate-calculator">
              <HeaderItem>
                <img src={CalculatorIcon} alt="Calculator" />
                <span>{t("header.rebateCalculator")}</span>
              </HeaderItem>
            </NavLink>
            <NavLink to="/location">
              <HeaderItem>
                <img src={LocationIcon} alt="" />
                <span>{t("header.location")}</span>
              </HeaderItem>
            </NavLink>
            <TopbarDivider aria-hidden />
            {isAuthenticated ? (
              renderAccountMenu(false, desktopAccountRef)
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
                  {BROKER_SUBMENU.map((item) => (
                    <BrokersDropLink
                      to={item.to}
                      key={item.to}
                      end={"end" in item ? item.end : false}
                      role="menuitem"
                    >
                      {item.label}
                    </BrokersDropLink>
                  ))}
                </BrokersDropMenu>
              )}
            </SubmenuWrapper>

            {navLinks.slice(brokersInsertAt).map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}

            <SubmenuWrapper onMouseEnter={openAboutMenu} onMouseLeave={closeAboutMenu}>
              <SubmenuToggle data-open={aboutMenuOpen ? "true" : "false"}>
                About us {aboutMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {aboutMenuOpen && (
                <BrokersDropMenu role="menu" aria-label="About us">
                  <DropSectionLabel>Behind the scenes</DropSectionLabel>
                  {ABOUT_SUBMENU.map((item) => (
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

            <SubmenuWrapper onMouseEnter={openToolsMenu} onMouseLeave={closeToolsMenu}>
              <SubmenuToggle data-open={submenuOpen ? "true" : "false"}>
                {t("header.tools")} {submenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>

              {submenuOpen && (
                <ToolsMegaMenu role="menu" aria-label={t("header.tools")}>
                  {educationTools.length > 0 && (
                    <ToolsMegaColumn>
                      <ToolsMegaLabel>{t("header.education")}</ToolsMegaLabel>
                      {educationTools.map((tool) => (
                        <ToolsMegaLink to={tool.to} key={tool.to} role="menuitem">
                          <span>{tool.label}</span>
                          {"badge" in tool && typeof (tool as { badge?: unknown }).badge === "string" ? (
                            <span
                              style={{
                                marginLeft: 8,
                                padding: "1px 7px",
                                borderRadius: 999,
                                background: "#fbbf24",
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
            <Logo src={logoSrc} alt={`${config?.siteName || "LegendPips"} Logo`} />
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

            <div>
              <SubmenuToggle onClick={() => setMobileBrokersOpen(!mobileBrokersOpen)}>
                {t("nav.brokers")} {mobileBrokersOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {mobileBrokersOpen && (
                <MobileToolsGroup>
                  {BROKER_SUBMENU.map((item) => (
                    <NavItem
                      to={item.to}
                      key={item.to}
                      end={"end" in item ? item.end : false}
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileBrokersOpen(false);
                      }}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                </MobileToolsGroup>
              )}
            </div>

            {navLinks.slice(brokersInsertAt).map((link) => (
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
              <SubmenuToggle onClick={() => setMobileAboutOpen(!mobileAboutOpen)}>
                About us {mobileAboutOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {mobileAboutOpen && (
                <MobileToolsGroup>
                  <MobileToolsHeading>Behind the scenes</MobileToolsHeading>
                  {ABOUT_SUBMENU.map((item) => (
                    <NavItem
                      to={item.to}
                      key={item.to}
                      end={"end" in item ? Boolean(item.end) : false}
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileAboutOpen(false);
                      }}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                </MobileToolsGroup>
              )}
            </div>

            <div>
              <SubmenuToggle onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}>
                {t("header.tools")} {mobileSubmenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>

              {mobileSubmenuOpen && (
                <MobileToolsGroup>
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
                          {"badge" in tool && typeof (tool as { badge?: unknown }).badge === "string"
                            ? ` · ${(tool as { badge: string }).badge}`
                            : ""}
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
