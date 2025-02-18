import React from "react";

import {
  CharacterValuesContract,
  ValueUtils,
} from "../../rules-engine/es";

import { RemoveButton } from "../../../../components/common/Button";
import ProficienciesPaneProficiencyEditor from "../ProficienciesPaneProficiencyEditor";

interface Props {
  proficiency: CharacterValuesContract;
  nameLookup: Record<number, string>;
  onDataUpdate: (proficiency: CharacterValuesContract) => void;
  onRemove: (proficiency: CharacterValuesContract) => void;
}
interface State {
  proficiency: CharacterValuesContract;
}
export default class ProficienciesPaneExistingProficiency extends React.PureComponent<
  Props,
  State
> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { proficiency } = this.props;

    if (proficiency !== prevProps.proficiency) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { proficiency } = props;

    return {
      proficiency,
    };
  };

  handleDataUpdate = (propertyKey: string, value) => {
    const { onDataUpdate } = this.props;

    this.setState((prevState) => {
      let newProficiency = {
        ...prevState.proficiency,
        [propertyKey]: value,
      };

      if (onDataUpdate) {
        onDataUpdate(newProficiency);
      }

      return {
        proficiency: newProficiency,
      };
    });
  };

  handleRemove = () => {
    const { proficiency } = this.state;
    const { onRemove } = this.props;

    if (onRemove) {
      onRemove(proficiency);
    }
  };

  render() {
    const { proficiency } = this.state;
    const { nameLookup } = this.props;

    const valueId = ValueUtils.getValueId(proficiency);
    return (
      <div className="ct-proficiencies-pane__proficiency">
        <div className="ct-proficiencies-pane__proficiency-primary">
          <div className="ct-proficiencies-pane__proficiency-name">
            {valueId === null ? "" : nameLookup[valueId]}
          </div>
          <div className="ct-proficiencies-pane__proficiency-actions">
            <div className="ct-proficiencies-pane__proficiency-action ct-proficiencies-pane__proficiency-action--remove">
              <RemoveButton onClick={this.handleRemove}>
                Remove Proficiency
              </RemoveButton>
            </div>
          </div>
        </div>
        <div className="ct-proficiencies-pane__proficiency-notes">
          <ProficienciesPaneProficiencyEditor
            onUpdate={this.handleDataUpdate}
            defaultValue={ValueUtils.getNotes(proficiency)}
            propertyKey="notes"
            placeholder="Enter Source Note..."
          />
        </div>
      </div>
    );
  }
}
