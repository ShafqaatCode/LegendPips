// src/components/shared/Typography.tsx
import styled from 'styled-components';

export const SectionHeading = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.sectionTitle};
  line-height: ${({ theme }) => theme.typography.sectionTitleLh};
  letter-spacing: -0.02em;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
`;
  
  export const UpperHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.bannerUpper};
  line-height: 1.35;
  letter-spacing: 0.06em;
  text-align: center;
  text-transform: uppercase;
  color: ${({theme}) => theme.colors.secondary};
  margin: 0;

  
  @media (max-width: 768px)
  {
    font-size: 0.75rem;
  }
  
`;

export const SubHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: ${({ theme }) => theme.typography.lead};
  line-height: 1.55;
  letter-spacing: -0.01em;
  text-align: center;
  max-width: 42rem;
  margin: 0.5rem auto 0;
  color: rgba(15, 23, 42, 0.85);

  
  @media (max-width: 768px)
  {
    font-size: ${({ theme }) => theme.typography.body};
    line-height: 1.5;
  }
   
`;


// export const GradientText = styled.h1`
//   background: ${({ theme }) => theme.colors.Gold};
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   display: inline-block;
// `;