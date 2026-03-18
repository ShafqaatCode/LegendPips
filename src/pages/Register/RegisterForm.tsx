import { useState } from "react";
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
  RegisterButton
} from "./Register.styles";
import { FaX } from "react-icons/fa6";
import { register as registerUser } from "../../services/authService";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const RegisterForm: React.FC<Props> = ({onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const password = watch("password");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email,
        password: data.password,
        phone: phone || undefined,
      });

      if (response.success) {
        setSuccess("Registration successful! You can now login.");
        // Optionally close modal and show success message
        setTimeout(() => {
          if (onClose) onClose();
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <CloseBtn onClick={onClose} ><FaX size={"16px"}/></CloseBtn>
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
        <Input
          type="text"
          placeholder="First Name"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && <ErrorMsg>First Name is required</ErrorMsg>}

        <Input
          type="text"
          placeholder="Last Name"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && <ErrorMsg>Last Name is required</ErrorMsg>}

        <PhoneRow>
          <PhoneInputStyled
            country={"us"}
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: "100%",
              height: "50px",
              padding: "",
              borderRadius: "8px",
              border: "1px solid #bfbfd4",
              fontSize: "14px",
            }}
            buttonStyle={{
              border: "1px solid #bfbfd4",
              borderRadius: "8px 0 0 8px",
            }}
            dropdownStyle={{ zIndex: 10 }}
          />
        </PhoneRow>

        <Input
          type="email"
          placeholder="Enter Email Address"
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
            I Understand And Accept The{" "}
            <Highlight>Terms And Disclaimer</Highlight> Set Forth By Legend Pips.
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
