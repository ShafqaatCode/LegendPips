import React, { useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  FiHelpCircle,
  FiMail,
  FiMessageSquare,
  FiMinus,
  FiPlus,
  FiSend,
  FiUploadCloud,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { submitFeedback } from "../../services/feedbackService";
import {
  WHATSAPP_SUPPORT_NUMBER_DISPLAY,
  WHATSAPP_SUPPORT_URL,
} from "../../utils/whatsappSupport";
import {
  DISCUSSION_GROUP_IS_EXTERNAL,
  DISCUSSION_GROUP_URL,
  SUPPORT_EMAIL,
  SUPPORT_EMAIL_URL,
} from "../../utils/supportChannels";

const NAVY = "#132E58";
const GOLD = "#FBC113";

type PopularFaq = { q: string; a: string; subjectHint: string; category: string };

const POPULAR_FAQS: PopularFaq[] = [
  {
    q: "When will the rebate be disbursed?",
    a: "Rebates are reviewed after your broker confirms closed lots. Once verified, credits usually appear in your LegendPips wallet within 1–3 business days. Delays often mean the IB link or account mapping is still pending.",
    subjectHint: "Rebate disbursement timing",
    category: "rebates",
  },
  {
    q: "What is the minimum withdrawal?",
    a: "Minimum withdrawal depends on your reward balance and payment method. Check User Panel → Rewards / Rebates for the current threshold. Incomplete KYC can block payouts even when the balance is ready.",
    subjectHint: "Minimum withdrawal (WD)",
    category: "rebates",
  },
  {
    q: "How do I change my trading account?",
    a: "Open User Panel → Live accounts (or IB change) and submit the new account details with your broker name. Support will re-link rebates after verification — do not trade on the new account until linkage is confirmed.",
    subjectHint: "Change trading account",
    category: "account",
  },
  {
    q: "Why is my MT4 / MT5 account invalid?",
    a: "Common causes: wrong account number, demo instead of live, IB not set to LegendPips, or the broker is temporarily disabled on our side. Double-check credentials and partner link, then attach a screenshot of your account info when opening a ticket.",
    subjectHint: "MT4/MT5 account invalid",
    category: "technical",
  },
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Hero = styled.section`
  position: relative;
  min-height: clamp(200px, 28vh, 260px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0b1b38 0%, ${NAVY} 55%, #1a3d6e 100%);
  padding: clamp(2.25rem, 5vw, 3.25rem) ${({ theme }) => theme.typography.pageGutter} 1.5rem;
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
  animation: ${fadeUp} 0.45s ease both;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${GOLD};
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-family: Poppins, sans-serif;
  font-size: clamp(1.55rem, 2.6vw, 2.05rem);
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.95rem;
`;

const Page = styled.main`
  background:
    radial-gradient(ellipse 70% 40% at 10% 0%, rgba(251, 193, 19, 0.08), transparent 50%),
    radial-gradient(ellipse 50% 35% at 90% 10%, rgba(19, 46, 88, 0.06), transparent 45%),
    #eef2f7;
  padding: 1.35rem ${({ theme }) => theme.typography.pageGutter} 3.5rem;
`;

const Shell = styled.div`
  max-width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1.15rem;
`;

const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  animation: ${fadeUp} 0.5s ease 0.05s both;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const ChannelCardBase = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.05rem 1.15rem;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(19, 46, 88, 0.06);
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(251, 193, 19, 0.55);
    box-shadow: 0 14px 32px rgba(19, 46, 88, 0.1);
  }
`;

const ChannelCardA = styled(ChannelCardBase).attrs({ as: "a" })``;
const ChannelCardLink = styled(ChannelCardBase).attrs({ as: Link })``;

const ChannelIcon = styled.span<{ $tone: "wa" | "tg" | "mail" }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
  background: ${({ $tone }) =>
    $tone === "wa"
      ? "linear-gradient(145deg, #25d366, #128c7e)"
      : $tone === "tg"
        ? "linear-gradient(145deg, #2aabee, #229ed9)"
        : `linear-gradient(145deg, ${NAVY}, #1a4a7a)`};
  color: #fff;
  box-shadow: 0 6px 14px rgba(19, 46, 88, 0.18);
`;

const ChannelText = styled.div`
  min-width: 0;
  h3 {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${NAVY};
  }
  p {
    margin: 0.2rem 0 0;
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1rem;
  align-items: start;
  animation: ${fadeUp} 0.55s ease 0.1s both;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.35rem 1.4rem 1.5rem;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.15rem;

  .icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, ${GOLD}, #f59e0b);
    color: ${NAVY};
    font-size: 1.1rem;
    box-shadow: 0 4px 12px rgba(251, 193, 19, 0.35);
  }

  h2 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: ${NAVY};
    letter-spacing: -0.01em;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 0.95rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${NAVY};

  input,
  select,
  textarea {
    font: inherit;
    font-weight: 500;
    font-size: 0.9rem;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.78rem 0.9rem;
    outline: none;
    background: #f8fafc;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }

  textarea {
    min-height: 140px;
    resize: vertical;
    line-height: 1.5;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: ${GOLD};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(251, 193, 19, 0.22);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const DropZone = styled.button<{ $hasFile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  min-height: 112px;
  padding: 1rem;
  border-radius: 14px;
  border: 1.5px dashed ${({ $hasFile }) => ($hasFile ? GOLD : "#cbd5e1")};
  background: ${({ $hasFile }) => ($hasFile ? "rgba(251, 193, 19, 0.08)" : "#f8fafc")};
  color: ${NAVY};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  svg {
    font-size: 1.55rem;
    color: ${({ $hasFile }) => ($hasFile ? "#b45309" : "#64748b")};
  }

  strong {
    font-size: 0.82rem;
    font-weight: 700;
  }

  span {
    font-size: 0.72rem;
    color: #64748b;
    font-weight: 500;
  }

  &:hover {
    border-color: ${GOLD};
    background: rgba(251, 193, 19, 0.06);
  }
`;

const FileChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.55rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: ${NAVY};
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  max-width: 100%;

  em {
    font-style: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
  }

  button {
    border: none;
    background: transparent;
    color: ${GOLD};
    display: inline-flex;
    cursor: pointer;
    padding: 0;
  }
`;

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 0.95rem 1.25rem;
  margin-top: 0.25rem;
  background: linear-gradient(135deg, ${GOLD} 0%, #f59e0b 100%);
  color: ${NAVY};
  font-weight: 800;
  font-size: 0.88rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(251, 193, 19, 0.35);
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Msg = styled.p<{ $ok?: boolean }>`
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $ok }) => ($ok ? "#047857" : "#b91c1c")};
`;

const FaqList = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const FaqItem = styled.div<{ $open?: boolean }>`
  border: 1px solid ${({ $open }) => ($open ? "rgba(251, 193, 19, 0.55)" : "#e2e8f0")};
  border-radius: 12px;
  background: ${({ $open }) => ($open ? "rgba(251, 193, 19, 0.06)" : "#f8fafc")};
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
`;

const FaqBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: ${NAVY};
  font-weight: 700;
  font-size: 0.86rem;
  line-height: 1.35;

  .toggle {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${NAVY};
    color: ${GOLD};
    font-size: 0.9rem;
  }
`;

const FaqAnswer = styled.div`
  padding: 0 0.95rem 0.9rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: #475569;
  font-weight: 500;

  button {
    margin-top: 0.65rem;
    border: none;
    background: transparent;
    color: ${NAVY};
    font-weight: 700;
    font-size: 0.78rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const SideLinks = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.1rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: ${NAVY};
    font-weight: 700;
    font-size: 0.82rem;
    text-decoration: none;
  }

  a:hover {
    color: #b45309;
  }
`;

const SupportTicketsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileLabel = useMemo(() => {
    if (!screenshot) return null;
    const mb = screenshot.size / (1024 * 1024);
    return `${screenshot.name} (${mb < 0.1 ? "<0.1" : mb.toFixed(1)} MB)`;
  }, [screenshot]);

  const applySuggestion = (faq: PopularFaq) => {
    setSubject(faq.subjectHint);
    setCategory(faq.category);
    setMessage((prev) =>
      prev.trim()
        ? prev
        : `Regarding: ${faq.q}\n\nTell us the chronology of your problem…`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFile = (file?: File | null) => {
    if (!file) {
      setScreenshot(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Screenshot must be 5 MB or smaller.");
      return;
    }
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    if (!ok) {
      setError("Please upload a JPG, PNG, or WebP screenshot.");
      return;
    }
    setError(null);
    setScreenshot(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      setError("Email and details are required.");
      return;
    }
    if (!subject.trim()) {
      setError("Please tell us how we can help (subject).");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await submitFeedback({
        email: email.trim(),
        subject: subject.trim(),
        category,
        message: message.trim(),
        page: "/support/tickets",
        screenshot,
      });
      setSuccess(
        res.ticketId
          ? `Ticket ${res.ticketId} created. Our team will reply soon.`
          : "Ticket created. Our team will reply soon."
      );
      setSubject("");
      setMessage("");
      setCategory("general");
      setScreenshot(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Support center</Eyebrow>
          <Title>How can we help you?</Title>
          <Lead>
            Reach us on WhatsApp, join the trader community, or open a ticket with screenshots — we reply with a
            tracking ID.
          </Lead>
        </HeroInner>
      </Hero>

      <Page>
        <Shell>
          <ChannelGrid>
            <ChannelCardA href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
              <ChannelIcon $tone="wa">
                <FaWhatsapp />
              </ChannelIcon>
              <ChannelText>
                <h3>WhatsApp</h3>
                <p>Quick response · {WHATSAPP_SUPPORT_NUMBER_DISPLAY}</p>
              </ChannelText>
            </ChannelCardA>

            {DISCUSSION_GROUP_IS_EXTERNAL ? (
              <ChannelCardA href={DISCUSSION_GROUP_URL} target="_blank" rel="noopener noreferrer">
                <ChannelIcon $tone="tg">
                  <FaTelegramPlane />
                </ChannelIcon>
                <ChannelText>
                  <h3>Discussion group</h3>
                  <p>Trader community</p>
                </ChannelText>
              </ChannelCardA>
            ) : (
              <ChannelCardLink to={DISCUSSION_GROUP_URL}>
                <ChannelIcon $tone="tg">
                  <FaTelegramPlane />
                </ChannelIcon>
                <ChannelText>
                  <h3>Discussion group</h3>
                  <p>Trader community</p>
                </ChannelText>
              </ChannelCardLink>
            )}

            <ChannelCardA href={SUPPORT_EMAIL_URL}>
              <ChannelIcon $tone="mail">
                <FiMail />
              </ChannelIcon>
              <ChannelText>
                <h3>Email support</h3>
                <p>Official assistance · {SUPPORT_EMAIL}</p>
              </ChannelText>
            </ChannelCardA>
          </ChannelGrid>

          <MainGrid>
            <Panel>
              <PanelHead>
                <span className="icon">
                  <FiMessageSquare />
                </span>
                <h2>Create a support ticket</h2>
              </PanelHead>

              <Form onSubmit={onSubmit}>
                <Row>
                  <Field>
                    Your email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@email.com"
                    />
                  </Field>
                  <Field>
                    Category
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="general">General</option>
                      <option value="account">Account</option>
                      <option value="rebates">Rebates</option>
                      <option value="technical">Technical</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                </Row>

                <Field>
                  How can we help you?
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Rebate problem not entering"
                    maxLength={200}
                    required
                  />
                </Field>

                <Field>
                  Explain the details
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us the chronology of your problem…"
                    required
                  />
                </Field>

                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={(e) => onFile(e.target.files?.[0] || null)}
                  />
                  <DropZone
                    type="button"
                    $hasFile={!!screenshot}
                    onClick={() => fileRef.current?.click()}
                  >
                    <FiUploadCloud />
                    <strong>Click to upload screenshot of proof (optional)</strong>
                    <span>JPG, PNG, or WebP · max 5 MB</span>
                  </DropZone>
                  {fileLabel && (
                    <FileChip>
                      <em>{fileLabel}</em>
                      <button
                        type="button"
                        aria-label="Remove screenshot"
                        onClick={() => {
                          setScreenshot(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                      >
                        <FiX />
                      </button>
                    </FileChip>
                  )}
                </div>

                {error && <Msg>{error}</Msg>}
                {success && <Msg $ok>{success}</Msg>}

                <Submit type="submit" disabled={loading}>
                  <FiSend /> {loading ? "Sending…" : "Send ticket now"}
                </Submit>
              </Form>

              <SideLinks>
                <Link to="/live-chat">
                  Live chat <FiArrowRight />
                </Link>
                {isAuthenticated ? (
                  <Link to="/user-panel/tickets">
                    My tickets <FiArrowRight />
                  </Link>
                ) : (
                  <Link to="/signin">
                    Sign in to track tickets <FiArrowRight />
                  </Link>
                )}
              </SideLinks>
            </Panel>

            <Panel>
              <PanelHead>
                <span className="icon">
                  <FiHelpCircle />
                </span>
                <h2>Popular questions</h2>
              </PanelHead>

              <FaqList>
                {POPULAR_FAQS.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <FaqItem key={faq.q} $open={open}>
                      <FaqBtn
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                      >
                        {faq.q}
                        <span className="toggle">{open ? <FiMinus /> : <FiPlus />}</span>
                      </FaqBtn>
                      {open && (
                        <FaqAnswer>
                          {faq.a}
                          <button type="button" onClick={() => applySuggestion(faq)}>
                            Use this topic in my ticket <FiArrowRight />
                          </button>
                        </FaqAnswer>
                      )}
                    </FaqItem>
                  );
                })}
              </FaqList>

              <SideLinks>
                <Link to="/faqs">
                  View all FAQs <FiArrowRight />
                </Link>
              </SideLinks>
            </Panel>
          </MainGrid>
        </Shell>
      </Page>
    </>
  );
};

export default SupportTicketsPage;
