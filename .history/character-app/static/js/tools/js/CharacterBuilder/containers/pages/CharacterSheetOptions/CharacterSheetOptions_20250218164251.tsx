import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import { DispatchProp } from "react-redux";

import { PrivacyTypeRadio } from "@dndbeyond/character-components/es";
import {
  CampaignDataContract,
  CampaignSettingContract,
  characterActions,
  CharacterPreferences,
  CharacterUtils,
  CharClass,
  ClassSpellListSpellsLookup,
  ClassUtils,
  Constants,
  CustomCampaignSettingContract,
  DataOriginRefData,
  HelperUtils,
  HtmlSelectOption,
  Race,
  RaceUtils,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  serviceDataSelectors,
  SourceContract,
} from "../../character-rules-engine/es";
import { Dice } from "@dndbeyond/dice";

import { RouteKey } from "~/subApps/builder/constants";

import { getAllEntitledSources } from "../../../../../../helpers/characterServiceApi";
import { PortraitName } from "../../../../../../subApps/builder/components/PortraitName";
import { appEnvActions, confirmModalActions } from "../../../../Shared/actions";
import { SimpleClassSpellList } from "../../../../Shared/components/SimpleClassSpellList";
import FormTogglesField, {
  ToggleInfo,
} from "../../../../Shared/components/common/FormTogglesField";
import { appEnvSelectors } from "../../../../Shared/selectors";
import config from "../../../../config";
import CampaignSettingModal from "../../../components/CampaignSettingModal";
import { Checkbox } from "../../../components/CharacterSheetOptions";
import CheckboxGroup from "../../../components/CharacterSheetOptions/CheckboxGroup";
import RadioGroup from "../../../components/CharacterSheetOptions/RadioGroup";
import ToggleButtonGroup from "../../../components/CharacterSheetOptions/ToggleButtonGroup";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import { BuilderAppState } from "../../../typings";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

/*
This component is NOT being used
This Page is the CampaignSettings version of "HOME BASIC INFO" page in the Builder. It will only show if the campaignSettingsFlag is enabled. Currently this is not released to the public.
*/

interface Props extends DispatchProp {
  preferences: CharacterPreferences;
  ruleData: RuleData;
  activeSourceCategories: Array<number>;
  diceEnabled: boolean;
  classes: Array<CharClass>;
  species: Race | null;
  dataOriginRefData: DataOriginRefData;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  campaign: CampaignDataContract;
  activeSources: Array<SourceContract>;
  campaignSetting: CustomCampaignSettingContract;
  allCampaignSettings: Array<CampaignSettingContract>;
}

interface Source {
  id: number;
  name: string;
  description: string;
  hasAccess: boolean;
  isReleased: boolean;
}

interface State {
  sources: Array<Source>;
  activeSourceIds: Array<number>;
  selectedSetting: CampaignSettingContract;
  showSettingModal: boolean;
  showMoreSources: boolean;
  preselectedSetting: number | null;
}

class CharacterSheetOptions extends React.PureComponent<Props, State> {
  static defaultProps = {
    diceEnabled: false,
  };

  state: State = {
    sources: [],
    activeSourceIds: [],
    selectedSetting: {
      id: -1,
      name: "No world selected",
      backgroundImageUrl: "",
      foregroundImageUrl: "",
      description: "",
      availableSources: [],
      configuration: null,
      status: 1,
    },
    showSettingModal: false,
    showMoreSources: false,
    preselectedSetting: this.props.campaignSetting.campaignSettingId,
  };

  componentDidMount() {
    const { campaign, campaignSetting, allCampaignSettings, ruleData } =
      this.props;

    // Get Campaign Setting and set data for selected item
    const selectedSetting = allCampaignSettings.filter(
      (s) => s.id === campaignSetting.campaignSettingId
    )[0];
    if (selectedSetting) {
      this.setState({ selectedSetting });
    }
    // Get sources to be checked and unchecked
    const sourceLookup = RuleDataUtils.getSourceDataLookup(ruleData);
    getAllEntitledSources(campaign ? campaign.id : undefined).then(
      async (res) => {
        const json = await res.json();
        const sourceIds: Array<number> = await json.data;

        const entitledSources = Object.keys(sourceLookup)
          .filter((source) => {
            return sourceLookup[source].isReleased;
          })
          .map((source) => {
            return {
              ...sourceLookup[source],
              hasAccess: sourceIds.includes(parseInt(source, 10)),
            };
          });

        // If `enabledSourceIds` is set, use custom sources, else use stock sources
        const activeSourceIds =
          campaignSetting.enabledSourceIds &&
          campaignSetting.enabledSourceIds.length > 0
            ? campaignSetting.enabledSourceIds
            : selectedSetting.availableSources.map((s) => s.sourceId);
        this.setState({ sources: entitledSources, activeSourceIds });
      }
    );
  }

  componentWillUnmount() {
    // fixes Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  handlePreferenceChange = (prefKey: string, value: boolean): void => {
    const { dispatch } = this.props;
    const typedPrefKey = CharacterUtils.getPreferenceKey(prefKey);
    if (typedPrefKey !== null) {
      dispatch(characterActions.preferenceChoose(typedPrefKey, value));
    }
  };

  handleIgnoreCoinWeightChange = (event: ChangeEvent, value: boolean) => {
    this.handlePreferenceChange("ignoreCoinWeight", value);
  };

  handleFeatPrerequisiteChange = (event: ChangeEvent, value: boolean) => {
    this.handlePreferenceChange("enforceFeatRules", !value);
  };

  handleMulticlassPrerequisiteChange = (event: ChangeEvent, value: boolean) => {
    this.handlePreferenceChange("enforceMulticlassRules", !value);
  };

  handleUseHomebrewContentChange = (event: ChangeEvent, value: boolean) => {
    this.handlePreferenceChange("useHomebrewContent", value);
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

  handleEncumbranceTypeChange = (evt: ChangeEvent, value: number) => {
    this.handleIntPreferenceChange("encumbranceType", `${value}`);
  };

  handleCampaignSettingChange = (id: number) => {
    const { dispatch } = this.props;
    const selectedSetting =
      this.props.allCampaignSettings.filter((s) => s.id === id)[0] || null;
    const activeSourceIds = selectedSetting.availableSources.map(
      (s) => s.sourceId
    );
    this.setState({ selectedSetting, activeSourceIds });
    dispatch(
      characterActions.campaignSettingSetRequest({
        campaignSettingId: selectedSetting.id,
        enabledSourceIds: null,
      })
    );
  };

  handleSelectionChange = (id: number) => {
    this.setState({
      preselectedSetting: id,
    });
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

  handleOptionalClassFeaturesPreferenceChangePromise = (
    event: ChangeEvent,
    value: boolean
  ): void => {
    const { dispatch, classes, classSpellListSpellsLookup } = this.props;

    const spellListIds: Array<number> =
      ClassUtils.getUpdateEnableOptionalClassFeaturesSpellListIdsToRemove(
        classes,
        value
      );

    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      this.handlePreferenceChange("enableOptionalClassFeatures", value);
    } else {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove", "fullscreen-modal--hurricane"],
          acceptBtnClsNames: [
            "character-button-remove",
            "character-button--hurricane",
          ],
          cancelBtnClsNames: ["character-button--hurricane"],
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
            this.handlePreferenceChange("enableOptionalClassFeatures", value);
          },
          onCancel: () => {},
        })
      );
    }
  };

  handleOptionalOriginsPreferenceChangePromise = (
    event: ChangeEvent,
    value: boolean
  ): void => {
    const { dispatch, species, classSpellListSpellsLookup } = this.props;

    if (!species) {
      this.handlePreferenceChange("enableOptionalOrigins", value);

      return;
    }

    const spellListIds: Array<number> =
      RaceUtils.getUpdateEnableOptionalOriginsSpellListIdsToRemove(
        species,
        value
      );

    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      this.handlePreferenceChange("enableOptionalOrigins", value);
      return;
    } else {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove", "fullscreen-modal--hurricane"],
          acceptBtnClsNames: [
            "character-button-remove",
            "character-button--hurricane",
          ],
          cancelBtnClsNames: ["character-button--hurricane"],
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
            this.handlePreferenceChange("enableOptionalOrigins", value);
          },
          onCancel: () => {},
        })
      );
    }
  };

  handleProgressionPreferenceChangePromise = (
    event: ChangeEvent,
    value: any
  ): void => {
    // Enforce value set
    if (value === null) {
      return;
    }

    const { dispatch } = this.props;
    const prefKey = CharacterUtils.getPreferenceKey("progressionType");

    if (value === Constants.PreferenceProgressionTypeEnum.XP) {
      dispatch(
        confirmModalActions.create({
          conClsNames: [
            "confirm-modal-preference",
            "fullscreen-modal--hurricane",
          ],
          acceptBtnClsNames: ["character-button--hurricane"],
          cancelBtnClsNames: ["character-button--hurricane"],
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
              dispatch(characterActions.preferenceChoose(prefKey, value));
            }
          },
          onCancel: () => {},
        })
      );
    } else if (value === Constants.PreferenceProgressionTypeEnum.MILESTONE) {
      dispatch(
        confirmModalActions.create({
          conClsNames: [
            "confirm-modal-preference",
            "fullscreen-modal--hurricane",
          ],
          acceptBtnClsNames: ["character-button--hurricane"],
          cancelBtnClsNames: ["character-button--hurricane"],
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
              dispatch(characterActions.preferenceChoose(prefKey, value));
            }
          },
          onCancel: () => {},
        })
      );
    }
  };

  handleHitPointPreferenceChangePromise = (
    event: ChangeEvent,
    value: any
  ): void => {
    // Enforce value set
    if (value === null) {
      return;
    }

    const { dispatch } = this.props;
    const prefKey = CharacterUtils.getPreferenceKey("hitPointType");

    if (value === Constants.PreferenceHitPointTypeEnum.FIXED) {
      dispatch(
        confirmModalActions.create({
          conClsNames: [
            "confirm-modal-preference",
            "fullscreen-modal--hurricane",
          ],
          acceptBtnClsNames: ["character-button--hurricane"],
          cancelBtnClsNames: ["character-button--hurricane"],
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
              dispatch(characterActions.preferenceChoose(prefKey, value));
            }
          },
          onCancel: () => {},
        })
      );
    } else if (value === Constants.PreferenceHitPointTypeEnum.MANUAL) {
      dispatch(
        confirmModalActions.create({
          conClsNames: [
            "confirm-modal-preference",
            "fullscreen-modal--hurricane",
          ],
          acceptBtnClsNames: ["character-button--hurricane"],
          cancelBtnClsNames: ["character-button--hurricane"],
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
              dispatch(characterActions.preferenceChoose(prefKey, value));
            }
          },
          onCancel: () => {},
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

  handleActiveSourceChangePromise = (
    sourceId: number,
    checked: boolean
  ): void => {
    const { dispatch, campaignSetting } = this.props;
    const { activeSourceIds, sources, selectedSetting } = this.state;
    const settingSources = selectedSetting.availableSources.map(
      (s) => s.sourceId
    );
    let newSourceIds: Array<number> = activeSourceIds;

    if (!checked) {
      newSourceIds = newSourceIds.filter((id) => id !== sourceId);
    } else {
      newSourceIds.push(sourceId);
    }
    this.setState({ sources, activeSourceIds: newSourceIds });

    // IF NEWLY CHANGED BOXES === AVAILABLE, SET TO NULL
    if (JSON.stringify(newSourceIds) === JSON.stringify(settingSources)) {
      dispatch(
        characterActions.activeSourcesSet(
          null,
          campaignSetting.campaignSettingId
        )
      );
    } else {
      dispatch(
        characterActions.activeSourcesSet(
          newSourceIds,
          campaignSetting.campaignSettingId
        )
      );
    }
  };

  renderPreferences = (): React.ReactNode => {
    const { preferences, ruleData, activeSourceCategories } = this.props;

    const {
      encumbranceType,
      hitPointType,
      progressionType,
      ignoreCoinWeight,
      enforceFeatRules,
      enforceMulticlassRules,
      enableOptionalOrigins,
      enableOptionalClassFeatures,
      useHomebrewContent,
      privacyType,
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

    let sourceToggles: Array<ToggleInfo> = [];
    let partneredSourceToggles: Array<ToggleInfo> = [];

    RuleDataUtils.getSourceCategories(ruleData).forEach((sourceCategory) => {
      if (!sourceCategory.isToggleable) {
        return null;
      }

      const toggle: ToggleInfo = {
        label: `${sourceCategory.name} Content`,
        initiallyEnabled: activeSourceCategories.includes(sourceCategory.id),
        onChange: this.handleSourceCategoryChange.bind(this, sourceCategory.id),
      };

      if (sourceCategory.isPartneredContent) {
        partneredSourceToggles.push(toggle);
      } else {
        sourceToggles.push(toggle);
      }
    });

    const toggleSettingModal = (value?: boolean) => {
      const showSettingModal = value ?? !this.state.showSettingModal;
      this.setState({ showSettingModal });
    };

    const toggleShowSources = () => {
      const showMoreSources = !this.state.showMoreSources;
      this.setState({ showMoreSources });
    };

    const handleSelectAllSources = () => {
      const { dispatch, campaignSetting } = this.props;
      const { sources } = this.state;

      const allSources = sources.map((s) => s.id);
      this.setState({ activeSourceIds: allSources });
      dispatch(
        characterActions.activeSourcesSet(
          allSources,
          campaignSetting.campaignSettingId
        )
      );
    };

    const handleResetSources = () => {
      const { dispatch, campaignSetting } = this.props;
      const { selectedSetting } = this.state;

      this.setState({
        activeSourceIds: selectedSetting.availableSources.map(
          (s) => s.sourceId
        ),
      });
      dispatch(
        characterActions.activeSourcesSet(
          null,
          campaignSetting.campaignSettingId
        )
      );
    };

    const getSortedSources = (sources: Source[]) => {
      const sortedSources: Source[] = [];
      const isCore = (name) =>
        name === "BR" || name === "PHB" || name === "DMG" || name === "MM";
      const coreRules = sources.filter((s) => isCore(s.name) && s.isReleased);
      const noncoreRules = sources.filter(
        (s) => !isCore(s.name) && s.isReleased
      );
      // Sort sources by id
      noncoreRules.sort((a, b) => a.description.localeCompare(b.description));
      const allSources = [...coreRules, ...noncoreRules];
      // Split sources into an array for each column
      const firstColumn = allSources.slice(0, Math.ceil(allSources.length / 2));
      const secondColumn = allSources.slice(Math.ceil(allSources.length / 2));
      // Loop through the first array which should always be longest
      for (let i = 0; i < firstColumn.length; i++) {
        // Add value at index from each half to a new array
        sortedSources.push(firstColumn[i]);
        if (secondColumn[i]) sortedSources.push(secondColumn[i]);
      }
      // Return new array
      return [firstColumn, secondColumn];
    };

    return (
      <div className="home-manage-preferences">
        <Typography
          variant="h2"
          sx={{
            fontSize: "24px",
            fontFamily: "Roboto",
            fontWeight: "bold",
            letterSpacing: "0",
            lineHeight: 1.4,
            marginBottom: "12px",
          }}
        >
          Campaign World
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#12181ca3", fontSize: "16px", lineHeight: 1.4 }}
        >
          Select a campaign world for your character to tailor the rules and
          options available.
        </Typography>
        {/* CURRENT CAMPAIGN BUTTON */}
        <Button
          aria-label="Select World"
          onClick={() => toggleSettingModal(true)}
          sx={{
            display: "block",
            p: 4,
            pb: 1,
            width: "100%",
            maxWidth: "500px",
            m: "20px auto",
            borderRadius: 4,
            backgroundImage: `url(${this.state.selectedSetting.backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            overflow: "hidden",
            transition: "opacity 0.3s",
            "&:hover": {
              opacity: "0.9",
            },
            "&:after": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,0.5)",
              borderRadius: 4,
              display: "block",
              zIndex: 0,
            },
          }}
        >
          <Typography
            variant="body1"
            color="white"
            sx={{
              fontSize: 13,
              fontWeight: 700,
              position: "relative",
              zIndex: 2,
              opacity: 0.7,
              visibility:
                this.props.campaignSetting.enabledSourceIds &&
                this.props.campaignSetting.enabledSourceIds.length > 0
                  ? "visible"
                  : "hidden",
            }}
          >
            Custom
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{ position: "relative", zIndex: 2, mb: 3, fontSize: 32 }}
          >
            {this.state.selectedSetting.name}
          </Typography>
          <Typography
            variant="body1"
            color="primary.contrastText"
            sx={{
              fontSize: 12,
              position: "relative",
              zIndex: 2,
              fontWeight: 700,
            }}
          >
            Change Setting &gt;
          </Typography>
        </Button>
        {/* END CURRENT CAMPAIGN BUTTON */}
        {/* CAMPAIGN SETTING SOURCES */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: "21px",
              fontFamily: "Roboto",
              fontWeight: "bold",
              letterSpacing: "0",
              lineHeight: 1.4,
              marginBottom: "12px",
            }}
          >
            Source Options
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#12181ca3",
              fontSize: "16px",
              lineHeight: 1.4,
              mb: 2,
            }}
          >
            Select sources to customize the rules and options available to this
            character or choose a campaign world preset to use.
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Sources</Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleSelectAllSources}
            sx={{ ml: 3, mt: 1, mb: 2, fontSize: 13 }}
          >
            Select All
          </Button>
          <Button
            size="small"
            onClick={handleResetSources}
            sx={{ fontSize: 13, mt: 1, mb: 2 }}
          >
            Reset
          </Button>
          <Box
            sx={{
              height: [
                this.state.showMoreSources
                  ? this.state.sources.length * 42
                  : 12 * 42,
                this.state.showMoreSources
                  ? (this.state.sources.length * 43) / 2
                  : (12 * 43) / 2,
              ],
              overflow: "hidden",
              transition: "height 0.5s",
            }}
          >
            <Grid container columnSpacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="homebrew"
                      onChange={(event, checked) =>
                        this.handlePreferenceChange(
                          "useHomebrewContent",
                          checked
                        )
                      }
                      checked={useHomebrewContent}
                    />
                  }
                  label={
                    <>
                      <Typography
                        sx={{
                          fontSize: 14,
                          lineHeight: "16px",
                        }}
                      >
                        Homebrew Content
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "GrayText",
                          lineHeight: "14px",
                        }}
                      >
                        Enables access to personal or campaign-shared homebrew
                        collections
                      </Typography>
                    </>
                  }
                  sx={{
                    width: "90%",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                    alignItems: "flex-start",
                    ".MuiCheckbox-root": { minWidth: 42, mt: "-10px" },
                    "*:not(.MuiCheckbox-root, .MuiSvgIcon-root)": {
                      width: "100%",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
              {getSortedSources(this.state.sources).map((col, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {col.map((source) => (
                    <Tooltip title={source.description} key={source.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={source.name}
                            onChange={(event, checked) =>
                              this.handleActiveSourceChangePromise(
                                source.id,
                                checked
                              )
                            }
                            checked={this.state.activeSourceIds.includes(
                              source.id
                            )}
                          />
                        }
                        label={
                          <Stack alignItems="center">
                            <div
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                              }}
                            >
                              {source.description}
                            </div>
                            {!source.hasAccess && (
                              <Tooltip
                                sx={{ ml: 1 }}
                                title="You may not have full access to this source"
                              >
                                <InfoIcon color="info" />
                              </Tooltip>
                            )}
                          </Stack>
                        }
                        sx={{
                          width: "90%",
                          textOverflow: "ellipsis",
                          textAlign: "left",
                          ".MuiCheckbox-root": { minWidth: 42 },
                          "*:not(.MuiCheckbox-root, .MuiSvgIcon-root))": {
                            width: "100%",
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleShowSources}
          sx={{ display: "block", m: "36px auto 20px" }}
        >
          Show {!this.state.showMoreSources ? "More" : "Less"}
        </Button>
        {/* END CAMPAIGN SETTING SOURCES */}
        <CampaignSettingModal
          campaignSettings={this.props.allCampaignSettings}
          handleSettingChange={this.handleCampaignSettingChange}
          handleSelectionChange={this.handleSelectionChange}
          selectedSettingId={this.state.selectedSetting.id}
          preselectedSettingId={this.state.preselectedSetting}
          showModal={this.state.showSettingModal}
          setShowModal={toggleSettingModal}
          sources={this.state.sources}
        />

        <FormTogglesField
          heading="Partnered Content"
          description="Allow or restrict partnered content to be used for this character. This content is unofficial and should be used only at your DM's discretion."
          toggles={partneredSourceToggles}
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: "21px",
            fontFamily: "Roboto",
            fontWeight: "bold",
            lineHeight: 1.4,
            marginTop: 6,
            marginBottom: "12px",
          }}
        >
          Rules
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#12181ca3",
            fontSize: "16px",
            lineHeight: 1.4,
            marginBottom: 5,
          }}
        >
          Customize the rules options you wish to use to create this character.
          These may be preset by your campaign world.
        </Typography>
        <CheckboxGroup
          title="Optional Features"
          subtitle="Allow or restrict optional features for this character"
          options={[
            {
              label: "Optional Class Features",
              name: "optionalClassFeatures",
              checked: enableOptionalClassFeatures,
              onChange: this.handleOptionalClassFeaturesPreferenceChangePromise,
            },
            {
              label: "Customize Your Origin",
              name: "customizeYourOrigin",
              checked: enableOptionalOrigins,
              onChange: this.handleOptionalOriginsPreferenceChangePromise,
            },
          ]}
        />

        <ToggleButtonGroup
          title="Level Advancement"
          subtitle="Characters advance either using Experience Points or at significant milestones"
          onChange={this.handleProgressionPreferenceChangePromise}
          value={progressionType}
          options={[
            {
              label: "Milestone",
              value: Constants.PreferenceProgressionTypeEnum.MILESTONE,
            },
            {
              label: "Experience",
              value: Constants.PreferenceProgressionTypeEnum.XP,
            },
          ]}
        />

        <ToggleButtonGroup
          title="Hit Points"
          subtitle="Use either a fixed value or roll hit dice when advancing levels"
          onChange={this.handleHitPointPreferenceChangePromise}
          value={hitPointType}
          options={[
            {
              label: "Fixed",
              value: Constants.PreferenceHitPointTypeEnum.FIXED,
            },
            {
              label: "Manual",
              value: Constants.PreferenceHitPointTypeEnum.MANUAL,
            },
          ]}
        />

        <CheckboxGroup
          title="Other Options"
          subtitle="Customize other optional rules preferences"
          options={[
            {
              label: "Ignore Coin Weight",
              subtitle: "Coin weight will not contribute to encumbrance",
              name: "ignoreCoinWeight",
              checked: ignoreCoinWeight,
              onChange: this.handleIgnoreCoinWeightChange,
            },
            {
              label: "Disable Feat Prerequisites",
              name: "disableFeatPrerequisites",
              checked: !enforceFeatRules,
              onChange: this.handleFeatPrerequisiteChange,
            },
            {
              label: "Disable Multiclassing Prerequisites",
              name: "disableMulticlassingPrerequisites",
              checked: !enforceMulticlassRules,
              onChange: this.handleMulticlassPrerequisiteChange,
            },
          ]}
        />

        <RadioGroup
          name="encumbranceType"
          label="Encumbrance"
          subtitle="Use standard rules, variant rules, or ignore encumbrance"
          defaultValue={encumbranceType}
          options={encumbranceOptions}
          onChange={this.handleEncumbranceTypeChange}
        />

        <PrivacyTypeRadio
          color="secondary"
          initialValue={privacyType}
          handleChange={(e, value) =>
            this.handleIntPreferenceChange.bind(
              this,
              "privacyType",
              parseInt(value)
            )()
          }
          sx={{ "> label": { textTransform: "initial !important" } }}
        />

        <Typography
          variant="subtitle1"
          sx={{ color: "#12181ca3", fontSize: "14px", marginTop: 5 }}
        >
          Looking for Character Sheet Options like level-scaled spells and
          whether your character is public? They’re on your character sheet
          under Character Options in your Manage sidebar.
        </Typography>
      </div>
    );
  };

  render() {
    return (
      <Page clsNames={["home-manage"]}>
        <PageBody>
          <div className="home-manage-primary">
            <div className="home-manage-primary-section home-manage-primary-section-portrait">
              <PortraitName />
            </div>
          </div>
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
  CharacterSheetOptions,
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
    campaign: rulesEngineSelectors.getCampaign(state),
    activeSources: rulesEngineSelectors.getActiveSources(state),
    campaignSetting: rulesEngineSelectors.getCampaignSetting(state),
    allCampaignSettings: serviceDataSelectors.getCampaignSettings(state),
  })
);
