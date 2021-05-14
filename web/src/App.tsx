import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import PrivateRoute from './helpers/PrivateRoute';
import { GlobalStyles } from './theme/globalStyles';
import * as themes from './theme/theme.json';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import SignInPage from './pages/SignInPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import Protected from './pages/Protected';
import { registerCall } from './helpers/registerCall';
import NavBar from './components/navigation/NavBar';
import ExpensesPage from './pages/expenses/ExpensesPage';
import ChoresPage from './pages/chores/ChoresPage';
import GroceriesPage from './pages/groceries/GroceriesPage';

library.add(fas);

function App() {
  return (
    <Router>
      <Switch>
        <ThemeProvider theme={themes.light}>
          <GlobalStyles />
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/register">
            <RegisterPage registerCall={registerCall} />
          </Route>
          <Route path="/registersuccess">
            <RegisterSuccessPage />
          </Route>
          <Route path="/signin">
            <SignInPage />
          </Route>
          <Route path="/expenses">
            <ExpensesPage />
          </Route>
          <Route path="/chores">
            <ChoresPage />
          </Route>
          <Route path="/groceries">
            <GroceriesPage />
          </Route>

          <PrivateRoute exact path="/protected">
            <Protected />
          </PrivateRoute>
          <NavBar />
        </ThemeProvider>
      </Switch>
    </Router>
  );
}

export default App;
