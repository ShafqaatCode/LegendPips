import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GLogo from "../../assets/icons/Google.png";
import {
  Container,
  Heading,
  GoogleButton,
  GoogleIcon,
  Input,
  ErrorMsg,
  PasswordRow,
  Icon,
  Terms,
  RegisterButton,
  ForgetPassword,
} from "./Login.styles";
import ForgetPasswordModal from "./ForgetPasswordModal";
import { useAuth } from "../../contexts/AuthContext";
import { firstAdminPath } from "../../utils/adminPermissions";
import { useLocale } from "../../contexts/LocaleContext";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  /** When provided, successful login runs this instead of redirecting away (e.g. modal on /contests). */
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login, complete2fa } = useAuth();
  const { t } = useLocale();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");

  const finishLogin = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
      return;
    }
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.role === "admin") {
        navigate(firstAdminPath(userData));
      } else {
        navigate("/user-panel");
      }
      window.location.reload();
    }, 200);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await login(data.email, data.password);

      if (response.success && "requires2fa" in response && response.requires2fa) {
        setTempToken(response.tempToken);
        setError("");
        return;
      }

      if (response.success) {
        finishLogin();
      } else {
        setError(response.message || t("panel.authInvalid"));
      }
    } catch (err: any) {
      setError(err.message || t("panel.authFail"));
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await complete2fa(tempToken, otpCode.trim());
      if (response.success) {
        finishLogin();
      } else {
        setError(response.message || "Invalid authenticator code");
      }
    } catch (err: any) {
      setError(err.message || "2FA verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (tempToken) {
    return (
      <Container>
        <Heading>Two-factor authentication</Heading>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 0, lineHeight: 1.5 }}>
          Enter the 6-digit code from your authenticator app to finish signing in.
        </p>
        <form onSubmit={onVerify2fa}>
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
            maxLength={8}
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <RegisterButton type="submit" disabled={isLoading || otpCode.length < 6}>
            {isLoading ? "Verifying…" : "Verify & continue"}
          </RegisterButton>
          <RegisterButton
            type="button"
            style={{ marginTop: "0.65rem" }}
            onClick={() => {
              setTempToken(null);
              setOtpCode("");
              setError("");
            }}
          >
            Back to login
          </RegisterButton>
        </form>
      </Container>
    );
  }

  return (
    <Container>
      <Heading>{t("panel.authLogin")}</Heading>

      <GoogleButton type="button">
        {t("panel.authGoogle")} <GoogleIcon src={GLogo} alt="G" />
      </GoogleButton>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder={t("panel.authEmail")}
          {...register("email", { required: true })}
        />
        {errors.email && <ErrorMsg>{t("panel.authEmailReq")}</ErrorMsg>}

        <PasswordRow>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("panel.authPassword")}
            {...register("password", { required: true })}
          />
          <Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Icon>
        </PasswordRow>
        {errors.password && <ErrorMsg>{t("panel.authPassReq")}</ErrorMsg>}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Terms>
          <input type="checkbox" {...register("terms", { required: true })} />
          <label>
            {t("panel.authTerms")}
          </label>
        </Terms>
        {errors.terms && <ErrorMsg>{t("panel.authTermsReq")}</ErrorMsg>}

        <ForgetPassword onClick={() => setIsForgotOpen(true)}>{t("panel.authForgot")}</ForgetPassword>

        <RegisterButton type="submit" disabled={isLoading}>
          {isLoading ? t("panel.authLogging") : t("panel.authLogin")}
        </RegisterButton>
        <RegisterButton onClick={onSwitchToRegister} type="button" style={{ marginTop: "0.65rem" }}>
          {t("panel.authRegister")}
        </RegisterButton>
      </form>
      <ForgetPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </Container>
  );
};

export default LoginForm;
