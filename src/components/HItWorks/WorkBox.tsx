import React from 'react';
import styled from 'styled-components';
import type { Variants } from 'framer-motion';
import { motion } from "framer-motion"

interface WorkBoxProps {
  index: number;
  icon: string;
  title: string;
  description: string;
}


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.3, duration: 0.7, ease: "easeOut" } })
};

const CardContainer = styled(motion.div)`
  position: relative;
  width: 315px;
  height: 178px;
  padding: 20px;
  border-radius: 10px;
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.2);
//   font-family: 'Arial', sans-serif;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 320px;
  }
`;

const TopIndex = styled.div`
  position: absolute;
  right: -20px;
  top: -20px;
  background: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px #888888;
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};
`;

const IconImage = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  line-height: 2rem;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
`;

const WorkBox: React.FC<WorkBoxProps> = ({ index, icon, title, description }) => {
  return (
    <CardContainer custom={index} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{once: true}} >
      <TopIndex>{index}</TopIndex>
      <IconImage src={icon} alt="Work Icon" />
      <Title>{title}</Title>
      <Description>{description}</Description>
    </CardContainer>
  );
};

export default WorkBox;
