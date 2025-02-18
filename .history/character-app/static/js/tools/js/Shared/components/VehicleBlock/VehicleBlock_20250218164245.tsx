import React from "react";

import { CharacterTheme } from "../../character-rules-engine/es";

import { GD_VehicleBlockProps } from "../../utils/Component";
import VehicleBlockActionStations from "./VehicleBlockActionStations";
import VehicleBlockActionSummaries from "./VehicleBlockActionSummaries";
import VehicleBlockActions from "./VehicleBlockActions";
import VehicleBlockComponents from "./VehicleBlockComponents";
import VehicleBlockFeatures from "./VehicleBlockFeatures";
import VehicleBlockHeader from "./VehicleBlockHeader";
import VehicleBlockPrimary from "./VehicleBlockPrimary";
import VehicleBlockShell from "./VehicleBlockShell";

interface Props extends GD_VehicleBlockProps {
  isInteractive: boolean;
  onComponentClick?: (componentId: number, vehicleId: number) => void;
  onActionStationClick?: (stationId: number, vehicleId: number) => void;
  shouldCoalesce: boolean;
  theme: CharacterTheme;
}
export default class VehicleBlock extends React.PureComponent<Props, {}> {
  static defaultProps = {
    isInteractive: false,
    shouldCoalesce: true,
    featuresProps: null,
    actionsProps: null,
    actionSummariesProps: null,
    actionStationsProps: null,
    componentsProps: null,
  };

  render() {
    const {
      headerProps,
      primaryProps,
      actionSummariesProps,
      featuresProps,
      actionsProps,
      actionStationsProps,
      componentsProps,
      shellProps,
      isInteractive,
      onComponentClick,
      onActionStationClick,
      shouldCoalesce,
      theme,
    } = this.props;

    return (
      <VehicleBlockShell {...shellProps}>
        <VehicleBlockHeader {...headerProps} />
        <VehicleBlockPrimary
          {...primaryProps}
          shouldCoalesce={shouldCoalesce}
        />
        {featuresProps !== null && <VehicleBlockFeatures {...featuresProps} />}
        {actionSummariesProps !== null && (
          <VehicleBlockActionSummaries
            {...actionSummariesProps}
            theme={theme}
          />
        )}
        {actionStationsProps !== null && (
          <VehicleBlockActionStations
            {...actionStationsProps}
            theme={theme}
            isInteractive={isInteractive}
            onActionStationClick={onActionStationClick}
            shouldCoalesce={shouldCoalesce}
          />
        )}
        {componentsProps !== null && (
          <VehicleBlockComponents
            {...componentsProps}
            theme={theme}
            isInteractive={isInteractive}
            onComponentClick={onComponentClick}
            shouldCoalesce={shouldCoalesce}
          />
        )}
        {actionsProps !== null && <VehicleBlockActions {...actionsProps} />}
      </VehicleBlockShell>
    );
  }
}
