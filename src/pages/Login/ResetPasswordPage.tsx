import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const Page = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.16), transparent 40%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
`;

const Card = styled.div`
  width: min(420px, 100%);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
  color: #132e58;
`;

const Body = styled.p`
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  font: inherit;
  &:focus {
    outline: none;
    border-color: #132e58;
  }
`;

const Button = styled.button`
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  background: #132e58;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Msg = styled.p<{ $ok?: boolean }>`
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  color: ${({ $ok }) => ($ok ? "#047857" : "#b91c1c")};
`;

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Missing or invalid reset link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Reset password</Title>
        {done ? (
          <>
            <Body>Your password has been updated. You can sign in with your new password.</Body>
            <Button as={Link} to="/signin" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
              Sign in
            </Button>
          </>
        ) : (
          <>
            <Body>Choose a new password for your LegendPips account.</Body>
            {!token && <Msg>This reset link is missing a token. Request a new one from Sign in → Forgot password.</Msg>}
            <form onSubmit={(e) => void onSubmit(e)}>
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
              {error && <Msg>{error}</Msg>}
              <Button type="submit" disabled={loading || !token}>
                {loading ? "Saving…" : "Update password"}
              </Button>
            </form>
          </>
        )}
      </Card>
    </Page>
  );
};

export default ResetPasswordPage;
