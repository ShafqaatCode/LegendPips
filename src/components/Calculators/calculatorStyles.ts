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
  gap: 0.7rem 1rem;
  margin-bottom: 0.7rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 0.65rem;
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

export const CalcResult = styled.div<{ $muted?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $muted }) => ($muted ? "#eef1f6" : "#d69e2e")};
  color: ${({ $muted }) => ($muted ? "#132e58" : "#fff")};
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.8125rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
  line-height: 1.3;

  span {
    font-weight: 700;
    margin-left: 0.3rem;
  }
`;

export const CalcResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const CalcResultTile = styled.div<{ $highlight?: boolean }>`
  background: ${({ $highlight }) => ($highlight ? "#d69e2e" : "#f3f4f7")};
  color: ${({ $highlight }) => ($highlight ? "#fff" : "#132e58")};
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid ${({ $highlight }) => ($highlight ? "transparent" : "rgba(0,0,0,0.06)")};

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
