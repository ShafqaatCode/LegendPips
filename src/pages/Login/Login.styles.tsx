import styled from "styled-components";

export const Container = styled.div`
  max-width: 650px;
  /* margin: 4rem auto; */
  padding: 3rem 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;
 

  @media(max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 2rem;
    width: 90%;

  }
`;

export const Heading = styled.h2`
  font-size: 40px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary || "#1f3b8c"};
  margin-bottom: 1.5rem;
`;

export const GoogleButton = styled.button`
  width: 100%;
  background-color: #132e58;
  color: white;
  padding: 1rem;
  border: none;
  font-size: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  margin-bottom: 1.5rem;
  cursor: pointer;

  &:hover{
  background-color: #132e58ee;
  }
`;

export const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1.2rem;
  border-radius: 8px;
  border: 1px solid #bfbfd4;
  font-size: 16px;
  margin-bottom: 1rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary || "#1f3b8c"};
    font-size: 1rem;
    font-weight: 400;
  }
`;

export const ErrorMsg = styled.div`
  color: red;
  font-size: 12px;
  margin-top: -0.7rem;
  margin-bottom: 0.8rem;
`;

export const PasswordRow = styled.div`
  position: relative;
`;

export const Icon = styled.span`
  position: absolute;
  right: 14px;
  top: 20px;
  color: #999;
  font-size: 16px;
  cursor: pointer;
`;

export const Terms = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  margin: 1rem 0;

  input {
    margin-top: 5px;
  }

  label {
    line-height: 1.5;
  }
`;

export const Highlight = styled.span`
  color: #e87511;
  font-style: italic;
  font-weight: 600;
`;

export const RegisterButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary || "#1f3b8c"};
  color: white;
  padding: 1rem;
  font-size: 26px;
  border: none;
  border-radius: 10px;
  font-weight: 400;
  cursor: pointer;

  &:hover{
  background: #132e58ee;
  }
`;

export const ForgetPassword = styled.div`
  text-align: right;
  color: #e87511;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 1.5rem;
  cursor: pointer;
`;
