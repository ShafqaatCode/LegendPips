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

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const openForget = () => {

  <ForgetPasswordModal isOpen={true} onClose={() => {}} />;
}


const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await login(data.email, data.password);

      if (response.success) {
        // Wait a moment for state to update, then check role and redirect
        setTimeout(() => {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData.role === 'admin') {
            navigate('/admin-panel');
          } else {
            navigate('/user-panel');
          }
          // Reload to ensure all state is fresh
          window.location.reload();
        }, 200);
      } else {
        setError(response.message || "Invalid email or password. Try: user@example.com / password123");
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

      {/* Dummy Login Helper */}
      <div style={{
        background: '#f0f7ff',
        border: '1px solid #Fbbf24',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        color: '#132E58'
      }}>
        <strong>Demo Credentials:</strong>
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <strong>Regular User:</strong>
            <div style={{ marginLeft: '0.5rem' }}>Email: <strong>user@example.com</strong> | Password: <strong>password123</strong></div>
          </div>
          <div>
            <strong>Admin User:</strong>
            <div style={{ marginLeft: '0.5rem' }}>Email: <strong>admin@example.com</strong> | Password: <strong>admin123</strong></div>
          </div>
        </div>
      </div>

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

        <ForgetPassword onClick={openForget}>Forget The Password?</ForgetPassword>

        <RegisterButton type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </RegisterButton>
        <RegisterButton onClick={onSwitchToRegister} type="button" style={{ marginTop: "1rem" }}>
          Register
        </RegisterButton>
      </form>
    </Container> 
  );
};

export default LoginForm;
