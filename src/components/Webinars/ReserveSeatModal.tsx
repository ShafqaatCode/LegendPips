import React, { useState } from 'react';
import styled from 'styled-components';
import { reserveWebinarSeat } from '../../services/webinarService';

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
  max-height: 90vh;
  overflow-y: auto;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
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

const SubmitButton = styled.button`
  flex: 1;
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

interface ReserveSeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  webinar: {
    id: number;
    title: string;
    instructor: string;
    date?: string;
    time?: string;
  } | null;
  onSubmit: (data: ReserveSeatData) => void;
}

export interface ReserveSeatData {
  name: string;
  email: string;
  phone?: string;
  questions?: string;
  agreeToTerms: boolean;
  webinarId: number;
}

const ReserveSeatModal: React.FC<ReserveSeatModalProps> = ({
  isOpen,
  onClose,
  webinar,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ReserveSeatData>({
    name: '',
    email: '',
    phone: '',
    questions: '',
    agreeToTerms: false,
    webinarId: webinar?.id || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    try {
      // Call API service
      await reserveWebinarSeat({
        webinarId: webinar.id.toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        questions: formData.questions,
      });
      
      // Also call the callback for additional handling
      await onSubmit(formData);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        questions: '',
        agreeToTerms: false,
        webinarId: webinar.id
      });
      onClose();
      alert('Seat reserved successfully! You will receive a confirmation email.');
    } catch (error: any) {
      console.error('Error reserving seat:', error);
      alert(error.message || 'Failed to reserve seat. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ModalTitle>Reserve Your Seat</ModalTitle>
        <ModalSubtitle>
          Reserve your seat for: <strong>{webinar.title}</strong>
        </ModalSubtitle>

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

          <FormGroup>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="questions">Questions or Comments (Optional)</Label>
            <TextArea
              id="questions"
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              placeholder="Any questions you'd like to ask during the webinar?"
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
              I agree to receive webinar updates and notifications via email
            </CheckboxLabel>
          </CheckboxGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Reserving...' : 'Reserve Seat'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReserveSeatModal;
