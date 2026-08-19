import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { submitLiveAccountRequest } from '../../services/liveAccountService';

export type BrokerSetupBroker = {
  id: string;
  name: string;
  logo: string;
  setupUrl?: string;
  description?: string;
  features?: string[];
  verified?: boolean;
};

type BrokerSetupPageProps = {
  broker: BrokerSetupBroker;
  onBack: () => void;
  backLabel?: string;
};

/**
 * PaybackFX-style vertical 3-step live account setup:
 * 1) Open live account (IB / referral link)
 * 2) Account number + terms
 * 3) Submit → admin approve / reject queue
 */
const BrokerSetupPage: React.FC<BrokerSetupPageProps> = ({
  broker,
  onBack,
  backLabel = 'Back to Broker Details',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState('pending');

  const openLiveUrl = broker.setupUrl?.trim() || '';

  const handleOpenLive = () => {
    if (openLiveUrl) {
      window.open(openLiveUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setError('Live account link is not configured for this broker yet. Contact support or try again later.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('Please sign in to submit your live account for admin review.');
      return;
    }

    const num = accountNumber.trim();
    if (!num) {
      setError('Please enter your live account number.');
      return;
    }
    if (!/^[A-Za-z0-9\-]+$/.test(num)) {
      setError('Account number looks invalid. Use only letters, numbers, or hyphens.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Terms and Conditions to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitLiveAccountRequest({
        brokerId: broker.id,
        brokerName: broker.name,
        accountNumber: num,
        termsAccepted: true,
      });
      setSubmittedStatus(res.item?.status || 'pending');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageWrapper>
        <Shell>
          <BackButton type="button" onClick={onBack}>
            <ArrowLeft size={16} />
            {backLabel}
          </BackButton>
          <SuccessCard>
            <CheckCircle2 size={56} color="#059669" />
            <SuccessTitle>Request sent to admin</SuccessTitle>
            <SuccessText>
              Your <strong>{broker.name}</strong> account number <strong>{accountNumber.trim()}</strong> was
              submitted for review (status: <strong>{submittedStatus}</strong>). Our team will approve or
              reject it — track progress in the member panel.
            </SuccessText>
            <SuccessActions>
              <GhostBtn type="button" onClick={onBack}>
                Back to broker
              </GhostBtn>
              <PrimaryBtn type="button" onClick={() => navigate('/user-panel/live-accounts')}>
                Track my request
              </PrimaryBtn>
              <GhostBtn
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setAccountNumber('');
                  setTermsAccepted(false);
                }}
              >
                Submit another account
              </GhostBtn>
            </SuccessActions>
          </SuccessCard>
        </Shell>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Shell>
        <BackButton type="button" onClick={onBack}>
          <ArrowLeft size={16} />
          {backLabel}
        </BackButton>

        <Panel>
          <HeaderRow>
            <LogoWrap>
              <img src={broker.logo} alt={broker.name} />
            </LogoWrap>
            <HeaderText>
              <Eyebrow>Live account setup</Eyebrow>
              <MainTitle>
                SET UP YOUR LIVE {broker.name.toUpperCase()} TRADING ACCOUNT
              </MainTitle>
              {broker.verified !== false && <VerifiedPill>Verified partner</VerifiedPill>}
            </HeaderText>
          </HeaderRow>

          {!isAuthenticated && (
            <LoginBanner>
              Sign in first so we can send this request to admin and show you approval status.
              <TermsLink to="/signin">Sign in</TermsLink>
            </LoginBanner>
          )}

          <form onSubmit={handleSubmit}>
            <Steps>
              {/* Step 1 */}
              <StepRow>
                <Timeline>
                  <StepDot $done={false}>1</StepDot>
                  <StepRail />
                </Timeline>
                <StepBody>
                  <StepLabel>Step 1</StepLabel>
                  <StepCard>
                    <StepHeading>Open a live account with {broker.name}</StepHeading>
                    <BtnCenter>
                      <OpenLiveBtn type="button" onClick={handleOpenLive}>
                        Open Live {broker.name}
                      </OpenLiveBtn>
                    </BtnCenter>
                    <Notes>
                      <li>
                        If you are based in the EU, Brazil, the UK, or Australia, open your account with the
                        jurisdiction listed by the broker when you click above.
                      </li>
                      <li>
                        If you already have a live account under a <strong>different IB</strong>, open a{' '}
                        <strong>new account</strong> (new email if required) using the button above so it is
                        linked through LegendPips.
                      </li>
                      <li>
                        If your account is not assigned to any IB yet, skip to Step 2 and enter your account
                        number so we can request the IB transfer with the broker.
                      </li>
                    </Notes>
                    {broker.setupUrl ? (
                      <Hint>
                        Referral link: opens in a new tab. Close it when registration is done, then continue
                        below.
                      </Hint>
                    ) : (
                      <Hint $warn>
                        No setup link configured yet for this broker. You can still submit an existing account
                        number in Step 2.
                      </Hint>
                    )}
                  </StepCard>
                </StepBody>
              </StepRow>

              {/* Step 2 */}
              <StepRow>
                <Timeline>
                  <StepDot $done={!!accountNumber.trim()}>2</StepDot>
                  <StepRail />
                </Timeline>
                <StepBody>
                  <StepLabel>Step 2</StepLabel>
                  <StepCard>
                    <StepHeading>
                      Provide your live {broker.name} account number
                    </StepHeading>
                    <FieldRow>
                      <FieldLabel htmlFor={`acct-${broker.id}`}>Account Number</FieldLabel>
                      <FieldInput
                        id={`acct-${broker.id}`}
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 12345678"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        autoComplete="off"
                      />
                    </FieldRow>
                    <TermsRow>
                      <input
                        id={`terms-${broker.id}`}
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <label htmlFor={`terms-${broker.id}`}>
                        I have read, understood and accepted the{' '}
                        <TermsLink to="/how-it-works" target="_blank" rel="noreferrer">
                          Terms and Conditions
                        </TermsLink>
                        .
                      </label>
                    </TermsRow>
                  </StepCard>
                </StepBody>
              </StepRow>

              {/* Step 3 */}
              <StepRow>
                <Timeline>
                  <StepDot $done={false}>3</StepDot>
                </Timeline>
                <StepBody>
                  <StepLabel>Step 3</StepLabel>
                  <StepCard>
                    <StepHeading>Submit your account</StepHeading>
                    {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
                    <BtnCenter>
                      <SubmitBtn type="submit" disabled={loading || !isAuthenticated}>
                        {loading ? (
                          <>
                            <Loader2 size={18} className="spin" />
                            Submitting…
                          </>
                        ) : (
                          'Submit for review'
                        )}
                      </SubmitBtn>
                    </BtnCenter>
                    <Hint>
                      After submit, our team reviews the account and will <strong>approve or reject</strong> it.
                      Track status under{' '}
                      <TermsLink to="/user-panel/live-accounts">My live accounts</TermsLink>. Trading terms
                      with the broker do not change.
                    </Hint>
                  </StepCard>
                </StepBody>
              </StepRow>
            </Steps>
          </form>
        </Panel>
      </Shell>
    </PageWrapper>
  );
};

export default BrokerSetupPage;

/* —— LegendPips navy / clean setup layout (PaybackFX structure) —— */

const navy = '#132E58';
const navyMid = '#1a4a7a';
const gold = '#Fbbf24';
const border = '#d8dee8';
const muted = '#64748b';

const PageWrapper = styled.div`
  min-height: 50vh;
  padding: 0.25rem 0 1.5rem;
`;

const Shell = styled.div`
  max-width: 880px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: transparent;
  color: ${muted};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0.85rem;
  padding: 0.25rem 0;

  &:hover {
    color: ${navy};
  }
`;

const Panel = styled.div`
  background: #fff;
  border: 1px solid ${border};
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid ${border};
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LogoWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 1px solid ${border};
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
`;

const HeaderText = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${gold};
  margin-bottom: 0.25rem;
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: ${navyMid};
  line-height: 1.35;
`;

const VerifiedPill = styled.span`
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
`;

const LoginBanner = styled.div`
  margin: 0 1.25rem 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  font-size: 0.8125rem;
  color: #1e40af;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.75rem;
`;

const Steps = styled.div`
  padding: 1.25rem 1.25rem 1.5rem;
`;

const StepRow = styled.div`
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 0.75rem;

  & + & {
    margin-top: 0.15rem;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepDot = styled.div<{ $done?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
  flex-shrink: 0;
  color: #fff;
  background: ${({ $done }) =>
    $done ? '#059669' : `linear-gradient(145deg, ${navy}, ${navyMid})`};
  border: 2px solid ${({ $done }) => ($done ? '#059669' : gold)};
  box-shadow: 0 2px 8px rgba(19, 46, 88, 0.15);
`;

const StepRail = styled.div`
  width: 3px;
  flex: 1;
  min-height: 24px;
  margin: 0.35rem 0;
  background: linear-gradient(180deg, ${navy}55, ${border});
  border-radius: 2px;
`;

const StepBody = styled.div`
  min-width: 0;
  padding-bottom: 1.15rem;
`;

const StepLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${muted};
  margin-bottom: 0.4rem;
`;

const StepCard = styled.div`
  background: #f4f7fb;
  border: 1px solid ${border};
  border-radius: 10px;
  padding: 1rem 1.1rem 1.15rem;
`;

const StepHeading = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${navyMid};
  line-height: 1.35;
`;

const BtnCenter = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0.15rem 0 0.25rem;
`;

const OpenLiveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  max-width: 100%;
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.25);
  transition: transform 0.12s, box-shadow 0.12s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(13, 148, 136, 0.32);
  }
`;

const Notes = styled.ul`
  margin: 1rem 0 0;
  padding: 0 0 0 1.1rem;
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.55;

  li {
    margin-bottom: 0.45rem;
  }

  strong {
    color: ${navy};
  }
`;

const Hint = styled.p<{ $warn?: boolean }>`
  margin: 0.85rem 0 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: ${({ $warn }) => ($warn ? '#b45309' : muted)};
  ${({ $warn }) =>
    $warn
      ? `
    padding: 0.5rem 0.65rem;
    background: #fffbeb;
    border-radius: 8px;
    border: 1px solid #fde68a;
  `
      : ''}
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 0.85rem;
`;

const FieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${navy};
  min-width: 120px;
`;

const FieldInput = styled.input`
  flex: 1;
  min-width: 180px;
  max-width: 320px;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${border};
  background: #fff;
  font-size: 0.875rem;
  color: ${navy};
  outline: none;

  &:focus {
    border-color: ${navy};
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
`;

const TermsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.45;

  input {
    margin-top: 0.2rem;
    accent-color: ${navy};
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const TermsLink = styled(Link)`
  color: ${navyMid};
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${navy};
  }
`;

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-width: 140px;
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, ${navy} 0%, ${navyMid} 100%);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(19, 46, 88, 0.2);

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorBanner = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.8125rem;
  font-weight: 600;
`;

const SuccessCard = styled.div`
  background: #fff;
  border: 1px solid ${border};
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
`;

const SuccessTitle = styled.h2`
  margin: 0.75rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #059669;
`;

const SuccessText = styled.p`
  margin: 0 auto 1.25rem;
  max-width: 440px;
  font-size: 0.875rem;
  color: ${muted};
  line-height: 1.55;
`;

const SuccessActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
`;

const GhostBtn = styled.button`
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: 1px solid ${border};
  background: #fff;
  color: ${navy};
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const PrimaryBtn = styled.button`
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: none;
  background: ${navy};
  color: #fff;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover {
    background: ${navyMid};
  }
`;
