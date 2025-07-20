import React from "react";
import styled, { keyframes } from "styled-components";
import { FaTools } from "react-icons/fa";

const ComingSoon: React.FC = () => {
  return (
    <Container>
      <IconWrapper>
        <FaTools size={48} />
      </IconWrapper>
      <Heading>We're Still Working On This Page</Heading>
      <Subheading>Please check back soon! Some features are still under development.</Subheading>
      <Note>Thank you for your patience 💙</Note>
    </Container>
  );
};

export default ComingSoon;

// Styled Components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  height: 80vh;
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  text-align: center;
  background: #0d1b2a;
  color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${fadeIn} 0.8s ease;
`;

const IconWrapper = styled.div`
  color: #00b4d8;
  margin-bottom: 1.2rem;
`;

const Heading = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.6rem;
`;

const Subheading = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 1rem;
`;

const Note = styled.p`
  font-size: 0.95rem;
  color: #aaa;
  font-style: italic;
`;
