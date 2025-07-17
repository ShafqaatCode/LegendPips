import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  SectionHeading,
  UpperHeading,
  SubHeading,
} from "../SharedStyleComponents/StyleHeadings.styles";
import MathImg from "../../assets/icons/all-svgrepo-com 2.png";
import type { Variants } from "framer-motion";

// Styled Components
const UpperHeadingDiv = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  img {
    height: 24px;
    width: 24px;
  }
`;

const HeadingWrapper = styled.div`
  text-align: center;
  
  padding: 1rem 0;
`;

// Animation Variants
const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.7,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.7,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

// Props Interface
interface SectionHeadingSetProps {
  upperText?: string;
  mainHeading: string;
  subText?: string;
}

// Component
const SectionHeadingSet: React.FC<SectionHeadingSetProps> = ({
  upperText,
  mainHeading,
  subText,
}) => {
  return (
    <HeadingWrapper>
      <UpperHeadingDiv
        custom={0}
        variants={fadeInDown}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <img src={MathImg} alt="icon" />
        <UpperHeading>{upperText}</UpperHeading>
      </UpperHeadingDiv>

      <motion.div
        custom={1}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SectionHeading>{mainHeading}</SectionHeading>
      </motion.div>

      <motion.div
        custom={3}
        variants={fadeInDown}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SubHeading>{subText}</SubHeading>
      </motion.div>
    </HeadingWrapper>
  );
};

export default SectionHeadingSet;
