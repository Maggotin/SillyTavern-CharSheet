import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  FeatureFlagContext,
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
  HtmlSelectOption,
  Race,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  RaceUtils,
} from "@dndbeyond/character-rules-engine/es";
import { Dice } from "@dndbeyond/dice";

import { SourceCategoryDescription } from "~/constants";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import config from "../../../../config";
import { appEnvActions } from "../../../actions";
import {
  CheckboxInfo,
  FormCheckBoxesField,
} from "../../../components/common/FormCheckBoxesField";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";
import PreferencesPaneSelectField from "./PreferencesPaneSelectField";
import PreferencesPaneToggleField from "./PreferencesPaneToggleField";
import PreferencesPaneTogglesField, {
  ToggleInfo,
} from "./PreferencesPaneTogglesField";

interface Props extends DispatchProp {
  activeSourceCategories: Array<number>;
  preferences: CharacterPreferences;
  ruleData: RuleData;
  diceEnabled: boolean;
  classes: Array<CharClass>;
  species: Race | null;
  dataOriginRefData: DataOriginRefData;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
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

  handleChangePrivacy = (value: number | null): void => {
    const typedPrefKey = CharacterUtils.getPreferenceKey("privacyType");
    if (typedPrefKey !== null) {
      this.props.dispatch(
        characterActions.preferenceChoose(typedPrefKey, value)
      );
    }
  };

  render() {
    const { preferences, activeSourceCategories, ruleData, diceEnabled } =
      this.props;

    const {
      useHomebrewContent,
      encumbranceType,
      hitPointType,
      progressionType,
      abilityScoreDisplayType,
      sharingType,
      privacyType,
      ignoreCoinWeight,
      enforceFeatRules,
      enforceMulticlassRules,
      showScaledSpells,
      enableOptionalClassFeatures,
      enableOptionalOrigins,
      enableDarkMode,
    } = preferences;
    const sourceCategories = RuleDataUtils.getSourceCategories(ruleData);

    const encumbranceOptions: Array<HtmlSelectOption> = [
      {
        label: "Use Encumbrance",
        value: Constants.PreferenceEncumbranceTypeEnum.ENCUMBRANCE,
      },
      {
        label: "No Encumbrance",
        value: Constants.PreferenceEncumbranceTypeEnum.NONE,
      },
      {
        label: "Variant Encumbrance",
        value: Constants.PreferenceEncumbranceTypeEnum.VARIANT,
      },
    ];

    const hpOptions: Array<HtmlSelectOption> = [
      { label: "Fixed", value: Constants.PreferenceHitPointTypeEnum.FIXED },
      { label: "Manual", value: Constants.PreferenceHitPointTypeEnum.MANUAL },
    ];

    const advancementOptions: Array<HtmlSelectOption> = [
      {
        label: "Milestone",
        value: Constants.PreferenceProgressionTypeEnum.MILESTONE,
      },
      { label: "XP", value: Constants.PreferenceProgressionTypeEnum.XP },
    ];

    const abilityDisplayOptions: Array<HtmlSelectOption> = [
      {
        label: "Modifiers Top",
        value: Constants.PreferenceAbilityScoreDisplayTypeEnum.MODIFIERS_TOP,
      },
      {
        label: "Scores Top",
        value: Constants.PreferenceAbilityScoreDisplayTypeEnum.SCORES_TOP,
      },
    ];

    const sharingOptions: Array<HtmlSelectOption> = [
      { label: "Full", value: Constants.PreferenceSharingTypeEnum.FULL },
      { label: "Limited", value: Constants.PreferenceSharingTypeEnum.LIMITED },
      // {label: 'Stat Block', value: Constants.PreferenceSharingTypeEnum.STAT_BLOCK},
    ];

    let sourceToggles: Array<CheckboxInfo> = [];
    let partneredSourceToggles: Array<CheckboxInfo> = [];

    sourceCategories.forEach((sourceCategory) => {
      if (!sourceCategory.isToggleable) {
        return null;
      }

      const toggle: ToggleInfo = {
        label: `${sourceCategory.name}`,
        initiallyEnabled: activeSourceCategories.includes(sourceCategory.id),
        onChange: this.handleSourceCategoryChange.bind(this, sourceCategory.id),
        sortOrder: sourceCategory.sortOrder,
      };

      if (sourceCategory.isPartneredContent) {
        partneredSourceToggles.push(toggle);
      } else {
        sourceToggles.push(toggle);
      }
    });

    return (
      <div className="ct-preferences-pane">
        <Header>Preferences</Header>

        <FormCheckBoxesField
          heading="Sources"
          description={SourceCategoryDescription.official}
          checkboxes={[
            {
              label: "Homebrew",
              initiallyEnabled: useHomebrewContent,
              onChange: this.handlePreferenceChange.bind(
                this,
                "useHomebrewContent"
              ),
              sortOrder: 0,
            },
            ...sourceToggles,
          ]}
          themed={true}
          showAccordion={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <FormCheckBoxesField
          heading="Partnered Content"
          description={SourceCategoryDescription.partnered}
          checkboxes={partneredSourceToggles}
          checkUncheckAllEnabled={true}
          themed={true}
          accordionHeading="Categories"
          variant="sidebar"
          darkMode={enableDarkMode}
          showAccordion={true}
        />

        <FormCheckBoxesField
          heading="Underdark Mode"
          description="Enables dark mode for this character"
          checkboxes={[
            {
              initiallyEnabled: enableDarkMode,
              label: "Enable dark mode",
              onChange: this.handlePreferenceChange.bind(
                this,
                "enableDarkMode"
              ),
            },
          ]}
          themed={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <FormCheckBoxesField
          heading="Dice Rolling"
          description="Enables digital dice rolling for this character"
          checkboxes={[
            {
              initiallyEnabled: diceEnabled,
              label: "Enable Dice Rolling",
              onChange: this.handleDiceToggle,
            },
          ]}
          themed={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <FormCheckBoxesField
          heading="Optional Features"
          description="Allow or restrict optional features for this character."
          checkboxes={[
            {
              label: "Optional Class Features",
              initiallyEnabled: enableOptionalClassFeatures,
              onChangePromise:
                this.handleOptionalClassFeaturesPreferenceChangePromise,
            },
            {
              label: "Customize Your Origin",
              initiallyEnabled: enableOptionalOrigins,
              onChangePromise:
                this.handleOptionalOriginsPreferenceChangePromise,
            },
          ]}
          themed={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <PreferencesPaneSelectField
          heading="Advancement Type"
          description="Story-based character progression / XP-based character progression"
          onChangePromise={this.handleProgressionPreferenceChangePromise}
          initialOptionRemoved={true}
          options={advancementOptions}
          initialValue={progressionType}
          block={true}
        />
        <PreferencesPaneSelectField
          heading="Hit Point Type"
          description="When leveling up, increase hit points by the fixed value for your chosen class or manually enter a rolled value"
          onChangePromise={this.handleHitPointPreferenceChangePromise}
          initialOptionRemoved={true}
          options={hpOptions}
          initialValue={hitPointType}
          block={true}
        />

        <FormCheckBoxesField
          heading="Use Prerequisites"
          description="Allow or restrict choices based on rule prerequisites for the following for this character"
          checkboxes={[
            {
              label: "Feats",
              initiallyEnabled: enforceFeatRules,
              onChange: this.handlePreferenceChange.bind(
                this,
                "enforceFeatRules"
              ),
            },
            {
              label: "Multiclass Requirements",
              initiallyEnabled: enforceMulticlassRules,
              onChange: this.handlePreferenceChange.bind(
                this,
                "enforceMulticlassRules"
              ),
            },
          ]}
          themed={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <FormCheckBoxesField
          heading="Show level-scaled spells"
          description="Display and highlight available spells to cast with higher level spell slots"
          checkboxes={[
            {
              initiallyEnabled: showScaledSpells,
              label: "Show Level-Scaled Spells",
              onChange: this.handlePreferenceChange.bind(
                this,
                "showScaledSpells"
              ),
            },
          ]}
          themed={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <PreferencesPaneSelectField
          heading="Encumbrance Type"
          description="Use the standard encumbrance rules / Disable the encumbrance display / Use the more detailed rules for encumbrance"
          onChange={this.handleIntPreferenceChange.bind(
            this,
            "encumbranceType"
          )}
          initialOptionRemoved={true}
          options={encumbranceOptions}
          initialValue={encumbranceType}
          block={true}
        />

        <FormCheckBoxesField
          heading="Ignore Coin Weight"
          description="Coins do not count against your total weight carried (50 coins weigh 1 lb.)"
          checkboxes={[
            {
              initiallyEnabled: ignoreCoinWeight,
              label: "Ignore Coin Weight",
              onChange: this.handlePreferenceChange.bind(
                this,
                "ignoreCoinWeight"
              ),
            },
          ]}
          themed={true}
          variant="sidebar"
          darkMode={enableDarkMode}
        />

        <PreferencesPaneSelectField
          heading="Ability Score/Modifier Display"
          description="Reverse the arrangement of ability modifiers and scores"
          onChange={this.handleIntPreferenceChange.bind(
            this,
            "abilityScoreDisplayType"
          )}
          initialOptionRemoved={true}
          options={abilityDisplayOptions}
          initialValue={abilityScoreDisplayType}
          block={true}
        />

        <PrivacyTypeRadio
          handleChange={(e) =>
            this.handleChangePrivacy(parseInt(e?.target?.value))
          }
          darkMode={enableDarkMode}
          initialValue={privacyType}
          themed={true}
          variant="sidebar"
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
    characterTheme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const PreferencesPaneContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <PreferencesPane paneHistoryStart={paneHistoryStart} {...props} />;
};

export default connect(mapStateToProps)(PreferencesPaneContainer);
