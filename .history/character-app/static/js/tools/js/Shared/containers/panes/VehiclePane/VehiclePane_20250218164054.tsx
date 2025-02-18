import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { has } from "lodash";
import React from "react";
import { connect } from "react-redux";

import {
  Collapsible,
  DisabledLockSvg,
  MarketplaceCta,
} from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  ConditionContract,
  Constants,
  ExtraManager,
  FormatUtils,
  RuleData,
  rulesEngineSelectors,
  VehicleComponentManager,
  VehicleManager,
} from "../../rules-engine/es";

import { EditableName } from "~/components/EditableName";
import { HtmlContent } from "~/components/HtmlContent";
import { Link } from "~/components/Link";
import { Reference } from "~/components/Reference";
import { TagGroup } from "~/components/TagGroup";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { useExtras } from "~/hooks/useExtras";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  PaneComponentEnum,
  PaneIdentifiersVehicle,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import CustomizeDataEditor from "../../../components/CustomizeDataEditor";
import EditorBox from "../../../components/EditorBox";
import VehicleBlock from "../../../components/VehicleBlock";
import VehicleConditionTrackers from "../../../components/VehicleConditionsTracker";
import VehicleFuelTracker from "../../../components/VehicleFuelTracker";
import VehicleHealthAdjuster from "../../../components/VehicleHealthAdjuster";
import { RemoveButton } from "../../../components/common/Button";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import {
  ComponentUtils,
  PaneIdentifierUtils,
  TypeScriptUtils,
} from "../../../utils";

interface Hack_DataForEditor {
  name: string | null;
  notes: string | null;
}
interface Hack_DataForAction {
  name: string | null;
  description: string | null;
}

interface Props {
  identifiers: PaneIdentifiersVehicle | null;
  isReadonly: boolean;
  ruleData: RuleData;
  theme: CharacterTheme;
  extraManagers: Array<ExtraManager>;
  paneContext: PaneInfo;
}

interface State {
  vehicle: VehicleManager | null;
  isCustomizeClosed: boolean;
}
class VehiclePane extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = this.generateStateData(props, true);
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
      this.setState(
        this.generateStateData(this.props, prevState.isCustomizeClosed)
      );
    }
  }

  generateStateData = (props: Props, isCustomizeClosed: boolean): State => {
    const { extraManagers, identifiers } = props;

    let extraManager: ExtraManager | null | undefined = null;

    if (identifiers !== null) {
      extraManager = extraManagers.find(
        (extraManager) => identifiers.id === extraManager.getMappingId()
      );
    }

    return {
      vehicle: extraManager
        ? (extraManager.getExtraData() as VehicleManager)
        : null,
      isCustomizeClosed,
    };
  };

  handleOpenCustomize = () => {
    this.setState({ isCustomizeClosed: !this.state.isCustomizeClosed });
  };

  handleComponentClick = (componentId: number, vehicleId: number): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    paneHistoryPush(
      PaneComponentEnum.VEHICLE_COMPONENT,
      PaneIdentifierUtils.generateVehicleComponent(componentId, vehicleId)
    );
  };

  handleActionStationClick = (stationId: number, vehicleId: number): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    paneHistoryPush(
      PaneComponentEnum.VEHICLE_ACTION_STATION,
      PaneIdentifierUtils.generateVehicleActionStation(stationId, vehicleId)
    );
  };

  handleRemove = (): void => {
    const { vehicle } = this.state;
    const {
      paneContext: { paneHistoryStart },
    } = this.props;

    if (vehicle === null) {
      return;
    }

    paneHistoryStart(PaneComponentEnum.EXTRA_MANAGE);
    vehicle.handleRemove();
  };

  hack__transformDataForEditor = (
    data: Hack_DataForAction
  ): Hack_DataForEditor => {
    return {
      name: data.name,
      notes: data.description,
    };
  };

  hack__transformDataForAction = (
    data: Hack_DataForEditor
  ): Hack_DataForAction => {
    return {
      name: data.name,
      description: data.notes,
    };
  };

  handleDataUpdate = (properties: Hack_DataForEditor): void => {
    const { vehicle } = this.state;

    if (!vehicle) {
      return;
    }

    const data = this.getData();
    const prevData: Partial<Hack_DataForEditor> = data ? data : {};

    const newProperties: Hack_DataForEditor = {
      ...prevData,
      ...properties,
    };

    vehicle.handleDataUpdate({
      properties: this.hack__transformDataForAction(newProperties),
    });
  };

  handleHealthAdjusterSave = (
    hitPointDiff: number,
    vehicleComponentManager: VehicleComponentManager
  ): void => {
    vehicleComponentManager.handleHitPointAdjustment({ hitPointDiff });
  };

  handleFuelChange = (remainingFuel: number): void => {
    const { vehicle } = this.state;

    if (!vehicle) {
      return;
    }

    vehicle.handleFuelChange({ remainingFuel });
  };

  handleConditionLevelChange = (
    conditionId: number,
    newLevel: number | null,
    prevLevel: number | null
  ): void => {
    const { vehicle } = this.state;

    if (vehicle === null) {
      return;
    }

    vehicle.handleConditionLevelChange(conditionId, newLevel, prevLevel);
  };

  getData = (): Hack_DataForEditor => {
    const { vehicle } = this.state;

    if (!vehicle) {
      return {
        name: null,
        notes: null,
      };
    }

    const name = vehicle.getName();
    const description = vehicle.getDescription();

    return this.hack__transformDataForEditor({ name, description });
  };

  renderCustomize = (): React.ReactNode => {
    const { isReadonly } = this.props;
    const { isCustomizeClosed } = this.state;

    if (isReadonly) {
      return null;
    }

    return (
      <div className="ct-vehicle-pane__customize">
        <Collapsible
          layoutType={"minimal"}
          header="Customize"
          collapsed={isCustomizeClosed}
          onChangeHandler={this.handleOpenCustomize}
        >
          <EditorBox>
            <CustomizeDataEditor
              data={this.getData()}
              enableNotes={true}
              enableName={true}
              onDataUpdate={this.handleDataUpdate}
            />
          </EditorBox>
        </Collapsible>
      </div>
    );
  };

  renderImage = (): React.ReactNode => {
    const { vehicle } = this.state;

    if (!vehicle) {
      return null;
    }

    let largeAvatarUrl = vehicle.getLargeAvatarUrl();
    if (!largeAvatarUrl) {
      return null;
    }

    const name = vehicle.getDefinitionName();
    let altText: string = name ? name : "vehicle image";

    return (
      <div className="ct-vehicle-pane__full-image">
        <img
          className="ct-vehicle-pane__full-image-img"
          src={largeAvatarUrl}
          alt={altText}
        />
      </div>
    );
  };

  renderTags = (): React.ReactNode => {
    const { vehicle } = this.state;

    if (!vehicle) {
      return null;
    }

    const tags = vehicle.getMovementNames();

    if (!tags.length) {
      return null;
    }

    return <TagGroup label="Tags" tags={tags} />;
  };

  renderDescription = (): React.ReactNode => {
    const { vehicle } = this.state;

    if (!vehicle) {
      return null;
    }

    const description = vehicle.getDefinitionDescription();
    if (!description) {
      return null;
    }

    const label = vehicle.getDefinitionName();

    return (
      <div className="ct-vehicle-pane__description">
        {label && (
          <div className="ct-vehicle-pane__description-heading">
            <Heading>{label}</Heading>
          </div>
        )}
        <HtmlContent
          className="ct-vehicle-pane__description-content"
          html={description}
          withoutTooltips
        />
      </div>
    );
  };

  renderActions = (): React.ReactNode => {
    const { isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <div className="ct-vehicle-pane__actions">
        <div className="ct-vehicle-pane__action">
          <RemoveButton onClick={this.handleRemove} />
        </div>
      </div>
    );
  };

  renderMarketplaceCta = (): React.ReactNode => {
    const { vehicle } = this.state;

    if (vehicle === null) {
      return null; //TODO could render a default empty state
    }

    let sourceNames = vehicle.getSourceNames();

    const sourceName: string | null =
      sourceNames.length > 0
        ? FormatUtils.renderNonOxfordCommaList(sourceNames)
        : null;
    const description: string =
      "To unlock this vehicle, check out the Marketplace to view purchase options.";

    return <MarketplaceCta sourceName={sourceName} description={description} />;
  };

  renderHealthAdjuster = (): React.ReactNode => {
    const { vehicle } = this.state;
    const { isReadonly } = this.props;

    if (vehicle === null) {
      return null;
    }

    if (!vehicle.isSpelljammer()) {
      const primaryComponent = vehicle.getPrimaryComponent();
      if (primaryComponent === null) {
        return null;
      }

      const hitPointInfo = primaryComponent.getHitPointInfo();
      if (hitPointInfo === null) {
        return null;
      }

      return (
        <VehicleHealthAdjuster
          hitPointInfo={hitPointInfo}
          onSave={(diff) =>
            this.handleHealthAdjusterSave(diff, primaryComponent)
          }
          isInteractive={!isReadonly}
        />
      );
    }

    const components = vehicle
      .getComponents()
      .filter((component) => component.getHitPointInfo() !== null);
    const componentCount = {};
    components.forEach((component) => {
      const componentName = component.getName();
      if (!componentName) {
        return;
      }
      if (has(componentCount, componentName)) {
        (componentCount[componentName] as number) += 1;
      } else {
        (componentCount[componentName] as number) = 1;
      }
    });
    const currentComponents = {};
    return components.map((component) => {
      const componentHitPointInfo = component.getHitPointInfo();
      if (componentHitPointInfo === null) {
        return null;
      }
      const componentName = component.getName() ?? "Hull";
      let componentNumber = "";
      if (componentCount[componentName] > 1) {
        if (has(currentComponents, componentName)) {
          componentNumber = ` ${((currentComponents[
            componentName
          ] as number) += 1)}`;
        } else {
          componentNumber = " 1";
          (currentComponents[componentName] as number) = 1;
        }
      }
      return (
        <VehicleHealthAdjuster
          hitPointInfo={componentHitPointInfo}
          onSave={(diff) => this.handleHealthAdjusterSave(diff, component)}
          heading={`Hit Points (${componentName}${componentNumber})`}
          isInteractive={!isReadonly}
        />
      );
    });
  };

  renderFuelTracker = (): React.ReactNode => {
    const { vehicle } = this.state;
    const { isReadonly } = this.props;

    if (vehicle === null) {
      return null;
    }

    const fuelData = vehicle.getFuelData();

    if (fuelData === null) {
      return null;
    }

    return (
      <VehicleFuelTracker
        fuelData={fuelData}
        onChange={this.handleFuelChange}
        isInteractive={!isReadonly}
      />
    );
  };

  renderConditionTrackers = (): React.ReactNode => {
    const { vehicle } = this.state;
    const { isReadonly } = this.props;

    if (vehicle === null) {
      return null;
    }

    const enabledConditions: Array<ConditionContract> = vehicle
      .getResolvedEnabledConditions()
      .filter(TypeScriptUtils.isNotNullOrUndefined);

    return (
      <VehicleConditionTrackers
        activeConditionLookup={vehicle.getActiveConditionLookup()}
        enabledConditions={enabledConditions}
        onLevelChange={this.handleConditionLevelChange}
        isInteractive={!isReadonly}
      />
    );
  };

  renderVehicleContent = (): React.ReactNode => {
    const { vehicle } = this.state;
    const { isReadonly, theme } = this.props;

    if (!vehicle) {
      return null; //TODO could render a default empty state
    }

    const primaryComponentManageType = vehicle.getPrimaryComponentManageType();
    const enableConditionTracking = vehicle.getEnableConditionTracking();
    const enableFuelTracking = vehicle.getEnableFuelTracking();
    const shouldCoalesce = vehicle.isSpelljammer();

    return (
      <React.Fragment>
        {this.renderCustomize()}
        {primaryComponentManageType ===
          Constants.VehicleConfigurationPrimaryComponentManageTypeEnum
            .VEHICLE && this.renderHealthAdjuster()}
        {enableFuelTracking && this.renderFuelTracker()}
        {enableConditionTracking && this.renderConditionTrackers()}
        <div className="ct-vehicle-pane__block">
          <VehicleBlock
            {...ComponentUtils.generateVehicleBlockProps(vehicle)}
            shouldCoalesce={shouldCoalesce}
            onComponentClick={this.handleComponentClick}
            onActionStationClick={this.handleActionStationClick}
            isInteractive={shouldCoalesce ? false : !isReadonly}
            theme={theme}
          />
        </div>
        {this.renderImage()}
        {this.renderTags()}
        {this.renderDescription()}
        <Link
          href={vehicle.getUrl() ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "8px",
            color: "primary.main",
          }}
        >
          {vehicle.getDefinitionName()} Details Page <ArrowRightAltIcon />
        </Link>
        {this.renderActions()}
      </React.Fragment>
    );
  };

  renderVehicleName = (): React.ReactNode => {
    const { vehicle } = this.state;
    const { theme } = this.props;

    if (!vehicle) {
      return null; //TODO could render a default empty state
    }

    const isAccessible = vehicle.isAccessible();
    let name = vehicle.getName();

    if (isAccessible) {
      return (
        <EditableName onClick={this.handleOpenCustomize}>{name}</EditableName>
      );
    } else {
      return (
        <React.Fragment>
          <DisabledLockSvg className="ct-vehicle-pane__header-lock" />
          {name}
        </React.Fragment>
      );
    }
  };

  render() {
    const { vehicle } = this.state;
    const { theme } = this.props;
    if (!vehicle) {
      return <PaneInitFailureContent />;
    }

    const isAccessible = vehicle.isAccessible();

    let avatarUrl = vehicle.getAvatarUrl();
    if (!avatarUrl) {
      avatarUrl = "";
    }

    return (
      <div className="ct-vehicle-pane" key={vehicle.getUniqueKey()}>
        <Header parent="Vehicle" preview={<Preview imageUrl={avatarUrl} />}>
          {this.renderVehicleName()}
        </Header>
        {vehicle.isHomebrew() ? (
          <Reference isDarkMode={theme.isDarkMode} name="Homebrew" />
        ) : (
          vehicle.getSourceNames().map((source, idx) => {
            return (
              <React.Fragment key={source}>
                {idx > 0 ? " /" : ""}{" "}
                <Reference isDarkMode={theme.isDarkMode} name={source} />
              </React.Fragment>
            );
          })
        )}
        {isAccessible
          ? this.renderVehicleContent()
          : this.renderMarketplaceCta()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    isReadonly: appEnvSelectors.getIsReadonly(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const VehiclePaneContainer = (props) => {
  const extras = useExtras();
  const { pane } = useSidebar();
  return <VehiclePane extraManagers={extras} paneContext={pane} {...props} />;
};
export default connect(mapStateToProps)(VehiclePaneContainer);
