import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html, body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Quicksand', 'Roboto', sans-serif;
    margin: 0 8px;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5 {
    margin: 0
  }

  a {
    color: ${({ theme }) => theme.primary.primary600};
    cursor: pointer;
  }

  button.btn {
    background-color: ${({ theme }) => theme.primary.primary600};
    color: ${({ theme }) => theme.neutral.white};
  }

  button {
    border: 0,
    display: inline-block;
    cursor: pointer;
    background-color: ${({ theme }) => theme.primary.primary600};
    color: ${({ theme }) => theme.text};
    border-radius: 50px;
    font-size: 14px;
    padding: 12px 24px;
    border: none;
  }
`;
