import styled from "styled-components";

export const BannerWrapper = styled.section`
  position: relative;
  background-size: cover;
  background-position: center;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .content {
    position: relative;
    z-index: 2;
    color: white;
  }
  margin-top: 60px;

  @media (max-width: 768px) {
    height: 200px;
    padding: 0 1rem;
    margin-top: 75px;
  }
`;
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 66, 153, 0.4),
    rgba(0, 66, 153, 0.6),
    rgba(0, 66, 153, 0.4)
  );
  z-index: 1;
`;


export const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;

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
