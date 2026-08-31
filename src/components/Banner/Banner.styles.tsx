import styled from "styled-components";

export const BannerWrapper = styled.section`
  position: relative;
  background-size: cover;
  background-position: center;
  height: clamp(320px, 42vh, 440px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};

  @media (max-width: 768px) {
    height: 300px;
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
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
`;

export const Breadcrumb = styled.div`
  font-size: ${({ theme }) => theme.typography.body};

  span {
    margin: 0 0.5rem;
    color: #fbc113;
  }
`;
