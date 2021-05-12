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

          <PrivateRoute exact path="/protected">
            <Protected />
          </PrivateRoute>
        </ThemeProvider>
      </Switch>
    </Router>
  );
}

export default App;
