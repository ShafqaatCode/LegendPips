import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
    max-width: 90%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const Title = styled.h2`
  color: #Fbbf24;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const MainMessage = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-top: 1rem;
`;

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Congratulations!</Title>
        <MainMessage>You've Successfully Unlocked LegendPips Premium Signals!</MainMessage>
        <Description>
          Your account has been upgraded - you now have full access to real-time signals for Forex, Gold, Crypto, and Indices. A confirmation email has been sent to your registered address, including a link to join our exclusive Premium Group where live updates and insights are shared regularly.
        </Description>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SubscriptionModal;
