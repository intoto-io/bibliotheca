import { ThemeProvider } from '@mui/material/styles';

import MuiTheme from './MuiTheme';

const withThemeProvider = (Story, context) => {
  return (
    <ThemeProvider theme={MuiTheme}>
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
