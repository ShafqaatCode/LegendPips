import styled from "styled-components";

export const Container = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 2.25rem 1.5rem 1.75rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.25rem 1.5rem;
  }
`;

export const Heading = styled.h2`
  font-size: 1.375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary || "#1f3b8c"};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
`;

export const GoogleButton = styled.button`
  width: 100%;
  background-color: #132e58;
  color: white;
  padding: 0.6rem 0.85rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #132e58ee;
  }
`;

export const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #bfbfd4;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary || "#1f3b8c"};
    font-size: 0.875rem;
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
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const Terms = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.75rem;
  margin: 0.75rem 0;

  input {
    margin-top: 3px;
  }

  label {
    line-height: 1.45;
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
  padding: 0.6rem 0.85rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #132e58ee;
  }
`;

export const ForgetPassword = styled.div`
  text-align: right;
  color: #e87511;
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
`;
