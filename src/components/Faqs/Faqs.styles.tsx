import styled from "styled-components";
import { theme } from "../../theme/theme";

export const Section = styled.section`
  padding: 4rem 2rem;
  background-color: #fff;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const ContentWrapper = styled.div`
  // border: 2px solid red;
  width: 85%;
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 220px;
  max-width: 320px;

  @media (max-width: 768px) {
    //   align-items:center;
    margin: auto;
  }
`;

import type { DefaultTheme } from "styled-components";

export const TabButton = styled.button<{ selected?: boolean }>`
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 999px;
  border: none;
  background-color: ${({
    selected,
    theme,
  }: {
    selected?: boolean;
    theme: DefaultTheme;
  }) => (selected ? theme.colors.primary : "#f1f5f9")};
  color: ${({ selected }) => (selected ? "#fff" : "#1e293b")};
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#1e3a8a" : "#e2e8f0")};
  }
`;

export const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  //   border: 2px solid green;
  width: 550px;

  @media (max-width: 868px) {
    align-items: center;
  }
`;

export const QuestionItem = styled.div`
  background-color: #f3f4f7;
  border-radius: 0.5rem;
  border: 1px solid #dfe0e4;
  //   border: 2px solid pink;
  width: 650px;

  @media (max-width: 768px) {
    width: 380px;
  }
`;

export const QuestionHeader = styled.div`
  padding: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const QuestionTitle = styled.div`
  font-size: 1rem;
  color: #0f172a;
`;

export const Answer = styled.div`
  padding: 1rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
`;

export const ToggleIcon = styled.div<{ isOpen?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ isOpen }) =>
    isOpen ? "#fbbf24" : "#1e3a8a"}; // Golden for open, primary for closed
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 0 1rem;
`;
