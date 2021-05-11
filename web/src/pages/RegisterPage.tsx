import { FC } from 'react';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
  FormStyle,
  FloatingLabel,
  Label,
  Input,
  RequiredInput,
  ErrorMessage,
  FormButton,
  FormContainer,
  LogoContainer,
} from '../styles/index';
import logo from '../assets/roomease_logo.png';

type FormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  server?: string;
};

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
      const res = await axios.post(`http://localhost:3009/register`, data);

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
    <FormContainer>
      <LogoContainer>
        <img src={logo} alt="logo" />
      </LogoContainer>
      <FormStyle method="POST" onSubmit={onSubmit}>
        <h2>Register New Account</h2>
        {errors.server && <ErrorMessage>{errors.server?.message}</ErrorMessage>}

        <FloatingLabel>
          <Input
            type="email"
            id="email"
            {...register('email', { required: true })}
          />
          <Label htmlFor="email">
            Email
            <RequiredInput>*</RequiredInput>
            &nbsp;
            <ErrorMessage role="alert">
              {errors.email && errors.email?.message}
            </ErrorMessage>
          </Label>
        </FloatingLabel>

        <FloatingLabel>
          <Input
            type="password"
            id="password"
            {...register('password', { required: true })}
          />
          <Label htmlFor="password">
            Password
            <RequiredInput>*</RequiredInput>
            &nbsp;
            <ErrorMessage role="alert">
              {errors.password && errors.password?.message}
            </ErrorMessage>
          </Label>
        </FloatingLabel>

        <FloatingLabel>
          <Input
            type="text"
            id="firstName"
            {...register('firstName', { required: true })}
          />
          <Label htmlFor="firstName">
            First Name
            <RequiredInput>*</RequiredInput>
            &nbsp;
            <ErrorMessage role="alert">
              {errors.firstName && errors.firstName?.message}
            </ErrorMessage>
          </Label>
        </FloatingLabel>

        <FloatingLabel>
          <Input
            type="text"
            id="lastName"
            {...register('lastName', { required: true })}
          />
          <Label htmlFor="lastName">
            Last Name
            <RequiredInput>*</RequiredInput>
            &nbsp;
            <ErrorMessage role="alert">
              {errors.lastName && errors.lastName?.message}
            </ErrorMessage>
          </Label>
        </FloatingLabel>

        <p>
          Already have an account? <Link to="/signin">Sign In Here</Link>
        </p>

        <FormButton type="submit">SIGN UP</FormButton>
      </FormStyle>
    </FormContainer>
  );
};

export default RegisterPage;
