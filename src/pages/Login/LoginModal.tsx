import React, { useEffect } from "react";
import styled from "styled-components";

import LoginForm from "./Login";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <LoginForm />
      </ModalWrapper>
    </Backdrop>
  );
};

export default SignupModal;

// Styled Components

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
  overflow-y: auto;
  padding: 4rem 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ModalWrapper = styled.div`
  /* position: relative;
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); */
`;

