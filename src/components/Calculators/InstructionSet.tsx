import React from "react";
import styled from "styled-components";

interface InstructionsProps {
  calculatorName: string;
  steps: string[];
  footer?: string;
}

const whyCopy: Record<string, string> = {
  "Position Size":
    "The LegendPips Position Size Calculator is trusted by traders worldwide for accurate, transparent, and reliable trade sizing.",
  Pip: "The LegendPips Pip Calculator is trusted by traders worldwide for accurate, transparent, and reliable pip value calculations.",
  Margin:
    "The LegendPips Margin Calculator is trusted by traders worldwide for accurate, transparent, and reliable margin calculations.",
  "Pivot Point":
    "The LegendPips Pivot Point Calculator helps you identify key support and resistance zones for better entries.",
  Fibonacci:
    "The LegendPips Fibonacci Calculator maps clear retracement and extension levels from any price swing.",
  Rebate:
    "The LegendPips Rebate Calculator gives cashback platform users a clear picture of potential earnings.",
};

const InstructionsSection: React.FC<InstructionsProps> = ({
  calculatorName,
  steps,
  footer,
}) => {
  const why = whyCopy[calculatorName];

  return (
    <Wrapper>
      <Inner>
        <SectionTitle>How to use the {calculatorName} calculator</SectionTitle>
        <Paragraph>Input the required fields:</Paragraph>
        <List>
          {steps.map((step, index) => (
            <ListItem key={index}>{step}</ListItem>
          ))}
        </List>
        {footer && <Paragraph>{footer}</Paragraph>}

        {why && (
          <>
            <WhyTitle>Why choose LegendPips?</WhyTitle>
            <Paragraph>{why}</Paragraph>
          </>
        )}
      </Inner>
    </Wrapper>
  );
};

export default InstructionsSection;

const Wrapper = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0.5rem ${({ theme }) => theme.typography.pageGutter} 2rem;
  box-sizing: border-box;
`;

const Inner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.4rem 1.4rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #d69e2e;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1.3;
`;

const WhyTitle = styled.h2`
  margin: 1.15rem 0 0.45rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #d69e2e;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const Paragraph = styled.p`
  margin: 0 0 0.55rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.55;
  color: #132e58;
`;

const List = styled.ul`
  margin: 0.4rem 0 0.85rem;
  padding-left: 1.15rem;
  list-style: disc;
`;

const ListItem = styled.li`
  margin-bottom: 0.35rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #132e58;
`;
