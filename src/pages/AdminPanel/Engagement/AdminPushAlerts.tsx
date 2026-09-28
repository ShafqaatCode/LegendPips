import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiBell, FiSend, FiArrowLeft } from "react-icons/fi";
import {
  fetchAdminAnnouncements,
  pushAdminAlert,
  type PublicAnnouncement,
} from "../../../services/announcementService";
import {
  PageWrap,
  PageHeader,
  PageTitleGroup,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionHead,
  SectionBody,
  PrimaryButton,
  GhostButton,
  ErrorBanner,
} from "../../../components/AdminPanel/adminUi";

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 0.875rem;
  &:hover {
    color: #132e58;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #132e58;
  select,
  input,
  textarea {
    font-weight: 400;
    padding: 0.55rem 0.65rem;
    border: 1px solid #e8ecf1;
    border-radius: 8px;
    font-size: 0.8125rem;
    outline: none;
    &:focus {
      border-color: #132e58;
    }
  }
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #132e58;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const SuccessBanner = styled.div`
  padding: 0.625rem 0.875rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  color: #047857;
  font-size: 0.8125rem;
  margin-bottom: 0.875rem;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HistoryItem = styled.div`
  padding: 0.75rem 1rem;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  font-size: 0.8125rem;
  strong {
    color: #132e58;
  }
  p {
    margin: 0.35rem 0 0;
    color: #64748b;
    line-height: 1.45;
  }
  .meta {
    margin-top: 0.35rem;
    font-size: 0.6875rem;
    color: #94a3b8;
  }
`;

const AdminPushAlerts: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [audience, setAudience] = useState<"all" | "active">("active");
  const [publishPublic, setPublishPublic] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState<PublicAnnouncement[]>([]);

  const loadHistory = async () => {
    try {
      const data = await fetchAdminAnnouncements(1, 15);
      setHistory(data.items);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!window.confirm("Push this alert to users and publish publicly?")) return;
    setSending(true);
    try {
      const res = await pushAdminAlert({ title, body, link: link || undefined, audience, publishPublic });
      setSuccess(res.message);
      setTitle("");
      setBody("");
      setLink("");
      void loadHistory();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Push failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrap>
      <BackLink to="/admin-panel">
        <FiArrowLeft /> Back to dashboard
      </BackLink>

      <PageHeader>
        <PageTitleGroup>
          <PageTitle>
            <FiBell /> Push alerts
          </PageTitle>
          <PageSubtitle>
            Send in-app alerts to members and publish on the public Alerts page
          </PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {success && <SuccessBanner>{success}</SuccessBanner>}

      <SectionCard>
        <SectionBody>
          <form onSubmit={(e) => void handlePush(e)}>
            <Field>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Alert headline" />
            </Field>
            <Field>
              Message
              <textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="What should users know?" />
            </Field>
            <Field>
              Link (optional)
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://… or /signals" />
            </Field>
            <Field>
              Send to
              <select value={audience} onChange={(e) => setAudience(e.target.value as "all" | "active")}>
                <option value="active">Active users</option>
                <option value="all">All users (not blocked)</option>
              </select>
            </Field>
            <CheckRow>
              <input type="checkbox" checked={publishPublic} onChange={(e) => setPublishPublic(e.target.checked)} />
              Publish on public Alerts page (/alerts) for everyone to see
            </CheckRow>
            <PrimaryButton type="submit" disabled={sending}>
              <FiSend style={{ marginRight: 6 }} />
              {sending ? "Pushing…" : "Push alert"}
            </PrimaryButton>
          </form>
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead>
          <h2>Recent public alerts</h2>
        </SectionHead>
        <SectionBody>
          {history.length === 0 && <p style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>No alerts pushed yet.</p>}
          <HistoryList>
            {history.map((h) => (
              <HistoryItem key={h.id}>
                <strong>{h.title}</strong>
                {h.body && <p>{h.body}</p>}
                <div className="meta">
                  {h.time} · {h.recipientCount} inbox · {h.audience}
                </div>
              </HistoryItem>
            ))}
          </HistoryList>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default AdminPushAlerts;
