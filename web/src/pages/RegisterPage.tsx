import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import LargeButton from '../styles/LargeButton';
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

const RegisterButton = styled(LargeButton)`
  background-color: ${({ theme }) => theme.primary.primary600};
  color: ${({ theme }) => theme.neutral.white};
`;

const RegisterPage = () => {
  const { inputs, handleChange } = useForm(initValues);

  const handleSubmit = () => {
    // do something
  };

  return (
    <div>
      <h1>Register Page</h1>

      <form method="/" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="email"
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            placeholder="password"
          />
        </label>
        <label htmlFor="firstName">
          First Name:
          <input
            type="firstName"
            name="firstName"
            value={inputs.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
        </label>
        <label htmlFor="lastName">
          Last Name:
          <input
            type="lastName"
            name="lastName"
            value={inputs.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </label>
        <RegisterButton type="submit">
          <FontAwesomeIcon icon={['fas', 'coffee']} />
          Register
        </RegisterButton>
      </form>
    </div>
  );
};

export default RegisterPage;
