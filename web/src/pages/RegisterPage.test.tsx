import { render, fireEvent } from '../test-utils';
import { screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';

describe('Register Form', () => {
  beforeEach(() => {
    render(<RegisterPage />);

    fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
      target: {
        value: 'mrkrabs@mrkrabs.com',
      },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: 'password',
      },
    });

    fireEvent.input(screen.getByRole('textbox', { name: /First Name/i }), {
      target: {
        value: 'Eugene',
      },
    });

    fireEvent.input(screen.getByRole('textbox', { name: /Last Name/i }), {
      target: {
        value: 'Krabs',
      },
    });
  });

  it('should render the basic fields', () => {
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

  it('should display error messages for all inputs when value is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
      target: {
        value: '',
      },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: '',
      },
    });

    fireEvent.input(screen.getByRole('textbox', { name: /First Name/i }), {
      target: {
        value: '',
      },
    });

    fireEvent.input(screen.getByRole('textbox', { name: /Last Name/i }), {
      target: {
        value: '',
      },
    });
    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(4);
  });

  it('should display error for empty or incomplete email field', async () => {
    fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
      target: {
        value: '',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);

    fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
      target: {
        value: 'mrkrabs',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });

  it('should display error for empty or less than 6 characters for password field', async () => {
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: '',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: {
        value: '12345',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });

  it('should display error for empty first name and last name fields', async () => {
    fireEvent.input(screen.getByRole('textbox', { name: /First Name/i }), {
      target: {
        value: '',
      },
    });

    fireEvent.input(screen.getByRole('textbox', { name: /Last Name/i }), {
      target: {
        value: '',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(2);
  });
});
