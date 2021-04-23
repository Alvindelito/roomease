import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { FloatingLabel, Label, Input, LargeButtonStyle } from '../styles/index';
import useForm from '../hooks/useForm';

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

  const handleSubmit = () => {
    // do something
  };

  return (
    <div>
      <form method="/" onSubmit={handleSubmit}>
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
