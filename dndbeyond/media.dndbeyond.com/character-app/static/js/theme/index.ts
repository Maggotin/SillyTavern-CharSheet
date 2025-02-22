import {
  createLightTheme,
  createDarkTheme,
} from "@dndbeyond/ttui/mui/theme/createTheme";

type PaletteOpt = "light" | "dark";

export const getTheme = (lightOrDark: PaletteOpt = "light", primary?) => {
  const primaryOverride = primary ? { primary: { main: primary } } : null;
  const themeOverrides = {
    palette: primaryOverride ?? {},
    zIndex: { modal: 99999 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  };

  if (lightOrDark === "light") {
    return createLightTheme(themeOverrides);
  } else {
    return createDarkTheme(themeOverrides);
  }
};
