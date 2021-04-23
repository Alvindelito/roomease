import { FC } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FloatingLabel, Label, Input, LargeButtonStyle } from '../styles/index';
import useForm from '../hooks/useForm';

import logo from '../assets/roomease_logo.png';

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

const RegisterPage: FC = () => {
  const { inputs, handleChange } = useForm(initValues);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
      console.error(err);
    }
  };

  return (
    <div>
      <img src={logo} alt="logo" />
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <FloatingLabel>
          <Input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
          <Label htmlFor="email">Email:</Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
          <Label htmlFor="password">Password:</Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="firstName"
            name="firstName"
            value={inputs.firstName}
            onChange={handleChange}
          />
          <Label htmlFor="firstName">First Name:</Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="lastName"
            name="lastName"
            value={inputs.lastName}
            onChange={handleChange}
          />
          <Label htmlFor="lastName">Last Name:</Label>
        </FloatingLabel>
        <RegisterButton type="submit">REGISTER</RegisterButton>
      </form>
    </div>
  );
};

export default RegisterPage;
