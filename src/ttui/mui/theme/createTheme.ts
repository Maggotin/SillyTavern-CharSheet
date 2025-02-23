import { createTheme, ThemeOptions } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { components } from "./config/components.ts";
import { palette } from "./config/palette.ts";
import { typography } from "./config/typography.ts";

export const createUITheme = (options: ThemeOptions = {}) =>
  createTheme(
    deepmerge(
      {
        components,
        palette,
        typography,
      },
      options,
    ),
  );
