import { FC } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  FormStyle,
  FloatingLabel,
  Label,
  Input,
  LargeButtonStyle,
  RequiredInput,
} from '../styles/index';
import useForm from '../hooks/useForm';
import ErrorMessage from '../components/ErrorMessage';
import logo from '../assets/roomease_logo.png';
import { Link } from 'react-router-dom';

type RegisterInputType = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

const initValues: RegisterInputType = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
};

const RegisterButton = styled(LargeButtonStyle)`
  background-color: ${({ theme }) => theme.primary.primary600};
  color: ${({ theme }) => theme.neutral.white};
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
`;

const LogoContainer = styled.div`
  height: 15vh;
`;

const RegisterPage: FC = () => {
  const { inputs, handleChange } = useForm(initValues);

  let error = null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (inputs)
      // TODO: check if any of the values of inputs are empty. if so, make error equal error message

      try {
        const submitData = await axios.post(
          `${process.env.REACT_APP_API_LINK}/register`,
          {
            email: inputs.email,
            plainPassword: inputs.password,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
          }
        );
      } catch (err) {
        error = err.toString();
        console.error(err);
      }
  };

  return (
    <RegisterContainer>
      <LogoContainer>
        <img src={logo} alt="logo" />
      </LogoContainer>
      <FormStyle onSubmit={handleSubmit}>
        <h2>Register</h2>
        <ErrorMessage error={error} />
        <FloatingLabel>
          <Input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
          <Label htmlFor="email">
            <RequiredInput>*</RequiredInput>
            Email:
          </Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
          <Label htmlFor="password">
            <RequiredInput>*</RequiredInput>
            Password:
          </Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="firstName"
            name="firstName"
            value={inputs.firstName}
            onChange={handleChange}
          />
          <Label htmlFor="firstName">
            <RequiredInput>*</RequiredInput>
            First Name:
          </Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="lastName"
            name="lastName"
            value={inputs.lastName}
            onChange={handleChange}
          />
          <Label htmlFor="lastName">
            <RequiredInput>*</RequiredInput>
            Last Name:
          </Label>
        </FloatingLabel>
        <p>
          Already have an account? <Link to="/signin">Sign In Here</Link>
        </p>
        <RegisterButton type="submit">SIGN UP</RegisterButton>
      </FormStyle>
    </RegisterContainer>
  );
};

export default RegisterPage;
