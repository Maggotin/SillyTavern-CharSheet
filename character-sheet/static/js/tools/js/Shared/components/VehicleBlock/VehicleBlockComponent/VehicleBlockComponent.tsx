import React from "react";

import { ManageIcon } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  Constants,
  FormatUtils,
} from "@dndbeyond/character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";

import { GD_VehicleBlockComponentProps } from "../../../utils/Component";
import VehicleBlockAction from "../VehicleBlockAction";
import VehicleBlockPrimaryAttributes from "../VehicleBlockPrimaryAttributes";
import VehicleBlockSectionHeader from "../VehicleBlockSectionHeader";

interface Props extends GD_VehicleBlockComponentProps {
  className: string;
  shouldCoalesce: boolean;
  onComponentClick?: (id: number, vehicleId: number) => void;
  isInteractive: boolean;
  theme: CharacterTheme;
}
export default class VehicleBlockComponent extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    isInteractive: false,
    shouldCoalesce: true,
  };

  renderHeading = (): React.ReactNode => {
    const {
      typeNames,
      name,
      count,
      isInteractive,
      theme,
      displayType,
      requiredCrew,
    } = this.props;

    const nameLabel: string = name !== null ? name : "";
    const isSpelljammer =
      displayType === Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER;

    let componentCount: string = "";
    if (count > 1) {
      componentCount = `(${count})`;
    }

    let primaryText: string = "";
    if (name !== null && typeNames.includes(name)) {
      primaryText = nameLabel;
    } else if (isSpelljammer) {
      primaryText = `${count > 1 ? `${count} ` : ""}${nameLabel}${
        requiredCrew ? ` (${requiredCrew} Crew${count > 1 ? " Each" : ""})` : ""
      }`;
    } else {
      let typesText = FormatUtils.renderNonOxfordCommaList(typeNames);
      primaryText = `${typesText}: ${nameLabel} ${componentCount}`;
    }

    let callout: React.ReactNode = null;
    if (isInteractive) {
      callout = (
        <ManageIcon tooltip="Manage HP" showIconOnEdge={false} theme={theme} />
      );
    }

    return <VehicleBlockSectionHeader label={primaryText} callout={callout} />;
  };

  renderActions = (): React.ReactNode => {
    const { actions } = this.props;

    if (actions.length === 0) {
      return null;
    }

    return (
      <div className="ct-vehicle-block-component__actions">
        {actions.map((action) => (
          <VehicleBlockAction action={action} key={action.key} />
        ))}
      </div>
    );
  };

  renderDescription = (): React.ReactNode => {
    const { description } = this.props;

    if (description === null) {
      return null;
    }

    return (
      <HtmlContent
        className="ct-vehicle-block-component__description"
        html={description}
        withoutTooltips
      />
    );
  };

  handleClick = (): void => {
    const { id, vehicleId, isInteractive, onComponentClick } = this.props;

    if (isInteractive && onComponentClick) {
      onComponentClick(id, vehicleId);
    }
  };

  renderAttributes = (): React.ReactNode => {
    const {
      count,
      costInfos,
      shouldCoalesce,
      armorClassInfo,
      hitPointInfo,
      speedInfos,
      coverType,
      requiredCrew,
      displayType,
      width,
      length,
      isPrimaryComponent,
    } = this.props;

    return (
      <div className="ct-vehicle-block-component__attributes">
        <VehicleBlockPrimaryAttributes
          armorClassInfo={armorClassInfo}
          hitPointInfo={hitPointInfo}
          speedInfos={speedInfos}
          coverType={coverType}
          requiredCrew={requiredCrew}
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

  renderActionsAndDescription() {
    const { displayType } = this.props;
    const isSpelljammer =
      displayType === Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER;
    return isSpelljammer ? (
      <>
        {this.renderDescription()}
        {this.renderActions()}
      </>
    ) : (
      <>
        {this.renderActions()}
        {this.renderDescription()}
      </>
    );
  }

  render() {
    const { isInteractive, uniqueKey } = this.props;

    let classNames: Array<string> = ["ct-vehicle-block-component"];
    if (isInteractive) {
      classNames.push("ct-vehicle-block-component--interactive");
    }

    return (
      <div
        key={uniqueKey}
        className={classNames.join(" ")}
        onClick={this.handleClick}
      >
        {this.renderHeading()}
        <div className="ct-vehicle-block-component__content">
          {this.renderAttributes()}
          {this.renderActionsAndDescription()}
        </div>
      </div>
    );
  }
}
