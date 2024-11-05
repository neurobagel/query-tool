import { createTheme } from '@mui/material';

const NBTheme = createTheme({
  palette: {
    primary: {
      light: '#F5A89B',
      main: '#D9748D',
      dark: '#A8556F',
      contrastText: '#FFFFFF',
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
