import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, userSelector, clearState } from '../features/UserSlice';

import {
  FormStyle,
  FloatingLabel,
  Label,
  Input,
  LargeButtonStyle,
  RequiredInput,
  FormButton,
  FormContainer,
  LogoContainer,
} from '../styles/index';
import logo from '../assets/roomease_logo.png';

import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  server?: string;
};

const SignInPage: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(
    userSelector
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>(formOptions);

  const onSubmit = (data: any) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      setError('server', {
        type: 'manual',
        message: errorMessage,
      });
      dispatch(clearState());
    }

    if (isSuccess) {
      dispatch(clearState());
      history.push('/');
    }
  }, [isError, isSuccess, dispatch, errorMessage, history, setError]);

  return (
    <FormContainer>
      <LogoContainer>
        <img src={logo} alt="logo" />
      </LogoContainer>
      <FormStyle method="POST" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>
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

        <p>
          Don't have an account? <Link to="/register">Sign Up Here</Link>
        </p>
        <FormButton disabled={isFetching} type="submit">
          {isFetching ? 'LOADING' : 'SIGN IN'}
        </FormButton>
      </FormStyle>
    </FormContainer>
  );
};

export default SignInPage;
