import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import SnackStackProvider from './components/SnackStackProvider';
import App from './App';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* CSS injection order for MUI and tailwind: https://mui.com/material-ui/guides/interoperability/#tailwind-css */}
    <StyledEngineProvider injectFirst>
      <SnackStackProvider>
        <RouterProvider router={router} />
      </SnackStackProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
