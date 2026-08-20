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

const FALLBACK_NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works?" },
  { to: "/rebates", label: "Rebates Brokers" },
  { to: "/prop-firms", label: "Prop Firms" },
  { to: "/contests", label: "Contests" },
  { to: "/brokers", label: "Brokers" },
  { to: "/compare", label: "Compare" },
  { to: "/complaints", label: "Complaints" },
  { to: "/signals", label: "Signals" },
  { to: "/rewards", label: "Rewards" },
  { to: "/analysis", label: "Analysis" },
  { to: "/forum", label: "Forum" },
  { to: "/traders", label: "Traders" },
];

const EDUCATION_PATHS = new Set([
  "/copy-trading",
  "/courses",
  "/trading-videos",
  "/webinars",
]);

const FALLBACK_TOOLS = [
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
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const desktopAccountRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountRef = useRef<HTMLDivElement | null>(null);
  const toolsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { openSignIn } = useAuthModal();
  const { mainNav, toolsNav, config } = useSiteConfig();
  const { t, labelForPath } = useLocale();

  const navLinks = mainNav.length
    ? mainNav.map((n) => ({ to: n.path, label: labelForPath(n.path, n.label), end: n.end }))
    : FALLBACK_NAV.map((n) => ({ ...n, label: labelForPath(n.to, n.label) }));
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
    };
  }, []);

  const openToolsMenu = () => {
    if (toolsCloseTimer.current) {
      clearTimeout(toolsCloseTimer.current);
      toolsCloseTimer.current = null;
    }
    setSubmenuOpen(true);
  };

  const closeToolsMenu = () => {
    if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current);
    toolsCloseTimer.current = setTimeout(() => setSubmenuOpen(false), 180);
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
          {isAdmin ? <FiShield size={18} aria-hidden /> : <FiUser size={18} aria-hidden />}
          <span>{outline ? (isAdmin ? t("header.admin") : user?.firstName || t("header.account")) : accountLabel}</span>
          {accountOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
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
                <img src={LocationIcon} alt="Location" />
                <span>{t("header.location")}</span>
              </HeaderItem>
            </NavLink>
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
            {navLinks.map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}

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
                          {tool.label}
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
            {navLinks.map((link) => (
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
