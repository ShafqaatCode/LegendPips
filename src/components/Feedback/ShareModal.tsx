import React from "react";
import styled from "styled-components";
import { FaFacebookSquare, FaWhatsappSquare, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6"; // Filled X (Twitter) square
import { MdEmail } from "react-icons/md"; // Filled email icon

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <CopyLink onClick={copyToClipboard}>📋 Copy Link</CopyLink>
        </Header>

        <ShareList>
          <ShareItem
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
          >
            <FaFacebookSquare color="#1877F2" size={22} border-radius={"100px"} /> Share on Facebook
          </ShareItem>

          <ShareItem
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
          >
            <FaSquareXTwitter color="black" size={22} /> Share on X
          </ShareItem>

          <ShareItem
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
          >
            <FaWhatsappSquare color="#25D366" size={22} /> Share on WhatsApp
          </ShareItem>

          <ShareItem
            href={`https://www.instagram.com/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
          >
            <FaInstagramSquare color="#E4405F" size={22} /> Share on Instagram
          </ShareItem>

          <ShareItem
            href={`mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`}
          >
            <MdEmail color="#0072C6" size={22} /> Share by Email
          </ShareItem>
        </ShareList>

        <CloseButton onClick={onClose}>×</CloseButton>
      </Modal>
    </Overlay>
  );
};

export default ShareModal;

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
  padding: 1.2rem;
  width: 100%;
  max-width: 280px;
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

const Header = styled.div`
  font-weight: 600;
  color: #012d5c;
  margin-bottom: 0.8rem;
`;

const CopyLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ShareList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const ShareItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: #333;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #555;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;
