// ForgetPasswordModal.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaX } from "react-icons/fa6";

interface ForgetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgetPasswordModal: React.FC<ForgetPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect with backend reset password API
    alert(`Password reset link sent to: ${email}`);
    setEmail("");
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaX size={"16px"} />
        </CloseButton>
        <FormWrapper>
          <Title>Forgot Password?</Title>
          <Description>
            Enter your registered email address below, and we’ll send you a link to reset your password.
          </Description>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubmitButton type="submit">Send Reset Link</SubmitButton>
          </form>
        </FormWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default ForgetPasswordModal;

// ===== Styled Components =====
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10vh 0;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background: #fff;
  padding: 40px 30px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 24px;
  font-size: 1.6rem;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ff4444;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #132e58;
`;

const Description = styled.p`
  font-size: 16px;
  color: #444;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #132e58;
  }
`;

const SubmitButton = styled.button`
  background: #0d2c54;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #173a6a;
  }
`;
