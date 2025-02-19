import React from "react";

interface Props {
  used: number;
  available: number;
  onSet?: (used: number) => void;
  size: "normal" | "small";
  isInteractive: boolean;
}
export default class SlotManager extends React.PureComponent<Props> {
  static defaultProps = {
    size: "normal",
    isInteractive: true,
  };

  handleClick = (isUsed: boolean, evt: React.MouseEvent): void => {
    let { onSet, used, available, isInteractive } = this.props;

    evt.nativeEvent.stopImmediatePropagation();
    evt.stopPropagation();

    if (!onSet || !isInteractive) {
      return;
    }

    if (isUsed) {
      onSet(Math.max(used - 1, 0));
    } else {
      onSet(Math.min(used + 1, available));
    }
  };

  render() {
    let { available, used, size, isInteractive } = this.props;

    let slotElements: Array<React.ReactNode> = [];

    let totalSlots: number = Math.max(available, used);
    for (let i = 0; i < totalSlots; i++) {
      let isUsed = i < used;

      let slotClassNames: Array<string> = ["ct-slot-manager__slot"];
      if (isUsed) {
        slotClassNames.push("ct-slot-manager__slot--used");
      }
      if (isInteractive) {
        slotClassNames.push("ct-slot-manager__slot--interactive");
      }
      if (i >= available) {
        slotClassNames.push("ct-slot-manager__slot--over-used");
      }

      slotElements.push(
        <div
          role="checkbox"
          aria-checked={isUsed}
          aria-label={"use"}
          className={slotClassNames.join(" ")}
          key={i}
          onClick={this.handleClick.bind(this, isUsed)}
        />
      );
    }

    return (
      <div className={`ct-slot-managerstcs-slot-manager--size-${size}`}>
        {slotElements}
      </div>
    );
  }
}
