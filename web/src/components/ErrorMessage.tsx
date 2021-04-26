import { FC } from 'react';
import styled from 'styled-components';

type ErrorType = {
  error: string | null;
};

const ErrorStyle = styled.div`
  color: ${({ theme }) => theme.negative.negative400};
  border: ${({ theme }) => `2px solid ${theme.negative.negative400}`};
  padding: 8px;
  display: inline-block;

  p {
    font-weight: 500;
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }
`;

const ErrorMessage: FC<ErrorType> = ({ error }) => {
  if (error) {
    return (
      <ErrorStyle>
        <p>* Error: {error}</p>
      </ErrorStyle>
    );
  } else {
    return null;
  }
};

export default ErrorMessage;
