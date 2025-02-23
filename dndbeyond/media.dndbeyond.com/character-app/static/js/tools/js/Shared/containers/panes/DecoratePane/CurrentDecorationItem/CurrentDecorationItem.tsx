import React from "react";

interface Props {
  onClick?: (decorationKey: string) => void;
  label: string;
  isActive: boolean;
  isReadonly: boolean;
  decorationKey: string;
}
const CurrentDecorationItem: React.FC<Props> = ({
  label,
  onClick,
  isActive,
  isReadonly,
  decorationKey,
  children,
}) => {
  return (
    <div
      className="ct-decorate-pane__grid-item"
      onClick={(evt: React.MouseEvent) => {
        evt.stopPropagation();
        if (onClick) {
          onClick(decorationKey);
        }
      }}
    >
      <div className="ct-decorate-pane__grid-item-label">{label}</div>
      <div
        className={`ct-decorate-pane__grid-item-inner ${
          isActive ? "ct-decorate-pane__grid-item-inner--is-active" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CurrentDecorationItem;
