import styled from "styled-components";
import PhoneInput from "react-phone-input-2";



export const Container = styled.div`
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 1.75rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;
  position: relative;

  @media (max-width: 768px) {
    padding: 2.25rem 1.25rem 1.5rem;
    margin: 0 auto;
  }
`;

export const Heading = styled.h2`
  font-size: 1.375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
`;

export const GoogleButton = styled.button`
  width: 100%;
  background-color: #1f3b8c;
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
    background-color: #173066;
  }
`;

export const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
  span {
    margin: 0 10px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
  }
`;

export const Line = styled.hr`
  flex: 1;
  height: 1px;
  background: #ccc;
  border: none;
`;

export const Or = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;



// export const SectionTitle = styled.div`
//   text-align: center;
//   color: #1f3b8c;
//   font-weight: 600;
//   margin: 1rem 0 1.2rem;
// `;

export const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #bfbfd4;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary};
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

export const PhoneRow = styled.div`
  margin-bottom: 1rem;
`;

export const PhoneInputStyled = styled(PhoneInput)`
  .form-control {
    width: 100% !important;
  }
`;

export const VerifyRow = styled.div`
  position: relative;
  /* margin-bottom: 1rem; */
`;

export const Retake = styled.button`
  position: absolute;
  right: 14px;
  top: 25px;
  background: none;
  border: none;
  color: #1f3b8c;
  font-size: 16px;
  cursor: pointer;
`;

export const PasswordRow = styled.div`
  position: relative;
  /* margin-bottom: 1rem; */
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
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.6rem 0.85rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.92;
  }
`;


export const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 20px;
  font-size: 1.6rem;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;
  @media (max-width: 768px) {
   top: 12px;
    right: 24px;
  }
 

  &:hover {
    color: #ff4444;
  }
`;

export const EmailOtpWrap = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
  margin-bottom: 0.75rem;

  ${Input} {
    margin-bottom: 0;
    flex: 1;
    min-width: 0;
  }
`;

export const SendOtpBtn = styled.button<{ $cooling?: boolean }>`
  flex-shrink: 0;
  padding: 0 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ $cooling }) => ($cooling ? "#e8ecf4" : "#fff")};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: ${({ $cooling }) => ($cooling ? "not-allowed" : "pointer")};
  white-space: nowrap;
  max-width: 42%;

  &:hover:not(:disabled) {
    background: #f0f4ff;
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
`;

export const OtpHint = styled.p`
  font-size: 0.72rem;
  color: #64748b;
  margin: -0.35rem 0 0.65rem;
  line-height: 1.4;
`;