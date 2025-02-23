import { ThemeProvider } from "@mui/material/styles";
import { createContext } from "react";
import { theme } from '../../theme';

interface CharacterThemeManager {
  themeColor: string;
  backgroundColor: string;
}

export const ThemeManager = createContext<CharacterThemeManager>({
  themeColor: '#C53131',
  backgroundColor: '#12181c'
});

export const ThemeManagerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};