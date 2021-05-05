import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
// 1. check localStorage for access token
// 2. ping /token

const isAuthenticated = true;

export default function PrivateRoute({ children, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
