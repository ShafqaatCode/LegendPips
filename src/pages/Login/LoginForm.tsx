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
  const { login } = useAuth();
  const { t } = useLocale();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await login(data.email, data.password);

      if (response.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
          return;
        }
        // Wait a moment for state to update, then check role and redirect
        setTimeout(() => {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData.role === 'admin') {
            navigate(firstAdminPath(userData));
          } else {
            navigate('/user-panel');
          }
          window.location.reload();
        }, 200);
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
