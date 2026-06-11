import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ReviewBox from "./ReviewBox";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { fetchPublicClientReviews, type ClientReview } from "../../services/siteConfigService";

const FALLBACK_REVIEWS = [
  {
    name: "Eleanor Pena",
    role: "Medical Assistant",
    rating: 5,
    description:
      "LegendPips has completely transformed the way I trade. The signals are incredibly accurate, and I've seen a noticeable increase in my profits. Highly recommended!",
  },
  {
    name: "Robert Fox",
    role: "Developer",
    rating: 4,
    description:
      "Our Satisfied clients have experienced success with our services and loan recommendations.",
  },
  {
    name: "Jenny Wilson",
    role: "Investor",
    rating: 5,
    description: "Legend Pips helps me track my trades better and I've noticed improvement in my profits.",
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
    padding: 1rem;
    border: 1px solid black;
    border-radius: 50%;
    color: black;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: transparent;

    &:hover { background-color: #e49c00; }
  }
`;

type ReviewItem = { name: string; role: string; rating: number; description: string };

const mapReview = (r: ClientReview): ReviewItem => ({
  name: r.name,
  role: r.role || "Client",
  rating: r.rating,
  description: r.body,
});

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    fetchPublicClientReviews()
      .then((data) => { if (data.length) setReviews(data.map(mapReview)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => setVisibleCount(window.innerWidth > 1024 ? 2 : 1);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(reviews.length / visibleCount));

  return (
    <TestimonialContainer>
      <SectionHeadingSet
        upperText=""
        mainHeading="TESTIMONIALS"
        subText="Discover why traders worldwide trust us as their top choice, with a focus on delivering consistent profits, exceptional service, cutting-edge technology."
      />
      <SliderWrapper>
        <SlideTrack currentIndex={currentIndex}>
          {reviews.map((review, index) => (
            <Slide key={index} visibleCount={visibleCount}>
              <ReviewBox {...review} />
            </Slide>
          ))}
        </SlideTrack>
      </SliderWrapper>
      {reviews.length > visibleCount && (
        <SlideButtons>
          <button type="button" onClick={() => setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides)}><FaArrowLeft /></button>
          <button type="button" onClick={() => setCurrentIndex((p) => (p + 1) % totalSlides)}><FaArrowRight /></button>
        </SlideButtons>
      )}
    </TestimonialContainer>
  );
};

export default Testimonials;
