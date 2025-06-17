import React from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";
import HolderImg from "../../assets/Man.png";

const ReviewContainer = styled.div`

  max-width: 200px;
  width: 200px;
  padding: 1.5rem;
  margin: 0 0.5rem;
//   border: 2px solid red;
  background: #fff;
  border-radius: 13px;
  font-family: Inter;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    min-width: 50%;
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
  width: 500px;

  @media (max-width: 768px) {
    text-align: center;
  }
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
        <img src={HolderImg} alt="Reviewer" />
        <div>
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </ProfileInfo>
    </ReviewContainer>
  );
};

export default ReviewBox;
