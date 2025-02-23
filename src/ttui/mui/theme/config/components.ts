import { ThemeOptions } from "@mui/material";

export const components: ThemeOptions["components"] = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        minWidth: 320,
        "&.MuiPaper-rounded": {
          borderRadius: "8px",
        },
        "&.MuiPaper-outlined": {
          borderColor: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiGrid: {
    styleOverrides: {
      root: {
        /**
         * n.b. this is a workaround for bad types on the DialogTitle component,
         * what I really want there is a Grid, but I don't want to enforce these
         * styles on any other Grid components that might be passed in, so I add
         * the className "DdbDialogTitle-root" to target this specific component
         */
        "&.DdbDialogTitle-root": {
          padding: "16px 20px 8px",
          "& .MuiIconButton-root": {
            padding: "4px",
            marginRight: "-8px",
          },
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: "none",
        "&:hover": {
          transition: "none",
          borderRadius: "3px",
        },
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: "16px 20px 0",
      },
    },
  },
  MuiDialogContentText: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        letterSpacing: "0.15px",
        marginBottom: "12px",
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: "15px",
        lineHeight: 26 / 15,
        letterSpacing: "0.45px",
      },
    },
  },
};
