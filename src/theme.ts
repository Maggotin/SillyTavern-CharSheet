import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    dnd: {
      colors: {
        default: string;
        muted: string;
        darkModeText: string;
        contentBgDark: string;
        positive: string;
        darkModePositive: string;
        negative: string;
        darkModeNegative: string;
      };
    }
  }
  interface ThemeOptions {
    dnd?: {
      colors?: {
        default?: string;
        muted?: string;
        darkModeText?: string;
        contentBgDark?: string;
        positive?: string;
        darkModePositive?: string;
        negative?: string;
        darkModeNegative?: string;
      };
    }
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C53131', // --theme-color from CSS
      light: '#fe4736', // --ttui_red-400
      dark: '#7d160f',  // --ttui_red-800
    },
    secondary: {
      main: '#1c74c6', // --ttui_blue-500
      light: '#4b8ed7', // --ttui_blue-400
      dark: '#004073', // --ttui_blue-800
    },
    background: {
      default: '#12181c', // --ttui_grey-900
      paper: '#232b2f', // --ttui_grey-800
    },
    text: {
      primary: '#f8eb56', // --character-dark-mode-text
      secondary: '#75838b', // --character-muted-color
    },
    error: {
      main: '#d24040', // --negative-color
      dark: '#c53131', // --dark-mode-negative-color
    },
    success: {
      main: '#40d250', // --positive-color
      dark: '#00c797', // --dark-mode-positive-color
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica',
      'sans-serif'
    ].join(','),
    // Adding D&D Beyond specific fonts
    h1: {
      fontFamily: '"Roboto Condensed", Roboto, Helvetica, sans-serif'
    },
    h2: {
      fontFamily: '"Roboto Condensed", Roboto, Helvetica, sans-serif'
    }
  },
  dnd: {
    colors: {
      default: '#96bf6b', // --character-default-color
      muted: '#75838b', // --character-muted-color
      darkModeText: '#f8eb56', // --character-dark-mode-text
      contentBgDark: '#202b33', // --character-content-bg-dark
      positive: '#40d250', // --positive-color
      darkModePositive: '#00c797', // --dark-mode-positive-color
      negative: '#d24040', // --negative-color
      darkModeNegative: '#c53131' // --dark-mode-negative-color
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*': {
            boxSizing: 'border-box',
            WebkitTapHighlightColor: 'transparent',
            outline: 0
          }
        }
      }
    }
  }
});

export default theme;
