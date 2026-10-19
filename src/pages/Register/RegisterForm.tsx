import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import GLogo from "../../assets/icons/Google.png";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Container,
  Heading,
  GoogleButton,
  GoogleIcon,
  Divider,
  Line,
  Or,
  Input,
  ErrorMsg,
  PhoneRow,
  PhoneInputStyled,
  PasswordRow,
  Icon,
  Terms,
  CloseBtn,
  RegisterButton,
  EmailOtpWrap,
  SendOtpBtn,
  OtpHint,
} from "./Register.styles";
import { FaX } from "react-icons/fa6";
import { register as registerUser, sendRegistrationOtp } from "../../services/authService";
import { fetchRegisterConfig, type RegisterConfig } from "../../services/siteConfigService";
import { useLocale } from "../../contexts/LocaleContext";
import { useAuth } from "../../contexts/AuthContext";
import TermsAcceptLabel from "../../components/Auth/TermsAcceptLabel";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const [searchParams] = useSearchParams();
  const referralFromUrl = (searchParams.get("ref") || searchParams.get("referralCode") || "").trim().toUpperCase();
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [regConfig, setRegConfig] = useState<RegisterConfig | null>(null);
  const { t } = useLocale();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegisterConfig().then(setRegConfig).catch(() => setRegConfig(null));
  }, []);

  const emailVerificationRequired = regConfig?.emailVerificationRequired !== false;
  const maintenanceMode = regConfig?.maintenanceMode === true;
  const registrationsClosed = regConfig?.allowRegistrations === false;
  const registerBlocked = maintenanceMode || registrationsClosed;

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = window.setInterval(() => {
      setOtpCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [otpCooldown]);

  const onGoogleClick = async () => {
    if (registerBlocked) {
      setError(
        maintenanceMode
          ? "The platform is in maintenance mode. Registration is temporarily closed."
          : "New registrations are currently disabled."
      );
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await loginWithGoogle({
        referralCode: referralFromUrl || undefined,
      });
      if (response.success && "requires2fa" in response && response.requires2fa) {
        setError(response.message || "Enter your authenticator code on the login screen.");
        return;
      }
      if (response.success) {
        setSuccess(t("panel.authRegOk"));
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/user-panel");
          window.location.reload();
        }, 600);
      } else {
        setError(response.message || t("panel.authRegFail"));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("panel.authRegFail"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (registerBlocked) {
      setError(
        maintenanceMode
          ? "The platform is in maintenance mode. Registration is temporarily closed."
          : "New registrations are currently disabled."
      );
      return;
    }
    const email = getValues("email") as string | undefined;
    setError("");
    setSuccess("");
    if (!email?.trim()) {
      setError(t("panel.authEnterEmail"));
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError(t("panel.authValidEmail"));
      return;
    }
    setOtpSending(true);
    try {
      const res = await sendRegistrationOtp(email.trim());
      setSuccess(res.message || t("panel.authOtpSent"));
      setOtpCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("panel.authOtpFail"));
    } finally {
      setOtpSending(false);
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (registerBlocked) {
      setError(
        maintenanceMode
          ? "The platform is in maintenance mode. Registration is temporarily closed."
          : "New registrations are currently disabled."
      );
      setIsLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError(t("panel.authPassMatch"));
      setIsLoading(false);
      return;
    }

    const otpRaw = String(data.otp ?? "").trim();
    if (emailVerificationRequired && !/^\d{6}$/.test(otpRaw)) {
      setError(t("panel.authNeedOtp"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: phone || undefined,
        otp: emailVerificationRequired ? otpRaw : undefined,
        referralCode: referralFromUrl || undefined,
      });

      if (response.success) {
        setSuccess(t("panel.authRegOk"));
        setTimeout(() => {
          if (onClose) onClose();
          window.location.reload();
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("panel.authRegFail"));
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <CloseBtn type="button" onClick={onClose}>
        <FaX size={"16px"} />
      </CloseBtn>
      <Heading>{t("panel.authRegister")}</Heading>

      {registerBlocked ? (
        <div style={{ padding: "0.75rem 0 1.25rem", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 0.35rem",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FBC113",
            }}
          >
            {maintenanceMode ? "Maintenance mode" : "Registrations closed"}
          </p>
          <p
            style={{
              margin: 0,
              padding: "0.95rem 1rem",
              borderRadius: 12,
              background: maintenanceMode ? "#fff7ed" : "#fef2f2",
              border: `1px solid ${maintenanceMode ? "#fed7aa" : "#fecaca"}`,
              color: maintenanceMode ? "#9a3412" : "#b91c1c",
              fontSize: 14,
              lineHeight: 1.55,
              fontWeight: 600,
            }}
          >
            {maintenanceMode
              ? "We're doing a quick upgrade. New registrations are temporarily closed — please check back soon."
              : "New registrations are currently disabled. Please check back later or contact support."}
          </p>
        </div>
      ) : null}

      {referralFromUrl && !registerBlocked ? (
        <p style={{ margin: "0 0 0.75rem", fontSize: 13, color: "#64748b" }}>
          Invite code applied: <strong style={{ color: "#132E58" }}>{referralFromUrl}</strong>
        </p>
      ) : null}

      {!registerBlocked && (
      <>
      <GoogleButton type="button" onClick={onGoogleClick} disabled={isLoading}>
        {t("panel.authGoogle")} <GoogleIcon src={GLogo} alt="G" />
      </GoogleButton>

      <Or>{t("panel.authOr")}</Or>

      <Divider>
        <Line />
        <span>{t("panel.authEmailReg")}</span>
        <Line />
      </Divider>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" placeholder={t("panel.authFirst")} {...register("firstName", { required: true })} />
        {errors.firstName && <ErrorMsg>{t("panel.authFirstReq")}</ErrorMsg>}

        <Input type="text" placeholder={t("panel.authLast")} {...register("lastName", { required: true })} />
        {errors.lastName && <ErrorMsg>{t("panel.authLastReq")}</ErrorMsg>}

        {emailVerificationRequired ? (
          <>
            <EmailOtpWrap>
              <Input type="email" placeholder={t("panel.authEmail")} {...register("email", { required: true })} />
              <SendOtpBtn
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || otpCooldown > 0}
                $cooling={otpCooldown > 0}
              >
                {otpSending ? t("panel.authSending") : otpCooldown > 0 ? `${otpCooldown}s` : t("panel.authSendCode")}
              </SendOtpBtn>
            </EmailOtpWrap>
            {errors.email && <ErrorMsg>{t("panel.authEmailReq")}</ErrorMsg>}
            <OtpHint>{t("panel.authOtpHint")}</OtpHint>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder={t("panel.authOtp")}
              {...register("otp", { required: emailVerificationRequired })}
            />
            {errors.otp && <ErrorMsg>{t("panel.authOtpReq")}</ErrorMsg>}
          </>
        ) : (
          <>
            <Input type="email" placeholder={t("panel.authEmail")} {...register("email", { required: true })} />
            {errors.email && <ErrorMsg>{t("panel.authEmailReq")}</ErrorMsg>}
          </>
        )}

        <PhoneRow>
          <PhoneInputStyled
            country="us"
            value={phone}
            onChange={(value) => setPhone(value)}
            enableSearch
            disableDropdown={false}
            countryCodeEditable={false}
            placeholder="Phone number"
            inputProps={{ autoComplete: "tel", name: "phone" }}
            preferredCountries={["us", "gb", "pk", "ae", "sa", "in"]}
          />
        </PhoneRow>

        <PasswordRow>
          <Input type={showPassword ? "text" : "password"} placeholder={t("panel.authPassword")} {...register("password", { required: true })} />
          <Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Icon>
        </PasswordRow>
        {errors.password && <ErrorMsg>{t("panel.authPassReq")}</ErrorMsg>}

        <PasswordRow>
          <Input
            type={showConfirmPassword ? "text" : "password"}
              placeholder={t("panel.authConfirm")}
            {...register("confirmPassword", { required: true })}
          />
          <Icon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </Icon>
        </PasswordRow>
        {errors.confirmPassword && <ErrorMsg>{t("panel.authConfirmReq")}</ErrorMsg>}

        {error && <ErrorMsg style={{ color: "#e74c3c" }}>{error}</ErrorMsg>}
        {success && <ErrorMsg style={{ color: "#2ecc71" }}>{success}</ErrorMsg>}

        <Terms>
          <input type="checkbox" {...register("terms", { required: true })} />
          <label>
            <TermsAcceptLabel variant="register" />
          </label>
        </Terms>
        {errors.terms && <ErrorMsg>{t("panel.authTermsReq")}</ErrorMsg>}

        <RegisterButton type="submit" disabled={isLoading}>
          {isLoading ? t("panel.authRegistering") : t("panel.authRegister")}
        </RegisterButton>
      </form>
      </>
      )}
    </Container>
  );
};

export default RegisterForm;
