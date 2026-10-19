import styled, { css } from "styled-components";

/**
 * Compact calculator chrome aligned with TradingCard / broker cards:
 * soft gray page, rounded white cards, gold titles, 14–16px body, pill CTAs.
 */

export const CalcPage = styled.div`
  background: #f3f4f7;
  padding-bottom: 1.5rem;
`;

export const CalcContainer = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 4.75rem ${({ theme }) => theme.typography.pageGutter} 1rem;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-top: 4.25rem;
  }
`;

export const CalcCard = styled.div`
  background: #fff;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 1.35rem 1.5rem 1.5rem;
  max-width: 720px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    border-radius: 20px;
    padding: 1.1rem 1rem 1.25rem;
  }
`;

export const CalcHeader = styled.h1`
  margin: 0 0 0.5rem;
  color: #d69e2e;
  font-weight: 700;
  font-size: 1.35rem;
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.125rem;
  }
`;

export const CalcDescription = styled.p`
  margin: 0 0 1.1rem;
  color: #132e58;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.55;
  max-width: 40rem;
`;

export const CalcFormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem 1rem;
  margin-bottom: 0.85rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const CalcFormGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const CalcLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #132e58;
  letter-spacing: 0.01em;
`;

/** Optional wrapper kept for compatibility — fields use stacked layout */
export const CalcField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
  border: none;
  padding: 0;
  background: transparent;
`;

const controlBase = css`
  width: 100%;
  box-sizing: border-box;
  padding: 0.45rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(19, 46, 88, 0.22);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  background: #f8fafc;
  color: #132e58;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:focus {
    outline: none;
    border-color: #132e58;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08);
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
`;

export const CalcInput = styled.input`
  ${controlBase}
`;

export const CalcSelect = styled.select`
  ${controlBase}
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #132e58 50%),
    linear-gradient(135deg, #132e58 50%, transparent 50%);
  background-position: calc(100% - 14px) calc(50% - 2px), calc(100% - 10px) calc(50% - 2px);
  background-size: 4px 4px, 4px 4px;
  background-repeat: no-repeat;
  background-color: #f8fafc;
  padding-right: 1.5rem;
`;

export const CalcButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.85rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CalcButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #132e58;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  padding: 0.55rem 1.35rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  min-width: 8.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: #2a4365;
  }
`;

/** @deprecated Prefer CalcMetricCard inside CalcResultPanel */
export const CalcResult = styled.div<{ $muted?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem;
  background: ${({ $muted }) => ($muted ? "#f8fafc" : "linear-gradient(135deg, #132e58 0%, #1e3a5f 100%)")};
  color: ${({ $muted }) => ($muted ? "#132e58" : "#fff")};
  font-weight: 600;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  font-size: 0.9375rem;
  text-align: left;
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
  width: 100%;
  box-sizing: border-box;
  white-space: normal;
  word-break: break-word;
  border: 1px solid ${({ $muted }) => ($muted ? "rgba(19, 46, 88, 0.1)" : "transparent")};

  span {
    font-weight: 700;
    margin-left: 0;
  }
`;

export const CalcResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.65rem;
  margin-top: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const CalcResultPanel = styled.div`
  margin-top: 1.15rem;
  padding: 1rem 1.05rem 1.1rem;
  border-radius: 16px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  border: 1px solid rgba(19, 46, 88, 0.12);
`;

export const CalcResultHeading = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
`;

export const CalcMetricCard = styled.div<{ $tone?: "primary" | "accent" | "muted" | "positive" | "negative" }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  min-height: 4.25rem;
  box-sizing: border-box;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "accent"
        ? "rgba(214, 158, 46, 0.35)"
        : $tone === "primary"
          ? "transparent"
          : "rgba(19, 46, 88, 0.1)"};
  background: ${({ $tone }) => {
    if ($tone === "primary") return "linear-gradient(145deg, #132e58 0%, #1a3d6e 100%)";
    if ($tone === "accent") return "linear-gradient(145deg, #f6e7c1 0%, #f0d78a 100%)";
    if ($tone === "positive") return "#ecfdf5";
    if ($tone === "negative") return "#fef2f2";
    return "#fff";
  }};
  color: ${({ $tone }) => {
    if ($tone === "primary") return "#fff";
    if ($tone === "accent") return "#132e58";
    if ($tone === "positive") return "#065f46";
    if ($tone === "negative") return "#991b1b";
    return "#132e58";
  }};
`;

export const CalcMetricLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.78;
  line-height: 1.2;
`;

export const CalcMetricValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.125rem;
  }
`;

export const CalcMetricNote = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.85;
  line-height: 1.35;
  margin-top: 0.15rem;
`;

export const CalcResultTile = styled.div<{ $highlight?: boolean }>`
  background: ${({ $highlight }) =>
    $highlight ? "linear-gradient(145deg, #132e58 0%, #1a3d6e 100%)" : "#fff"};
  color: ${({ $highlight }) => ($highlight ? "#fff" : "#132e58")};
  font-weight: 500;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid ${({ $highlight }) => ($highlight ? "transparent" : "rgba(19, 46, 88, 0.1)")};

  span {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
`;

export const CalcHint = styled.p`
  margin: 0.65rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.45;
`;

export const CalcError = styled.p`
  margin: 0.65rem 0 0;
  font-size: 0.75rem;
  color: #b91c1c;
  font-weight: 600;
  line-height: 1.45;
`;

export const CalcToggleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0.15rem 0 0.75rem;
`;

export const CalcToggle = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? "#d69e2e" : "#132e58")};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#c08c22" : "#2a4365")};
  }
`;

export const CalcSplitResults = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  margin-top: 1.1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const CalcPanelTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #d69e2e;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const CalcStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;
