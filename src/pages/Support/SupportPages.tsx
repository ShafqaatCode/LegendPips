import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiArrowRight,
  FiBookOpen,
  FiHelpCircle,
  FiMail,
  FiMessageCircle,
  FiShield,
  FiVideo,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import Faqs from "../../components/Faqs/Faqs";
import ContactAdviceSection from "../../components/Support/ContactAdviceSection";
import { useAuth } from "../../contexts/AuthContext";
import {
  WHATSAPP_SUPPORT_NUMBER_DISPLAY,
  WHATSAPP_SUPPORT_URL,
} from "../../utils/whatsappSupport";

const Hero = styled.section`
  position: relative;
  min-height: clamp(220px, 30vh, 280px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter} 1.75rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${bannerBg});
  background-size: cover;
  opacity: 0.12;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbbf24;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Content = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const Grid = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.05);
  transition: border-color 0.15s, transform 0.15s;

  &:hover {
    border-color: rgba(251, 191, 36, 0.55);
    transform: translateY(-2px);
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #132e58;
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.5;
    flex: 1;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8125rem;
    font-weight: 700;
    color: #132e58;
    margin-top: 0.35rem;
  }
`;

const IconWrap = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: #fffbeb;
  color: #132e58;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const ContactCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.05);

  h3 {
    margin: 0 0 0.45rem;
    color: #132e58;
    font-size: 1rem;
  }

  p {
    margin: 0 0 0.75rem;
    color: #64748b;
    font-size: 0.875rem;
    line-height: 1.55;
  }

  a {
    color: #132e58;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #132e58;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export function ContactSupportPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Support</Eyebrow>
          <Title>Contact us</Title>
          <Lead>
            Questions about rebates, broker issues, or your account? Reach our team through the channels below.
          </Lead>
        </HeroInner>
      </Hero>

      <ContactAdviceSection defaultTab="contact" />

      <Page>
        <Content>
          <ContactGrid>
            <ContactCard>
              <h3>
                <FiMail style={{ marginRight: 8, verticalAlign: "middle" }} />
                Email support
              </h3>
              <p>General help, partnership questions, and account follow-ups.</p>
              <a href="mailto:support@legendpips.com">support@legendpips.com</a>
            </ContactCard>

            <ContactCard>
              <h3>
                <FiMessageCircle style={{ marginRight: 8, verticalAlign: "middle" }} />
                Live chat
              </h3>
              <p>Chat with us during business hours for quick answers.</p>
              <ContactLink to="/live-chat">
                Open live chat <FiArrowRight />
              </ContactLink>
            </ContactCard>

            <ContactCard>
              <h3>
                <FaWhatsapp style={{ marginRight: 8, verticalAlign: "middle", color: "#25D366" }} />
                WhatsApp
              </h3>
              <p>Message our support team on WhatsApp for fast help.</p>
              <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                {WHATSAPP_SUPPORT_NUMBER_DISPLAY}
              </a>
            </ContactCard>

            <ContactCard>
              <h3>
                <FiShield style={{ marginRight: 8, verticalAlign: "middle" }} />
                Broker complaints
              </h3>
              <p>Report withdrawal delays, manipulation, or poor broker support.</p>
              <ContactLink to="/complaints">
                Complaint center <FiArrowRight />
              </ContactLink>
            </ContactCard>

            <ContactCard>
              <h3>
                <FiHelpCircle style={{ marginRight: 8, verticalAlign: "middle" }} />
                Support tickets
              </h3>
              <p>
                {isAuthenticated
                  ? "Open a ticket and track replies from your member panel."
                  : "Sign in to open support tickets and track replies."}
              </p>
              <ContactLink to={isAuthenticated ? "/user-panel/tickets" : "/support/tickets"}>
                {isAuthenticated ? "My tickets" : "Open a ticket"} <FiArrowRight />
              </ContactLink>
            </ContactCard>

            <ContactCard>
              <h3>
                <FiShield style={{ marginRight: 8, verticalAlign: "middle" }} />
                Member panel
              </h3>
              <p>
                {isAuthenticated
                  ? "Track complaints, rebates, and verification from your dashboard."
                  : "Sign in to view tickets, rebates, and verification status."}
              </p>
              <ContactLink to={isAuthenticated ? "/user-panel" : "/signin"}>
                {isAuthenticated ? "Open dashboard" : "Sign in"} <FiArrowRight />
              </ContactLink>
            </ContactCard>
          </ContactGrid>
        </Content>
      </Page>
    </>
  );
}

export function BrokerAdvicePage() {
  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Support</Eyebrow>
          <Title>Broker advice</Title>
          <Lead>
            Tell us what you need — or use the short form below — and we will help match you to a
            suitable partner broker.
          </Lead>
        </HeroInner>
      </Hero>
      <ContactAdviceSection defaultTab="advice" />
    </>
  );
}

export function FaqsPage() {
  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Support</Eyebrow>
          <Title>FAQs</Title>
          <Lead>Quick answers about signals, rebates, brokers, and using LegendPips.</Lead>
        </HeroInner>
      </Hero>
      <Faqs />
    </>
  );
}

const KB_ITEMS = [
  {
    to: "/how-it-works",
    icon: <FiHelpCircle />,
    title: "How LegendPips works",
    body: "Rebates, signals, contests, and the member panel explained step by step.",
  },
  {
    to: "/about/methodology",
    icon: <FiShield />,
    title: "Why trust our reviews",
    body: "How we rank brokers, handle partner links, and maintain Scam Broker Shield.",
  },
  {
    to: "/courses",
    icon: <FiBookOpen />,
    title: "Courses",
    body: "Structured lessons for beginners and intermediate traders.",
  },
  {
    to: "/trading-videos",
    icon: <FiVideo />,
    title: "Trading videos",
    body: "Free and premium video lessons on charts, risk, and strategy.",
  },
  {
    to: "/calculators",
    icon: <FiBookOpen />,
    title: "Calculators & tools",
    body: "Pip, margin, rebate, spread comparison, and more trading utilities.",
  },
  {
    to: "/complaints",
    icon: <FiShield />,
    title: "Complaint guides",
    body: "How to document broker issues and what our team can investigate.",
  },
];

export function KnowledgeBasePage() {
  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Support</Eyebrow>
          <Title>Knowledge base</Title>
          <Lead>Guides and learning resources to help you trade smarter with LegendPips.</Lead>
        </HeroInner>
      </Hero>

      <Page>
        <Grid>
          {KB_ITEMS.map((item) => (
            <Card to={item.to} key={item.to}>
              <IconWrap>{item.icon}</IconWrap>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span>
                Read more <FiArrowRight />
              </span>
            </Card>
          ))}
        </Grid>
      </Page>
    </>
  );
}
