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
  ContentWrapper,
  Divider,
} from "./Faqs.styles";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ButtonBase from "../SharedComponents/Button";
import styled from "styled-components";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion"



export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1]
    }
  })
}


type CategoryKey =
  | "Forex & Stock Basics"
  | "Trading Strategies"
  | "Broker Comparisons"
  | "Education and Tutorials";

const ContactWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;

  p {
    font-size: 11px;
    font-weight: 400;
    font-family: Inter;
    padding: 1rem 4px;
  }
`;

const categories: CategoryKey[] = [
  "Forex & Stock Basics",
  "Trading Strategies",
  "Broker Comparisons",
  "Education and Tutorials",
];

const faqsData = {
  "Forex & Stock Basics": [
    {
      question: "What is Forex trading?",
      answer:
        "Our platform provides realtime Forex signals based on expert analysis. You can access these signals directly through your LegendPips account. LegendPips partners with reliable brokers to ensure secure trading.",
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
  ],
  "Trading Strategies": [
    {
      question: "What trading strategies do you support?",
      answer:
        "We support multiple strategies including scalping, swing trading, and day trading with detailed analysis.",
    },
    {
      question: "Can I customize my trading strategy?",
      answer:
        "Yes, users can choose and adapt strategies based on their risk tolerance and goals.",
    },
  ],
  "Broker Comparisons": [
    {
      question: "Which brokers are supported?",
      answer:
        "We work with top brokers such as ICMarkets, Exness, and FBS, selected based on reliability and spreads.",
    },
    {
      question: "How to compare brokers?",
      answer:
        "Visit our broker comparison page where features like leverage, spread, and user reviews are listed.",
    },
  ],
  "Education and Tutorials": [
    {
      question: "Do you offer Forex tutorials?",
      answer:
        "Yes, we have a library of tutorials designed for all levels, from beginners to advanced traders.",
    },
    {
      question: "Are the tutorials free?",
      answer:
        "Basic tutorials are free, while premium educational content is available with a subscription.",
    },
  ],
};

const Faqs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const selectedQuestions = faqsData[categories[selectedCategory]];

  const handleToggle = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

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
              <TabButton custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                key={i}
                selected={selectedCategory === i}
                onClick={() => {
                  setSelectedCategory(i);
                  setOpenQuestion(null);
                }}
              >
                {cat}
              </TabButton>
            ))}

            <ContactWrapper>
              <p>
                We've compiled a list of frequently asked questions to provide
                you with quick and helpful answers.
              </p>
              <ButtonBase fontSize="11px" width="150px">
                Contact Us{" "}
                <img style={{ width: "16px" }} src={ArrowIcon} alt="arrowicon" />
              </ButtonBase>
            </ContactWrapper>
          </LeftPanel>

          <RightPanel>
            {selectedQuestions.map((q, i) => (
              <QuestionItem key={i} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <QuestionHeader onClick={() => handleToggle(i)}>
                  <QuestionTitle>{q.question}</QuestionTitle>
                  <ToggleIcon isOpen={openQuestion === i}>
                    {openQuestion === i ? "−" : "+"}
                  </ToggleIcon>
                </QuestionHeader>

                {openQuestion === i && (
                  <>
                    <Divider />
                    <Answer>{q.answer}</Answer>
                  </>
                )}
              </QuestionItem>
            ))}
          </RightPanel>
        </ContentWrapper>
      </Container>
    </Section>
  );
};

export default Faqs;