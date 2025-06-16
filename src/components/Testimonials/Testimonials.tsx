import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ReviewBox from "./ReviewBox";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const reviews = [
  {
    name: "Eleanor Pena",
    role: "Medical Assistant",
    rating: 5,
    description:
      "LegendPips has completely transformed the way I trade. The signals are incredibly accurate, and I've seen a noticeable increase in my  profits. Highly recommended!",
  },
  {
    name: "Robert Fox",
    role: "Developer",
    rating: 4,
    description:
      "Our Satisfied clients have experienced success with our services and loan recommendations. Here are some of their testimonials highlighting their positive experiences and the value they received.",
  },
  {
    name: "Jenny Wilson",
    role: "Investor",
    rating: 3,
    description:
      "Legend Pips helps me track my trades better and I’ve noticed improvement in my profits.",
  },
];

const TestimonialContainer = styled.section`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  overflow: hidden;
  margin-top: 2rem;
`;

const SliderWrapper = styled.div`
  width: 100%;
//   border: 2px solid red;
  max-width: 1000px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
`;

const SlideTrack = styled.div<{ currentIndex: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 100}%)`};
`;

const Slide = styled.div<{ visibleCount: number }>`
  flex: 0 0 ${({ visibleCount }) => 100 / visibleCount}%;
  display: flex;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
`;

const SlideButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  button {
    padding: 1rem 1rem;
    border: 1px solid black;
    border-radius: 50%;
    color: black;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: transparent;

    &:hover {
      background-color: #e49c00;
    }
  }
`;

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth > 1024 ? 2 : 1);
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(reviews.length / visibleCount);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <TestimonialContainer>
      <SectionHeadingSet
        upperText="All in one Trading platform"
        mainHeading="Testimonials"
        subText="Discover why traders worldwide trust us as their top choice. With a focus on delivering consistent profits, exceptional service, cutting-edge technology."
      />
      <SliderWrapper>
        <SlideTrack currentIndex={currentIndex}>
          {reviews.map((review, index) => (
            <Slide key={index} visibleCount={visibleCount}>
              <ReviewBox
                name={review.name}
                role={review.role}
                rating={review.rating}
                description={review.description}
              />
            </Slide>
          ))}
        </SlideTrack>
      </SliderWrapper>
      <SlideButtons>
        <button onClick={goPrev}>
          <FaArrowLeft />
        </button>
        <button onClick={goNext}>
          <FaArrowRight />
        </button>
      </SlideButtons>
    </TestimonialContainer>
  );
};

export default Testimonials;
