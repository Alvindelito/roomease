import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const RegisterSuccessContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  text-align: center;
  p,
  a {
    margin: 8px 0;
  }

  svg {
    font-size: 64px;
    color: ${({ theme }) => theme.positive.positive600};
  }
`;

const RegisterSuccessPage = () => {
  const history = useHistory();
  const [countdown, setCountdown] = useState(3);

  useEffect((): any => {
    if (!countdown) {
      return history.push('/signin');
    }

    const intervalId = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown, history]);

  return (
    <RegisterSuccessContainer>
      <FontAwesomeIcon icon={['fas', 'check']} size="lg" />
      <p>Your new account has been made!</p>
      <p>You'll be redirected to the sign in page in a moment </p>
      <Link to="/signin">click here to sign in now</Link>
      <h2>{countdown}</h2>
    </RegisterSuccessContainer>
  );
};

export default RegisterSuccessPage;
