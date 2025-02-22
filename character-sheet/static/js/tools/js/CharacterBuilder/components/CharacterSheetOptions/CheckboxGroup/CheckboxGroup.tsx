import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import React from "react";

import Checkbox from "../Checkbox";
import { TitleH3 } from "../shared-styles";

export const CheckboxGroup = ({ options, title, subtitle }) => {
  return (
    <>
      <Typography variant="h3" sx={TitleH3}>
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: "#12181ca3", fontSize: "14px" }}
      >
        {subtitle}
      </Typography>
      <FormGroup>
        {options.map((option) => {
          return (
            <React.Fragment key={option.name}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={option.onChange}
                    name={option.name}
                    checked={option.checked}
                  />
                }
                label={option.label}
              />
              {option.subtitle && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#12181CA3",
                    fontSize: "12px",
                    ml: 4,
                    lineHeight: "14px",
                  }}
                >
                  {option.subtitle}
                </Typography>
              )}
            </React.Fragment>
          );
        })}
      </FormGroup>
    </>
  );
};
