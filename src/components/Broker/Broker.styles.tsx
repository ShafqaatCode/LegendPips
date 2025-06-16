import styled from "styled-components";

export const CardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: #fff;
  border: 2px solid #fbc113;
  border-radius: 10px;
  gap: 1.5rem;
  flex-wrap: wrap;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TopRibbon = styled.div`
  position: absolute;
  top: -10px;
  right: 0;
  background-color: #fbc113;
  padding: 0.3rem 1rem;
  font-weight: bold;
  font-size: 13px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

export const LogoSection = styled.div`
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoImg = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background: #fff;
`;

export const InfoSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: 22px;
    margin: 0;
  }
`;

export const VerifiedBadge = styled.div`
  background-color: #2563eb;
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 5px;
`;

export const Description = styled.p`
  font-size: 14px;
  margin: 0.4rem 0;
  color: #333;
`;

export const RatingBox = styled.div`
  min-width: 120px;
  text-align: center;
`;

export const StarRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

export const ReviewCount = styled.div`
  font-weight: bold;
  margin-top: 5px;
  font-size: 16px;

  span {
    font-weight: normal;
    font-size: 12px;
    display: block;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  min-width: 160px;

  .terms {
    font-size: 11px;
    color: gray;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const PrimaryButton = styled.button`
  background-color: #0f1c46;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1.2rem;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1a2b5c;
  }
`;

export const SecondaryLink = styled.a`
  color: #0f1c46;
  font-size: 13px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
