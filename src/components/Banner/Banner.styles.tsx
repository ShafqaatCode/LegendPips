import styled from "styled-components";

export const BannerWrapper = styled.section`
  position: relative;
  background-size: cover;
  background-position: center;
  // height: 550px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* margin-top: 60px; */
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    height: 440px;
    /* margin-top: 75px; */
    padding: 0 1rem;
  }

  & .content {
    position: relative;
    z-index: 2;
    color: white;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 66, 153, 0.6),
    rgba(0, 66, 153, 0.5),
    rgba(0, 66, 153, 0.6)
  );
  z-index: 1;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Breadcrumb = styled.div`
  font-size: 1rem;

  span {
    margin: 0 0.5rem;
    color: #fbc113;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;
