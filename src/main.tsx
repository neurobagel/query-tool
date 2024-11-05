import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { appBasePath, enableAuth, clientID } from './utils/constants';
import './index.css';
import theme from './theme';

const router = createBrowserRouter([
  {
    path: appBasePath,
    element: <App />,
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
  enableAuth ? <GoogleOAuthProvider clientId={clientID}>{app}</GoogleOAuthProvider> : app
);
