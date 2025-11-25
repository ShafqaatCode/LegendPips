import React from "react";
import styled from "styled-components";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const Backdrop = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  position: relative;
  background: #ffffff;
  padding: 30px;
  width: 360px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 6px 18px rgba(0,0,0,0.15);
  font-family: sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 12px;
  color: #132e58;
`;

const Desc = styled.p`
  color: #4a4a4a;
  margin-bottom: 18px;
`;

const ConfirmBtn = styled.button`
  background: #132e58;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0e2241;
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  color: #132e58;

  &:hover {
    color: #0e2241;
  }
`;

export const UnderDevelopmentModal: React.FC<ModalProps> = ({ open, onClose }) => {
  return (
    <Backdrop open={open} onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={onClose}>✕</CloseIcon>
        <Title>🚧 Under Development</Title>
        <Desc>
          This Site is currently being developed and Under maintenance.<br />
          
        </Desc>
        <ConfirmBtn onClick={onClose}>Okay</ConfirmBtn>
      </ModalBox>
    </Backdrop>
  );
};
