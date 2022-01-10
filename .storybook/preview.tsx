import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as Emotion10ThemeProvider } from 'emotion-theming';

import MuiTheme from './MuiTheme';

const withThemeProvider = (Story, context) => {
  return (
    <Emotion10ThemeProvider theme={MuiTheme}>
      <ThemeProvider theme={MuiTheme}>
        {/* Default font settings for components not using MUI5 */}
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              font-size: 15px;      
            }
          `}
        </style>
        <Story {...context} />
      </ThemeProvider>
    </Emotion10ThemeProvider>
  );
};

export const decorators = [withThemeProvider];

export const parameters = {
  backgrounds: {
    default: 'Light',
    values: [
      {
        name: 'Light',
        value: '#fff',
      },
    ],
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
