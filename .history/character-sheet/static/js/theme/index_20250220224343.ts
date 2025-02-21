// src/theme/index.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// You can refer to CSS variables defined in public/style.css in your theme
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: { main: 'var(--theme-color)' },
        background: {
            default: 'var(--theme-background)',
            paper: 'var(--theme-background-solid)'
        },
        text: { primary: 'var(--theme-contrast)' }
    },
    typography: {
        fontFamily: [
            'Roboto Condensed',
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' }
            }
        }
    },
    zIndex: { modal: 99999 }
};

const theme = createTheme(themeOptions);
export default theme;