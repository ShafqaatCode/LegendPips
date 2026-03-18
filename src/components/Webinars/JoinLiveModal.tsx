import React, { useState } from 'react';
import styled from 'styled-components';
import { joinLiveWebinar } from '../../services/webinarService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
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
    color: #132E58;
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e74c3c;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
  margin-bottom: 1rem;
  
  &::before {
    content: '🔴';
    font-size: 12px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 0.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 2rem;
`;

const InfoBox = styled.div`
  background: #f0f7ff;
  border: 1px solid #e0e8ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div<{ icon: "calendar" | "time" | "instructor" }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 14px;
  color: #555;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: ${({ icon }) => {
      if (icon === 'calendar') return '"📅"';
      if (icon === 'time') return '"🕐"';
      if (icon === 'instructor') return '"👤"';
      return '""';
    }};
    font-size: 16px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const JoinButton = styled.button`
  flex: 1;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: #c0392b;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &::before {
    content: '▶';
    font-size: 14px;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: white;
  color: #132E58;
  border: 2px solid #e0e0e0;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f7ff;
    border-color: #132E58;
  }
`;

interface JoinLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  webinar: {
    id: number;
    title: string;
    instructor: string;
    date?: string;
    time?: string;
  } | null;
  onJoin: (data: JoinLiveData) => void;
}

export interface JoinLiveData {
  name: string;
  email: string;
  agreeToTerms: boolean;
  webinarId: number;
}

const JoinLiveModal: React.FC<JoinLiveModalProps> = ({
  isOpen,
  onClose,
  webinar,
  onJoin
}) => {
  const [formData, setFormData] = useState<JoinLiveData>({
    name: '',
    email: '',
    agreeToTerms: false,
    webinarId: webinar?.id || 0
  });
  const [isJoining, setIsJoining] = useState(false);

  React.useEffect(() => {
    if (webinar) {
      setFormData(prev => ({ ...prev, webinarId: webinar.id }));
    }
  }, [webinar]);

  if (!isOpen || !webinar) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsJoining(true);
    try {
      // Call API service
      const result = await joinLiveWebinar({
        webinarId: webinar.id.toString(),
        name: formData.name,
        email: formData.email,
      });
      
      // Also call the callback for additional handling
      await onJoin(formData);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        agreeToTerms: false,
        webinarId: webinar.id
      });
      
      // Redirect to webinar URL if available
      if (result.webinarUrl) {
        window.open(result.webinarUrl, '_blank');
      }
      
      onClose();
      alert('Successfully joined the live webinar!');
    } catch (error: any) {
      console.error('Error joining webinar:', error);
      alert(error.message || 'Failed to join webinar. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <LiveIndicator>LIVE NOW</LiveIndicator>
        <ModalTitle>Join Live Webinar</ModalTitle>
        <ModalSubtitle>
          <strong>{webinar.title}</strong>
        </ModalSubtitle>

        <InfoBox>
          {webinar.instructor && (
            <InfoItem icon="instructor">Instructor: {webinar.instructor}</InfoItem>
          )}
          {webinar.date && (
            <InfoItem icon="calendar">Date: {webinar.date}</InfoItem>
          )}
          {webinar.time && (
            <InfoItem icon="time">Time: {webinar.time}</InfoItem>
          )}
        </InfoBox>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
            />
            <CheckboxLabel htmlFor="agreeToTerms">
              I agree to the terms and conditions and privacy policy
            </CheckboxLabel>
          </CheckboxGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <JoinButton type="submit" disabled={isJoining}>
              {isJoining ? 'Joining...' : 'Join Live'}
            </JoinButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default JoinLiveModal;
