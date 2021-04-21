import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './theme/globalStyles';
import * as themes from './theme/theme.json';

function App() {
  return (
    <ThemeProvider theme={themes.light}>
      <GlobalStyles />
      <div>
        waddup
        <button className="btn">yes</button>
        <a>hello</a>
      </div>
    </ThemeProvider>
  );
}

export default App;
