import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaX } from "react-icons/fa6";
import { type Competition, joinCompetition } from "../../services/contestService";

type JoinContestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  comp: Competition;
  contestId: string;
  onJoined?: () => void;
};

function formatContestEnd(raw?: string): string {
  if (!raw?.trim()) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw.slice(0, 10);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const JoinContestModal: React.FC<JoinContestModalProps> = ({
  isOpen,
  onClose,
  comp,
  contestId,
  onJoined,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setError("");
      setDone(false);
      setSubmitting(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const endLabel = formatContestEnd(comp.ends || comp.endDate);

  const handleConfirm = async () => {
    if (!contestId || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await joinCompetition(contestId);
      setDone(true);
      onJoined?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not join this contest.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseBtn type="button" onClick={onClose} aria-label="Close">
          <FaX size={16} />
        </CloseBtn>

        {done ? (
          <>
            <Title>You&apos;re in</Title>
            <Lead>
              You&apos;ve joined <strong>{comp.title}</strong>. Good luck — we&apos;ll keep your entry linked to your
              account.
            </Lead>
            <ButtonRow>
              <Primary type="button" onClick={onClose}>
                Close
              </Primary>
              <Secondary as={Link} to="/user-panel/contests" onClick={onClose}>
                View my contests
              </Secondary>
            </ButtonRow>
          </>
        ) : (
          <>
            <Title>Join contest</Title>
            <Lead>
              You&apos;re about to register for <strong>{comp.title}</strong> using your LegendPips account.
            </Lead>

            <Summary>
              <Row>
                <span>Entry</span>
                <span>{comp.entry || "—"}</span>
              </Row>
              <Row>
                <span>Deadline</span>
                <span>{endLabel}</span>
              </Row>
              <Row>
                <span>Format</span>
                <span>{comp.type || "—"}</span>
              </Row>
            </Summary>

            <FinePrint>
              Demo-style competitions only — no real-money entry through this site. By confirming, you agree this is
              for participation tracking on LegendPips.
            </FinePrint>

            {error ? <Err>{error}</Err> : null}

            <ButtonRow>
              <Ghost type="button" onClick={onClose} disabled={submitting}>
                Cancel
              </Ghost>
              <Primary type="button" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Joining…" : "Confirm & join"}
              </Primary>
            </ButtonRow>
          </>
        )}
      </Modal>
    </Overlay>
  );
};

export default JoinContestModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const Modal = styled.div`
  position: relative;
  width: min(440px, 100%);
  background: #ffffff;
  border-radius: 14px;
  padding: 1.5rem 1.35rem 1.35rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
  border: 1px solid #e8eaef;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const Title = styled.h2`
  margin: 0 0 0.65rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f1c46;
  letter-spacing: -0.02em;
  padding-right: 2rem;
`;

const Lead = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(15, 23, 42, 0.82);

  strong {
    color: #0f1c46;
  }
`;

const Summary = styled.div`
  background: #f8fafc;
  border: 1px solid #e8eaef;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  margin-bottom: 0.85rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.8125rem;
  padding: 0.35rem 0;
  color: #0f172a;

  span:first-child {
    color: #64748b;
    font-weight: 500;
  }

  span:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

const FinePrint = styled.p`
  margin: 0 0 1rem;
  font-size: 0.72rem;
  line-height: 1.45;
  color: #64748b;
`;

const Err = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  color: #b91c1c;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const Primary = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: #132e58;
  color: #fff;

  &:hover:not(:disabled) {
    background: #1a3d72;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Ghost = styled.button`
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 0.55rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  color: #334155;

  &:hover:not(:disabled) {
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Secondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.55rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid #132e58;
  color: #132e58;
  background: #fff;

  &:hover {
    background: #f0f5ff;
  }
`;
