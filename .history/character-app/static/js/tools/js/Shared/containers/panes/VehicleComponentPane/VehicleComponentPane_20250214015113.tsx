import React from "react";
import { connect } from "react-redux";

import {
  CharacterTheme,
  ExtraManager,
  FormatUtils,
  RuleData,
  rulesEngineSelectors,
  VehicleComponentManager,
  VehicleManager,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { useExtras } from "~/hooks/useExtras";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import {
  PaneComponentEnum,
  PaneIdentifiersVehicleComponent,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import {
  VehicleBlockComponent,
  VehicleBlockShell,
} from "../../../components/VehicleBlock";
import VehicleHealthAdjuster from "../../../components/VehicleHealthAdjuster";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { ComponentUtils, PaneIdentifierUtils } from "../../../utils";

interface Props {
  identifiers: PaneIdentifiersVehicleComponent | null;
  isReadonly: boolean;
  ruleData: RuleData;
  theme: CharacterTheme;
  extraManagers: Array<ExtraManager>;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  vehicle: VehicleManager | null;
  component: VehicleComponentManager | null;
}
class VehicleComponentPane extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { extraManagers, identifiers } = this.props;

    if (
      extraManagers !== prevProps.extraManagers ||
      identifiers !== prevProps.identifiers
    ) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { extraManagers, identifiers } = props;

    let foundExtra: ExtraManager | null | undefined = null;
    let foundVehicle: VehicleManager | null | undefined = null;
    let foundComponent: VehicleComponentManager | null | undefined = null;
    if (identifiers !== null) {
      foundExtra = extraManagers.find(
        (extra) => identifiers.vehicleId === extra.getMappingId()
      );
      if (foundExtra) {
        foundVehicle = foundExtra.getExtraData() as VehicleManager;
        foundComponent = foundVehicle
          .getComponents()
          .find((component) => identifiers.id === component.getMappingId());
      }
    }

    return {
      vehicle: foundVehicle ? foundVehicle : null,
      component: foundComponent ? foundComponent : null,
    };
  };

  handleParentClick = (): void => {
    const { paneHistoryPush } = this.props;
    const { vehicle } = this.state;

    if (vehicle) {
      paneHistoryPush(
        PaneComponentEnum.VEHICLE,
        PaneIdentifierUtils.generateVehicle(vehicle.getMappingId())
      );
    }
  };

  handleHealthAdjusterSave = (hitPointDiff: number): void => {
    const { component } = this.state;

    if (component === null) {
      return;
    }

    component.handleHitPointAdjustment({ hitPointDiff });
  };

  renderBlock = (): React.ReactNode => {
    const { vehicle, component } = this.state;
    const { ruleData, theme } = this.props;

    if (vehicle === null || component === null) {
      return;
    }

    return (
      <div className="ct-vehicle-component-pane__block">
        <VehicleBlockShell displayType={vehicle.getDisplayType()}>
          <VehicleBlockComponent
            {...ComponentUtils.generateVehicleBlockComponentProps(
              component.vehicleComponent,
              vehicle.vehicle,
              ruleData
            )}
            theme={theme}
            shouldCoalesce={false}
          />
        </VehicleBlockShell>
      </div>
    );
  };

  renderName = (): React.ReactNode => {
    const { component } = this.state;

    if (component === null) {
      return null;
    }

    let name = component.getName();

    if (name === null) {
      return null;
    }

    let nameText: Array<string> = [];
    const typeNames = component.getTypeNames();
    if (typeNames.length > 0 && !typeNames.includes(name)) {
      nameText.push(FormatUtils.renderNonOxfordCommaList(typeNames));
    }

    nameText.push(name);

    return nameText.join(": ");
  };

  render() {
    const { vehicle, component } = this.state;
    const { isReadonly } = this.props;

    if (vehicle === null || component === null) {
      return <PaneInitFailureContent />;
    }

    const hitPointInfo = component.getHitPointInfo();

    return (
      <div className="ct-vehicle-component-pane" key={component.getUniqueKey()}>
        <Header parent={vehicle.getName()} onClick={this.handleParentClick}>
          {this.renderName()}
        </Header>
        {hitPointInfo !== null && (
          <VehicleHealthAdjuster
            hitPointInfo={hitPointInfo}
            isInteractive={!isReadonly}
            initiallyCollapsed={false}
            onSave={this.handleHealthAdjusterSave}
          />
        )}
        {this.renderBlock()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    isReadonly: appEnvSelectors.getIsReadonly(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
  };
}

const VehicleComponentPaneContainer = (props) => {
  const extras = useExtras();
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return (
    <VehicleComponentPane
      extraManagers={extras}
      paneHistoryPush={paneHistoryPush}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(VehicleComponentPaneContainer);
