import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "../Register/RegisterModal";
import AutoTranslateRoot from "../../components/i18n/AutoTranslateRoot";

/**
 * /signin and /register routes: show the real centered modal on a dark backdrop
 * instead of a bare form stuck in the corner.
 */
const AuthPageShell: React.FC<{ mode: "signin" | "register" }> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [signinOpen, setSigninOpen] = React.useState(mode === "signin");
  const [signupOpen, setSignupOpen] = React.useState(mode === "register");

  useEffect(() => {
    setSigninOpen(mode === "signin");
    setSignupOpen(mode === "register");
  }, [mode]);

  const fromState = (location.state as { from?: string | { pathname?: string } } | null)?.from;
  const from =
    typeof fromState === "string"
      ? fromState
      : fromState?.pathname || "/";

  const goAway = () => navigate(from && from !== "/signin" && from !== "/register" ? from : "/", { replace: true });

  return (
    <AutoTranslateRoot>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0b1b38 0%, #132e58 55%, #1a3a6a 100%)",
        }}
      >
        <LoginModal
          isOpen={signinOpen}
          onClose={goAway}
          onSwitchToRegister={() => {
            setSigninOpen(false);
            setSignupOpen(true);
            navigate("/register", { replace: true, state: location.state });
          }}
          onLoginSuccess={() => {
            setSigninOpen(false);
            navigate(from && from !== "/signin" ? from : "/user-panel", { replace: true });
          }}
        />
        <RegisterModal
          isOpen={signupOpen}
          onClose={goAway}
        />
      </div>
    </AutoTranslateRoot>
  );
};

export const SignInPage: React.FC = () => <AuthPageShell mode="signin" />;
export const RegisterPage: React.FC = () => <AuthPageShell mode="register" />;

export default SignInPage;
