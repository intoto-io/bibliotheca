import { createTheme, Theme } from '@mui/material/styles';
import { amber } from '@mui/material/colors';

const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

const T = createTheme({
  palette: {
    primary: { main: '#06f' },
    secondary: amber,
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
