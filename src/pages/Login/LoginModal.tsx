import React, { useEffect } from "react";
import styled from "styled-components";
import LoginForm from "./Login";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // Prevent scrolling when modal is open
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

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <LoginForm />
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;

// Styled Components
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
 
  max-width: 800px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  
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
  @media (max-width: 768px) {
   top: 12px;
    right: 2.5rem;
  }
 

  &:hover {
    color: #ff4444;
  }
`;
