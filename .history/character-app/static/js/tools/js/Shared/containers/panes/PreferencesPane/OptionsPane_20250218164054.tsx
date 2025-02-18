import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  FeatureFlagContext,
  LightLinkOutSvg,
  PrivacyTypeRadio,
} from "@dndbeyond/character-components/es";
import {
  AnySimpleDataType,
  characterActions,
  CharacterPreferences,
  CharacterTheme,
  CharacterUtils,
  CharClass,
  ClassSpellListSpellsLookup,
  ClassUtils,
  Constants,
  DataOriginRefData,
  HelperUtils,
  Race,
  RuleData,
  rulesEngineSelectors,
  RaceUtils,
} from "../../rules-engine/es";
import { Dice } from "@dndbeyond/dice";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneMenuItem } from "~/subApps/sheet/components/Sidebar/components/PaneMenu";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { sheetAppSelectors } from "../../../../CharacterSheet/selectors";
import config from "../../../../config";
import { appEnvActions } from "../../../actions";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";
import PreferencesPaneToggleField from "./PreferencesPaneToggleField";

// This component is NOT used - it's only for character campaigns (hasCampaignSettingFlag)

interface Props extends DispatchProp {
  activeSourceCategories: Array<number>;
  preferences: CharacterPreferences;
  ruleData: RuleData;
  diceEnabled: boolean;
  classes: Array<CharClass>;
  species: Race | null;
  dataOriginRefData: DataOriginRefData;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  builderUrl: string;
  characterTheme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class PreferencesPane extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handlePreferenceChange = (
    prefKey: string,
    value: AnySimpleDataType
  ): void => {
    const { dispatch } = this.props;
    const typedPrefKey = CharacterUtils.getPreferenceKey(prefKey);
    if (typedPrefKey !== null) {
      dispatch(characterActions.preferenceChoose(typedPrefKey, value));
    }
  };

  handleIntPreferenceChange = (prefKey: string, value: number | null): void => {
    const { dispatch } = this.props;
    const typedPrefKey = CharacterUtils.getPreferenceKey(prefKey);
    if (typedPrefKey !== null) {
      dispatch(characterActions.preferenceChoose(typedPrefKey, value));
    }
  };

  handleSourceCategoryChange = (sourceId: number, isActive: boolean): void => {
    const { dispatch, activeSourceCategories } = this.props;
    let newSourceCats: Array<number> = [];
    if (isActive) {
      newSourceCats = [...activeSourceCategories, sourceId];
    } else {
      newSourceCats = activeSourceCategories.filter((id) => id !== sourceId);
    }

    dispatch(characterActions.activeSourceCategoriesSet(newSourceCats));
  };

  handleOptionalClassFeaturesPreferenceChangePromise = (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ): void => {
    const { paneHistoryStart, classes, classSpellListSpellsLookup } =
      this.props;
    const spellListIds: Array<number> =
      ClassUtils.getUpdateEnableOptionalClassFeaturesSpellListIdsToRemove(
        classes,
        newIsEnabled
      );

    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      this.handlePreferenceChange("enableOptionalClassFeatures", newIsEnabled);
      accept();
    } else {
      paneHistoryStart(
        PaneComponentEnum.PREFERENCES_OPTIONAL_CLASS_FEATURES_CONFIRM,
        PaneIdentifierUtils.generatePreferenceOptionalClassFeaturesConfirm(
          spellListIds,
          newIsEnabled
        )
      );
      reject();
    }
  };

  handleOptionalOriginsPreferenceChangePromise = (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ): void => {
    const { paneHistoryStart, species, classSpellListSpellsLookup } =
      this.props;

    if (!species) {
      this.handlePreferenceChange("enableOptionalOrigins", newIsEnabled);
      accept();

      return;
    }

    const spellListIds: Array<number> =
      RaceUtils.getUpdateEnableOptionalOriginsSpellListIdsToRemove(
        species,
        newIsEnabled
      );

    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      this.handlePreferenceChange("enableOptionalOrigins", newIsEnabled);
      accept();
    } else {
      paneHistoryStart(
        PaneComponentEnum.PREFERENCES_OPTIONAL_ORIGINS_CONFIRM,
        PaneIdentifierUtils.generatePreferenceOptionalOriginsConfirm(
          spellListIds,
          newIsEnabled
        )
      );
      reject();
    }
  };

  handleProgressionPreferenceChangePromise = (
    newId: string,
    oldId: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { paneHistoryStart } = this.props;

    const newIdValue = HelperUtils.parseInputInt(newId);

    if (newIdValue !== null) {
      paneHistoryStart(
        PaneComponentEnum.PREFERENCES_PROGRESSION_CONFIRM,
        PaneIdentifierUtils.generatePreferenceProgressionConfirm(newIdValue)
      );
    }

    reject();
  };

  handleHitPointPreferenceChangePromise = (
    newId: string,
    oldId: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { paneHistoryStart } = this.props;

    const newIdValue = HelperUtils.parseInputInt(newId);

    if (newIdValue !== null) {
      paneHistoryStart(
        PaneComponentEnum.PREFERENCES_HIT_POINT_CONFIRM,
        PaneIdentifierUtils.generatePreferenceHitPointConfirm(newIdValue)
      );
    }

    reject();
  };

  handleDiceToggle = (): void => {
    const { dispatch, diceEnabled } = this.props;

    const newDiceEnabledSetting: boolean = !diceEnabled;

    try {
      localStorage.setItem("dice-enabled", newDiceEnabledSetting.toString());
      Dice.setEnabled(newDiceEnabledSetting);
    } catch (e) {}

    dispatch(
      appEnvActions.dataSet({
        diceEnabled: newDiceEnabledSetting,
      })
    );
  };

  handleAbilityScoreDisplayToggle = (): void => {
    const { dispatch, preferences } = this.props;
    const { abilityScoreDisplayType } = preferences;
    const newSetting =
      abilityScoreDisplayType ===
      Constants.PreferenceAbilityScoreDisplayTypeEnum.MODIFIERS_TOP
        ? Constants.PreferenceAbilityScoreDisplayTypeEnum.SCORES_TOP
        : Constants.PreferenceAbilityScoreDisplayTypeEnum.MODIFIERS_TOP;
    const typedPrefKey = CharacterUtils.getPreferenceKey(
      "abilityScoreDisplayType"
    );

    if (typedPrefKey !== null) {
      dispatch(characterActions.preferenceChoose(typedPrefKey, newSetting));
    }
  };

  handlePrivacyToggle = (): void => {
    const { dispatch, preferences } = this.props;
    const { privacyType } = preferences;
    const newSetting =
      privacyType === Constants.PreferencePrivacyTypeEnum.PUBLIC
        ? Constants.PreferencePrivacyTypeEnum.PRIVATE
        : Constants.PreferencePrivacyTypeEnum.PUBLIC;
    const typedPrefKey = CharacterUtils.getPreferenceKey("privacyType");

    if (typedPrefKey !== null) {
      dispatch(characterActions.preferenceChoose(typedPrefKey, newSetting));
    }
  };

  handleBuilderClick = (): void => {
    const { builderUrl } = this.props;

    // @ts-ignore
    window.location = builderUrl;
  };

  handleChangePrivacy = (value: number | null): void => {
    const typedPrefKey = CharacterUtils.getPreferenceKey("privacyType");
    if (typedPrefKey !== null) {
      this.props.dispatch(
        characterActions.preferenceChoose(typedPrefKey, value)
      );
    }
  };

  render() {
    const { preferences, diceEnabled } = this.props;

    const {
      abilityScoreDisplayType,
      privacyType,
      showScaledSpells,
      enableDarkMode,
    } = preferences;

    return (
      <div className="ct-preferences-pane">
        <Header>Character Options</Header>

        <PaneMenuItem
          className="ct-pane-menu__item--options"
          menukey="builder"
          suffixIcon={<LightLinkOutSvg />}
          onClick={this.handleBuilderClick}
        >
          Looking for Character Builder Options?
        </PaneMenuItem>

        <PreferencesPaneToggleField
          heading="Underdark Mode"
          description="Enables dark mode for this character"
          initiallyEnabled={enableDarkMode}
          onChange={this.handlePreferenceChange.bind(this, "enableDarkMode")}
        />
        <PreferencesPaneToggleField
          heading="Dice Rolling"
          description="Enables digital dice rolling for this character"
          initiallyEnabled={diceEnabled}
          onChange={this.handleDiceToggle}
        />
        <PreferencesPaneToggleField
          heading="Show Level-Scaled Spells"
          description="Display and highlight available spells to cast with higher level spell slots"
          initiallyEnabled={showScaledSpells}
          onChange={this.handlePreferenceChange.bind(this, "showScaledSpells")}
        />
        <PreferencesPaneToggleField
          heading="Ability Scores on Top"
          description="Swap the arrangement of ability modifiers and scores"
          initiallyEnabled={
            abilityScoreDisplayType ===
            Constants.PreferenceAbilityScoreDisplayTypeEnum.SCORES_TOP
          }
          onChange={this.handleAbilityScoreDisplayToggle}
        />

        <PrivacyTypeRadio
          handleChange={(e) =>
            this.handleChangePrivacy(parseInt(e?.target?.value))
          }
          darkMode={enableDarkMode}
          initialValue={privacyType}
          themeColor={this.props.characterTheme.themeColor}
          compact
        />

        <div className="ct-preferences-pane__version">
          <div className="ct-preferences-pane__version-label">Version:</div>
          <div className="ct-preferences-pane__version-value">
            {config.version}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    activeSourceCategories:
      rulesEngineSelectors.getActiveSourceCategories(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    classes: rulesEngineSelectors.getClasses(state),
    species: rulesEngineSelectors.getRace(state),
    classSpellListSpellsLookup:
      rulesEngineSelectors.getClassSpellListSpellsLookup(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    builderUrl: sheetAppSelectors.getBuilderUrl(state),
    characterTheme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const OptionsPaneContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <PreferencesPane paneHistoryStart={paneHistoryStart} {...props} />;
};

export default connect(mapStateToProps)(OptionsPaneContainer);
