import styled from "styled-components";
import { motion } from "framer-motion"

export const SliderWrapper = styled.div`
  position: relative;
  margin-top: -60px;
  z-index: 10;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
  

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

export const CardsContainer = styled.div`

  overflow: hidden;
  width: 100%;
  max-width: 940px;
//   border: 2px solid red;
//   margin: 1rem 0.4rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const CardsSlider = styled.div<{ translateX: number }>`
  display: flex;
  align-items:center;
  justify-content: center;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => props.translateX}%);
`;

export const Card = styled(motion.div)`
  flex: 0 0 auto;
  width: 170px;
  height: 155px;
  margin: 0 0.5rem;
  background-color: ${({ theme }) => theme.colors.WHITE};
  border-radius: 8px;
  text-align: center;
  padding: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform 0.3s ease;

  img {
    height: 50px;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    z-index: 2;
    position: relative;
    white-space: nowrap;
  }

  /* .hover-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.08;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 0;
    transition: width 0.4s ease, height 0.4s ease;
  } */
/* 
  &:hover .hover-bg {
    width: 200%;
    height: 200%;
  }

  &:hover {
    transform: translateY(-3px);
  } */
`;

export const ArrowsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin: 30px;

  @media (min-width: 769px) {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    justify-content: space-between;
    margin-top: 0;
    padding: 0 1rem;
  }
`;

export const ArrowBase = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.WHITE};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.8rem;
  border-radius: 50%;
  padding: 0.7rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: white;
  }
`;

export const ArrowLeft = styled(ArrowBase)``;
export const ArrowRight = styled(ArrowBase)``;
