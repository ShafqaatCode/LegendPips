import React, { useState } from "react";
import {
  Section,
  Container,
  LeftPanel,
  TabButton,
  RightPanel,
  QuestionItem,
  QuestionHeader,
  QuestionTitle,
  ToggleIcon,
  Answer,
  ContactSection,
  ContactText,
  ContactButton,
  ContentWrapper,
} from "./Faqs.styles";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";

const categories = [
  "Forex & Stock Basics",
  "Trading Strategies",
  "Broker Comparisons",
  "Education and Tutorials",
];

const questions = [
  {
    question: "What is Forex trading?",
    answer:
      "Our platform provides realtime Forex signals based on expert analysis. You can access these signals directly through your Tradexy account. Tradexy partners with reliable brokers to ensure secure trading.",
  },
  {
    question: "How do I start trading with LegendPips?",
    answer:
      "You can start trading by creating an account and following our guided onboarding process.",
  },
  {
    question: "How do I get Forex signals?",
    answer:
      "Forex signals will be available directly on your dashboard after subscribing to a plan.",
  },
  {
    question: "Do I need experience to start trading?",
    answer:
      "No, our platform provides tutorials and customer support to help beginners learn and grow.",
  },
];

const Faqs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(0);

  return (
    <Section>
      <Container>
        <SectionHeadingSet
          mainHeading="Get Answers"
          upperText="Frequently asked questions"
          subText="We’ve answered common questions to help you understand how our platform works and what you can expect."
        />

        <ContentWrapper>
          <LeftPanel>
            {categories.map((cat, i) => (
              <TabButton
                key={i}
                selected={selectedCategory === i}
                onClick={() => setSelectedCategory(i)}
              >
                {cat}
              </TabButton>
            ))}
          </LeftPanel>

          <RightPanel>
            {questions.map((q, i) => (
              <QuestionItem key={i}>
                <QuestionHeader onClick={() => setOpenQuestion(i)}>
                  <QuestionTitle>{q.question}</QuestionTitle>
                  <ToggleIcon>{openQuestion === i ? "➖" : "➕"}</ToggleIcon>
                </QuestionHeader>
                {openQuestion === i && <Answer>{q.answer}</Answer>}
              </QuestionItem>
            ))}
          </RightPanel>
        </ContentWrapper>

        <ContactSection>
          <ContactText>
            We've compiled a list of frequently asked questions to provide you
            with quick and helpful answers.
          </ContactText>
          <ContactButton>Contact US 📨</ContactButton>
        </ContactSection>
      </Container>
    </Section>
  );
};

export default Faqs;
