import React from "react";

import Button, { ButtonProps } from "../Button";

//Duplicated from CharacterToolsClient
// ToolsClient implements as a ThemeButton wrapper
// eventually RemoveButton usage should be replaced with this one with specialized style overrides

export interface RemoveButtonProps extends Partial<ButtonProps> {}
const RemoveButton: React.FunctionComponent<RemoveButtonProps> = ({
  size = "small",
  style = "outline",
  stopPropagation = true,
  children,
  className,
  ...restProps
}) => {
  let classNames: Array<string> = [
    "ddbc-remove-button",
    "character-button-remove",
  ];
  if (className) {
    classNames.push(className);
  }

  return (
    <Button
      {...restProps}
      size={size}
      style={style}
      stopPropagation={stopPropagation}
      className={classNames.join(" ")}
    >
      {children ? children : "Remove"}
    </Button>
  );
};

export default RemoveButton;
