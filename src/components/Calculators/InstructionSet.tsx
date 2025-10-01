// InstructionsSection.tsx
import React from "react";
import styled from "styled-components";

interface InstructionsProps {
  calculatorName: string;  
  steps: string[];         
  footer?: string;         
}

const InstructionsSection: React.FC<InstructionsProps> = ({
  calculatorName,
  steps,
  footer,
}) => {
  return (
    <Wrapper>
      {/* Dynamic Instructions Section */}
      <SectionTitle>
        How to Use the LegendPips {calculatorName} Calculator:
      </SectionTitle>

      <Paragraph>Input the Required Fields:</Paragraph>

      <List>
        {steps.map((step, index) => (
          <ListItem key={index}>{step}</ListItem>
        ))}
      </List>

      {footer && <Paragraph>{footer}</Paragraph>}

      {/* Static Why Choose Section */}
      <SectionTitle className="WhyThis">Why Choose LegendPips Service?</SectionTitle>
      <Paragraph>
        The <strong>LegendPips {calculatorName} Calculator</strong> is trusted
        by traders worldwide for accurate, transparent, and reliable trade
        sizing. We are committed to helping you manage risk effectively and
        boost your profitability through a simple, hassle-free calculation
        process.
      </Paragraph>
    </Wrapper>
  );
};

export default InstructionsSection;

// Styles
const Wrapper = styled.section`
  padding: 3rem 2rem;
  max-width: 1250px;
  margin: auto;

  color: #132e58;
  
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #132e58;

    &.WhyThis {
        font-size: 36px;
        font-weight: 400;
    }
`;

const Paragraph = styled.p`
  font-size: 20px;
  font-weight: 400;
  /* line-height: 100%; */
  margin-bottom: 1rem;
  color: #1e293b;
   
`;

const List = styled.ul`
  margin: 1rem 0 2rem;
  padding-left: 2rem;
 
  
`;

const ListItem = styled.li`
  margin-bottom: 0.8rem;
  font-size: 20px;
  
  line-height: 1.6;
  color: #132e58;
  list-style-type: disc;
`;
