import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import { FiAlertTriangle, FiCheckCircle, FiShield } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { findContentSafetyIssue } from "../../utils/contentSafety";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import {
  COMPLAINT_CATEGORIES,
  fetchComplaintBlacklist,
  submitBrokerComplaint,
  type BlacklistBroker,
  type BlacklistWarning,
} from "../../services/complaintService";

const ComplaintsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillBroker = searchParams.get("broker") || "";
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useAuthModal();

  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [listed, setListed] = useState<BlacklistBroker[]>([]);
  const [warnings, setWarnings] = useState<BlacklistWarning[]>([]);

  const [brokerId, setBrokerId] = useState(prefillBroker);
  const [brokerName, setBrokerName] = useState("");
  const [category, setCategory] = useState("withdrawal");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [accountRef, setAccountRef] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    fetchBrokersPage({ page: 1, limit: 50 })
      .then((r) => setBrokers(r.items || []))
      .catch(() => setBrokers([]));
    fetchComplaintBlacklist()
      .then((r) => {
        setListed(r.brokers);
        setWarnings(r.warnings);
      })
      .catch(() => {
        setListed([]);
        setWarnings([]);
      });
  }, []);

  useEffect(() => {
    if (!prefillBroker) return;
    setBrokerId(prefillBroker);
  }, [prefillBroker]);

  const selectedName = useMemo(
    () => brokers.find((b) => b._id === brokerId)?.name || "",
    [brokers, brokerId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    if (!isAuthenticated) {
      openSignIn({ returnTo: `${window.location.pathname}${window.location.search}` });
      return;
    }
    const safety = findContentSafetyIssue(`${subject}\n${details}\n${accountRef}`);
    if (safety) {
      setError(safety);
      return;
    }
    setSaving(true);
    try {
      const res = await submitBrokerComplaint({
        brokerId: brokerId || undefined,
        brokerName: brokerId ? selectedName : brokerName.trim(),
        category,
        subject: subject.trim(),
        details: details.trim(),
        accountRef: accountRef.trim() || undefined,
      });
      setOk(res.message);
      setSubject("");
      setDetails("");
      setAccountRef("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not submit complaint.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>BROKER COMPLAINT CENTER</h1>
          <p>
            Report withdrawal delays, unfair trading conditions, or suspected scam brokers. Every case
            gets a ticket ID and is reviewed by the LegendPips team.
          </p>
          <h3>File a report · Track status · Public warning list</h3>
        </HeroInner>
      </Hero>

      <Page>
        <Grid>
          <FormCard id="file-complaint">
            <h2>Submit a complaint</h2>
            <p className="lead">
              Sign in so we can follow up. Do not include emails or phone numbers in the description.
            </p>
            <form onSubmit={handleSubmit}>
              <Label>Broker</Label>
              <Select value={brokerId} onChange={(e) => setBrokerId(e.target.value)}>
                <option value="">Broker not in our list…</option>
                {brokers.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                    {b.blacklisted ? " (on warning list)" : ""}
                  </option>
                ))}
              </Select>
              {!brokerId && (
                <>
                  <Label>Broker name</Label>
                  <Input
                    value={brokerName}
                    onChange={(e) => setBrokerName(e.target.value)}
                    placeholder="Type the broker or prop firm name"
                    maxLength={80}
                  />
                </>
              )}
              <Label>Issue type</Label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {COMPLAINT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary of what happened"
                maxLength={140}
              />
              <Label>What happened</Label>
              <Area
                rows={6}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Dates, amounts, account type, and what support told you. Min 30 characters."
                maxLength={4000}
              />
              <Label>Account / ticket reference (optional)</Label>
              <Input
                value={accountRef}
                onChange={(e) => setAccountRef(e.target.value)}
                placeholder="Broker account number or their ticket ID"
                maxLength={80}
              />
              {error && <Err>{error}</Err>}
              {ok && <Ok><FiCheckCircle /> {ok}</Ok>}
              <Submit type="submit" disabled={saving}>
                {saving ? "Sending…" : isAuthenticated ? "Submit complaint" : "Sign in to submit"}
              </Submit>
              {isAuthenticated && (
                <TrackLink to="/user-panel/complaints">Track my complaints →</TrackLink>
              )}
            </form>
          </FormCard>

          <Side>
            <WarnCard>
              <h2>
                <FiAlertTriangle /> Public warning list
              </h2>
              <p>Brokers added here after investigation. Always do your own due diligence.</p>
              {listed.length === 0 && warnings.length === 0 ? (
                <Empty>No public warnings right now.</Empty>
              ) : (
                <WarnList>
                  {listed.map((b) => (
                    <li key={b.id}>
                      <strong>{b.name}</strong>
                      <span>{b.reason}</span>
                    </li>
                  ))}
                  {warnings.map((w) => (
                    <li key={w.name}>
                      <strong>{w.name}</strong>
                      <span>Trader reports under review ({w.category}).</span>
                    </li>
                  ))}
                </WarnList>
              )}
            </WarnCard>

            <Steps>
              <h3>
                <FiShield /> How it works
              </h3>
              <ol>
                <li>You file a complaint and get a ticket ID.</li>
                <li>Our team investigates and may contact you in the member panel.</li>
                <li>We resolve, dismiss, or escalate. Repeated cases can go on the warning list.</li>
              </ol>
            </Steps>
          </Side>
        </Grid>
      </Page>
    </>
  );
};

export default ComplaintsPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(320px, 42vh, 420px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(3.5rem, 8vw, 5rem) ${({ theme }) => theme.typography.pageGutter} 2.5rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: url(${bannerBg});
  background-size: cover;
  filter: blur(2px);
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.8), rgba(19, 46, 88, 0.8));
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  h1 {
    margin: 0 0 1rem;
    font-size: ${({ theme }) => theme.typography.heroTitle};
    line-height: ${({ theme }) => theme.typography.heroTitleLh};
  }
  p {
    margin: 0 0 0.75rem;
    font-size: ${({ theme }) => theme.typography.body};
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.9);
  }
  h3 {
    margin: 2rem 0 0;
    font-size: ${({ theme }) => theme.typography.panelSectionTitle};
    font-weight: 600;
  }
`;

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.5rem 0 3rem;
`;

const Grid = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 1.25rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.35rem 1.25rem 1.5rem;
  h2 {
    margin: 0 0 0.35rem;
    color: #132e58;
  }
  .lead {
    margin: 0 0 1rem;
    color: #64748b;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #132e58;
  margin: 0.65rem 0 0.3rem;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
  background: #fff;
`;

const Area = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
  resize: vertical;
`;

const Submit = styled.button`
  margin-top: 0.9rem;
  background: #132e58;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-weight: 700;
  font: inherit;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
  }
`;

const TrackLink = styled(Link)`
  display: inline-block;
  margin-top: 0.75rem;
  margin-left: 0.85rem;
  color: #132e58;
  font-weight: 700;
  font-size: 0.875rem;
`;

const Err = styled.p`
  color: #b91c1c;
  font-size: 0.8125rem;
`;

const Ok = styled.p`
  color: #166534;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WarnCard = styled.section`
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 1.1rem 1.15rem;
  h2 {
    margin: 0 0 0.35rem;
    color: #9a3412;
    font-size: 1.05rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  p {
    margin: 0 0 0.75rem;
    font-size: 0.8125rem;
    color: #9a3412;
  }
`;

const WarnList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  li {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  strong {
    color: #7c2d12;
  }
  span {
    font-size: 0.8rem;
    color: #9a3412;
    line-height: 1.4;
  }
`;

const Empty = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #9a3412;
`;

const Steps = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.1rem 1.15rem;
  h3 {
    margin: 0 0 0.65rem;
    color: #132e58;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1rem;
  }
  ol {
    margin: 0;
    padding-left: 1.15rem;
    color: #475569;
    font-size: 0.85rem;
    line-height: 1.55;
  }
  li {
    margin-bottom: 0.4rem;
  }
`;
