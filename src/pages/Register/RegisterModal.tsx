import React, { useEffect } from "react";
import styled from "styled-components";

import RegisterForm from "./RegisterForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

const RegisterModal: React.FC<LoginModalProps> = ({ isOpen, onClose}) => {
 useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <RegisterForm onClose={onClose} />
      </ModalContainer>
    </Overlay>
  );
};

export default RegisterModal;

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
  // padding: 10vh 0; 
  overflow-y: auto;  
 
`;

const ModalContainer = styled.div`
 
  border-radius: 12px;

  max-width: 800px;
  position: relative;
  
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  
`;
