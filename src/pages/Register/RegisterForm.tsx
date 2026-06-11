import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
  Highlight,
  RegisterButton,
  EmailOtpWrap,
  SendOtpBtn,
  OtpHint,
} from "./Register.styles";
import { FaX } from "react-icons/fa6";
import { register as registerUser, sendRegistrationOtp } from "../../services/authService";
import { fetchRegisterConfig, type RegisterConfig } from "../../services/siteConfigService";

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
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [regConfig, setRegConfig] = useState<RegisterConfig | null>(null);

  useEffect(() => {
    fetchRegisterConfig().then(setRegConfig).catch(() => setRegConfig(null));
  }, []);

  const emailVerificationRequired = regConfig?.emailVerificationRequired !== false;

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = window.setInterval(() => {
      setOtpCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [otpCooldown]);

  const handleSendOtp = async () => {
    const email = getValues("email") as string | undefined;
    setError("");
    setSuccess("");
    if (!email?.trim()) {
      setError("Enter your email first, then request a code.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setOtpSending(true);
    try {
      const res = await sendRegistrationOtp(email.trim());
      setSuccess(res.message || "Verification code sent. Check your inbox.");
      setOtpCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send verification code.");
    } finally {
      setOtpSending(false);
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const otpRaw = String(data.otp ?? "").trim();
    if (emailVerificationRequired && !/^\d{6}$/.test(otpRaw)) {
      setError("Enter the 6-digit verification code sent to your email.");
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
      });

      if (response.success) {
        setSuccess("Registration successful! You can now login.");
        setTimeout(() => {
          if (onClose) onClose();
          window.location.reload();
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
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
      <Heading>Register</Heading>

      <GoogleButton type="button">
        Continue with Google <GoogleIcon src={GLogo} alt="G" />
      </GoogleButton>

      <Or>or</Or>

      <Divider>
        <Line />
        <span>Register with Email</span>
        <Line />
      </Divider>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" placeholder="First Name" {...register("firstName", { required: true })} />
        {errors.firstName && <ErrorMsg>First Name is required</ErrorMsg>}

        <Input type="text" placeholder="Last Name" {...register("lastName", { required: true })} />
        {errors.lastName && <ErrorMsg>Last Name is required</ErrorMsg>}

        {emailVerificationRequired ? (
          <>
            <EmailOtpWrap>
              <Input type="email" placeholder="Email address" {...register("email", { required: true })} />
              <SendOtpBtn
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || otpCooldown > 0}
                $cooling={otpCooldown > 0}
              >
                {otpSending ? "Sending…" : otpCooldown > 0 ? `${otpCooldown}s` : "Send code"}
              </SendOtpBtn>
            </EmailOtpWrap>
            {errors.email && <ErrorMsg>Email is required</ErrorMsg>}
            <OtpHint>We&apos;ll email a 6-digit code. Enter it below to verify this address before you register.</OtpHint>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="6-digit code"
              {...register("otp", { required: emailVerificationRequired })}
            />
            {errors.otp && <ErrorMsg>Verification code is required</ErrorMsg>}
          </>
        ) : (
          <>
            <Input type="email" placeholder="Email address" {...register("email", { required: true })} />
            {errors.email && <ErrorMsg>Email is required</ErrorMsg>}
          </>
        )}

        <PhoneRow>
          <PhoneInputStyled
            country={"us"}
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: "100%",
              height: "40px",
              padding: "0 0.75rem",
              borderRadius: "8px",
              border: "1px solid #bfbfd4",
              fontSize: "0.875rem",
            }}
            buttonStyle={{
              border: "1px solid #bfbfd4",
              borderRadius: "8px 0 0 8px",
            }}
            dropdownStyle={{ zIndex: 10 }}
          />
        </PhoneRow>

        <PasswordRow>
          <Input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password", { required: true })} />
          <Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Icon>
        </PasswordRow>
        {errors.password && <ErrorMsg>Password is required</ErrorMsg>}

        <PasswordRow>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", { required: true })}
          />
          <Icon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </Icon>
        </PasswordRow>
        {errors.confirmPassword && <ErrorMsg>Confirm your password</ErrorMsg>}

        {error && <ErrorMsg style={{ color: "#e74c3c" }}>{error}</ErrorMsg>}
        {success && <ErrorMsg style={{ color: "#2ecc71" }}>{success}</ErrorMsg>}

        <Terms>
          <input type="checkbox" {...register("terms", { required: true })} />
          <label>
            I Understand And Accept The <Highlight>Terms And Disclaimer</Highlight> Set Forth By Legend Pips.
          </label>
        </Terms>
        {errors.terms && <ErrorMsg>You must accept the terms</ErrorMsg>}

        <RegisterButton type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </RegisterButton>
      </form>
    </Container>
  );
};

export default RegisterForm;
