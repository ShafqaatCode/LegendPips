import React, { useState } from "react";
import styled from "styled-components";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !message) {
      setError("Please fill out both fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulating API call
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setSuccess("Thank you for your feedback!");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("Failed to send feedback");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>Feedback / Help improve this page</Header>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            placeholder="Your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </SubmitButton>
        </Form>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Modal>
    </Overlay>
  );
};

export default FeedbackModal;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  color: #012d5c;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: #012d5c;
  }
`;

const Textarea = styled.textarea`
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 120px;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #012d5c;
  }
`;

const SubmitButton = styled.button`
  background: #012d5c;
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
  &:hover:enabled {
    background: #013e7e;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #555;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.85rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  font-size: 0.85rem;
  text-align: center;
`;
