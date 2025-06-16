import styled from "styled-components";
export const CardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 1.8rem 1.8rem 1.8rem 6rem; /* Extra left padding */
  background-color: #fefefe;
  // border: 3px solid transparent;
  border-radius: 12px;
  background-clip: padding-box;
  // box-shadow: 0 0 0 3px #fbc113;
  flex-wrap: wrap;
  width: 85%;
  margin: auto;
  // overflow:hidden;
`;

export const TopIndex = styled.span`
background-color: ${({ theme }) => theme.colors.primary};
position: absolute;
color: white;
top:-20px;
left: 20px;
text-align: center;

padding: 5px 12px;
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
  // clip-path: polygon(100% 0, 100% 100%, 80% 100%, 0 100%, 20% 0);
  border-radius: 5px;
`;
export const LogoSection = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoImg = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 50%;
  background-color: #fff;
  // box-shadow: 0 0 0 4px #fbc113;
  object-fit: cover;
`;


export const InfoSection = styled.div`
  flex: 2;
  min-width: 250px;
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
`;

export const RatingBox = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  padding: 2rem;
  // justify-content: space-between;
  min-width: 120px;
  // width: 180px;
  // height: 140px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  text-align: center;

  @media (max-width: 768px) {
    align-self: stretch;
    text-align: left;
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
    align-items: flex-start;
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
  padding: 0.7rem 2.2rem;
  border-radius: 2rem;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #1a2c60;
  }
`;

export const SecondaryButton = styled.a`
  color: #0f1c46;
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
