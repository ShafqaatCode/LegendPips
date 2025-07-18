import styled from "styled-components";

const ButtonBase = styled.button<{
  bgColor?: string;
  color?: string;
  borderColor?: string;
  width?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
}>`
  padding: ${({ padding }) => padding || "0.75rem 2rem"};
  font-size: ${({ fontSize }) => fontSize || "1.2rem"};
  font-weight: ${({fontWeight}) => fontWeight || "500"};
  border-radius: 30px;
  cursor: pointer;
  border: 2px solid;
  transition: all 0.3s ease;
  width: ${({ width }) => width || "268px"};
  border: 2px solid ${({ borderColor}) => borderColor || "transparent"};
  background-color: ${({ bgColor, theme }) => bgColor || theme.colors.primary};
  color: ${({ color, theme }) => color || theme.colors.WHITE};
  font-family: ${({ theme }) => theme.font.family};
  white-space: nowrap;


  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  &:hover {
    opacity: 0.9;
  }

  

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 320px;
  }
`;

export default ButtonBase;
