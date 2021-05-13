import { render, fireEvent, screen, waitFor } from '../test-utils';
import axios from 'axios';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import store from '../app/store';

import SignInPage from './SignInPage';
import { Router } from 'react-router';

jest.mock('axios');

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

  it('should display no errors when input fields meet requirements', async () => {
    fireEvent.submit(screen.getByRole('button', { name: /SIGN IN/i }));
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
  });
});

describe('Sign In Server Validation', () => {
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

  it('should display error after server validation fails', async () => {
    const ERR_RESPONSE = {
      response: {
        status: 403,
        data: {
          error: 'Error: Email or Password are poopoo',
        },
      },
    };

    ((axios.post as unknown) as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(ERR_RESPONSE)
    );

    fireEvent.submit(screen.getByRole('button', { name: /SIGN IN/i }));

    const DATA = {
      email: 'mrkrabs@mrkrabs.com',
      password: 'password',
    };

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:4000/login`,
        DATA,
        { withCredentials: true }
      )
    );
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(1));
  });
});

describe('Sign In Page Redirects', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should redirect to Home Page on successful login', async () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <Router history={history}>
        <Provider store={store}>
          <SignInPage />
        </Provider>
      </Router>
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

    const DATA = {
      email: 'mrkrabs@mrkrabs.com',
      password: 'password',
    };

    const RESPONSE = {
      status: 200,
      data: {
        email: 'mrkrabs@mrkrabs.com',
        password: 'password',
      },
    };

    ((axios.post as unknown) as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(RESPONSE)
    );

    fireEvent.submit(screen.getByRole('button', { name: /SIGN IN/i }));
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:4000/login`,
        DATA,
        { withCredentials: true }
      )
    );
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    await waitFor(() => expect(pushSpy).toHaveBeenCalledWith('/'));
  });

  it('should redirect to register page when clicking link', async () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <Router history={history}>
        <Provider store={store}>
          <SignInPage />
        </Provider>
      </Router>
    );

    fireEvent.click(screen.getByText(/Sign Up Here/i));

    expect(pushSpy).toHaveBeenCalledWith('/register');
  });
});
