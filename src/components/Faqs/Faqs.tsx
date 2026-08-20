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
import { useLocale } from "../../contexts/LocaleContext";
import ButtonBase from "../SharedComponents/Button";
import styled from "styled-components";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import type { Variants } from "framer-motion";




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


type FaqGroup = { cat: string; items: Array<[string, string]> };

const FAQ_GROUPS: FaqGroup[] = [
  { cat: "faq.cat1", items: [["faq.q1", "faq.a1"], ["faq.q2", "faq.a2"], ["faq.q3", "faq.a3"], ["faq.q4", "faq.a4"]] },
  { cat: "faq.cat2", items: [["faq.q5", "faq.a5"], ["faq.q6", "faq.a6"]] },
  { cat: "faq.cat3", items: [["faq.q7", "faq.a7"], ["faq.q8", "faq.a8"], ["faq.q9", "faq.a9"]] },
  { cat: "faq.cat4", items: [["faq.q10", "faq.a10"], ["faq.q11", "faq.a11"]] },
];

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

const Faqs: React.FC = () => {
  const { t } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const selectedQuestions = FAQ_GROUPS[selectedCategory].items;

  const handleToggle = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <Section>
      <Container>
        <SectionHeadingSet
          mainHeading={t("faq.title")}
          upperText={t("faq.kicker")}
          subText={t("faq.body")}
        />

        <ContentWrapper>
          <LeftPanel>
            {FAQ_GROUPS.map((group, i) => (
              <TabButton custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                key={group.cat}
                selected={selectedCategory === i}
                onClick={() => {
                  setSelectedCategory(i);
                  setOpenQuestion(null);
                }}
              >
                {t(group.cat)}
              </TabButton>
            ))}

            <ContactWrapper>
              <p>
                {t("faq.contact")}
              </p>
              <ButtonBase fontSize="11px" width="150px">
                {t("faq.contactBtn")}{" "}
                <img style={{ width: "16px" }} src={ArrowIcon} alt="" />
              </ButtonBase>
            </ContactWrapper>
          </LeftPanel>

          <RightPanel>
            {selectedQuestions.map(([qKey, aKey], i) => (
              <QuestionItem key={qKey} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <QuestionHeader onClick={() => handleToggle(i)}>
                  <QuestionTitle>{t(qKey)}</QuestionTitle>
                  <ToggleIcon isOpen={openQuestion === i}>
                    {openQuestion === i ? "−" : "+"}
                  </ToggleIcon>
                </QuestionHeader>

                {openQuestion === i && (
                  <>
                    <Divider />
                    <Answer>{t(aKey)}</Answer>
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