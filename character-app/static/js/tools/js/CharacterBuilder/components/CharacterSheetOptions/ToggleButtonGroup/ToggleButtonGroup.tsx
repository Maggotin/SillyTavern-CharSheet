import FormControl from "@mui/material/FormControl";
import ToggleButton from "@mui/material/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import React from "react";

import { TitleH3 } from "../shared-styles";

export const ToggleButtonGroup = ({
  options,
  title,
  subtitle,
  value,
  onChange,
}) => {
  return (
    <FormControl>
      <Typography variant="h3" sx={TitleH3}>
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: "#12181ca3", fontSize: "14px" }}
      >
        {subtitle}
      </Typography>
      <MuiToggleButtonGroup
        value={value}
        exclusive
        onChange={onChange}
        sx={{ marginTop: 1 }}
      >
        {options.map((option) => {
          return (
            <ToggleButton
              value={option.value}
              key={option.value}
              sx={{
                "&.Mui-selected": {
                  color: "secondary.main",
                  backgroundColor: "rgba(197, 0, 9, 0.08)", // TODO: put this color in the theme?
                },
              }}
            >
              {option.label}
            </ToggleButton>
          );
        })}
      </MuiToggleButtonGroup>
    </FormControl>
  );
};
