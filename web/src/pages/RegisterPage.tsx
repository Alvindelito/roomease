import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import LargeButton from '../styles/LargeButton';

const RegisterButton = styled(LargeButton)`
  background-color: ${({ theme }) => theme.primary.primary600};
  color: ${({ theme }) => theme.neutral.white};
`;

const RegisterPage = () => {
  return (
    <div>
      <h1>Register Page</h1>

      <RegisterButton>
        <FontAwesomeIcon icon={['fas', 'coffee']} />
        asdf
      </RegisterButton>
    </div>
  );
};

export default RegisterPage;
