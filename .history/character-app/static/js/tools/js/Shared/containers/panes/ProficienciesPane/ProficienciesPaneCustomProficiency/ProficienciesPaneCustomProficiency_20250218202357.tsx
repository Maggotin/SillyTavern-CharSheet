import React from "react";

import { CustomProficiencyContract } from "@dndbeyond/character-rules-engine/es";

import { RemoveButton } from "../../../../components/common/Button";
import ProficienciesPaneProficiencyEditor from "../ProficienciesPaneProficiencyEditor";

interface Props {
  proficiency: CustomProficiencyContract;
  onDataUpdate?: (id: number, data: Record<string, any>) => void;
  onRemove?: (proficiency: CustomProficiencyContract) => void;
}
export default class ProficienciesPaneCustomProficiency extends React.PureComponent<Props> {
  getData = (): Record<string, any> => {
    const { proficiency } = this.props;

    if (proficiency === null) {
      return {};
    }

    return proficiency;
  };

  handleDataUpdate = (propertyKey: string, value: string): void => {
    const { onDataUpdate, proficiency } = this.props;

    if (onDataUpdate) {
      let newProperties = this.getData();
      onDataUpdate(proficiency.id, {
        ...newProperties,
        [propertyKey]: value,
      });
    }
  };

  handleRemove = (): void => {
    const { onRemove, proficiency } = this.props;

    if (onRemove) {
      onRemove(proficiency);
    }
  };

  render() {
    const { proficiency } = this.props;

    return (
      <div className="ct-proficiencies-pane__proficiency">
        <div className="ct-proficiencies-pane__proficiency-primary">
          <div className="ct-proficiencies-pane__proficiency-name">
            <ProficienciesPaneProficiencyEditor
              onUpdate={this.handleDataUpdate}
              defaultValue={proficiency.name}
              propertyKey="name"
              placeholder="Enter Name"
            />
          </div>
          <div className="ct-proficiencies-pane__proficiency-actions">
            <div className="ct-proficiencies-pane__proficiency-actionstcs-proficiencies-pane__proficiency-action--remove">
              <RemoveButton onClick={this.handleRemove}>
                Remove Proficiency
              </RemoveButton>
            </div>
          </div>
        </div>
        <div className="ct-proficiencies-pane__proficiency-notes">
          <ProficienciesPaneProficiencyEditor
            onUpdate={this.handleDataUpdate}
            defaultValue={proficiency.notes}
            propertyKey="notes"
            placeholder="Enter Source Note..."
          />
        </div>
      </div>
    );
  }
}
