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
  padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
    max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
  overflow-y: auto;

  @media (max-width: 640px) {
    align-items: flex-start;
    padding-top: max(8px, env(safe-area-inset-top));
  }
`;

const ModalCard = styled.div<{ $size?: "md" | "lg" }>`
  width: 100%;
  max-width: ${({ $size }) => ($size === "lg" ? "760px" : "640px")};
  max-height: min(92vh, calc(100dvh - 24px));
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: auto 0;

  @media (max-width: 640px) {
    max-height: calc(100dvh - 16px);
    border-radius: 12px;
    margin-top: 0;
  }
`;

const Header = styled.div`
  flex-shrink: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
`;

const Title = styled.h3`
  margin: 0;
  color: #132e58;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #6b7280;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    color: #132e58;
  }
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 16px;
  -webkit-overflow-scrolling: touch;
`;

const Footer = styled.div`
  flex-shrink: 0;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  background: #fff;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    align-items: stretch;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export interface SimpleModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** lg = wider forms (e.g. broker editor) */
  size?: "md" | "lg";
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay role="dialog" aria-modal="true" aria-label={title} onClick={() => onClose()}>
      <ModalCard $size={size} onClick={(e) => e.stopPropagation()}>
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
