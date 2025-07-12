import styled from "styled-components";
import PhoneInput from "react-phone-input-2";



export const Container = styled.div`
  max-width: 420px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;
`;

export const Heading = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #1f2a48;
  margin-bottom: 1.5rem;
`;

export const GoogleButton = styled.button`
  width: 100%;
  background-color: #1f3b8c;
  color: white;
  padding: 12px;
  border: none;
  font-size: 16px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
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
    margin: 0 8px;
    color: #333;
    font-weight: 600;
  }
`;

export const Line = styled.hr`
  flex: 1;
  height: 1px;
  background: #ccc;
  border: none;
`;

export const SectionTitle = styled.div`
  text-align: center;
  color: #1f3b8c;
  font-weight: 700;
  margin: 1rem 0 1.2rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #bfbfd4;
  font-size: 14px;
  margin-bottom: 1rem;
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
  margin-bottom: 1rem;
`;

export const Retake = styled.button`
  position: absolute;
  right: 14px;
  top: 14px;
  background: none;
  border: none;
  color: #1f3b8c;
  font-size: 14px;
  cursor: pointer;
`;

export const PasswordRow = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

export const Icon = styled.span`
  position: absolute;
  right: 14px;
  top: 14px;
  color: #999;
  font-size: 16px;
  cursor: pointer;
`;

export const Terms = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
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
  background-color: #1f3b8c;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;
