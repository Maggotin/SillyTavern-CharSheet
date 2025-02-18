import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  SxProps,
  Theme,
} from "@mui/material";
import clsx from "clsx";

import { Constants } from "../../character-rules-engine";

import styles from "./styles.module.css";

interface PrivacyTypeRadioProps {
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  themeColor?: string;
  compact?: boolean;
  darkMode?: boolean;
  handleChange?: (e, value) => void;
  initialValue?: number | null;
  sx?: SxProps<Theme>;
  variant?: "builder" | "sidebar" | "default";
  themed?: boolean;
}

const privacyOptions = [
  {
    value: Constants.PreferencePrivacyTypeEnum.CAMPAIGN_ONLY,
    label: "Campaign Only",
    description:
      "Only others within a Campaign you have joined can view your Characters.",
  },
  {
    value: Constants.PreferencePrivacyTypeEnum.PUBLIC,
    label: "Public",
    description: "Anyone with a shared link can view your Characters.",
  },
  {
    value: Constants.PreferencePrivacyTypeEnum.PRIVATE,
    label: "Private",
    description: "Only you can view your Characters.",
  },
];

const PrivacyTypeRadio = ({
  color,
  compact,
  darkMode,
  initialValue,
  handleChange,
  sx,
  themeColor,
  variant = "default",
  themed = false,
}: PrivacyTypeRadioProps) => {
  return (
    <FormControl
      sx={sx}
      className={clsx([
        styles.container,
        variant === "sidebar" && styles.containerSidebar,
        variant === "builder" && styles.containerBuilder,
      ])}
    >
      <label
        id="character-privacy-radio"
        className={clsx([
          styles.heading,
          variant === "sidebar" && styles.headingSidebar,
          variant === "builder" && styles.headingBuilder,
          darkMode && styles.headingSidebarDark,
        ])}
      >
        Character Privacy
      </label>
      <RadioGroup
        aria-labelledby="character-privacy-radio"
        name="controlled-radio-buttons-group"
        value={initialValue}
        onChange={handleChange}
        className={clsx([styles.radioGroup])}
      >
        {privacyOptions.map((option, i) => (
          <FormControlLabel
            key={option.value + i}
            value={option.value}
            control={
              <Radio
                className={clsx([
                  initialValue === option.value && styles.buttonChecked,
                  initialValue === option.value && themed && styles.themed,
                  variant === "builder" &&
                    initialValue === option.value &&
                    styles.buttonCheckedBuilder,
                ])}
              />
            }
            label={
              <div className={clsx(styles.radioInfoGroup)}>
                <label
                  className={clsx([
                    styles.radioHeading,
                    variant === "sidebar" && styles.radioHeadingSidebar,
                    variant === "builder" && styles.radioHeadingBuilder,
                  ])}
                >
                  {option.label}
                </label>
                <label
                  className={clsx([
                    styles.radioDescription,
                    variant === "sidebar" && styles.radioDescriptionSidebar,
                    darkMode && styles.radioDescriptionDark,
                  ])}
                >
                  {option.description}
                </label>
              </div>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default PrivacyTypeRadio;
