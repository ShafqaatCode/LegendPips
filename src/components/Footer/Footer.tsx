import styled from "styled-components";
import type { FC, FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiMessageCircle, FiArrowRight, FiChevronUp } from "react-icons/fi";
import { useLocale } from "../../contexts/LocaleContext";
import { useSiteLogo } from "../../contexts/SiteConfigContext";
import {
  WHATSAPP_SUPPORT_NUMBER_DISPLAY,
  WHATSAPP_SUPPORT_URL,
} from "../../utils/whatsappSupport";

const Shell = styled.footer`
  position: relative;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.primary} 0%,
    #0e2548 55%,
    #0c1f3d 100%
  );
  color: rgba(226, 232, 240, 0.78);
`;

const AccentLine = styled.div`
  height: 2px;
  background: ${({ theme }) => theme.colors.Gold};
  opacity: 0.9;
`;

const BackTop = styled.a`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.gold};
    border-color: rgba(251, 191, 36, 0.5);
  }
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
`;

const SubscribeBand = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 28rem);
  gap: 1.25rem 2.5rem;
  align-items: center;
  padding: clamp(2rem, 4vw, 2.75rem) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const SubscribeCopy = styled.div``;

const SubscribeKicker = styled.p`
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const SubscribeTitle = styled.h3`
  margin: 0;
  font-size: clamp(1.15rem, 1.8vw, 1.4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.WHITE};
  line-height: 1.3;
`;

const SubscribeHint = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(226, 232, 240, 0.72);
  max-width: 40ch;
`;

const SubscribeForm = styled.form`
  display: flex;
  gap: 0;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SubscribeInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  padding: 0.9rem 1rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary};
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    outline: none;
  }
`;

const SubscribeButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: none;
  padding: 0.9rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.Gold};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.05);
  }
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(2.25rem, 4.5vw, 3rem) 0 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const BrandCol = styled.div`
  @media (max-width: 900px) {
    grid-column: 1 / -1;
  }
`;

const LogoLink = styled(NavLink)`
  display: inline-block;
  text-decoration: none;
  margin-bottom: 0.9rem;
`;

const LogoImage = styled.img`
  display: block;
  height: clamp(38px, 4.5vw, 48px);
  width: auto;
  max-width: min(200px, 65vw);
  object-fit: contain;
`;

const Blurb = styled.p`
  margin: 0 0 1.15rem;
  max-width: 30ch;
  font-size: 0.875rem;
  line-height: 1.65;
  color: rgba(226, 232, 240, 0.78);
`;

const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.15rem;
`;

const ContactA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.92);
  text-decoration: none;

  svg {
    color: ${({ theme }) => theme.colors.gold};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const ContactLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.92);
  text-decoration: none;

  svg {
    color: ${({ theme }) => theme.colors.gold};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const Col = styled.nav``;

const ColTitle = styled.h4`
  margin: 0 0 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const LinkList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled(NavLink)`
  font-size: 0.875rem;
  color: rgba(226, 232, 240, 0.88);
  text-decoration: none;
  line-height: 1.4;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ExtLink = styled.a`
  font-size: 0.875rem;
  color: rgba(226, 232, 240, 0.88);
  text-decoration: none;
  line-height: 1.4;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Legal = styled.div`
  margin-top: 0.35rem;
  padding: 1rem 1.15rem 1.05rem;
  border: 1px solid rgba(251, 193, 19, 0.28);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
`;

const LegalText = styled.p`
  margin: 0 0 0.55rem;
  font-size: 0.68rem;
  line-height: 1.65;
  color: rgba(148, 163, 184, 0.95);
  max-width: 78rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BottomBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.1rem 0 1.5rem;
  margin-top: 1rem;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: rgba(148, 163, 184, 0.95);
`;

const BottomLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;

  a {
    font-size: 0.72rem;
    color: rgba(148, 163, 184, 0.95);
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const Footer: FC = () => {
  const { t } = useLocale();
  const { src: logoSrc, alt: logoAlt, height: logoHeight, maxWidth: logoMaxWidth } = useSiteLogo();

  const onNewsletter = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Shell>
      <AccentLine />
      <BackTop href="#top" aria-label="Back to top">
        <FiChevronUp size={16} />
      </BackTop>

      <Inner>
        <SubscribeBand>
          <SubscribeCopy>
            <SubscribeKicker>{t("footer.newsletter")}</SubscribeKicker>
            <SubscribeTitle>Stay ahead of rebates & market moves</SubscribeTitle>
            <SubscribeHint>
              Short updates on cashback, brokers, and tools — unsubscribe anytime.
            </SubscribeHint>
          </SubscribeCopy>
          <SubscribeForm onSubmit={onNewsletter}>
            <SubscribeInput
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              aria-label={t("footer.emailPlaceholder")}
              required
            />
            <SubscribeButton type="submit">
              {t("footer.subscribe")}
              <FiArrowRight size={15} />
            </SubscribeButton>
          </SubscribeForm>
        </SubscribeBand>

        <Main>
          <BrandCol>
            <LogoLink to="/" aria-label={logoAlt || "LegendPips home"}>
              <LogoImage
                src={logoSrc}
                alt={logoAlt}
                style={{
                  height: Math.min(48, Math.max(36, logoHeight)),
                  maxWidth: Math.min(200, Math.max(120, logoMaxWidth)),
                }}
              />
            </LogoLink>
            <Blurb>{t("footer.blurb")}</Blurb>
            <ContactRow>
              <ContactA href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={14} />
                {WHATSAPP_SUPPORT_NUMBER_DISPLAY}
              </ContactA>
              <ContactLink to="/live-chat">
                <FiMessageCircle size={14} />
                Live chat
              </ContactLink>
              <ContactA href="mailto:support@legendpips.com">
                <FiMail size={14} />
                Email
              </ContactA>
            </ContactRow>
          </BrandCol>

          <Col aria-label="Company">
            <ColTitle>{t("footer.company")}</ColTitle>
            <LinkList>
              <li><FooterLink to="/about">{t("footer.about")}</FooterLink></li>
              <li><FooterLink to="/about/team">The team</FooterLink></li>
              <li><FooterLink to="/about/methodology">Methodology</FooterLink></li>
              <li><FooterLink to="/about/careers">Careers</FooterLink></li>
              <li><FooterLink to="/about/partners">Partners</FooterLink></li>
            </LinkList>
          </Col>

          <Col aria-label="Explore">
            <ColTitle>Explore</ColTitle>
            <LinkList>
              <li><FooterLink to="/brokers">{t("footer.brokers")}</FooterLink></li>
              <li><FooterLink to="/rebates">Rebates</FooterLink></li>
              <li><FooterLink to="/find-broker">Find my broker</FooterLink></li>
              <li><FooterLink to="/compare">Compare</FooterLink></li>
              <li><FooterLink to="/tools">{t("footer.tools")}</FooterLink></li>
              <li><FooterLink to="/signals">Signals</FooterLink></li>
              <li><FooterLink to="/contests">Contests</FooterLink></li>
              <li><FooterLink to="/leaderboard">Leaderboard</FooterLink></li>
              <li><FooterLink to="/rewards">Rewards</FooterLink></li>
              <li><FooterLink to="/strategies">Strategies</FooterLink></li>
              <li><FooterLink to="/streaks">Streaks</FooterLink></li>
            </LinkList>
          </Col>

          <Col aria-label="Help">
            <ColTitle>{t("footer.help")}</ColTitle>
            <LinkList>
              <li><FooterLink to="/support">{t("footer.support")}</FooterLink></li>
              <li><FooterLink to="/support/advice">Broker advice</FooterLink></li>
              <li><FooterLink to="/support/tickets">Tickets</FooterLink></li>
              <li><FooterLink to="/complaints">{t("footer.complaintCenter")}</FooterLink></li>
              <li><FooterLink to="/faqs">FAQs</FooterLink></li>
              <li><FooterLink to="/knowledge-base">Knowledge base</FooterLink></li>
              <li>
                <ExtLink href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </ExtLink>
              </li>
            </LinkList>
          </Col>
        </Main>

        <Legal>
          <LegalText>
            LegendPips does not provide accounts to residents of the United States. The content of
            this website is not intended for individuals in any country or jurisdiction where such
            distribution or use would violate local laws or regulations.
          </LegalText>
          <LegalText>
            Trading foreign exchange involves significant risk and may not be appropriate for all
            investors. Only trade with money you can afford to lose. Information on this site is for
            educational purposes only and is not investment advice.
          </LegalText>
        </Legal>

        <BottomBar>
          <Copyright>© {new Date().getFullYear()} LegendPips. All rights reserved.</Copyright>
          <BottomLinks>
            <FooterLink to="/legal/terms">{t("footer.terms")}</FooterLink>
            <FooterLink to="/legal/privacy">{t("footer.privacy")}</FooterLink>
            <FooterLink to="/legal/risk-disclosure">{t("footer.risk")}</FooterLink>
            <FooterLink to="/legal/cashback-terms">{t("footer.cashback")}</FooterLink>
          </BottomLinks>
        </BottomBar>
      </Inner>
    </Shell>
  );
};

export default Footer;
