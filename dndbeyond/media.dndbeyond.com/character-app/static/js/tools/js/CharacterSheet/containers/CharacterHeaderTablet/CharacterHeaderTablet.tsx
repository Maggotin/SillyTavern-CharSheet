import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  LightBuilderSvg,
  ThemedShareSvg,
  ThemedLongRestSvg,
  ThemedShortRestSvg,
} from "@dndbeyond/character-components/es";
import {
  characterActions,
  CampaignDataContract,
  CharacterPreferences,
  characterSelectors,
  CharacterStatusSlug,
  CharacterTheme,
  Constants,
  HitPointInfo,
  Item,
  ItemUtils,
  RuleData,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { Link } from "~/components/Link";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../Shared/selectors";
import StatusSummaryMobile from "../../components/StatusSummaryMobile";
import WatchTourDialog from "../../components/WatchTourDialog";
import { sheetAppSelectors } from "../../selectors";
import { SheetAppState } from "../../typings";
import { CharacterHeaderInfo } from "../CharacterHeaderInfo";

interface Props extends DispatchProp {
  hitPointInfo: HitPointInfo;
  fails: number;
  successes: number;
  deathCause: Constants.DeathCauseEnum;
  inspiration: boolean;
  campaign: CampaignDataContract | null;
  builderUrl: string;
  items: Array<Item>;
  preferences: CharacterPreferences;
  ruleData: RuleData;
  isReadonly: boolean;
  theme: CharacterTheme;
  status: CharacterStatusSlug | null;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class CharacterHeaderTablet extends React.PureComponent<Props> {
  handleCampaignShow = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.CAMPAIGN);
  };

  handleShortResetClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryStart(PaneComponentEnum.SHORT_REST);
  };

  handleGameLogClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryStart(PaneComponentEnum.GAME_LOG);
  };

  handleLongResetClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryStart(PaneComponentEnum.LONG_REST);
  };

  handleShareClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryStart(PaneComponentEnum.SHARE_URL);
  };

  handleHealthSummaryClick = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.HEALTH_MANAGE);
    }
  };

  handleInspirationClick = (): void => {
    const { inspiration, dispatch } = this.props;

    dispatch(characterActions.inspirationSet(!inspiration));
  };

  hasMagicItem = (): boolean => {
    const { items } = this.props;

    return !!items.find((item) => ItemUtils.isMagic(item));
  };

  renderSideContent = (): React.ReactNode => {
    const {
      hitPointInfo,
      fails,
      successes,
      deathCause,
      inspiration,
      builderUrl,
      preferences,
      isReadonly,
      ruleData,
      theme,
      status,
    } = this.props;

    if (isReadonly) {
      if (status === CharacterStatusSlug.PREMADE) {
        return (
          <div>
            <WatchTourDialog />
          </div>
        );
      }
      return (
        <React.Fragment>
          <div className="ct-character-header-tablet__group ct-character-header-tablet__group--summary">
            <StatusSummaryMobile
              hitPointInfo={hitPointInfo}
              fails={fails}
              successes={successes}
              inspiration={inspiration}
              ruleData={ruleData}
              deathCause={deathCause}
              onHealthClick={this.handleHealthSummaryClick}
              onInspirationClick={this.handleInspirationClick}
              isInteractive={!isReadonly}
            />
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {preferences !== null &&
          preferences.privacyType ===
            Constants.PreferencePrivacyTypeEnum.PUBLIC && (
            <div className="ct-character-header-tablet__group ct-character-header-tablet__group--share">
              <div
                className="ct-character-header-tablet__button"
                onClick={this.handleShareClick}
                role="button"
                tabIndex={0}
              >
                <div className="ct-character-header-tablet__button-icon">
                  <ThemedShareSvg theme={theme} />
                </div>
                <span className="ct-character-header-tablet__button-label">
                  Share
                </span>
              </div>
            </div>
          )}
        <div className="ct-character-header-tablet__group ct-character-header-tablet__group--short-rest">
          <div
            className="ct-character-header-tablet__button"
            onClick={this.handleShortResetClick}
            role="button"
            tabIndex={0}
          >
            <div className="ct-character-header-tablet__button-icon">
              <ThemedShortRestSvg theme={theme} />
            </div>
            <span className="ct-character-header-tablet__button-label">
              Short Rest
            </span>
          </div>
        </div>
        <div className="ct-character-header-tablet__group ct-character-header-tablet__group--long-rest">
          <div
            className="ct-character-header-tablet__button"
            onClick={this.handleLongResetClick}
            role="button"
            tabIndex={0}
          >
            <div className="ct-character-header-tablet__button-icon">
              <ThemedLongRestSvg theme={theme} />
            </div>
            <span className="ct-character-header-tablet__button-label">
              Long Rest
            </span>
          </div>
        </div>
        <div className="ct-character-header-tablet__group ct-character-header-tablet__group--builder">
          <Tooltip
            isDarkMode={theme.isDarkMode}
            title="Go to builder"
            className="ct-character-header-tablet__builder"
          >
            <Link
              href={builderUrl}
              className="ct-character-header-tablet__builder-link"
              useRouter
            >
              <LightBuilderSvg />
            </Link>
          </Tooltip>
        </div>
        <div className="ct-character-header-tablet__group ct-character-header-tablet__group--summary">
          <StatusSummaryMobile
            hitPointInfo={hitPointInfo}
            fails={fails}
            successes={successes}
            deathCause={deathCause}
            inspiration={inspiration}
            ruleData={ruleData}
            onHealthClick={this.handleHealthSummaryClick}
            onInspirationClick={this.handleInspirationClick}
            isInteractive={!isReadonly}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="ct-character-header-tablet">
        <div className="ct-character-header-tablet__group ct-character-header-tablet__group-tidbits">
          <CharacterHeaderInfo />
        </div>
        <div className="ct-character-header-tablet__group ct-character-header-tablet__group--gap" />
        {this.renderSideContent()}
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    hitPointInfo: rulesEngineSelectors.getHitPointInfo(state),
    fails: rulesEngineSelectors.getDeathSavesFailCount(state),
    successes: rulesEngineSelectors.getDeathSavesSuccessCount(state),
    inspiration: rulesEngineSelectors.getInspiration(state),
    builderUrl: sheetAppSelectors.getBuilderUrl(state),
    campaign: rulesEngineSelectors.getCampaign(state),
    items: rulesEngineSelectors.getInventory(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    deathCause: rulesEngineSelectors.getDeathCause(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    status: characterSelectors.getStatusSlug(state),
  };
}

const CharacterHeaderTabletContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <CharacterHeaderTablet paneHistoryStart={paneHistoryStart} {...props} />
  );
};

export default connect(mapStateToProps)(CharacterHeaderTabletContainer);
