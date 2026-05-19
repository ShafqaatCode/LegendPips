import styled from "styled-components";

export const Container = styled.section`
  margin-left: 0;
  @media (max-width: 1000px) {
    margin: 0;
  }
`;

export const CardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 0.85rem 1rem 0.85rem 3.15rem;
  background-color: #ffffff;
  border-radius: 10px;
  background-clip: padding-box;
  flex-wrap: wrap;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  border: 1px solid #e8eaef;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.05);

  @media (max-width: 1024px) {
    gap: 1rem;
    padding: 0.85rem 0.9rem 0.85rem 2.85rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1.25rem 1rem;
    max-width: 100%;
    gap: 1rem;
  }
`;

export const TopIndex = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  position: absolute;
  color: white;
  top: -10px;
  left: 12px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 1.35rem;
  padding: 3px 7px;
  border-radius: 4px;
  line-height: 1.2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
`;

export const FeaturedRibbon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #c2410c;
  color: white;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 0 10px 0 6px;
`;

export const LogoSection = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
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
  height: 64px;
  width: 64px;
  border-radius: 50%;
  background-color: #fff;
  object-fit: cover;
  border: 1px solid #eef0f4;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);

  @media (max-width: 768px) {
    height: 72px;
    width: 72px;
  }
`;

export const InfoSection = styled.div`
  flex: 2;
  min-width: 0;
  max-width: min(36rem, 100%);

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    text-align: center;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;

  h2 {
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0;
    color: #0f1c46;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const VerifiedBadge = styled.span`
  background-color: #1d4ed8;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
  letter-spacing: 0.02em;
`;

export const Description = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.72);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    text-align: center;
    -webkit-line-clamp: 4;
  }
`;

export const RatingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.65rem;
  min-width: 5.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
  background: #fafbfc;

  @media (max-width: 768px) {
    align-self: center;
    width: auto;
    min-width: 7rem;
  }
`;

export const StarRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
  font-size: 11px;
  line-height: 1;

  svg {
    width: 11px;
    height: 11px;
  }
`;

export const ReviewText = styled.div`
  margin-top: 4px;

  strong {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #0f1c46;
  }

  span {
    display: block;
    font-size: 0.65rem;
    color: #6b7280;
    margin-top: 1px;
    letter-spacing: 0.01em;
  }
`;

export const ActionSection = styled.div`
  min-width: 7.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;

  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
    max-width: 220px;
  }
`;

export const TermsText = styled.span`
  font-size: 0.6rem;
  color: #64748b;
  text-align: center;
  line-height: 1.3;
`;

export const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  width: 100%;
  max-width: 9.5rem;
  margin: 0 auto;
  justify-content: center;
  transition: background 0.2s ease, transform 0.15s ease;

  img {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background-color: #1a2c60;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const SecondaryButton = styled.a`
  color: #132e58;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
  margin-top: 0.1rem;

  &:hover {
    text-decoration: underline;
  }
`;
