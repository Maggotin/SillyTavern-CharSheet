import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Select } from "../../character-components/es";
import {
  characterActions,
  CharacterConfiguration,
  Constants,
  HelperUtils,
  HtmlSelectOption,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { BuilderAppState } from "../../typings";

interface Props extends DispatchProp {
  configuration: CharacterConfiguration;
  initialOptionRemoved: boolean;
  onScoreMethodChange?: (value: number | null) => void;
  hideTilAbilityScoreTypeSet: boolean;
}
class AbilityScoreTypeChooser extends React.PureComponent<Props> {
  static defaultProps = {
    initialOptionRemoved: true,
    hideTilAbilityScoreTypeSet: false,
  };

  handleScoreMethodChange = (value: string): void => {
    const { dispatch, onScoreMethodChange } = this.props;

    const parsedValue = HelperUtils.parseInputInt(value);

    dispatch(characterActions.abilityScoreTypeSetRequest(parsedValue));

    if (onScoreMethodChange) {
      onScoreMethodChange(parsedValue);
    }
  };

  render() {
    const { configuration, initialOptionRemoved, hideTilAbilityScoreTypeSet } =
      this.props;

    const scoreMethodOptions: Array<HtmlSelectOption> = [
      {
        label: "Standard Array",
        value: Constants.AbilityScoreTypeEnum.STANDARD_ARRAY,
      },
      {
        label: "Manual/Rolled",
        value: Constants.AbilityScoreTypeEnum.MANUAL,
      },
      {
        label: "Point Buy",
        value: Constants.AbilityScoreTypeEnum.POINT_BUY,
      },
    ];

    if (hideTilAbilityScoreTypeSet && configuration.abilityScoreType === null) {
      return null;
    }

    return (
      <div className="ability-score-type-chooser">
        <Select
          options={scoreMethodOptions}
          onChange={this.handleScoreMethodChange}
          initialOptionRemoved={initialOptionRemoved}
          value={configuration.abilityScoreType}
          placeholder="-- Choose a Generation Method --"
        />
      </div>
    );
  }
}

function mapStateToProps(state: BuilderAppState) {
  return {
    configuration: rulesEngineSelectors.getCharacterConfiguration(state),
  };
}

export default connect(mapStateToProps)(AbilityScoreTypeChooser);
