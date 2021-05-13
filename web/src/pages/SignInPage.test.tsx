import { render, fireEvent } from '../test-utils';
import { screen, waitFor } from '@testing-library/react';
import store from '../app/store';
import { Provider } from 'react-redux';

import SignInPage from './SignInPage';

describe('Sign In Form Validation', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <SignInPage />
      </Provider>
    );

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
  });

  it('should render all form fields', () => {
    expect(
      screen.getByRole('heading', { name: /Sign In/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should display all client-side errors when submitted with empty inputs', async () => {
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

    fireEvent.submit(screen.getByRole('button', { name: /SIGN IN/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(2);
  });

  it('should display error for incomplete email field', async () => {
    fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
      target: {
        value: 'mrkrabs',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /SIGN IN/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});
