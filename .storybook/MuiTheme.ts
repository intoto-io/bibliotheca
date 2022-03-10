import { createTheme } from '@mui/material/styles';

const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

const T = createTheme({
  palette: {
    primary: {
      main: '#06f',
      light: '#6b93ff',
      dark: '#003dcb',
    },
    secondary: {
      main: '#ffa726',
      light: '#ffd95b',
      dark: '#c77800',
    },
    grey: {
      50: '#eef6f8',
    },
  },
  typography: {
    fontFamily: font,
    fontSize: 15,
    subtitle1: {
      fontSize: '1.6em',
      fontWeight: 'bold',
    },
    subtitle2: {
      fontSize: '1.15em',
      fontWeight: 'bold',
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        regular: {
          height: '64px',
          minHeight: '64px',
          '@media (min-width: 600px)': {
            minHeight: '64px',
          },
        },
      },
    },
  },
});

export default T;
