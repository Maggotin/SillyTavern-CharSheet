import { visuallyHidden } from "@mui/utils";
import React, { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  rulesEngineSelectors,
  CharacterTheme,
  ExtrasFilterData,
  ExtraGroupInfo,
  Constants,
  ExtrasManager,
  ExtraManager,
} from "../../rules-engine/es";

import { TabFilter } from "~/components/TabFilter";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { useExtras } from "~/hooks/useExtras";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import ExtraList from "../../../Shared/components/ExtraList";
import { ThemeButton } from "../../../Shared/components/common/Button";
import { ExtrasManagerContext } from "../../../Shared/managers/ExtrasManagerContext";
import { appEnvSelectors } from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import ContentGroup from "../../components/ContentGroup";
import ExtrasFilter from "../../components/ExtrasFilter";
import { SheetAppState } from "../../typings";

interface Props extends DispatchProp {
  extras: Array<ExtraManager>;
  extrasManager: ExtrasManager;
  isReadonly: boolean;
  showNotes: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
interface State {
  filterData: ExtrasFilterData;
}
class Extras extends React.PureComponent<Props, State> {
  static defaultProps = {
    isReadonly: false,
    showNotes: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      filterData: {
        filteredExtras: [],
        showAdvancedFilters: false,
        isFiltering: false,
        filterCount: 0,
      },
    };
  }

  handleFilterUpdate = (filterData: ExtrasFilterData): void => {
    this.setState({
      filterData,
    });
  };

  handleManageClick = (): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(PaneComponentEnum.EXTRA_MANAGE);
  };

  handleExtraShow = (extra: ExtraManager): void => {
    const { paneHistoryStart } = this.props;

    if (extra.isCreature()) {
      paneHistoryStart(
        PaneComponentEnum.CREATURE,
        PaneIdentifierUtils.generateCreature(extra.getMappingId())
      );
    } else if (extra.isVehicle()) {
      paneHistoryStart(
        PaneComponentEnum.VEHICLE,
        PaneIdentifierUtils.generateVehicle(extra.getMappingId())
      );
    }
  };

  handleExtraStatusChange = (extra: ExtraManager, isActive: boolean): void => {
    extra.handleSetActive({ isActive });
  };

  renderManageButton = (): React.ReactNode => {
    const { isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <ThemeButton
        style="outline"
        size="medium"
        onClick={this.handleManageClick}
      >
        Manage Extras
      </ThemeButton>
    );
  };

  renderDefault = (): React.ReactNode => {
    return (
      <div className="ct-extras__empty">
        Extras that you add will display here.
      </div>
    );
  };

  renderNoResults = (): React.ReactNode => {
    return (
      <div className="ct-extras__empty">No Extras Match the Current Filter</div>
    );
  };

  renderContent = (): React.ReactNode => {
    const { filterData } = this.state;
    const { extras, extrasManager, showNotes, isReadonly, theme } = this.props;

    if (!extras.length) {
      return this.renderDefault();
    }

    if (filterData.showAdvancedFilters) {
      return null;
    }

    if (!filterData.filteredExtras.length) {
      return this.renderNoResults();
    }

    let groups = extrasManager.getExtrasGroups(filterData.filteredExtras);
    const orderedGroupInfos = extrasManager.getGroupInfosForExtras(
      filterData.filteredExtras
    );

    let primaryGroups: Array<ExtraGroupInfo> = [];
    let otherGroups: Array<ExtraGroupInfo> = [];
    let vehicleGroups: Array<ExtraGroupInfo> = [];
    orderedGroupInfos.forEach((groupInfo) => {
      if (groupInfo) {
        if (groupInfo.isPrimary) {
          primaryGroups.push(groupInfo);
        } else if (groupInfo.id === Constants.ExtraGroupTypeEnum.VEHICLE) {
          vehicleGroups.push(groupInfo);
        } else {
          otherGroups.push(groupInfo);
        }
      }
    });

    return (
      <div className="ct-extras__content">
        <TabFilter
          filters={[
            ...primaryGroups.map((groupInfo) => ({
              label: groupInfo.name || "",
              content: (
                <ContentGroup header={groupInfo.name}>
                  <ExtraList
                    theme={theme}
                    extras={groups[groupInfo.id]}
                    showNotes={showNotes}
                    onShow={this.handleExtraShow}
                    onStatusChange={this.handleExtraStatusChange}
                    isReadonly={isReadonly}
                  />
                </ContentGroup>
              ),
            })),
            ...(otherGroups.length > 0
              ? [
                  {
                    label: "Other",
                    content: otherGroups.map((groupInfo) => (
                      <ContentGroup key={groupInfo.id} header={groupInfo.name}>
                        <ExtraList
                          theme={theme}
                          extras={groups[groupInfo.id]}
                          showNotes={showNotes}
                          onShow={this.handleExtraShow}
                          onStatusChange={this.handleExtraStatusChange}
                          isReadonly={isReadonly}
                        />
                      </ContentGroup>
                    )),
                  },
                ]
              : []),
            ...(vehicleGroups.length > 0
              ? [
                  {
                    label: "Vehicle",
                    content: vehicleGroups.map((groupInfo) => (
                      <ContentGroup key={groupInfo.id} header={groupInfo.name}>
                        <ExtraList
                          theme={theme}
                          extras={groups[groupInfo.id]}
                          showNotes={showNotes}
                          onShow={this.handleExtraShow}
                          onStatusChange={this.handleExtraStatusChange}
                          isReadonly={isReadonly}
                        />
                      </ContentGroup>
                    )),
                  },
                ]
              : []),
          ]}
        />
      </div>
    );
  };

  render() {
    const { extras, theme } = this.props;

    return (
      <section
        className={`ct-extras ${
          theme.isDarkMode ? "ct-extras--dark-mode" : ""
        }`}
      >
        <h2 style={visuallyHidden}>Extras</h2>
        <div className="ct-extras__filter">
          <ExtrasFilter
            extras={extras}
            onDataUpdate={this.handleFilterUpdate}
            callout={this.renderManageButton()}
            theme={theme}
          />
        </div>
        {this.renderContent()}
      </section>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

function ExtrasContainer(props) {
  const { extrasManager } = useContext(ExtrasManagerContext);
  const extras = useExtras();
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <Extras
      extrasManager={extrasManager}
      paneHistoryStart={paneHistoryStart}
      extras={extras}
      {...props}
    />
  );
}

export default connect(mapStateToProps)(ExtrasContainer);
