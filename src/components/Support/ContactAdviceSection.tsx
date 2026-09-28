import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck, FiMail, FiMessageSquare, FiPhone } from "react-icons/fi";
import { openLiveChat } from "../../utils/liveChatEvents";
import { WHATSAPP_SUPPORT_URL } from "../../utils/whatsappSupport";
import { submitFeedback } from "../../services/feedbackService";

type TabKey = "contact" | "advice";

const SUPPORT_EMAIL = "support@legendpips.com";

type Props = {
  /** Force starting tab (URL `?tab=advice` still wins when present). */
  defaultTab?: TabKey;
};

const ContactAdviceSection: React.FC<Props> = ({ defaultTab = "contact" }) => {
  const [params, setParams] = useSearchParams();
  const tabFromUrl = params.get("tab") === "advice" ? "advice" : params.get("tab") === "contact" ? "contact" : null;
  const [tab, setTab] = useState<TabKey>(tabFromUrl || defaultTab);
  const [callbackOpen, setCallbackOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [adviceName, setAdviceName] = useState("");
  const [adviceEmail, setAdviceEmail] = useState("");
  const [adviceCountry, setAdviceCountry] = useState("");
  const [adviceDeposit, setAdviceDeposit] = useState("");
  const [adviceGoal, setAdviceGoal] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceDone, setAdviceDone] = useState<string | null>(null);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  useEffect(() => {
    if (tabFromUrl) setTab(tabFromUrl);
  }, [tabFromUrl]);

  const selectTab = (next: TabKey) => {
    setTab(next);
    setDone(null);
    setError(null);
    const onSupportPage =
      typeof window !== "undefined" && window.location.pathname.startsWith("/support");
    if (!onSupportPage) return;
    const nextParams = new URLSearchParams(params);
    if (next === "advice") nextParams.set("tab", "advice");
    else nextParams.delete("tab");
    setParams(nextParams, { replace: true });
  };

  const submitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }
    setLoading(true);
    setError(null);
    setDone(null);
    try {
      const contactEmail = email.trim() || SUPPORT_EMAIL;
      const res = await submitFeedback({
        email: contactEmail,
        subject: "Request a call back — broker advice",
        category: "account",
        message: [
          name.trim() ? `Name: ${name.trim()}` : null,
          `Phone: ${phone.trim()}`,
          email.trim() ? `Email: ${email.trim()}` : null,
          note.trim() ? `Note: ${note.trim()}` : null,
          "Source: Contact / Advice widget — callback request",
        ]
          .filter(Boolean)
          .join("\n"),
        page: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      setDone(
        res.ticketId
          ? `Request sent. Ticket ${res.ticketId} — we will call you back.`
          : "Request sent. We will call you back shortly."
      );
      setName("");
      setPhone("");
      setEmail("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send request.");
    } finally {
      setLoading(false);
    }
  };

  const submitAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceEmail.trim()) {
      setAdviceError("Please enter your email so we can reply.");
      return;
    }
    if (!adviceGoal.trim() && !adviceCountry.trim()) {
      setAdviceError("Tell us your country or what you need help with.");
      return;
    }
    setAdviceLoading(true);
    setAdviceError(null);
    setAdviceDone(null);
    try {
      const res = await submitFeedback({
        email: adviceEmail.trim(),
        subject: "Broker advice request",
        category: "account",
        message: [
          adviceName.trim() ? `Name: ${adviceName.trim()}` : null,
          adviceCountry.trim() ? `Country: ${adviceCountry.trim()}` : null,
          adviceDeposit.trim() ? `Deposit range: ${adviceDeposit.trim()}` : null,
          adviceGoal.trim() ? `Looking for: ${adviceGoal.trim()}` : null,
          "Source: Contact / Advice widget — advice form",
        ]
          .filter(Boolean)
          .join("\n"),
        page: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      setAdviceDone(
        res.ticketId
          ? `Thanks — we received your request (Ticket ${res.ticketId}).`
          : "Thanks — we received your advice request and will reply soon."
      );
      setAdviceName("");
      setAdviceEmail("");
      setAdviceCountry("");
      setAdviceDeposit("");
      setAdviceGoal("");
    } catch (err) {
      setAdviceError(err instanceof Error ? err.message : "Could not send request.");
    } finally {
      setAdviceLoading(false);
    }
  };

  return (
    <Section aria-label="Contact and broker advice">
      <Frame>
        <Aside>
          <AsideEyebrow>LegendPips support</AsideEyebrow>
          <AsideTitle>
            {tab === "contact" ? "Talk to a real person" : "Get broker advice"}
          </AsideTitle>
          <AsideText>
            {tab === "contact"
              ? "Not sure which broker fits you? Our team looks out for your interests — regulation, spreads, and cashback included."
              : "We match you using regulation, platforms, and rebate rates — not whoever pays us the most."}
          </AsideText>
          <AsidePoints>
            {(tab === "contact"
              ? ["Live chat & call backs", "Email follow-ups", "WhatsApp support"]
              : ["Country & deposit match", "Side-by-side rebates", "Account manager help"]
            ).map((line) => (
              <AsidePoint key={line}>
                <FiCheck /> {line}
              </AsidePoint>
            ))}
          </AsidePoints>
          {tab === "advice" && (
            <AsideCta to="/find-broker">Or take the Find my broker quiz →</AsideCta>
          )}
        </Aside>

        <Main>
          <Seg role="tablist" aria-label="Contact options">
            <SegBtn
              type="button"
              role="tab"
              aria-selected={tab === "contact"}
              $active={tab === "contact"}
              onClick={() => selectTab("contact")}
            >
              Contact Us
            </SegBtn>
            <SegBtn
              type="button"
              role="tab"
              aria-selected={tab === "advice"}
              $active={tab === "advice"}
              onClick={() => selectTab("advice")}
            >
              Advice
            </SegBtn>
          </Seg>

          {tab === "contact" ? (
            <>
              <MainTitle>Not sure which broker to open an account with?</MainTitle>
              <MainLead>
                Our experienced staff can help choose a broker based on your needs. We promise to
                look out for your best interests.
              </MainLead>

              <ChannelGrid>
                <Channel type="button" onClick={() => openLiveChat()}>
                  <ChannelIcon $tone="teal">
                    <FiMessageSquare />
                  </ChannelIcon>
                  <ChannelLabel>Live Chat</ChannelLabel>
                  <ChannelHint>Real-time answers</ChannelHint>
                </Channel>
                <Channel
                  type="button"
                  $active={callbackOpen}
                  onClick={() => {
                    setCallbackOpen((v) => !v);
                    setDone(null);
                    setError(null);
                  }}
                >
                  <ChannelIcon $tone="navy">
                    <FiPhone />
                  </ChannelIcon>
                  <ChannelLabel>Call back</ChannelLabel>
                  <ChannelHint>We phone you</ChannelHint>
                </Channel>
                <Channel as="a" href={`mailto:${SUPPORT_EMAIL}?subject=Broker%20advice`}>
                  <ChannelIcon $tone="gold">
                    <FiMail />
                  </ChannelIcon>
                  <ChannelLabel>Email</ChannelLabel>
                  <ChannelHint>support@…</ChannelHint>
                </Channel>
              </ChannelGrid>

              {callbackOpen && (
                <FormBlock onSubmit={submitCallback}>
                  <FormTitle>Request a call back</FormTitle>
                  <Row2>
                    <Field>
                      <span>Name</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </Field>
                    <Field>
                      <span>Phone *</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 …"
                        required
                      />
                    </Field>
                  </Row2>
                  <Row2>
                    <Field>
                      <span>Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="optional"
                      />
                    </Field>
                    <Field>
                      <span>Note</span>
                      <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Best time / country"
                      />
                    </Field>
                  </Row2>
                  {error && <Msg $error>{error}</Msg>}
                  {done && <Msg>{done}</Msg>}
                  <FormActions>
                    <Primary type="submit" disabled={loading}>
                      {loading ? "Sending…" : "Submit request"}
                    </Primary>
                    <GhostLink href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                      WhatsApp instead
                    </GhostLink>
                  </FormActions>
                </FormBlock>
              )}
            </>
          ) : (
            <>
              <MainTitle>How we advise you</MainTitle>
              <Steps>
                <li>
                  <b>1</b>
                  <span>Share country, deposit size, and preferred platform (MT4/MT5/cTrader).</span>
                </li>
                <li>
                  <b>2</b>
                  <span>We compare LegendPips rebate rates and trading conditions side by side.</span>
                </li>
                <li>
                  <b>3</b>
                  <span>You get a clear recommendation, then open via our link so cashback is tracked.</span>
                </li>
                <li>
                  <b>4</b>
                  <span>After signup, your account manager can stay with you.</span>
                </li>
              </Steps>

              <FormBlock onSubmit={submitAdvice}>
                <FormTitle>Short advice form</FormTitle>
                <Row2>
                  <Field>
                    <span>Name</span>
                    <input
                      value={adviceName}
                      onChange={(e) => setAdviceName(e.target.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field>
                    <span>Email *</span>
                    <input
                      type="email"
                      value={adviceEmail}
                      onChange={(e) => setAdviceEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                    />
                  </Field>
                </Row2>
                <Row2>
                  <Field>
                    <span>Country</span>
                    <input
                      value={adviceCountry}
                      onChange={(e) => setAdviceCountry(e.target.value)}
                      placeholder="e.g. Pakistan"
                    />
                  </Field>
                  <Field>
                    <span>Deposit range</span>
                    <input
                      value={adviceDeposit}
                      onChange={(e) => setAdviceDeposit(e.target.value)}
                      placeholder="$200 – $500"
                    />
                  </Field>
                </Row2>
                <Field>
                  <span>What do you need?</span>
                  <textarea
                    value={adviceGoal}
                    onChange={(e) => setAdviceGoal(e.target.value)}
                    placeholder="Forex or crypto, beginner vs experienced, platform…"
                    rows={3}
                  />
                </Field>
                {adviceError && <Msg $error>{adviceError}</Msg>}
                {adviceDone && <Msg>{adviceDone}</Msg>}
                <FormActions>
                  <Primary type="submit" disabled={adviceLoading}>
                    {adviceLoading ? "Sending…" : "Request advice"}
                  </Primary>
                  <GhostBtn type="button" onClick={() => openLiveChat()}>
                    Live chat
                  </GhostBtn>
                </FormActions>
              </FormBlock>
            </>
          )}
        </Main>
      </Frame>
    </Section>
  );
};

export default ContactAdviceSection;

const Section = styled.section`
  padding: clamp(1.75rem, 4vw, 2.75rem) ${({ theme }) => theme.typography.pageGutter};
  background: #f4f6fa;
`;

const Frame = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.25fr);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(19, 46, 88, 0.1);
  background: #fff;
  box-shadow: 0 16px 40px rgba(19, 46, 88, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Aside = styled.aside`
  padding: clamp(1.4rem, 3vw, 2rem);
  background:
    radial-gradient(ellipse 80% 60% at 0% 0%, rgba(251, 191, 36, 0.2), transparent 55%),
    linear-gradient(165deg, #0f2448 0%, #132e58 55%, #0c1f3d 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AsideEyebrow = styled.p`
  margin: 0;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const AsideTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.25;
`;

const AsideText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.78);
`;

const AsidePoints = styled.ul`
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const AsidePoint = styled.li`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);

  svg {
    color: ${({ theme }) => theme.colors.gold};
    flex-shrink: 0;
  }
`;

const AsideCta = styled(Link)`
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Main = styled.div`
  padding: clamp(1.25rem, 3vw, 1.85rem);
  background: #fff;
`;

const Seg = styled.div`
  display: inline-flex;
  padding: 0.25rem;
  margin-bottom: 1.1rem;
  border-radius: 999px;
  background: #eef2f7;
  gap: 0.15rem;
`;

const SegBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 800;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#64748b")};
  transition: background 0.15s ease, color 0.15s ease;
`;

const MainTitle = styled.h3`
  margin: 0 0 0.45rem;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  line-height: 1.35;
`;

const MainLead = styled.p`
  margin: 0 0 1.15rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Channel = styled.button<{ $active?: boolean }>`
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  text-align: left;
  padding: 0.9rem 0.85rem;
  border-radius: 14px;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.secondary : "#e8ebf0")};
  background: ${({ $active }) => ($active ? "#f0f5ff" : "#fafbfc")};
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ChannelIcon = styled.span<{ $tone: "teal" | "navy" | "gold" }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $tone, theme }) => ($tone === "gold" ? theme.colors.primary : "#fff")};
  background: ${({ $tone, theme }) =>
    $tone === "teal" ? "#0d9488" : $tone === "gold" ? theme.colors.gold : theme.colors.primary};
`;

const ChannelLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ChannelHint = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
`;

const Steps = styled.ol`
  list-style: none;
  margin: 0 0 1.15rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
    font-size: 0.84rem;
    line-height: 1.5;
    color: #475569;
  }

  b {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const FormBlock = styled.form`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eef2f7;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const FormTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;

  input,
  textarea {
    border: 1.5px solid #dbe3ef;
    border-radius: 10px;
    padding: 0.55rem 0.7rem;
    font-size: 0.875rem;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.primary};
    background: #fff;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.secondary};
      box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
`;

const Primary = styled.button`
  appearance: none;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

const GhostBtn = styled.button`
  appearance: none;
  border: 1.5px solid #dbe3ef;
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.55rem 0.95rem;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const GhostLink = styled.a`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0d9488;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Msg = styled.p<{ $error?: boolean }>`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ $error }) => ($error ? "#dc2626" : "#059669")};
`;
