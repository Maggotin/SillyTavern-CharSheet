import { Typography } from "@mui/material";
import React, { ChangeEvent, HTMLAttributes } from "react";
import { DispatchProp } from "react-redux";

import {
  characterActions,
  CharacterPreferences,
  Constants,
  HelperUtils,
  HtmlSelectOption,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  CharacterUtils,
  DataOriginRefData,
  ClassSpellListSpellsLookup,
  ClassUtils,
  CharClass,
  Race,
  RaceUtils,
  characterSelectors,
  PremadeInfo,
  PremadeInfoStatus,
  CharacterTheme,
} from "../../character-rules-engine/es";
import { Dice } from "../../dice";

import { SourceCategoryDescription } from "~/constants";
import { RouteKey } from "~/subApps/builder/constants";
import { FormInputField } from "~/tools/js/Shared/components/common/FormInputField";
import UserRoles from "~/tools/js/Shared/constants/UserRoles";
import PrivacyTypeRadio from "~/tools/js/smartComponents/PrivacyTypeRadio";

import { appEnvActions, confirmModalActions } from "../../../../Shared/actions";
import { SimpleClassSpellList } from "../../../../Shared/components/SimpleClassSpellList";
import {
  FormCheckBoxesField,
  CheckboxInfo,
} from "../../../../Shared/components/common/FormCheckBoxesField";
import FormSelectField from "../../../../Shared/components/common/FormSelectField";
import FormToggleField from "../../../../Shared/components/common/FormToggleField";
import { appEnvSelectors } from "../../../../Shared/selectors";
import config from "../../../../config";
import RadioGroup from "../../../components/CharacterSheetOptions/RadioGroup";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import { BuilderAppState } from "../../../typings";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

interface Props extends DispatchProp {
  preferences: CharacterPreferences;
  ruleData: RuleData;
  activeSourceCategories: Array<number>;
  diceEnabled: boolean;
  userRoles: string[] | null | undefined;
  classes: Array<CharClass>;
  species: Race | null;
  dataOriginRefData: DataOriginRefData;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  premadeInfo: PremadeInfo | null;
  characterId: number;
  characterTheme: CharacterTheme;
}

interface State {
  showUserCharacterSettings: boolean;
}

class HomeBasicInfo extends React.PureComponent<Props, State> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleToggleCharacterSettings = (value: boolean) => {
    this.setState({ showUserCharacterSettings: value });
  };

  handlePreferenceChange = (prefKey: string, value: boolean): void => {
    const { dispatch } = this.props;
    const typedPrefKey = CharacterUtils.getPreferenceKey(prefKey);
    if (typedPrefKey !== null) {
      dispatch(characterActions.preferenceChoose(typedPrefKey, value));
    }
  };

  handleIntPreferenceChange = (prefKey: string, value: string): void => {
    const { dispatch } = this.props;
    const typedPrefKey = CharacterUtils.getPreferenceKey(prefKey);
    if (typedPrefKey !== null) {
      dispatch(
        characterActions.preferenceChoose(
          typedPrefKey,
          HelperUtils.parseInputInt(value)
        )
      );
    }
  };

  handleSourceCategoryChange = (sourceId: number, isActive: boolean): void => {
    const { dispatch, activeSourceCategories } = this.props;

    let newSourceCats: Array<any> = [];
    if (isActive) {
      newSourceCats = [...activeSourceCategories, sourceId];
    } else {
      newSourceCats = activeSourceCategories.filter((id) => id !== sourceId);
    }

    dispatch(characterActions.activeSourceCategoriesSet(newSourceCats));
  };

  handlePartneredSourceChangeAll = (
    sourceIds: number[],
    isActive: boolean
  ): void => {
    const { dispatch, activeSourceCategories } = this.props;

    let newSourceCats: Array<any> = [];
    if (isActive) {
      newSourceCats = [...activeSourceCategories, ...sourceIds];
    } else {
      newSourceCats = activeSourceCategories.filter(
        (id) => !sourceIds.includes(id)
      );
    }

    dispatch(characterActions.activeSourceCategoriesSet(newSourceCats));
  };

  handleOptionalClassFeaturesPreferenceChangePromise = (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch, classes, classSpellListSpellsLookup } = this.props;
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
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Optional Class Features",
          content: (
            <div className="change-preference-content">
              <p>
                Are you sure you want to disable{" "}
                <strong>Optional Class Features</strong> for this character?
              </p>
              <p>
                After doing so, the following spells provided by these features
                will be removed from your character:
              </p>
              <SimpleClassSpellList
                spellListIds={spellListIds}
                classSpellListSpellsLookup={classSpellListSpellsLookup}
              />
            </div>
          ),
          onConfirm: () => {
            this.handlePreferenceChange(
              "enableOptionalClassFeatures",
              newIsEnabled
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleOptionalOriginsPreferenceChangePromise = (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch, species, classSpellListSpellsLookup } = this.props;

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
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Customized Origin Features",
          content: (
            <div className="change-preference-content">
              <p>
                Are you sure you want to disable{" "}
                <strong>Customized Origins</strong> for this character?
              </p>
              <p>
                After doing so, the following spells provided by these features
                will be removed from your character:
              </p>
              <SimpleClassSpellList
                spellListIds={spellListIds}
                classSpellListSpellsLookup={classSpellListSpellsLookup}
              />
            </div>
          ),
          onConfirm: () => {
            this.handlePreferenceChange("enableOptionalOrigins", newIsEnabled);
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleProgressionPreferenceChangePromise = (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch } = this.props;

    const prefKey = CharacterUtils.getPreferenceKey("progressionType");
    const newIdValue = HelperUtils.parseInputInt(newValue);

    if (newIdValue === Constants.PreferenceProgressionTypeEnum.XP) {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-preference"],
          heading: "XP Advancement",
          content: (
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your advancement method to XP
                progression?
              </p>
              <p>
                You will begin with the base XP value for your current level.
              </p>
            </div>
          ),
          onConfirm: () => {
            if (prefKey !== null) {
              dispatch(characterActions.preferenceChoose(prefKey, newIdValue));
            }
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    } else if (
      newIdValue === Constants.PreferenceProgressionTypeEnum.MILESTONE
    ) {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-preference"],
          heading: "Milestone Advancement",
          content: (
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your advancement method to
                Milestone progression?
              </p>
              <p>Your current XP values will be lost.</p>
            </div>
          ),
          onConfirm: () => {
            if (prefKey !== null) {
              dispatch(characterActions.preferenceChoose(prefKey, newIdValue));
            }
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleHitPointPreferenceChangePromise = (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch } = this.props;

    const prefKey = CharacterUtils.getPreferenceKey("hitPointType");
    const newIdValue = HelperUtils.parseInputInt(newValue);

    if (newIdValue === Constants.PreferenceHitPointTypeEnum.FIXED) {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-preference"],
          heading: "Fixed Hit Points",
          content: (
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your hit points to the fixed
                value?
              </p>
              <p>Any rolled hit point totals will be lost.</p>
            </div>
          ),
          onConfirm: () => {
            if (prefKey !== null) {
              dispatch(characterActions.preferenceChoose(prefKey, newIdValue));
            }
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    } else if (newIdValue === Constants.PreferenceHitPointTypeEnum.MANUAL) {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-preference"],
          heading: "Fixed Hit Points",
          content: (
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your hit points manual entry?
              </p>
              <p>
                After doing so, use Manage HP in the Class section to enter your
                rolled values.
              </p>
            </div>
          ),
          onConfirm: () => {
            if (prefKey !== null) {
              dispatch(characterActions.preferenceChoose(prefKey, newIdValue));
            }
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
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

  renderPreferences = (): React.ReactNode => {
    const { preferences, ruleData, activeSourceCategories, diceEnabled } =
      this.props;

    const {
      useHomebrewContent,
      encumbranceType,
      hitPointType,
      progressionType,
      abilityScoreDisplayType,
      privacyType,
      ignoreCoinWeight,
      enforceFeatRules,
      enforceMulticlassRules,
      showScaledSpells,
      enableOptionalOrigins,
      enableOptionalClassFeatures,
    } = preferences;

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

    let sourceToggles: Array<CheckboxInfo> = [];
    let partneredSourceCheckboxes: Array<CheckboxInfo> = [];
    let allPartneredSources: Array<number> = [];

    RuleDataUtils.getSourceCategories(ruleData).forEach((sourceCategory) => {
      if (!sourceCategory.isToggleable) {
        return null;
      }

      const checkbox: CheckboxInfo = {
        label: `${sourceCategory.name}`,
        initiallyEnabled: activeSourceCategories.includes(sourceCategory.id),
        onChange: this.handleSourceCategoryChange.bind(this, sourceCategory.id),
        sortOrder: sourceCategory.sortOrder,
        description: sourceCategory.description ?? "",
      };

      if (sourceCategory.isPartneredContent) {
        delete checkbox.description; // remove description from partnered content
        partneredSourceCheckboxes.push(checkbox);
        allPartneredSources.push(sourceCategory.id);
      } else {
        sourceToggles.push(checkbox);
      }
    });

    const checkboxAllPartneredContent: CheckboxInfo = {
      label: "All Partnered Content",
      initiallyEnabled: allPartneredSources.every((id) =>
        activeSourceCategories.includes(id)
      ),
      onChange: this.handlePartneredSourceChangeAll.bind(
        this,
        allPartneredSources
      ),
    };
    return (
      <div className="home-manage-preferences">
        <FormCheckBoxesField
          heading="Sources"
          description={SourceCategoryDescription.official}
          checkboxes={[
            ...sourceToggles,
            {
              label: "Homebrew",
              description: SourceCategoryDescription.homebrew,
              initiallyEnabled: useHomebrewContent,
              onChange: this.handlePreferenceChange.bind(
                this,
                "useHomebrewContent"
              ),
              sortOrder: 0,
            },
          ]}
          showAccordion={false}
          variant="builder"
        />

        <FormCheckBoxesField
          heading="Partnered Content"
          description={SourceCategoryDescription.partnered}
          checkboxes={partneredSourceCheckboxes}
          checkUncheckAllEnabled={true}
          onCheckUncheckAll={checkboxAllPartneredContent}
          showAccordion={true}
          accordionHeading="Choose Partners"
          variant="builder"
          allText="All"
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
          variant="builder"
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
          variant="builder"
        />

        <FormSelectField
          heading="Advancement Type"
          description="Story-based character progression / XP-based character progression"
          onChangePromise={this.handleProgressionPreferenceChangePromise}
          initialOptionRemoved={true}
          options={advancementOptions}
          initialValue={"" + progressionType}
          block={true}
        />
        <FormSelectField
          heading="Hit Point Type"
          description="When leveling up, increase hit points by the fixed value for your chosen class or manually enter a rolled value"
          onChangePromise={this.handleHitPointPreferenceChangePromise}
          initialOptionRemoved={true}
          options={hpOptions}
          initialValue={"" + hitPointType}
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
          variant="builder"
        />

        <FormCheckBoxesField
          heading="Show Level-Scaled Spells"
          description="Display and highlight available spells to cast with higher level spell slots"
          checkboxes={[
            {
              label: "Show Level-Scaled Spells",
              initiallyEnabled: showScaledSpells,
              onChange: this.handlePreferenceChange.bind(
                this,
                "showScaledSpells"
              ),
            },
          ]}
          variant="builder"
        />

        <FormSelectField
          heading="Encumbrance Type"
          description="Use the standard encumbrance rules / Disable the encumbrance display / Use the more detailed rules for encumbrance"
          onChange={this.handleIntPreferenceChange.bind(
            this,
            "encumbranceType"
          )}
          initialOptionRemoved={true}
          options={encumbranceOptions}
          initialValue={"" + encumbranceType}
          block={true}
        />

        <FormCheckBoxesField
          heading="Ignore Coin Weight"
          description="Coins do not count against your total weight carried (50 coins weigh 1 lb.)"
          checkboxes={[
            {
              label: "Ignore Coin Weight",
              initiallyEnabled: ignoreCoinWeight,
              onChange: this.handlePreferenceChange.bind(
                this,
                "ignoreCoinWeight"
              ),
            },
          ]}
          variant="builder"
        />

        <FormSelectField
          heading="Ability Score/Modifier Display"
          description="Reverse the arrangement of ability modifiers and scores"
          onChange={this.handleIntPreferenceChange.bind(
            this,
            "abilityScoreDisplayType"
          )}
          initialOptionRemoved={true}
          options={abilityDisplayOptions}
          initialValue={"" + abilityScoreDisplayType}
          block={true}
        />

        <PrivacyTypeRadio
          initialValue={privacyType}
          handleChange={(e) =>
            this.handleChangePrivacy(parseInt(e.target.value))
          }
          variant="builder"
        />
      </div>
    );
  };

  handleAddPremadeInfo = (): void => {
    const { dispatch, characterId } = this.props;

    const data = {
      characterId: characterId,
      publishStatus: PremadeInfoStatus.DRAFT,
      definition: {
        longDescription: null,
        shortDescription: null,
        imageUrl: null,
        imageAltText: null,
        mobileImageUrl: null,
        mobileImageAccessibility: null,
        themeColor: null,
      },
    };

    dispatch(characterActions.premadeInfoAdd(data));
  };

  handleDeletePremadeInfo = (): void => {
    const { dispatch, characterId } = this.props;
    dispatch(characterActions.premadeInfoDelete(characterId));
  };

  handlePremadeInfoChanged = (premadeInfo: PremadeInfo): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.premadeInfoUpdate(premadeInfo));
  };

  renderPremadePreferences = (): React.ReactNode => {
    const { premadeInfo } = this.props;

    const statusOptions: Array<HtmlSelectOption> = [
      { label: "Draft", value: PremadeInfoStatus.DRAFT },
      { label: "Published", value: PremadeInfoStatus.PUBLISHED },
      { label: "Archived", value: PremadeInfoStatus.ARCHIVED },
    ];

    const inputAttributes = {
      disabled: !premadeInfo,
    } as HTMLAttributes<HTMLInputElement>;

    return (
      <div className="home-manage-preferences">
        <FormToggleField
          heading="Premade Character"
          toggleLabel="Enabled official character"
          description="Toggle on to make this a premade character. You cannot disable this if the premade status is Published."
          initiallyEnabled={!!premadeInfo}
          onChange={(toggledOn) => {
            toggledOn
              ? this.handleAddPremadeInfo()
              : this.handleDeletePremadeInfo();
          }}
          isReadOnly={
            premadeInfo?.publishStatus === PremadeInfoStatus.PUBLISHED
          }
        />
        {premadeInfo && (
          <>
            <RadioGroup
              name="premadeStatus"
              label="Publish Status"
              subtitle="Mark this character as published when you are ready for it to be publically visible."
              value={premadeInfo.publishStatus}
              options={statusOptions}
              disabled={!premadeInfo}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                premadeInfo.publishStatus = event.currentTarget
                  .value as PremadeInfoStatus;
                this.handlePremadeInfoChanged(premadeInfo);
                this.forceUpdate();
              }}
            />
            <FormInputField
              label="Long Description"
              initialValue={premadeInfo.definition.longDescription}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.longDescription = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
            <FormInputField
              label="Short Description"
              initialValue={premadeInfo.definition.shortDescription}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.shortDescription = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
            <FormInputField
              label="Image Url"
              initialValue={premadeInfo.definition.imageUrl}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.imageUrl = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
            <FormInputField
              label="Image Alt Text"
              initialValue={premadeInfo.definition.imageAltText}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.imageAltText = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
            <FormInputField
              label="Mobile Image Url"
              initialValue={premadeInfo.definition.mobileImageUrl}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.mobileImageUrl = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
            <FormInputField
              label="Mobile Image Accessibility"
              initialValue={premadeInfo.definition.mobileImageAccessibility}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.mobileImageAccessibility = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
            <FormInputField
              label="Theme Color Hex Code"
              initialValue={premadeInfo.definition.themeColor}
              inputAttributes={inputAttributes}
              onBlur={(value: string) => {
                premadeInfo.definition.themeColor = value;
                this.handlePremadeInfoChanged(premadeInfo);
              }}
            />
          </>
        )}
      </div>
    );
  };

  render() {
    const { userRoles } = this.props;
    const isLorekeeper =
      userRoles?.includes(UserRoles.LOREKEEPER) ||
      userRoles?.includes(UserRoles.ADMIN);

    return (
      <Page clsNames={["home-manage"]}>
        <PageBody>
          {isLorekeeper && (
            <div style={{ border: "5px solid hotpink" }}>
              <PageHeader>
                Premade Character Preferences - Lorekeepers Only
              </PageHeader>
              {this.renderPremadePreferences()}
            </div>
          )}
          <Typography fontSize={24}>Character Preferences</Typography>
          {this.renderPreferences()}
          <div className="home-manage__version">
            <div className="home-manage__version-label">Version:</div>
            <div className="home-manage__version-value">{config.version}</div>
          </div>
        </PageBody>
      </Page>
    );
  }
}

export default ConnectedBuilderPage(
  HomeBasicInfo,
  RouteKey.HOME_BASIC_INFO,
  (state: BuilderAppState) => ({
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    activeSourceCategories:
      rulesEngineSelectors.getActiveSourceCategories(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    classes: rulesEngineSelectors.getClasses(state),
    species: rulesEngineSelectors.getRace(state),
    classSpellListSpellsLookup:
      rulesEngineSelectors.getClassSpellListSpellsLookup(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    userRoles: appEnvSelectors.getUserRoles(state),
    premadeInfo: characterSelectors.getPremadeInfo(state),
    characterId: rulesEngineSelectors.getId(state),
    characterTheme: rulesEngineSelectors.getCharacterTheme(state),
  })
);
