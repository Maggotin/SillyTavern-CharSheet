import React, { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Global } from '@emotion/react';

const fontFaces = `
  @font-face {
    font-family: 'Scala Sans Offc';
    src: url('https://maggotin.github.io/hosted-assets/fonts/ScalaSansOffc.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Scala Sans Sc Offc';
    src: url('https://maggotin.github.io/hosted-assets/fonts/ScalaSansScOffc.ttf') format('truetype');
  }
  @font-face {
    font-family: 'MrsEavesSmallCaps';
    src: url('https://maggotin.github.io/hosted-assets/fonts/MrsEavesSmallCaps.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Tiamat';
    src: url('https://maggotin.github.io/hosted-assets/fonts/Tiamat.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Tiamat Condensed SC';
    src: url('https://maggotin.github.io/hosted-assets/fonts/TiamatCondensedSC.ttf') format('truetype');
  }
`;

interface CharacterThemeContextType {
  themeColor: string;
  backgroundColor: string;
  fontFamily: string;
  accentColor?: string;
}

const CharacterThemeContext = createContext<CharacterThemeContextType>({
  themeColor: '#C53131',
  backgroundColor: '#12181c',
  fontFamily: 'Roboto, Helvetica, sans-serif',
  accentColor: '#fe4736'
});

export const useCharacterTheme = () => useContext(CharacterThemeContext);

export const CharacterThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = {
    themeColor: '#C53131',
    backgroundColor: '#12181c',
    fontFamily: 'Roboto, Helvetica, sans-serif',
    accentColor: '#fe4736'
  };

  const solidBackground = theme.backgroundColor.length > 7 
    ? theme.backgroundColor.slice(0, -2) 
    : theme.backgroundColor;

  return (
    <CharacterThemeContext.Provider value={theme}>
      <Global
        styles={`
          ${fontFaces}
          :root {
            /* Theme Colors */
            --theme-color: ${theme.themeColor};
            --theme-background: ${theme.backgroundColor};
            --theme-background-solid: ${solidBackground};
            --theme-transparent: color-mix(in srgb, var(--theme-color), transparent 60%);
            
            /* Character Colors */
            --character-default-color: #96bf6b;
            --character-builder-blue: #1c9aef;
            --character-muted-color: var(--ttui_grey-500);
            --character-content-bg-dark: #202b33;
            
            /* Fonts */
            --font-family: ${theme.fontFamily};
            --font-condensed: "Roboto Condensed", var(--font-family);
            --font-scala-sans-offc: "Scala Sans Offc", var(--font-family);
            --font-scala-sans-sc-offc: "Scala Sans Sc Offc", var(--font-scala-sans-offc);
            --font-mrs-eaves-small-caps: MrsEavesSmallCaps, var(--font-family);
            --ttui_font-tiamat: "Tiamat", serif;
            --ttui_font-tiamat-condensed: "Tiamat Condensed SC";
          }
        `}
      />
      {children}
    </CharacterThemeContext.Provider>
  );
};