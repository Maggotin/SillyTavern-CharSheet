import { values, sortBy } from "lodash";
import React from "react";

import { CharacterTheme } from "../../character-rules-engine/es";

import {
  GD_VehicleBlockActionStationListProps,
  GD_VehicleBlockActionStationProps,
} from "../../../utils/Component";
import VehicleBlockActionStation from "../VehicleBlockActionStation";
import VehicleBlockActionStationsShell from "../VehicleBlockActionStationsShell";

interface Props extends GD_VehicleBlockActionStationListProps {
  isInteractive: boolean;
  shouldCoalesce: boolean;
  theme: CharacterTheme;
  onActionStationClick?: (stationId: number, vehicleId: number) => void;
}
export default class VehicleBlockActionStations extends React.PureComponent<Props> {
  static defaultProps = {
    shouldCoalesce: true,
    isInteractive: false,
  };

  getActionStationProps = (): Array<GD_VehicleBlockActionStationProps> => {
    const { actionStations, shouldCoalesce } = this.props;

    let displayActionStations: Array<GD_VehicleBlockActionStationProps> =
      actionStations;

    if (shouldCoalesce) {
      let uniquenessFactorLookup: Record<
        string,
        GD_VehicleBlockActionStationProps
      > = displayActionStations.reduce(
        (acc: Record<string, GD_VehicleBlockActionStationProps>, station) => {
          let uniqueness: string = station.uniquenessFactor;

          if (!acc[uniqueness]) {
            acc[uniqueness] = station;
          } else {
            acc[uniqueness].count += 1;
          }

          return acc;
        },
        {}
      );

      displayActionStations = values(uniquenessFactorLookup);
    }

    return sortBy(
      displayActionStations,
      (actionStation) => actionStation.displayOrder
    );
  };

  render() {
    const {
      actionStations,
      shouldCoalesce,
      isInteractive,
      onActionStationClick,
      theme,
    } = this.props;

    if (actionStations.length === 0) {
      return null;
    }

    const actionStationsProps = this.getActionStationProps();

    return (
      <VehicleBlockActionStationsShell>
        {actionStationsProps.map((stationProps) => (
          <VehicleBlockActionStation
            {...stationProps}
            theme={theme}
            isInteractive={
              stationProps.enableComponentManagement && isInteractive
            }
            onActionStationClick={onActionStationClick}
            shouldCoalesce={shouldCoalesce}
          />
        ))}
      </VehicleBlockActionStationsShell>
    );
  }
}
