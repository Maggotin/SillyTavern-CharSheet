import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import { ChangeEvent } from "react";

import { TitleH3 } from "../shared-styles";

type RadioGroupProps = {
  name?: string;
  defaultValue?: any;
  label: string;
  options?: any;
  subtitle?: string;
  onChange?: (event: ChangeEvent, value: any) => void;
  disabled?: boolean;
  value?: any;
};

export const RadioGroup = ({
  name,
  defaultValue,
  label,
  options,
  subtitle,
  onChange,
  disabled = false,
  value,
}: RadioGroupProps) => {
  return (
    <FormControl disabled={disabled}>
      <FormLabel
        sx={{ ...TitleH3, color: "#000" }}
        id={`radio-button-group-${label.split(" ").join("-")}`}
      >
        {label}
      </FormLabel>
      <Typography
        variant="subtitle1"
        sx={{ color: "#12181ca3", fontSize: "14px" }}
      >
        {subtitle}
      </Typography>
      <MuiRadioGroup
        aria-labelledby={`radio-button-group-${label.split(" ").join("-")}`}
        name={name}
        onChange={onChange}
        {...{
          ...(defaultValue && { defaultValue }),
          ...(value && { value }),
        }}
      >
        {options.map((option) => {
          return (
            <FormControlLabel
              value={option.value}
              control={<Radio color="secondary" />}
              label={option.label}
              key={option.value}
            />
          );
        })}
      </MuiRadioGroup>
    </FormControl>
  );
};
