import React from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";
import HolderImg from "../../assets/Man.png";

const ReviewContainer = styled.div`
  width: 100%;
  max-width: 550px;
  padding: 2rem;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  font-family: Inter, sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  @media (min-width: 768px) {
    margin: 0 1rem;
  }

  @media (min-width: 1024px) {
    max-width: 550px;
  }
`;

const StarRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #a3a8ae;
  margin-bottom: 1rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h3 {
    font-size: 17px;
    font-weight: 500;
  }

  p {
    font-size: 13px;
    font-weight: 400;
    color: #abaeb4;
  }

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

interface ReviewBoxProps {
  rating: number;
  name: string;
  role: string;
  description: string;
}

const ReviewBox: React.FC<ReviewBoxProps> = ({
  rating,
  name,
  role,
  description,
}) => {
  return (
    <ReviewContainer>
      <StarRow>
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} color={i < rating ? "#FBAF00" : "#ccc"} />
        ))}
      </StarRow>
      <Description>{description}</Description>
      <ProfileInfo>
        <img src={HolderImg} alt={name} />
        <div>
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </ProfileInfo>
    </ReviewContainer>
  );
};

export default ReviewBox;
