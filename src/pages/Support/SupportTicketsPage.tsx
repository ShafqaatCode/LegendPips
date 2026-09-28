import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLifeBuoy, FiMessageCircle } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { submitFeedback } from "../../services/feedbackService";

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
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.35rem;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.05);
`;

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const Label = styled.label`
  display: grid;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  input,
  select,
  textarea {
    font: inherit;
    text-transform: none;
    letter-spacing: normal;
    font-weight: 500;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
    outline: none;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #132e58;
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

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  background: #132e58;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Msg = styled.p<{ $ok?: boolean }>`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ $ok }) => ($ok ? "#047857" : "#b91c1c")};
`;

const AltLink = styled(Link)`
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

const SupportTicketsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      setError("Email and message are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await submitFeedback({
        email: email.trim(),
        subject: subject.trim() || "Support request",
        category,
        message: message.trim(),
        page: "/support/tickets",
      });
      setSuccess(
        res.ticketId
          ? `Ticket ${res.ticketId} created. Our team will reply soon.`
          : "Ticket created. Our team will reply soon."
      );
      setSubject("");
      setMessage("");
      setCategory("general");
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
          <Eyebrow>Support</Eyebrow>
          <Title>Support tickets</Title>
          <Lead>
            Open a ticket for rebates, account help, or technical issues — and track replies with your ticket ID.
          </Lead>
        </HeroInner>
      </Hero>

      <Page>
        <Content>
          <Card>
            <Form onSubmit={onSubmit}>
              <Row>
                <Label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                  />
                </Label>
                <Label>
                  Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="general">General</option>
                    <option value="account">Account</option>
                    <option value="rebates">Rebates</option>
                    <option value="technical">Technical</option>
                    <option value="other">Other</option>
                  </select>
                </Label>
              </Row>
              <Label>
                Subject
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short summary"
                  maxLength={200}
                />
              </Label>
              <Label>
                Message
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue…"
                  required
                />
              </Label>
              {error && <Msg>{error}</Msg>}
              {success && <Msg $ok>{success}</Msg>}
              <Submit type="submit" disabled={loading}>
                <FiLifeBuoy /> {loading ? "Sending…" : "Submit ticket"}
              </Submit>
            </Form>
          </Card>

          <Card>
            <p style={{ margin: "0 0 0.75rem", color: "#64748b", fontSize: "0.9rem", lineHeight: 1.55 }}>
              Prefer instant help? Use live chat. Signed-in members can also track every ticket in the member panel.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <AltLink to="/live-chat">
                <FiMessageCircle /> Live chat <FiArrowRight />
              </AltLink>
              {isAuthenticated ? (
                <AltLink to="/user-panel/tickets">
                  My tickets <FiArrowRight />
                </AltLink>
              ) : (
                <AltLink to="/signin">
                  Sign in to track tickets <FiArrowRight />
                </AltLink>
              )}
            </div>
          </Card>
        </Content>
      </Page>
    </>
  );
};

export default SupportTicketsPage;
