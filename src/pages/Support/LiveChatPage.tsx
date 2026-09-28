import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiMessageCircle, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { openLiveChat } from "../../utils/liveChatEvents";
import { useAuthModal } from "../../contexts/AuthModalContext";

const Page = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem;
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.18), transparent 42%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
`;

const Card = styled.div`
  width: min(480px, 100%);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 2rem 1.5rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
`;

const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #0f172a;
  font-size: 1.4rem;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #132e58;
  letter-spacing: -0.02em;
`;

const Body = styled.p`
  margin: 0 0 1.35rem;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.55;
`;

const Primary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: #132e58;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  &:hover { background: #1a3d6e; }
`;

const Secondary = styled(Link)`
  display: inline-block;
  margin-top: 0.85rem;
  color: #132e58;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const LiveChatPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { openSignIn } = useAuthModal();
  const isMember = isAuthenticated && user?.role !== "admin";

  useEffect(() => {
    if (isMember) openLiveChat();
  }, [isMember]);

  return (
    <Page>
      <Card>
        <IconWrap>
          <FiMessageCircle />
        </IconWrap>
        <Title>Live Chat</Title>
        <Body>
          {isMember
            ? "Your live chat is open in the bottom-right corner. Ask about rebates, brokers, KYC, or account help."
            : "Chat with LegendPips support in real time. Sign in to start a conversation — replies appear instantly in the chat window."}
        </Body>
        {isMember ? (
          <Primary type="button" onClick={() => openLiveChat()}>
            Open chat window <FiArrowRight />
          </Primary>
        ) : (
          <Primary type="button" onClick={() => openSignIn({ returnTo: "/live-chat", redirectAfterLogin: true })}>
            Sign in to chat <FiArrowRight />
          </Primary>
        )}
        <Secondary to="/support/tickets">Open a support ticket</Secondary>
        <Secondary to="/support/contact">Other contact options</Secondary>
      </Card>
    </Page>
  );
};

export default LiveChatPage;
