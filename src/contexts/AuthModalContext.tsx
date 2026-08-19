import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../pages/Login/LoginModal";
import RegisterModal from "../pages/Register/RegisterModal";

type OpenOptions = {
  /** Path to stay on / return to after login (default: current path). */
  returnTo?: string;
  /** If true, navigate to returnTo after login (for protected pages). */
  redirectAfterLogin?: boolean;
};

type AuthModalContextValue = {
  openSignIn: (opts?: OpenOptions) => void;
  openRegister: (opts?: OpenOptions) => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const useAuthModal = (): AuthModalContextValue => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
};

/** Safe hook when provider may be missing (returns no-ops). */
export const useAuthModalOptional = (): AuthModalContextValue => {
  const ctx = useContext(AuthModalContext);
  return (
    ctx || {
      openSignIn: () => {},
      openRegister: () => {},
      closeAuth: () => {},
    }
  );
};

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [signinOpen, setSigninOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);

  const openSignIn = useCallback((opts?: OpenOptions) => {
    setReturnTo(opts?.returnTo ?? null);
    setRedirectAfterLogin(!!opts?.redirectAfterLogin);
    setSignupOpen(false);
    setSigninOpen(true);
  }, []);

  const openRegister = useCallback((opts?: OpenOptions) => {
    setReturnTo(opts?.returnTo ?? null);
    setRedirectAfterLogin(!!opts?.redirectAfterLogin);
    setSigninOpen(false);
    setSignupOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setSigninOpen(false);
    setSignupOpen(false);
    setReturnTo(null);
    setRedirectAfterLogin(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    const dest = returnTo;
    const shouldRedirect = redirectAfterLogin;
    closeAuth();
    if (shouldRedirect && dest) {
      navigate(dest);
      return;
    }
    // Stay on current page; refresh auth-dependent UI
    window.dispatchEvent(new Event("auth-modal-success"));
  }, [closeAuth, navigate, redirectAfterLogin, returnTo]);

  const value = useMemo(
    () => ({ openSignIn, openRegister, closeAuth }),
    [openSignIn, openRegister, closeAuth]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={signinOpen}
        onClose={closeAuth}
        onSwitchToRegister={() => {
          setSigninOpen(false);
          setSignupOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <RegisterModal
        isOpen={signupOpen}
        onClose={closeAuth}
      />
    </AuthModalContext.Provider>
  );
};
