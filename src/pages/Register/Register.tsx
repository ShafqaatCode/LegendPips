import React, { useState } from "react";
import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterModal = () => {
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Container>
      <Heading>Register</Heading>

      <GoogleButton>
        Continue with Google <GoogleIcon>G</GoogleIcon>
      </GoogleButton>

      <Divider>
        <Line />
        <span>Or</span>
        <Line />
      </Divider>

      <SectionTitle>Register With Email</SectionTitle>

      <Input type="text" placeholder="Full Name" />

      <PhoneRow>
        <PhoneInputStyled
          country={"us"}
          value={phone}
          onChange={setPhone}
          inputStyle={{
            width: "100%",
            height: "44px",
            borderRadius: "8px",
            border: "1px solid #bfbfd4",
          }}
          buttonStyle={{
            border: "1px solid #bfbfd4",
            borderRadius: "8px 0 0 8px",
          }}
          dropdownStyle={{ zIndex: 10 }}
        />
      </PhoneRow>

      <Input type="email" placeholder="Enter Email Address" />

      <VerifyRow>
        <Input type="text" placeholder="Verification Code" />
        <Retake>Retake</Retake>
      </VerifyRow>

      <PasswordRow>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
        />
        <Icon onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </Icon>
      </PasswordRow>

      <PasswordRow>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
        />
        <Icon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </Icon>
      </PasswordRow>

      <Terms>
        <input type="checkbox" />
        <label>
          I Understand And Accept The{" "}
          <Highlight>Terms And Disclaimer</Highlight> Set Forth By Legend Pips.
        </label>
      </Terms>

      <RegisterButton>Register</RegisterButton>
    </Container>
  );
};

export default RegisterModal;

// Styled Components

const Container = styled.div`
  max-width: 420px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;
`;

const Heading = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #1f2a48;
  margin-bottom: 1.5rem;
`;

const GoogleButton = styled.button`
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

const GoogleIcon = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #fbbc05;
`;

const Divider = styled.div`
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

const Line = styled.hr`
  flex: 1;
  height: 1px;
  background: #ccc;
  border: none;
`;

const SectionTitle = styled.div`
  text-align: center;
  color: #1f3b8c;
  font-weight: 700;
  margin: 1rem 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #bfbfd4;
  font-size: 14px;
  margin-bottom: 1rem;
`;

const PhoneRow = styled.div`
  margin-bottom: 1rem;
`;

const PhoneInputStyled = styled(PhoneInput)`
  .form-control {
    width: 100% !important;
  }
`;

const VerifyRow = styled.div`
  position: relative;
`;

const Retake = styled.span`
  position: absolute;
  right: 14px;
  top: 14px;
  color: #1f3b8c;
  font-size: 14px;
  cursor: pointer;
`;

const PasswordRow = styled.div`
  position: relative;
`;

const Icon = styled.span`
  position: absolute;
  right: 14px;
  top: 14px;
  color: #999;
  font-size: 16px;
  cursor: pointer;
`;

const Terms = styled.div`
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

const Highlight = styled.span`
  color: #e87511;
  font-style: italic;
  font-weight: 600;
`;

const RegisterButton = styled.button`
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
