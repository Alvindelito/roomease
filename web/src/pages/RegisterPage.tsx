import { FC } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import {
  FormStyle,
  FloatingLabel,
  Label,
  Input,
  LargeButtonStyle,
  RequiredInput,
} from '../styles/index';
import logo from '../assets/roomease_logo.png';

import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  server?: string;
};

const RegisterButton = styled(LargeButtonStyle)`
  background-color: ${({ theme }) => theme.primary.primary600};
  color: ${({ theme }) => theme.neutral.white};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100vh;
  justify-content: center;
  width: 100%;

  h2 {
    text-align: center;
  }

  p {
    margin: 12px auto;
    text-align: center;
  }
`;

const LogoContainer = styled.div`
  height: 15vh;
`;

const RegisterPage: FC = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
    firstName: Yup.string()
      .max(128, 'Your name is this long?')
      .required('First Name is required'),
    lastName: Yup.string()
      .max(128, 'Your name is this long?')
      .required('Last Name is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>(formOptions);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      const res = await axios.post(
        `${process.env.REACT_APP_API_LINK}/register`,
        data
      );

      console.log(await res.status);

      if (res.status === 200) {
        return history.push('/registersuccess');
      }
    } catch (err) {
      setError('server', {
        type: 'manual',
        message: err.response.data.error,
      });
    }
  });

  return (
    <RegisterContainer>
      <LogoContainer>
        <img src={logo} alt="logo" />
      </LogoContainer>
      <FormStyle method="POST" onSubmit={onSubmit}>
        <h2>Register New Account</h2>
        {errors.server && (
          <RequiredInput>{errors.server?.message}</RequiredInput>
        )}
        <FloatingLabel>
          <Input type="email" {...register('email', { required: true })} />
          <Label htmlFor="email">
            Email
            <RequiredInput>
              * {errors.email && errors.email?.message}
            </RequiredInput>
            &nbsp;
          </Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input
            type="password"
            {...register('password', { required: true })}
          />
          <Label htmlFor="password">
            Password
            <RequiredInput>
              * {errors.password && errors.password?.message}
            </RequiredInput>
          </Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input type="text" {...register('firstName', { required: true })} />
          <Label htmlFor="firstName">
            First Name
            <RequiredInput>
              * {errors.firstName && errors.firstName?.message}
            </RequiredInput>
          </Label>
        </FloatingLabel>
        <FloatingLabel>
          <Input type="text" {...register('lastName', { required: true })} />
          <Label htmlFor="lastName">
            Last Name
            <RequiredInput>
              * {errors.lastName && errors.lastName?.message}
            </RequiredInput>
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
