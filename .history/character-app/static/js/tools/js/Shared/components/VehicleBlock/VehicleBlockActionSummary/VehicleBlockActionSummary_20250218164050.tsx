import React from "react";

import { CharacterTheme } from "../../rules-engine/es";

import { Reference } from "~/components/Reference";

import { VehicleActionSummaryProps } from "../../../utils/Component";
import InlineSeparatedNodes from "../../common/InlineSeparatedNodes";

interface Props {
  actionSummary: VehicleActionSummaryProps;
  theme: CharacterTheme;
}
export default class VehicleBlockActionSummary extends React.PureComponent<Props> {
  render() {
    const {
      name,
      description,
      sourceId,
      sourceName,
      sourceFullName,
      sourceChapterNumber,
    } = this.props.actionSummary;
    const { theme } = this.props;

    let nodes: Array<React.ReactNode> = [];

    if (name !== null) {
      nodes.push(
        <span className="ct-vehicle-block__action-summary-label">{name}.</span>
      );
    }

    if (description !== null) {
      nodes.push(
        <span className="ct-vehicle-block__action-summary-text">
          {description}
        </span>
      );
    }

    if (sourceId !== null) {
      nodes.push(
        <React.Fragment>
          {"("}
          <Reference
            isDarkMode={theme?.isDarkMode}
            name={sourceName}
            tooltip={sourceFullName}
            chapter={sourceChapterNumber}
          />
          {")."}
        </React.Fragment>
      );
    }

    return (
      <div className="ct-vehicle-block__action-summary">
        <InlineSeparatedNodes nodes={nodes} sep={" "} />
      </div>
    );
  }
}
