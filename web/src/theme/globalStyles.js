import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  a {
    color: ${({ theme }) => theme.primary.primary600};
    cursor: pointer;
  }

  button.btn {
    background-color: ${({ theme }) => theme.primary.primary600};
    color: ${({ theme }) => theme.text};
  }

  button {
    border: 0,
    display: inline-block;
    cursor: pointer;
    background-color: ${({ theme }) => theme.primary.primary600};
    color: ${({ theme }) => theme.text};
    border-radius: 4px;
    font-size: 14px;
    padding: 12px 24px;
  }
`;
