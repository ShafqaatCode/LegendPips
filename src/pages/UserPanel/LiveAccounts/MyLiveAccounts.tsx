import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLink,
  FiRefreshCw,
  FiExternalLink,
  FiPlus,
  FiSend,
  FiClock,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";
import {
  fetchMyLiveAccountRequests,
  liveAccountKindLabel,
  liveAccountStatusLabel,
  submitLiveAccountRequest,
  type LiveAccountKind,
  type LiveAccountRequestRow,
} from "../../../services/liveAccountService";
import { fetchBrokersPage } from "../../../services/brokerService";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ErrorBanner,
  Pill,
  GhostButton,
  PrimaryButton,
  TextArea,
  EmptyState,
  userColors,
} from "../../../components/UserPanel/userUi";
import { useLocale } from "../../../contexts/LocaleContext";
import styled from "styled-components";

type BrokerOpt = { id: string; name: string };

const WORKFLOW = [
  {
    n: 1,
    title: "Open account via link / IB code",
    body: "Register or open a live account through the LegendPips partner link (or IB code) for that broker.",
  },
  {
    n: 2,
    title: "Submit account number in the form",
    body: "Enter the broker and your trading account number on the left, then submit for linking.",
  },
  {
    n: 3,
    title: "Automatic validation (max 1×24 hours)",
    body: "Our team verifies the account with the broker. Most requests are reviewed within one business day.",
  },
  {
    n: 4,
    title: "Trade as usual",
    body: "Once approved, keep trading normally. Eligible volume generates rebate credits automatically.",
  },
  {
    n: 5,
    title: "Rebates every weekend",
    body: "Credits are prepared for distribution on Saturday and Sunday. Track them under My Rebates.",
  },
];

const MyLiveAccounts: React.FC = () => {
  const { t } = useLocale();
  const [items, setItems] = useState<LiveAccountRequestRow[]>([]);
  const [brokers, setBrokers] = useState<BrokerOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [brokerId, setBrokerId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [comment, setComment] = useState("");
  const [accountKind, setAccountKind] = useState<LiveAccountKind | "">("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [rows, brokerPage] = await Promise.all([
        fetchMyLiveAccountRequests(),
        fetchBrokersPage({ rebatesPage: true, page: 1, limit: 100 }),
      ]);
      setItems(rows);
      const opts = (brokerPage.items || [])
        .map((b: { id?: string; _id?: string; name?: string }) => ({
          id: String(b.id || b._id || ""),
          name: String(b.name || "").trim(),
        }))
        .filter((b) => b.id && b.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      setBrokers(opts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pillVariant = (s: string) => {
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    if (s === "in_progress") return "user";
    if (s === "pending") return "pending";
    return "default";
  };

  const resetForm = () => {
    setAccountNumber("");
    setComment("");
    setAccountKind("");
    setTermsAccepted(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const broker = brokers.find((b) => b.id === brokerId);
    if (!broker) {
      setError("Please select a broker.");
      return;
    }
    const num = accountNumber.trim();
    if (!num) {
      setError("Please enter your account number.");
      return;
    }
    if (!/^[A-Za-z0-9\-]+$/.test(num)) {
      setError("Account number looks invalid. Use only letters, numbers, or hyphens.");
      return;
    }
    if (accountKind !== "new" && accountKind !== "existing") {
      setError("Please choose whether this is a new account or an existing account.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitLiveAccountRequest({
        brokerId: broker.id,
        brokerName: broker.name,
        accountNumber: num,
        accountKind,
        comment: comment.trim() || undefined,
        termsAccepted: true,
      });
      setSuccess(res.message || "Account submitted for review.");
      resetForm();
      setItems(await fetchMyLiveAccountRequests());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>
            <FiLink /> Link trading account
          </PageTitle>
          <PageSubtitle>
            Link a partner broker account so LegendPips can match your trades and credit rebates after verification.
          </PageSubtitle>
        </div>
        <Link to="/rebates" style={{ textDecoration: "none" }}>
          <GhostButton $sm type="button">
            <FiExternalLink /> Partner brokers
          </GhostButton>
        </Link>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Layout>
        <LeftCol>
          <Card>
            <CardHead>
              <h2>
                <FiPlus /> Link account form
              </h2>
            </CardHead>
            <CardBody>
              {success && <SuccessMsg>{success}</SuccessMsg>}
              <form onSubmit={onSubmit}>
                <Field>
                  <label htmlFor="live-broker">Select a partner broker</label>
                  <select
                    id="live-broker"
                    value={brokerId}
                    onChange={(e) => setBrokerId(e.target.value)}
                    disabled={submitting || loading}
                  >
                    <option value="">— Choose a broker —</option>
                    {brokers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <label htmlFor="live-acct">Trading account number</label>
                  <input
                    id="live-acct"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 12345678"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={submitting}
                    autoComplete="off"
                  />
                </Field>

                <Field>
                  <label htmlFor="live-comment">Comment (optional)</label>
                  <TextArea
                    id="live-comment"
                    placeholder="IB code used, email on the broker account, etc."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                    maxLength={1000}
                  />
                </Field>

                <KindPanel>
                  <KindHint>
                    If you used our link, choose <strong>new</strong>. If the account already existed under another IB,
                    choose <strong>existing</strong> (transfer to our IB first).
                  </KindHint>
                  <KindOptions>
                    <KindOption $active={accountKind === "new"}>
                      <input
                        type="radio"
                        name="accountKind"
                        checked={accountKind === "new"}
                        onChange={() => setAccountKind("new")}
                        disabled={submitting}
                      />
                      This is a new account
                    </KindOption>
                    <KindOption $active={accountKind === "existing"}>
                      <input
                        type="radio"
                        name="accountKind"
                        checked={accountKind === "existing"}
                        onChange={() => setAccountKind("existing")}
                        disabled={submitting}
                      />
                      This is an existing account
                    </KindOption>
                  </KindOptions>
                </KindPanel>

                <KindOption $active={termsAccepted} style={{ marginTop: "0.75rem" }}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={submitting}
                  />
                  <span>
                    I accept the{" "}
                    <Link to="/how-it-works" target="_blank" rel="noreferrer">
                      Terms and Conditions
                    </Link>
                  </span>
                </KindOption>

                <SubmitRow>
                  <PrimaryButton type="submit" disabled={submitting || loading}>
                    <FiSend /> {submitting ? "Submitting…" : "Link account now"}
                  </PrimaryButton>
                </SubmitRow>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <h2>Registered account list</h2>
              <GhostButton $sm type="button" onClick={load} disabled={loading}>
                <FiRefreshCw /> Refresh
              </GhostButton>
            </CardHead>
            <CardBody>
              {loading && <Muted>Loading…</Muted>}
              {!loading && items.length === 0 && (
                <EmptyState>
                  <strong>{items.length} Accounts</strong>
                  <br />
                  There is no account registration history yet.
                </EmptyState>
              )}
              {!loading && items.length > 0 && (
                <>
                  <CountLine>
                    {items.length} Account{items.length === 1 ? "" : "s"}
                  </CountLine>
                  <ListStack>
                    {items.map((row) => (
                      <RowCard key={row.id}>
                        <div>
                          <div className="title">{row.brokerName}</div>
                          <div className="meta">
                            Account #{row.accountNumber}
                            {" · "}
                            {liveAccountKindLabel(row.accountKind)}
                            {row.createdAt ? ` · ${new Date(row.createdAt).toLocaleString()}` : ""}
                          </div>
                          {row.comment ? (
                            <div className="note">
                              <strong>Your note:</strong> {row.comment}
                            </div>
                          ) : null}
                          {row.adminNote && (
                            <div className="note">
                              <strong>Team note:</strong> {row.adminNote}
                            </div>
                          )}
                        </div>
                        <Pill $variant={pillVariant(row.status)}>{liveAccountStatusLabel(row.status)}</Pill>
                      </RowCard>
                    ))}
                  </ListStack>
                </>
              )}
            </CardBody>
          </Card>
        </LeftCol>

        <RightCol>
          <Card>
            <CardHead>
              <h2>
                <FiCheckCircle /> Validation workflow
              </h2>
            </CardHead>
            <CardBody>
              <Timeline>
                {WORKFLOW.map((step, i) => (
                  <TimelineItem key={step.n}>
                    <Rail>
                      <StepNum>{step.n}</StepNum>
                      {i < WORKFLOW.length - 1 && <RailLine />}
                    </Rail>
                    <StepCopy>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </StepCopy>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <h2>
                <FiCalendar /> Payout schedule & system
              </h2>
              <AutoPill>Automatic</AutoPill>
            </CardHead>
            <CardBody>
              <PayoutRow>
                <PayoutIcon $tone="gold">
                  <FiClock />
                </PayoutIcon>
                <div>
                  <PayoutLabel>Distribution days</PayoutLabel>
                  <PayoutValue>Every Saturday & Sunday</PayoutValue>
                </div>
              </PayoutRow>
              <PayoutRow>
                <PayoutIcon $tone="green">
                  <FiCheckCircle />
                </PayoutIcon>
                <div>
                  <PayoutLabel>Payout options</PayoutLabel>
                  <PayoutValue>Bank / Trading account (via My Rebates)</PayoutValue>
                </div>
              </PayoutRow>
              <PayoutNote>
                After your linked account is approved, weekend rebate runs credit eligible volume. Withdrawals are
                requested from <Link to="/user-panel/rebates">My Rebates</Link>.
              </PayoutNote>
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <h2>LegendPips advantages</h2>
            </CardHead>
            <CardBody>
              <AdvList>
                <li>Partner broker & prop cashback in one place</li>
                <li>Clear validation status on every submission</li>
                <li>Weekend rebate distribution schedule</li>
                <li>Discount codes on prop challenge purchases</li>
              </AdvList>
            </CardBody>
          </Card>
        </RightCol>
      </Layout>
    </PageWrap>
  );
};

export default MyLiveAccounts;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`;

const Card = styled.section`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  overflow: hidden;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${userColors.border};
  background: #f8fafc;

  h2 {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 800;
    color: ${userColors.navy};
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;

  label {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${userColors.navy};
  }

  input,
  select {
    padding: 0.6rem 0.75rem;
    border: 1px solid ${userColors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    color: ${userColors.text};
    background: #fff;
    outline: none;

    &:focus {
      border-color: ${userColors.navy};
      box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08);
    }
  }
`;

const KindPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.75rem 0.85rem;
  background: #f8fafc;
  border: 1px solid ${userColors.border};
  border-radius: 10px;
`;

const KindHint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: ${userColors.muted};
`;

const KindOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const KindOption = styled.label<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? userColors.navy : userColors.border)};
  background: ${({ $active }) => ($active ? "rgba(19, 46, 88, 0.06)" : "#fff")};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${userColors.navy};

  input {
    accent-color: ${userColors.navy};
    width: 15px;
    height: 15px;
  }

  a {
    color: #1d4ed8;
  }
`;

const SubmitRow = styled.div`
  margin-top: 1rem;

  button {
    width: 100%;
    justify-content: center;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const SuccessMsg = styled.div`
  margin-bottom: 0.85rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 0.8125rem;
  font-weight: 600;
`;

const CountLine = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${userColors.navy};
`;

const Muted = styled.p`
  margin: 0;
  color: ${userColors.muted};
  font-size: 0.85rem;
`;

const ListStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const RowCard = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  background: #f8fafc;
  border: 1px solid ${userColors.border};
  border-radius: 10px;
  flex-wrap: wrap;

  .title {
    font-weight: 800;
    color: ${userColors.navy};
    font-size: 0.85rem;
  }
  .meta {
    font-size: 0.72rem;
    color: ${userColors.muted};
    margin-top: 0.15rem;
  }
  .note {
    font-size: 0.72rem;
    color: ${userColors.navy};
    margin-top: 0.3rem;
  }
`;

const Timeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const TimelineItem = styled.li`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 0.75rem;
`;

const Rail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepNum = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #132e58;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RailLine = styled.span`
  width: 2px;
  flex: 1;
  min-height: 18px;
  background: #e2e8f0;
  margin: 0.25rem 0;
`;

const StepCopy = styled.div`
  padding-bottom: 1rem;

  strong {
    display: block;
    color: #132e58;
    font-size: 0.85rem;
    margin-bottom: 0.2rem;
  }

  p {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.45;
    color: #64748b;
  }
`;

const AutoPill = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  padding: 0.2rem 0.5rem;
`;

const PayoutRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 0.85rem;
`;

const PayoutIcon = styled.div<{ $tone: "gold" | "green" }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $tone }) => ($tone === "gold" ? "#fef3c7" : "#ecfdf5")};
  color: ${({ $tone }) => ($tone === "gold" ? "#b45309" : "#047857")};
`;

const PayoutLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const PayoutValue = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #132e58;
  margin-top: 0.1rem;
`;

const PayoutNote = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #64748b;
  padding-top: 0.35rem;
  border-top: 1px solid ${userColors.border};

  a {
    color: #1d4ed8;
    font-weight: 700;
  }
`;

const AdvList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.1rem;
  color: #475569;
  font-size: 0.8rem;
  line-height: 1.55;

  li + li {
    margin-top: 0.35rem;
  }
`;
