import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { GlobalStyles } from './theme/globalStyles';
import * as themes from './theme/theme.json';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import SignInPage from './pages/SignInPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';

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
            <RegisterPage />
          </Route>
          <Route path="/registersuccess">
            <RegisterSuccessPage />
          </Route>
          <Route path="/signin">
            <SignInPage />
          </Route>
        </ThemeProvider>
      </Switch>
    </Router>
  );
}

export default App;
