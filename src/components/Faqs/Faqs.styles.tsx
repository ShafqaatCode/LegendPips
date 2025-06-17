// Faqs.styles.ts
import styled from "styled-components";
import type { DefaultTheme } from "styled-components";

export const Section = styled.section`
  padding: 4rem 2rem;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 220px;
  flex-basis: 300px;
  box-sizing: border-box;

  @media (max-width: 868px) {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    align-items: stretch;
  }
`;

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
  text-align: left;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#1e3a8a" : "#e2e8f0")};
  }

  @media (max-width: 868px) {
    width: 100%;
  }
`;

export const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;
  flex-basis: 600px;
  align-items: flex-end;
  box-sizing: border-box;

  @media (max-width: 868px) {
    width: 100%;
    align-items: center;
  }
`;

export const QuestionItem = styled.div`
  background-color: #f3f4f7;
  border-radius: 0.5rem;
  border: 1px solid #dfe0e4;
  width: 100%;
  max-width: 650px;
  box-sizing: border-box;
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
    isOpen ? "#fbbf24" : "#1e3a8a"};
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