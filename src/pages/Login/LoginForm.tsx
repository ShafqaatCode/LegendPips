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
  Highlight,
  RegisterButton,
  ForgetPassword,
} from "./Login.styles";
import ForgetPasswordModal from "./ForgetPasswordModal";
import { useAuth } from "../../contexts/AuthContext";
import { firstAdminPath } from "../../utils/adminPermissions";

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
        setError(response.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Heading>Login</Heading>

      <GoogleButton type="button">
        Continue with Google <GoogleIcon src={GLogo} alt="G" />
      </GoogleButton>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="Email Address"
          {...register("email", { required: true })}
        />
        {errors.email && <ErrorMsg>Email is required</ErrorMsg>}

        <PasswordRow>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", { required: true })}
          />
          <Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Icon>
        </PasswordRow>
        {errors.password && <ErrorMsg>Password is required</ErrorMsg>}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Terms>
          <input type="checkbox" {...register("terms", { required: true })} />
          <label>
            I Accept The <Highlight>Terms And Disclaimer</Highlight> Set Forth By Legend Pips.
          </label>
        </Terms>
        {errors.terms && <ErrorMsg>You must accept the terms</ErrorMsg>}

        <ForgetPassword onClick={() => setIsForgotOpen(true)}>Forget The Password?</ForgetPassword>

        <RegisterButton type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </RegisterButton>
        <RegisterButton onClick={onSwitchToRegister} type="button" style={{ marginTop: "0.65rem" }}>
          Register
        </RegisterButton>
      </form>
      <ForgetPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </Container> 
  );
};

export default LoginForm;
