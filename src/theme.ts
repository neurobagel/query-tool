import { createTheme } from '@mui/material';

const NBTheme = createTheme({
  palette: {
    primary: {
      light: '#ed937b',
      main: '#e17e93',
      dark: '#df799a',
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: { textTransform: 'none' },
      },
    },
  },
});

export default NBTheme;
