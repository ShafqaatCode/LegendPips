import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { AccountManager } from "../../services/accountManagerService";

type Props = {
  manager: AccountManager;
};

const AccountManagerCard: React.FC<Props> = ({ manager }) => {
  const [open, setOpen] = useState(true);
  const initials = manager.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return (
    <Card>
      <Head>
        <AvatarWrap>
          {manager.avatarUrl ? (
            <Avatar src={manager.avatarUrl} alt={manager.name} />
          ) : (
            <AvatarFallback aria-hidden>{initials || "AM"}</AvatarFallback>
          )}
          <OnlineDot $online={manager.online !== false} title={manager.online !== false ? "Online" : "Offline"} />
        </AvatarWrap>
        <HeadCopy>
          <Label>Your account manager</Label>
          <Name>{manager.name}</Name>
        </HeadCopy>
      </Head>

      <Toggle type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        Show contacts {open ? <FiChevronUp /> : <FiChevronDown />}
      </Toggle>

      {open && (
        <Contacts>
          {manager.email ? (
            <Row>
              <span>E-mail:</span>
              <a href={`mailto:${manager.email}`}>{manager.email}</a>
            </Row>
          ) : null}
          {manager.telegram ? (
            <Row>
              <span>Telegram:</span>
              <a
                href={
                  manager.telegram.startsWith("http")
                    ? manager.telegram
                    : `https://t.me/${manager.telegram.replace(/^@/, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {manager.telegram.startsWith("@") ? manager.telegram : `@${manager.telegram.replace(/^@/, "")}`}
              </a>
            </Row>
          ) : null}
          {manager.whatsapp ? (
            <Row>
              <span>WhatsApp:</span>
              <a
                href={`https://wa.me/${manager.whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {manager.whatsapp}
              </a>
            </Row>
          ) : null}
          {!manager.email && !manager.telegram && !manager.whatsapp ? (
            <Empty>Contact details will appear here once your manager adds them.</Empty>
          ) : null}
        </Contacts>
      )}
    </Card>
  );
};

export default AccountManagerCard;

const Card = styled.article`
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.05);
  padding: 1.1rem 1.15rem 1rem;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  background: #e2e8f0;
`;

const AvatarFallback = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(145deg, #132e58, #1e4a7a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
`;

const OnlineDot = styled.span<{ $online?: boolean }>`
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $online }) => ($online ? "#22c55e" : "#94a3b8")};
  border: 2px solid #fff;
`;

const HeadCopy = styled.div`
  min-width: 0;
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.15rem;
`;

const Name = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
`;

const Toggle = styled.button`
  margin-top: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  background: none;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: #132e58;
  }
`;

const Contacts = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eef2f7;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  line-height: 1.45;

  span {
    color: #94a3b8;
    min-width: 4.75rem;
  }

  a {
    color: #475569;
    text-decoration: none;
    font-weight: 500;
    word-break: break-all;
  }

  a:hover {
    color: #132e58;
    text-decoration: underline;
  }
`;

const Empty = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
`;
