import { render, fireEvent, screen, waitFor } from '../../test-utils';
import { createMemoryHistory } from 'history';

import NavBar from './NavBar';
import { Router } from 'react-router';

describe('NavBar clicking Nav Item', () => {
  it('should direct user to page after clicking nav item', async () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <Router history={history}>
        <NavBar />
      </Router>
    );

    fireEvent.click(screen.getByText(/Home/i));

    expect(pushSpy).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getByText(/Expenses/i));

    expect(pushSpy).toHaveBeenCalledWith('/expenses');

    fireEvent.click(screen.getByText(/Chores/i));

    expect(pushSpy).toHaveBeenCalledWith('/chores');

    fireEvent.click(screen.getByText(/Groceries/i));

    expect(pushSpy).toHaveBeenCalledWith('/groceries');
  });
});
