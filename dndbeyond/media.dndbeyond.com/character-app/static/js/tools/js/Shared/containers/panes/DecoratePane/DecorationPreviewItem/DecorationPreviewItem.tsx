import React from "react";

interface Props {
  avatarId: number | null;
  avatarName?: string | null;
  isSelected?: boolean;
  isCurrent: boolean;
  onSelected?: (avatarId: number | null) => void;
  className?: string;
  innerClassName?: string;
}
export default class DecorationPreviewItem extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onSelected, avatarId } = this.props;

    if (onSelected) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onSelected(avatarId);
    }
  };

  render() {
    const {
      isSelected,
      isCurrent,
      children,
      avatarName,
      className,
      innerClassName,
    } = this.props;

    let classNames: Array<string> = ["ct-decoration-manager__item"];
    if (className) {
      classNames.push(className);
    }
    if (isSelected) {
      classNames.push("ct-decoration-manager__item--selected");
    }
    if (isCurrent) {
      classNames.push("ct-decoration-manager__item--current");
    }

    return (
      <div className={classNames.join(" ")} onClick={this.handleClick}>
        <div
          className={`ct-decoration-manager__item-inner${
            innerClassName ? ` ${innerClassName}` : ""
          }`}
        >
          {children}
        </div>
        {avatarName && (
          <div className="ct-decoration-manager__item-label">{avatarName}</div>
        )}
      </div>
    );
  }
}
