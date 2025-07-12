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
  VerifyRow,
  Retake,
  PasswordRow,
  Icon,
  Terms,
  Highlight,
  RegisterButton
} from "./Register.styles";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: any) => {
    console.log({ ...data, phone });
  };

  return (
    <Container>
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
          placeholder="Full Name"
          {...register("fullName", { required: true })}
        />
        {errors.fullName && <ErrorMsg>Full Name is required</ErrorMsg>}

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

        <VerifyRow>
          <Input
            type="text"
            placeholder="Verification Code"
            {...register("verification", { required: true })}
          />
          <Retake type="button">Retake</Retake>
        </VerifyRow>
        {errors.verification && <ErrorMsg>Verification code is required</ErrorMsg>}

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

        <Terms>
          <input type="checkbox" {...register("terms", { required: true })} />
          <label>
            I Understand And Accept The{" "}
            <Highlight>Terms And Disclaimer</Highlight> Set Forth By Legend Pips.
          </label>
        </Terms>
        {errors.terms && <ErrorMsg>You must accept the terms</ErrorMsg>}

        <RegisterButton type="submit">Register</RegisterButton>
      </form>
    </Container>
  );
};

export default RegisterForm;
