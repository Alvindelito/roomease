import { render, fireEvent } from '../test-utils';
import { screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';

describe('Register Form', () => {
  it('should render the basic fields', () => {
    render(<RegisterPage />);

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

    expect(
      screen.getByRole('button', { name: /SIGN UP/i })
    ).toBeInTheDocument();
  });

  it('should display required errors when value is invalid', async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    fireEvent.input(emailInput, {
      target: {
        value: 'mrkrabs',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(4);
  });
});
