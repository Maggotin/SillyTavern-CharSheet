import { values, sortBy, has } from "lodash";
import React from "react";

import {
  CharacterTheme,
  Constants,
} from "../../rules-engine/es";

import {
  GD_VehicleBlockComponentListProps,
  GD_VehicleBlockComponentProps,
} from "../../../utils/Component";
import VehicleBlockComponent from "../VehicleBlockComponent";
import VehicleBlockComponentsShell from "../VehicleBlockComponentsShell";

interface Props extends GD_VehicleBlockComponentListProps {
  shouldCoalesce: boolean;
  isInteractive: boolean;
  theme: CharacterTheme;
  onComponentClick?: (componentId: number, vehicleId: number) => void;
}
export default class VehicleBlockComponents extends React.PureComponent<Props> {
  static defaultProps = {
    shouldCoalesce: true,
  };

  getComponentInfos = (): Array<GD_VehicleBlockComponentProps> => {
    const { components, shouldCoalesce } = this.props;

    let displayComponents: Array<GD_VehicleBlockComponentProps> = components;

    if (shouldCoalesce) {
      const uniquenessFactorLookup: Record<
        string,
        GD_VehicleBlockComponentProps
      > = components.reduce(
        (acc: Record<string, GD_VehicleBlockComponentProps>, component) => {
          let uniqueness = component.uniquenessFactor;

          if (!acc[uniqueness]) {
            acc[uniqueness] = component;
          } else {
            acc[uniqueness].count += 1;
          }

          return acc;
        },
        {}
      );

      displayComponents = values(uniquenessFactorLookup);
    }

    return sortBy(displayComponents, (component) => component.displayOrder);
  };

  render() {
    const { shouldCoalesce, isInteractive, onComponentClick, theme } =
      this.props;

    let components = this.getComponentInfos();

    if (components.length === 0) {
      return null;
    }

    // Components only not action stations (Currently due to Spelljammer)
    // Filters out helm (primary component) from Spelljammer
    components = components.filter(
      (component) =>
        !(
          component.displayType ===
            Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER &&
          component.isPrimaryComponent
        )
    );

    return (
      <VehicleBlockComponentsShell>
        {components.map((componentProps) => (
          <VehicleBlockComponent
            {...componentProps}
            theme={theme}
            isInteractive={
              componentProps.enableComponentManagement && isInteractive
            }
            onComponentClick={onComponentClick}
            shouldCoalesce={shouldCoalesce}
          />
        ))}
      </VehicleBlockComponentsShell>
    );
  }
}
