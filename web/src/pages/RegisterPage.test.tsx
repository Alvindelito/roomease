import { screen, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import * as themes from '../theme/theme.json';

import RegisterPage from './RegisterPage';
import { GlobalStyles } from '../theme/globalStyles';

describe('Register Form', () => {
  it('should render the basic fields', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={themes.light}>
          <GlobalStyles />
          <RegisterPage />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Register New Account' })
    ).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: /First Name/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: /Last Name/i })
    ).toBeInTheDocument();
  });
});
