import React, { useState } from "react";
import { useForm } from "react-hook-form";
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


const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
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

        <Terms>
          <input type="checkbox" {...register("terms", { required: true })} />
          <label>
            I Accept The <Highlight>Terms And Disclaimer</Highlight> Set Forth By Legend Pips.
          </label>
        </Terms>
        {errors.terms && <ErrorMsg>You must accept the terms</ErrorMsg>}

        <ForgetPassword>Forget The Password?</ForgetPassword>

        <RegisterButton type="submit">Login</RegisterButton>
        <RegisterButton type="button" style={{ marginTop: "1rem" }}>
          Register
        </RegisterButton>
      </form>
    </Container>
  );
};

export default LoginForm;
