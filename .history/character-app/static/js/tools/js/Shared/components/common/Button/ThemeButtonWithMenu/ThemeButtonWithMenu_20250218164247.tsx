import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import React from "react";

import { GroupedMenuOption } from "../../character-rules-engine/es";

import { ThemeButton } from "..";

interface Props {
  children: React.ReactNode;
  groupedOptions: Array<GroupedMenuOption>;
  className?: string;
  size?: string;
  buttonStyle?: string;
  showSingleOption?: boolean;
  onSelect: (containerDefinitionKey: string) => void;
  containerEl?: HTMLElement;
}

export const ThemeButtonWithMenu: React.FC<Props> = ({
  className,
  children,
  groupedOptions,
  size = "small",
  buttonStyle = "filled",
  onSelect,
  showSingleOption = false,
  containerEl,
}) => {
  const singleOption =
    groupedOptions.length === 1 &&
    groupedOptions[0].options?.length === 1 &&
    !showSingleOption;

  const classNames = [className, "ct-theme-button-with-menu"];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!singleOption) {
      setAnchorEl(event.currentTarget);
    } else if (singleOption) {
      onSelect(groupedOptions[0].options[0]?.value);
    }
  };

  const handleClose = (value?: string) => {
    if (value) {
      onSelect(value);
    }
    setAnchorEl(null);
  };

  return (
    <span className={classNames.join(" ")}>
      <ThemeButton
        size={size}
        style={buttonStyle}
        onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
          handleClick(evt);
        }}
        data-testid={`theme-button-with-menu-${children?.toString()}`
          .toLowerCase()
          .replace(/\s/g, "-")}
      >
        {children}{" "}
        {!singleOption && (
          <KeyboardArrowDownIcon sx={{ width: 8, height: 8 }} />
        )}
      </ThemeButton>
      {!singleOption && (
        <Popover
          anchorEl={anchorEl}
          container={containerEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={(evt: any) => {
            evt.stopPropagation();
            evt.nativeEvent?.stopImmediatePropagation();

            handleClose();
          }}
        >
          <List
            sx={{ bgcolor: "background.default" }}
            onClick={(evt) => {
              evt.nativeEvent?.stopImmediatePropagation();
              evt.stopPropagation();
            }}
          >
            {groupedOptions.map((groupedOption) => (
              <React.Fragment key={groupedOption.label}>
                <ListSubheader
                  sx={{
                    lineHeight: "32px",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "12px",
                    bgcolor: "background.default",
                  }}
                  data-testid={`theme-button-with-menu-subheader-${groupedOption.label}`
                    .toLowerCase()
                    .replace(/\s/g, "-")}
                >
                  {groupedOption.label}
                </ListSubheader>
                {groupedOption.options.map((option) => {
                  return (
                    <MenuItem
                      sx={{ bgcolor: "background.default" }}
                      key={option.value}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        evt.nativeEvent?.stopImmediatePropagation();
                        handleClose(option.value);
                      }}
                      data-testid={`theme-button-with-menu-item-${option.label}`
                        .toLowerCase()
                        .replace(/\s/g, "-")}
                    >
                      {option.label}
                    </MenuItem>
                  );
                })}
              </React.Fragment>
            ))}
          </List>
        </Popover>
      )}
    </span>
  );
};

export default ThemeButtonWithMenu;
