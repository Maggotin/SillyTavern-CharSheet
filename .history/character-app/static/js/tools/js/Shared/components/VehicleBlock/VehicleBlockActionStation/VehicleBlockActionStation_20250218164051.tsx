import React from "react";

import { ManageIcon } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  FormatUtils,
} from "../../rules-engine/es";

import { GD_VehicleBlockActionStationProps } from "../../../utils/Component";
import InlineSeparatedNodes from "../../common/InlineSeparatedNodes";
import VehicleBlockAction from "../VehicleBlockAction";
import VehicleBlockPrimaryAttributes from "../VehicleBlockPrimaryAttributes";

interface Props extends GD_VehicleBlockActionStationProps {
  className: string;
  shouldCoalesce: boolean;
  onActionStationClick?: (id: number, vehicleId: number) => void;
  isInteractive: boolean;
  theme: CharacterTheme;
}
export default class VehicleBlockActionStation extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    isInteractive: false,
    shouldCoalesce: true,
  };

  renderHeading = (): React.ReactNode => {
    const { name, requiredCrew, coverType, count } = this.props;

    let displayText: Array<string> = [];

    if (count > 1) {
      displayText.push(`${count}`);
    }

    if (name !== null) {
      displayText.push(name);
    }

    let extraText: Array<string> = [];
    if (requiredCrew !== null) {
      let requiredCrewText: string = `Requires ${requiredCrew} Crew`;
      if (count > 1) {
        requiredCrewText = `Each Station ${requiredCrewText}`;
      }
      extraText.push(requiredCrewText);
    }

    if (coverType !== null) {
      extraText.push(`Grants ${coverType} Cover`);
    }

    if (extraText.length > 0) {
      displayText.push(`(${FormatUtils.renderNonOxfordCommaList(extraText)})`);
    }

    if (displayText.length === 0) {
      return null;
    }

    return (
      <span className="ct-vehicle-block-action-station__heading">
        {displayText.join(" ")}.
      </span>
    );
  };

  renderActions = (): React.ReactNode => {
    const { actions } = this.props;

    if (actions.length === 0) {
      return null;
    }

    return (
      <span className="ct-vehicle-block-action-station__actions">
        {actions.map((action) => (
          <VehicleBlockAction action={action} key={action.key} />
        ))}
      </span>
    );
  };

  renderDescription = (): React.ReactNode => {
    const { description } = this.props;

    if (description === null) {
      return null;
    }

    return (
      <span className="ct-vehicle-block-action-station__description">
        {description}
      </span>
    );
  };

  handleClick = (): void => {
    const { id, vehicleId, isInteractive, onActionStationClick } = this.props;

    if (isInteractive && onActionStationClick) {
      onActionStationClick(id, vehicleId);
    }
  };

  renderAttributes = (): React.ReactNode => {
    const {
      count,
      shouldCoalesce,
      armorClassInfo,
      hitPointInfo,
      speedInfos,
      isInteractive,
      theme,
      costInfos,
      displayType,
      width,
      length,
      isPrimaryComponent,
    } = this.props;

    if (
      armorClassInfo === null &&
      hitPointInfo === null &&
      speedInfos.length === 0
    ) {
      return null;
    }

    return (
      <div className="ct-vehicle-block-action-station__attributes">
        {isInteractive && (
          <div className="ct-vehicle-block-action-station__attributes-callout">
            <ManageIcon
              tooltip="Manage HP"
              showIconOnEdge={false}
              theme={theme}
            />
          </div>
        )}
        <VehicleBlockPrimaryAttributes
          armorClassInfo={armorClassInfo}
          hitPointInfo={hitPointInfo}
          speedInfos={speedInfos}
          count={count}
          shouldCoalesce={shouldCoalesce}
          costInfos={costInfos}
          displayType={displayType}
          width={width}
          length={length}
          isPrimaryComponent={isPrimaryComponent}
        />
      </div>
    );
  };

  render() {
    const { isInteractive } = this.props;

    let classNames: Array<string> = ["ct-vehicle-block-action-station"];
    if (isInteractive) {
      classNames.push("ct-vehicle-block-action-station--interactive");
    }

    let nodes: Array<React.ReactNode> = [];
    const headingNode = this.renderHeading();
    if (headingNode !== null) {
      nodes.push(headingNode);
    }

    const descriptionNode = this.renderDescription();
    if (descriptionNode !== null) {
      nodes.push(descriptionNode);
    }

    const actionsNode = this.renderActions();
    if (actionsNode !== null) {
      nodes.push(actionsNode);
    }

    return (
      <div className={classNames.join(" ")} onClick={this.handleClick}>
        <div className="ct-vehicle-block-action-station__content">
          <InlineSeparatedNodes nodes={nodes} sep={" "} />
          {this.renderAttributes()}
        </div>
      </div>
    );
  }
}
