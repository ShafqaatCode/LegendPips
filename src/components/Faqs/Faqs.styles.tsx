import styled from "styled-components";

export const Section = styled.section`
  padding: 4rem 2rem;
  background-color: #fff;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const Heading = styled.div`
  text-align: center;

  span {
    color: #2563eb;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin: 0.5rem 0;
    color: #0f172a;
  }
`;

export const SubHeading = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  color: #475569;
`;

export const ContentWrapper = styled.div`
  border: 2px solid red;
width: 90%;
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
`;

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 220px;
`;

export const TabButton = styled.button<{ selected?: boolean }>`
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 999px;
  border: none;
  background-color: ${({ selected }) => (selected ? "#1e3a8a" : "#f1f5f9")};
  color: ${({ selected }) => (selected ? "#fff" : "#1e293b")};
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#1e3a8a" : "#e2e8f0")};
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 2px solid red;
  width: 550px;
`;

export const QuestionItem = styled.div`
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
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

export const ToggleIcon = styled.div`
  font-size: 1.25rem;
  color: #1e3a8a;
`;

export const Answer = styled.div`
  padding: 1rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
`;

export const ContactSection = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

export const ContactText = styled.p`
  font-size: 1rem;
  color: #334155;
  margin-bottom: 1rem;
`;

export const ContactButton = styled.button`
  background-color: #1e3a8a;
  color: #fff;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #172554;
  }
`;
