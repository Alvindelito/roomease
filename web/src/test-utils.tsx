import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import * as themes from './theme/theme.json';
import { GlobalStyles } from './theme/globalStyles';

const AllTheProviders: FC = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={themes.light}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
