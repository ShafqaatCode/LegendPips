// src/components/shared/Typography.tsx
import styled from 'styled-components';

export const SectionHeading = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 64px;
  line-height: 100px;
  letter-spacing: -0.6%;
  text-align: center;
  text-transform: uppercase;
  `;
  
  export const UpperHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.6%;
  text-align: center;
  text-transform: uppercase;
  color: ${({theme}) => theme.colors.secondary}
  
`;

export const SubHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.6%;
  text-align: center;
  width:850px;
  margin:auto;
  // border: 2px solid red;
  margin-bottom: 2rem;
   
`;


// export const GradientText = styled.h1`
//   background: ${({ theme }) => theme.colors.Gold};
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   display: inline-block;
// `;