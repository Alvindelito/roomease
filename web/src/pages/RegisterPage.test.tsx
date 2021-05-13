import { render, fireEvent, screen, waitFor } from '../test-utils';
import RegisterPage from './RegisterPage';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const RES = {
  _id: '609c03bbffe5765bbedc9981',
  email: 'mrkrabs@mrkrabs.com',
  password: 'password',
  firstName: 'Eugene',
  lastName: 'Krabs',
  householdId: '',
  isHouseholdOwner: false,
  __v: 0,
};

const mockRegister = jest.fn((data) => {
  return Promise.resolve({ RES });
});

describe('Register Form Validation', () => {
  beforeEach(() => {
    render(<RegisterPage registerCall={mockRegister} />);

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

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should render all form fields', () => {
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

  it('should successfully call axios', async () => {
    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));

    const DATA = {
      email: 'mrkrabs@mrkrabs.com',
      password: 'password',
      firstName: 'Eugene',
      lastName: 'Krabs',
    };

    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(mockRegister).toBeCalledWith(DATA);
  });
});

describe('Register Page Redirects', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  it('should redirect to success page on successful submit', async () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <Router history={history}>
        <RegisterPage registerCall={mockRegister} />
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

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));

    let DATA = {
      email: 'mrkrabs@mrkrabs.com',
      password: 'password',
      firstName: 'Eugene',
      lastName: 'Krabs',
    };

    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(mockRegister).toBeCalledWith(DATA);

    expect(pushSpy).toHaveBeenCalledWith('/registersuccess');
  });

  it('should redirect to sign in page when clicking link to sign in', async () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <Router history={history}>
        <RegisterPage registerCall={mockRegister} />
      </Router>
    );

    fireEvent.click(screen.getByText(/Sign In Here/i));
    expect(pushSpy).toHaveBeenCalledWith('/signin');
  });
});

describe('Register Form Error', () => {
  it('should display error when promise rejects', async () => {
    const mockRegisterError = jest.fn().mockRejectedValue({
      response: {
        data: {
          error: 'server validation error',
        },
      },
    });
    render(<RegisterPage registerCall={mockRegisterError} />);

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

    fireEvent.submit(screen.getByRole('button', { name: /SIGN UP/i }));
    await waitFor(() => expect(mockRegisterError).toBeCalled());
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(1));
  });
});
