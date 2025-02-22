import React from "react";
import { connect, DispatchProp } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CampaignSummary,
  LightBuilderSvg,
  ThemedLongRestSvg,
  ThemedShareSvg,
  ThemedShortRestSvg,
} from "@dndbeyond/character-components/es";
import {
  CampaignDataContract,
  CharacterPreferences,
  characterSelectors,
  CharacterStatusSlug,
  CharacterTheme,
  Constants,
  Item,
  ItemUtils,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../Shared/selectors";
import { GameLogState } from "../../../Shared/stores/typings";
import WatchTourDialog from "../../components/WatchTourDialog";
import { sheetAppSelectors } from "../../selectors";
import { SheetAppState } from "../../typings";
import CharacterHeaderInfo from "../CharacterHeaderInfo";

interface Props extends DispatchProp {
  campaign: CampaignDataContract | null;
  builderUrl: string;
  items: Array<Item>;
  preferences: CharacterPreferences;
  theme: CharacterTheme;
  isReadonly: boolean;
  gameLog: GameLogState;
  status: CharacterStatusSlug | null;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}

class CharacterHeaderDesktop extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

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

  hasMagicItem = (): boolean => {
    const { items } = this.props;

    return !!items.find((item) => ItemUtils.isMagic(item));
  };

  renderSideContent = (): React.ReactNode => {
    const {
      builderUrl,
      campaign,
      preferences,
      isReadonly,
      theme,
      gameLog,
      status,
    } = this.props;

    if (isReadonly) {
      if (status === CharacterStatusSlug.PREMADE) {
        return <WatchTourDialog />;
      }

      if (!campaign) {
        return null;
      }

      return (
        <CampaignSummary
          campaign={campaign}
          onCampaignShow={this.handleCampaignShow}
          gameLog={gameLog}
          theme={theme}
        />
      );
    }

    return (
      <React.Fragment>
        {preferences !== null &&
          preferences.privacyType ===
            Constants.PreferencePrivacyTypeEnum.PUBLIC && (
            <div className="ct-character-header-desktop__group ct-character-header-desktop__group--share">
              <div
                className="ct-character-header-desktop__button"
                onClick={this.handleShareClick}
                role="button"
                tabIndex={0}
              >
                <div className="ct-character-header-desktop__button-icon">
                  <ThemedShareSvg theme={theme} />
                </div>
                <span className="ct-character-header-desktop__button-label">
                  Share
                </span>
              </div>
            </div>
          )}
        <div className="ct-character-header-desktop__group ct-character-header-desktop__group--short-rest">
          <div
            className="ct-character-header-desktop__button"
            onClick={this.handleShortResetClick}
            role="button"
            tabIndex={0}
          >
            <div className="ct-character-header-desktop__button-icon">
              <ThemedShortRestSvg theme={theme} />
            </div>
            <span className="ct-character-header-desktop__button-label">
              Short Rest
            </span>
          </div>
        </div>
        <div className="ct-character-header-desktop__group ct-character-header-desktop__group--long-rest">
          <div
            className="ct-character-header-desktop__button"
            onClick={this.handleLongResetClick}
            role="button"
            tabIndex={0}
          >
            <div className="ct-character-header-desktop__button-icon">
              <ThemedLongRestSvg theme={theme} />
            </div>
            <span className="ct-character-header-desktop__button-label">
              Long Rest
            </span>
          </div>
        </div>
        {/*{this.hasMagicItem() &&*/}
        {/*<div className="ct-character-header-desktop__group">*/}
        {/*<div className="ct-character-header-desktop__button" onClick={this.handleDawnClick}>*/}
        {/*<i className="i-menu-dawn" />*/}
        {/*<span className="ct-character-header-desktop__button-label">Dawn</span>*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*}*/}
        {campaign !== null && (
          <CampaignSummary
            campaign={campaign}
            onCampaignShow={this.handleCampaignShow}
            gameLog={gameLog}
            theme={theme}
          />
        )}
        <div className="ct-character-header-desktop__group ct-character-header-desktop__group--builder">
          <Tooltip
            isDarkMode={theme.isDarkMode}
            title="Go to builder"
            className="ct-character-header-desktop__builder"
          >
            <RouterLink
              to={builderUrl}
              className="ct-character-header-desktop__builder-link"
              aria-label="Go to builder"
            >
              <LightBuilderSvg />
            </RouterLink>
          </Tooltip>
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="ct-character-header-desktop">
        <div className="ct-character-header-desktop__group ct-character-header-desktop__group-tidbits">
          <CharacterHeaderInfo />
        </div>
        <div className="ct-character-header-desktop__group ct-character-header-desktop__group--gap" />
        {this.renderSideContent()}
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    builderUrl: sheetAppSelectors.getBuilderUrl(state),
    campaign: rulesEngineSelectors.getCampaign(state),
    items: rulesEngineSelectors.getInventory(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    gameLog: appEnvSelectors.getGameLog(state),
    status: characterSelectors.getStatusSlug(state),
  };
}

const CharacterHeaderDesktopContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <CharacterHeaderDesktop paneHistoryStart={paneHistoryStart} {...props} />
  );
};

export default connect(mapStateToProps)(CharacterHeaderDesktopContainer);
