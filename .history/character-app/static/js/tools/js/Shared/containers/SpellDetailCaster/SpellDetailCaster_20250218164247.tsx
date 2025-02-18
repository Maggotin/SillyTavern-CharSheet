import React from "react";
import { connect } from "react-redux";

import { rulesEngineSelectors } from "../../character-rules-engine/es";

import SpellCaster from "../../components/SpellCaster";
import * as appEnvSelectors from "../../selectors/appEnv";
import { SharedAppState } from "../../stores/typings";

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}
export default connect(mapStateToProps)(SpellCaster);
