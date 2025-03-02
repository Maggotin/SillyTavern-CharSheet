import { ThemeOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypeBackground {
    pane?: string;
  }
  
  interface Palette {
    rarity: {
      uncommon: string;
      rare: string;
      veryRare: string;
      legendary: string;
      artifact: string;
      contrastText: string;
    }
    reference: Record<string, string>;
    message: Record<string, string>;
  }
  
  interface PaletteOptions {
    rarity?: Partial<Palette['rarity']>;
    reference?: Record<string, string>;
    message?: Record<string, string>;
  }
}

export const palette: ThemeOptions["palette"] = {
  mode: "dark",
  text: {
    primary: "#ecedeeff",
    secondary: "#ecedeea3",
    disabled: "#ecedee5c",
  },
  primary: {
    main: "#dcdfe1ff",
    dark: "#75838bff",
    light: "#f9fafaff",
    contrastText: "#000000ff",
  },
  secondary: {
    main: "#00daa6ff",
    dark: "#00b674ff",
    light: "#b3efd9ff",
    contrastText: "#000000ff",
  },
  action: {
    active: "#dcdfe1a3",
    hover: "#dcdfe11f",
    selected: "#dcdfe12e",
    disabled: "#dcdfe166",
    disabledBackground: "#dcdfe133",
    focus: "#dcdfe133",
  },
  error: {
    main: "#ed6c02ff",
    dark: "#c77700ff",
    light: "#ffb547ff",
    contrastText: "#ffffffff",
  },
  warning: {
    main: "#ed6c02ff",
    dark: "#c77700ff",
    light: "#ffb547ff",
    contrastText: "#ffffffff",
  },
  info: {
    main: "#2196f3ff",
    dark: "#0b79d0ff",
    light: "#64b6f7ff",
    contrastText: "#ffffffff",
  },
  success: {
    main: "#4caf50ff",
    dark: "#3b873eff",
    light: "#7bc67eff",
    contrastText: "#ffffffff",
  },
  background: {
    paper: "#12181cff",
    default: "#232b2fff",
    pane: "#12181cdb",
  },
  common: { white: "#ffffffff", black: "#000000ff" },
  grey: {
    "50": "#f4f5f5ff",
    "100": "#ecedeeff",
    "200": "#dcdfe1ff",
    "300": "#c4cbceff",
    "400": "#a2acb2ff",
    "500": "#75838bff",
    "600": "#525c63ff",
    "700": "#374045ff",
    "800": "#232b2fff",
    "900": "#12181cff",
  },
  rarity: {
    uncommon: "#7ebe15ff",
    rare: "#41a9f2ff",
    veryRare: "#c364e7ff",
    legendary: "#ffb62aff",
    artifact: "#f77558ff",
    contrastText: "#000000ff",
  },
  reference: {
    magicItem: "#41a9f2ff",
    monster: "#f77558ff",
    skill: "#7ebe15ff",
    spell: "#c364e7ff",
    contrastText: "#000000ff",
  },
  message: {
    check: "#c364e7ff",
    custom: "#ecedeea3",
    damage: "#f77558ff",
    healSave: "#7ebe15ff",
    initiative: "#ffb62aff",
    toHit: "#41a9f2ff",
  },
};
