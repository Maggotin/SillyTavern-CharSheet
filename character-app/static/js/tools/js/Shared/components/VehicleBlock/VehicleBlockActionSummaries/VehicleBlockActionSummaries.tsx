import React from "react";

import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import { GD_VehicleBlockActionSummariesProps } from "../../../utils/Component";
import VehicleBlockActionSummary from "../VehicleBlockActionSummary";
import VehicleBlockSectionHeader from "../VehicleBlockSectionHeader";

interface Props extends GD_VehicleBlockActionSummariesProps {
  theme: CharacterTheme;
}
export default class VehicleBlockActionSummaries extends React.PureComponent<Props> {
  render() {
    const { actionsText, actionsSummaries, theme } = this.props;

    if (actionsText === null && actionsSummaries.length === 0) {
      return null;
    }

    return (
      <div className="ct-vehicle-block__action-summaries">
        <VehicleBlockSectionHeader label="Actions" />
        {actionsText !== null && (
          <div className="ct-vehicle-block__action-summaries-content">
            {actionsText}
          </div>
        )}
        {actionsSummaries.length > 0 && (
          <div className="ct-vehicle-block__action-summaries-content">
            {actionsSummaries.map((summary, idx) => {
              const key = `${summary.name !== null ? summary.name : ""}-${idx}`;
              return (
                <VehicleBlockActionSummary
                  theme={theme}
                  actionSummary={summary}
                  key={key}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
