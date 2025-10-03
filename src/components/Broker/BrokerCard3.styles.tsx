import styled from "styled-components";

export const Container = styled.section`
  margin:0px 40px;
  max-width: 1400px;
  /* margin: auto; */
  @media (max-width: 1000px) {
    margin: 0;
  }
`;

export const CardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  background-color: #fefefe;
  border-radius: 12px;
  background-clip: padding-box;
  flex-wrap: wrap;
  /* width: 90%; */
  margin: auto;
  /* box-shadow: 0 0 0 3px #fbc113; */

  @media (max-width: 1024px) {
    gap: 2rem;
    padding-left: 5rem;
    width: 90%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.5rem;
    width: 95%;
    gap: 1.5rem;
    margin: 1rem auto;
  }
`;

export const TopIndex = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  position: absolute;
  color: white;
  top: -20px;
  left: 20px;
  text-align: center;
  padding: 5px 12px;
  border-radius: 5px;
`;

export const FeaturedRibbon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d97706;
  color: white;
  padding: 6px 14px;
  font-weight: bold;
  font-size: 12px;
  border-radius: 0 12px 0 5px;
`;

export const LogoSection = styled.div`
  
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin-bottom: 1rem;
  }
`;

export const LogoImg = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 50%;
  background-color: #fff;
  object-fit: cover;
  // box-shadow: 0 0 0 4px #fbc113;

  @media (max-width: 768px) {
    height: 100px;
    width: 100px;
  }
`;

export const InfoSection = styled.div`
  flex: 2;
  min-width: 250px;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
    text-align: center;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;

  h2 {
    font-size: 36px;
    margin: 0;
    color: #0f1c46;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const VerifiedBadge = styled.span`
  background-color: #2563eb;
  color: #ffffff;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 5px;
  white-space: nowrap;
`;

export const Description = styled.p`
  font-size: 16px;
  color: rgba(15, 23, 42, 0.8);
  margin: 0;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const RatingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-width: 120px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  text-align: center;

  @media (max-width: 768px) {
    align-self: center;
    width: 80%;
    max-width: 300px;
  }
`;

export const StarRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

export const ReviewText = styled.div`
  margin-top: 6px;

  strong {
    font-size: 18px;
    color: #0f1c46;
  }

  span {
    display: block;
    font-size: 12px;
    color: #6b7280;
  }
`;

export const ActionSection = styled.div`
  min-width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
  }
`;

export const TermsText = styled.span`
  font-size: 10px;
  color: #0f172a;
`;

export const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.6rem 2.3rem;
  /* padding: 7px 20px; */
  border-radius: 2rem;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  justify-content: center;

  &:hover {
    background-color: #1a2c60;
  }
`;

export const SecondaryButton = styled.a`
  color: #132e58;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
