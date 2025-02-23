import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    dnd: {
      colors: {
        default: string;
        muted: string;
        contentBgDark: string;
        positive: string;
        negative: string;
        themeTransparent: string;
      };
      fonts: {
        primary: string;
        display: string;
        scalaSans: string;
        scalaSansSc: string;
        mrsEaves: string;
        tiamat: string;
        tiamatCondensed: string;
      };
    }
  }
  interface ThemeOptions {
    dnd?: {
      colors?: {
        default?: string;
        muted?: string;
        contentBgDark?: string;
        positive?: string;
        negative?: string;
        themeTransparent?: string;
      };
      fonts?: {
        primary?: string;
        display?: string;
        scalaSans?: string;
        scalaSansSc?: string;
        mrsEaves?: string;
        tiamat?: string;
        tiamatCondensed?: string;
      };
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: 'var(--theme-color)',
      light: 'var(--ttui_red-400)',
      dark: 'var(--ttui_red-800)',
    },
    secondary: {
      main: 'var(--character-builder-blue)',
      light: 'var(--ttui_blue-400)',
      dark: 'var(--ttui_blue-800)',
    },
    background: {
      default: 'var(--theme-background)',
      paper: 'var(--character-content-bg-dark)',
    },
    text: {
      primary: 'var(--character-dark-mode-text)',
      secondary: 'var(--character-muted-color)',
    },
    error: {
      main: 'var(--negative-color)',
      dark: 'var(--dark-mode-negative-color)',
    },
    success: {
      main: 'var(--positive-color)',
      dark: 'var(--dark-mode-positive-color)',
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
      default: '#96bf6b',
      muted: '#75838b',
      contentBgDark: '#202b33',
      positive: '#40d250',
      negative: '#d24040',
      themeTransparent: 'rgba(197, 49, 49, 0.6)' // Based on primary.main with 60% opacity
    },
    fonts: {
      primary: 'Roboto, Helvetica, sans-serif',
      display: '"Roboto Condensed", Roboto, Helvetica, sans-serif',
      scalaSans: '"Scala Sans Offc", Roboto, Helvetica, sans-serif',
      scalaSansSc: '"Scala Sans Sc Offc", "Scala Sans Offc", Roboto, Helvetica, sans-serif',
      mrsEaves: 'MrsEavesSmallCaps, Roboto, Helvetica, sans-serif',
      tiamat: '"Tiamat", serif',
      tiamatCondensed: '"Tiamat Condensed SC"'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
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
  },
  zIndex: { 
    modal: 99999 
  }
});

export default theme;
