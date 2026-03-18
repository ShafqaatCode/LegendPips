import React, { useEffect } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 640px;
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  color: #132e58;
  font-size: 16px;
  font-weight: 800;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
    color: #132e58;
  }
`;

const Body = styled.div`
  padding: 16px 18px;
`;

const Footer = styled.div`
  padding: 14px 18px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export interface SimpleModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, title, onClose, children, footer }) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => onClose()}
    >
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <FiX />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
        {footer ? <Footer>{footer}</Footer> : null}
      </ModalCard>
    </Overlay>
  );
};

export default SimpleModal;

