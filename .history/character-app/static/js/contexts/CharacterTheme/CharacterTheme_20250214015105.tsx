import { useContext, useEffect } from "react";
import { createContext } from "react";
import { useSelector } from "react-redux";

import {
  rulesEngineSelectors,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine";

export let CharacterThemeContext = createContext<CharacterTheme>({
  isDefault: false,
  themeColorId: 0,
  name: "",
  themeColor: "",
  backgroundColor: "",
  isDarkMode: false,
});

export const CharacterThemeProvider = ({ children }) => {
  const {
    isDefault,
    themeColorId,
    name,
    themeColor,
    backgroundColor,
    isDarkMode,
  } = useSelector(rulesEngineSelectors.getCharacterTheme);

  const solidBackground =
    backgroundColor.length > 7 ? backgroundColor.slice(0, -2) : backgroundColor;

  const isThemeColorDark = () => {
    // Remove #
    const c = themeColor.substring(1);
    // convert rrggbb to decimal
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    // Get luma from rgb colors
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 40;
  };

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <CharacterThemeContext.Provider
      value={{
        isDefault,
        themeColorId,
        name,
        themeColor,
        backgroundColor,
        isDarkMode,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --theme-color: ${themeColor};
            --theme-background: ${backgroundColor};
            --theme-background-solid: ${solidBackground};
            --theme-contrast: var(--ttui_grey-${isDarkMode ? 50 : 900});

            --theme-transparent: color-mix(in srgb, var(--theme-color), transparent 60%);
            
            /* Update the character muted color for readability on dark mode */
            ${
              isDarkMode ? "--character-muted-color: var(--ttui_grey-400);" : ""
            }
          }`,
        }}
      />
      {children}
    </CharacterThemeContext.Provider>
  );
};

export const useCharacterTheme = () => {
  return useContext(CharacterThemeContext);
};
