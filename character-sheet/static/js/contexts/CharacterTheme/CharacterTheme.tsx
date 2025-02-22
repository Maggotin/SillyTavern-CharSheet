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
  isDefault: boolean;
  themeColor: string;
  backgroundColor: string;
  isDarkMode: boolean;
}

const CharacterThemeContext = createContext<CharacterThemeContextType>({
  isDefault: true,
  themeColor: '#C53131',
  backgroundColor: '#12181c',
  isDarkMode: true,
});

export const useCharacterTheme = () => useContext(CharacterThemeContext);

export const CharacterThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We'll connect this to Redux later
  const theme = {
    isDefault: true,
    themeColor: '#C53131',
    backgroundColor: '#12181c',
    isDarkMode: true,
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
            --theme-color: ${theme.themeColor};
            --theme-background: ${theme.backgroundColor};
            --theme-background-solid: ${solidBackground};
            --theme-contrast: ${theme.isDarkMode ? 'var(--ttui_grey-50)' : 'var(--ttui_grey-900)'};
            --theme-transparent: color-mix(in srgb, var(--theme-color), transparent 60%);
            --character-muted-color: ${theme.isDarkMode ? 'var(--ttui_grey-400)' : 'var(--ttui_grey-500)'};
            
      
            --font-family: Roboto, Helvetica, sans-serif;
            --font-condensed: "Roboto Condensed", Roboto, Helvetica, sans-serif;
            
           
            --ttui_font-tiamat: "Tiamat", serif;
            --ttui_font-tiamat-condensed: "Tiamat Condensed SC";
            --ttui_font-roboto: Roboto, Helvetica, sans-serif;
          
            --font-scala-sans-offc: "Scala Sans Offc", var(--font-family);
            --font-scala-sans-sc-offc: "Scala Sans Sc Offc", var(--font-scala-sans-offc);
            --font-mrs-eaves-small-caps: MrsEavesSmallCaps, var(--font-family);
          }
        `}
      />
      {children}
    </CharacterThemeContext.Provider>
  );
};