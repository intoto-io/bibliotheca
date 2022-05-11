import { ThemeProvider as MUIThemeProvider } from '@mui/system';
import { ThemeProvider as Emotion10ThemeProvider } from '@emotion/react';

import MuiTheme from './MuiTheme';

const withThemeProvider = (Story, context) => {
  return (
    <Emotion10ThemeProvider theme={MuiTheme}>
      <MUIThemeProvider theme={MuiTheme}>
        {/* Default font settings for components not using MUI5 */}
        <style>
          {`
            body {
              font-family: ${MuiTheme.typography.fontFamily};
              font-size: ${MuiTheme.typography.fontSize}px;      
            }
          `}
        </style>
        <Story {...context} />
      </MUIThemeProvider>
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
