import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { appBasePath, enableAuth, clientID } from './utils/constants';
import './index.css';
import theme from './theme';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: appBasePath,
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
  },
]);

const app = (
  <React.StrictMode>
    {/* CSS injection order for MUI and tailwind: https://mui.com/material-ui/guides/interoperability/#tailwind-css */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  enableAuth ? (
    <Auth0Provider
      domain="neurobagel.ca.auth0.com" // TODO: Replace with customizable domain
      clientId={clientID}
      authorizationParams={{
        redirect_uri: window.location.origin, // TODO: ensure that users end up where they started, including query params
      }}
    >
      {app}
    </Auth0Provider>
  ) : (
    app
  )
);
