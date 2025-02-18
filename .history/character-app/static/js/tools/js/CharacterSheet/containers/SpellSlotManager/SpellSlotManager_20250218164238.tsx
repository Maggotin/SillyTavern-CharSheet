import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  ApiRequestHelpers,
  rulesEngineSelectors,
  characterActions,
  SpellSlotContract,
} from "../../character-rules-engine/es";

import { appEnvSelectors } from "../../../Shared/selectors";
import { SheetAppState } from "../../typings";
import SpellSlotManagerGroup from "./SpellSlotManagerGroup";

interface Props extends DispatchProp {
  spellSlots: Array<SpellSlotContract>;
  pactSlots: Array<SpellSlotContract>;
  isReadonly: boolean;
}
class SpellSlotManager extends React.PureComponent<Props> {
  handleSlotSet = (level: number, used: number): void => {
    const { dispatch } = this.props;
    const spellLevelSpellSlotRequestsDataKey =
      ApiRequestHelpers.getSpellLevelSpellSlotRequestsDataKey(level);

    if (spellLevelSpellSlotRequestsDataKey !== null) {
      dispatch(
        characterActions.spellLevelSpellSlotsSet({
          [spellLevelSpellSlotRequestsDataKey]: used,
        })
      );
    }
  };

  handlePactSet = (level: number, used: number): void => {
    const { dispatch } = this.props;

    const spellLevelPactMagicRequestsDataKey =
      ApiRequestHelpers.getSpellLevelPactMagicRequestsDataKey(level);

    if (spellLevelPactMagicRequestsDataKey !== null) {
      dispatch(
        characterActions.spellLevelPactMagicSlotsSet({
          [spellLevelPactMagicRequestsDataKey]: used,
        })
      );
    }
  };

  render() {
    const { spellSlots, pactSlots, isReadonly } = this.props;

    return (
      <div className="ct-spell-slot-manager">
        <SpellSlotManagerGroup
          heading="Spell Slots"
          slots={spellSlots}
          onSlotSet={this.handleSlotSet}
          isReadonly={isReadonly}
        />
        <SpellSlotManagerGroup
          heading="Pact Magic"
          slots={pactSlots}
          onSlotSet={this.handlePactSet}
          isReadonly={isReadonly}
        />
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    spellSlots: rulesEngineSelectors.getSpellSlots(state),
    pactSlots: rulesEngineSelectors.getPactMagicSlots(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

export default connect(mapStateToProps)(SpellSlotManager);
