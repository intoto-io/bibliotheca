import { createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

const MuiTheme = createMuiTheme({
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
  overrides: {
    MuiToolbar: {
      regular: {
        height: '64px',
        minHeight: '64px',
        '@media (min-width: 600px)': {
          minHeight: '64px',
        },
      },
    },
  },
  props: {
    MuiTypography: {
      variantMapping: {
        subtitle1: 'h2',
      },
    },
  },
});

export default MuiTheme;
