import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './theme/globalStyles';
import * as themes from './theme/theme.json';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ThemeProvider theme={themes.light}>
      <GlobalStyles />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
