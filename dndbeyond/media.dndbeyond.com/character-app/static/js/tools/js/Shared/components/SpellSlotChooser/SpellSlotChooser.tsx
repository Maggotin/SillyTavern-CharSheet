import React from "react";

import { ThemeButton } from "../common/Button";

interface Props {
  onPactChoose: () => void;
  onSpellChoose: () => void;
  isSpellSlotAvailable: boolean;
  isPactSlotAvailable: boolean;
  doesSpellSlotExist: boolean;
  doesPactSlotExist: boolean;
}
export default class SpellSlotChooser extends React.PureComponent<Props> {
  render() {
    const {
      onPactChoose,
      onSpellChoose,
      doesSpellSlotExist,
      doesPactSlotExist,
      isSpellSlotAvailable,
      isPactSlotAvailable,
    } = this.props;

    return (
      <div className="ct-spells-slot-chooser">
        {doesSpellSlotExist && (
          <ThemeButton
            onClick={onSpellChoose}
            size={"small"}
            disabled={!isSpellSlotAvailable}
          >
            Spell Slot
          </ThemeButton>
        )}
        {doesPactSlotExist && (
          <ThemeButton
            onClick={onPactChoose}
            size={"small"}
            disabled={!isPactSlotAvailable}
          >
            Pact Slot
          </ThemeButton>
        )}
      </div>
    );
  }
}
