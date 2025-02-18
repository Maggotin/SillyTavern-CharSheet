import axios, { Canceler } from "axios";
import { orderBy } from "lodash";
import React, { HTMLAttributes, useContext } from "react";
import { DispatchProp } from "react-redux";

import {
  LoadingPlaceholder,
  Select,
} from "@dndbeyond/character-components/es";
import {
  AlignmentContract,
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  Background,
  BackgroundCharacteristicContract,
  BackgroundContract,
  BackgroundDefinitionContract,
  BackgroundUtils,
  characterActions,
  CharacterFeaturesManager,
  CharacterLifestyleContract,
  CharacterNotes,
  CharacterPreferences,
  CharacterTraits,
  Choice,
  ChoiceData,
  ChoiceUtils,
  Constants,
  DefinitionPool,
  DefinitionUtils,
  FeatDefinitionContract,
  FeatLookup,
  FeatureChoiceOption,
  HelperUtils,
  HtmlSelectOption,
  HtmlSelectOptionGroup,
  Modifier,
  ModifierUtils,
  OptionalOriginLookup,
  PrerequisiteData,
  Race,
  RuleData,
  ruleDataSelectors,
  RuleDataUtils,
  rulesEngineSelectors,
  serviceDataSelectors,
} from "../../rules-engine/es";

import { CollapsibleContent } from "~/components/CollapsibleContent";
import { HtmlContent } from "~/components/HtmlContent";
import { Link } from "~/components/Link";
import { useSource } from "~/hooks/useSource";
import { EditorWithDialog } from "~/subApps/builder/components/EditorWithDialog";
import { RouteKey } from "~/subApps/builder/constants";
import { FormInputField } from "~/tools/js/Shared/components/common/FormInputField";
import { DetailChoice } from "~/tools/js/Shared/containers/DetailChoice";

import {
  confirmModalActions,
  toastMessageActions,
} from "../../../../Shared/actions";
import SuggestionTable from "../../../../Shared/components/SuggestionTable";
import {
  Collapsible,
  CollapsibleHeader,
} from "../../../../Shared/components/legacy/common/Collapsible";
import { CHARACTER_DESCRIPTION_NUMBER_VALUE } from "../../../../Shared/constants/App";
import DataLoadingStatusEnum from "../../../../Shared/constants/DataLoadingStatusEnum";
import { CharacterFeaturesManagerContext } from "../../../../Shared/managers/CharacterFeaturesManagerContext";
import {
  apiCreatorSelectors,
  appEnvSelectors,
} from "../../../../Shared/selectors";
import { AppLoggerUtils } from "../../../../Shared/utils";
import Button from "../../../components/Button";
import { GrantedFeat } from "../../../components/GrantedFeat/GrantedFeat";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageSubHeader from "../../../components/PageSubHeader";
import { BuilderAppState } from "../../../typings";
import ConnectedBuilderPage from "../ConnectedBuilderPage";
import { HelperTextAccordion } from "~/components/HelperTextAccordion";

interface CustomBackgroundManagerProps {
  backgroundData: BackgroundDefinitionContract[];
  name: string | null;
  description: string | null;
  featureId: number | null;
  characteristicsId: number | null;
  modifierType: number | null;
  onSave: (properties: any) => void;
}
interface CustomBackgroundManagerState {
  name: string | null;
  description: string | null;
  featureId: number | null;
  characteristicsId: number | null;
  modifierType: number | null;
}
class CustomBackgroundManager extends React.PureComponent<
  CustomBackgroundManagerProps,
  CustomBackgroundManagerState
> {
  constructor(props: CustomBackgroundManagerProps) {
    super(props);

    const { name, description, featureId, characteristicsId, modifierType } =
      props;

    this.state = {
      name,
      description,
      featureId,
      characteristicsId,
      modifierType,
    };
  }

  getStateProperties = (): any => {
    const { name, description, featureId, characteristicsId, modifierType } =
      this.state;
    return {
      name,
      description,
      featureId,
      characteristicsId,
      modifierType,
    };
  };

  handleSave = (): void => {
    const { onSave } = this.props;

    if (onSave) {
      onSave(this.getStateProperties());
    }
  };

  handleMetaDataSet = (propertyKey: string, value: any): void => {
    this.setState((prevState: CustomBackgroundManagerState) => ({
      ...prevState,
      [propertyKey]: value,
    }));
  };

  handleTextInputBlur = (
    propertyKey: string,
    evt: React.FocusEvent<HTMLInputElement>
  ): void => {
    const value = evt.target.value;
    this.handleMetaDataSet(propertyKey, value);
  };

  handleNumberSelectChange = (propertyKey: string, value: string): void => {
    this.handleMetaDataSet(propertyKey, HelperUtils.parseInputInt(value));
  };

  render() {
    const { backgroundData } = this.props;
    const { name, description, featureId, characteristicsId, modifierType } =
      this.state;

    const orderedBackgrounds: BackgroundDefinitionContract[] = orderBy(
      backgroundData,
      (backgroundDefinition) => backgroundDefinition.name
    );
    const backgroundDataOptions: HtmlSelectOption[] = orderedBackgrounds.map(
      (bg) => ({
        label: bg.name,
        value: bg.id,
      })
    );

    let featureOptions = backgroundDataOptions;
    let characteristicsOptions = backgroundDataOptions;
    // TODO change this to use rules engine enum once available
    let modifierTypeOptions: HtmlSelectOption[] = [
      {
        label: "2 Skills and 2 Tools",
        value: Constants.BackgroundModifierTypeEnum.TWO_TOOLS,
      },
      {
        label: "2 Skills and 2 Languages",
        value: Constants.BackgroundModifierTypeEnum.TWO_LANGUAGES,
      },
      {
        label: "2 Skills, 1 Tool, and 1 Language",
        value: Constants.BackgroundModifierTypeEnum.ONE_TOOL_ONE_LANGUAGE,
      },
    ];

    return (
      <div className="custom-background">
        <div className="custom-background-editor">
          <div className="custom-background-properties">
            <div className="custom-background-property custom-background-property-full">
              <div className="custom-background-property-value">
                <input
                  type="text"
                  defaultValue={name ? name : ""}
                  onBlur={this.handleTextInputBlur.bind(this, "name")}
                />
              </div>
              <div className="custom-background-property-label">Name</div>
            </div>
            <div className="custom-background-property custom-background-property-textarea">
              <div className="custom-background-property-value">
                <textarea
                  defaultValue={description ? description : ""}
                  onBlur={this.handleTextInputBlur.bind(this, "description")}
                />
              </div>
              <div className="custom-background-property-label">
                Description
              </div>
            </div>
            <div className="custom-background-property custom-background-property-choice">
              <div className="custom-background-property-value">
                <Select
                  onChange={this.handleNumberSelectChange.bind(
                    this,
                    "modifierType"
                  )}
                  options={modifierTypeOptions}
                  value={modifierType}
                  clsNames={[""]}
                />
              </div>
              <div className="custom-background-property-label">
                Proficiency/Language Choices
              </div>
            </div>
            <div className="custom-background-property custom-background-property-choice">
              <div className="custom-background-property-value">
                <Select
                  onChange={this.handleNumberSelectChange.bind(
                    this,
                    "featureId"
                  )}
                  options={featureOptions}
                  value={featureId}
                  clsNames={[""]}
                />
              </div>
              <div className="custom-background-property-label">
                Background Feature
              </div>
            </div>
            <div className="custom-background-property custom-background-property-choice">
              <div className="custom-background-property-value">
                <Select
                  onChange={this.handleNumberSelectChange.bind(
                    this,
                    "characteristicsId"
                  )}
                  options={characteristicsOptions}
                  value={characteristicsId}
                  clsNames={[""]}
                />
              </div>
              <div className="custom-background-property-label">
                Background Characteristics
              </div>
            </div>
          </div>
          <div className="custom-background-actions">
            <Button onClick={this.handleSave}>Save</Button>
          </div>
        </div>
      </div>
    );
  }
}

interface Props extends DispatchProp {
  ruleData: RuleData;
  background: Background | null;
  currentBackground: BackgroundContract | null;
  alignmentData: AlignmentContract[];
  alignment: AlignmentContract | null;
  lifestyleData: CharacterLifestyleContract[];
  lifestyle: CharacterLifestyleContract | null;
  faith: string | null;
  traits: CharacterTraits;
  notes: CharacterNotes;
  hair: string | null;
  skin: string | null;
  eyes: string | null;
  height: string | null;
  weight: number | null;
  age: number | null;
  gender: string | null;
  isMobile: boolean;
  choiceInfo: ChoiceData;
  species: Race;
  featLookup: FeatLookup;
  prerequisiteData: PrerequisiteData;
  preferences: CharacterPreferences;
  optionalOriginLookup: OptionalOriginLookup;
  definitionPool: DefinitionPool;
  languages: Modifier[];
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<FeatDefinitionContract[]>>;
  loadAvailableBackgrounds: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<BackgroundDefinitionContract[]>>;
  characterFeaturesManager: CharacterFeaturesManager;
  getGroupedOptionsBySourceCategory: (
    backgrounds: BackgroundDefinitionContract[]
  ) => HtmlSelectOptionGroup[];
}
interface State {
  customizeCollapsed: boolean;
  backgroundData: BackgroundDefinitionContract[];
  loadingStatus: DataLoadingStatusEnum;
}
class DescriptionManage extends React.PureComponent<Props, State> {
  loadBackgroundsCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      customizeCollapsed: !this.isCustomBackgroundEmpty(props.background),
      backgroundData: [],
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
    };
  }

  componentDidMount(): void {
    const { loadAvailableBackgrounds } = this.props;

    this.setState({
      loadingStatus: DataLoadingStatusEnum.LOADING,
    });

    loadAvailableBackgrounds({
      cancelToken: new axios.CancelToken((c) => {
        this.loadBackgroundsCanceler = c;
      }),
    })
      .then((response) => {
        let apiData: BackgroundDefinitionContract[] = [];

        const data = ApiAdapterUtils.getResponseData(response);
        if (data !== null) {
          apiData = data;
        }

        this.setState({
          backgroundData: apiData,
          loadingStatus: DataLoadingStatusEnum.LOADED,
        });
        this.loadBackgroundsCanceler = null;
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  }

  componentWillUnmount(): void {
    if (this.loadBackgroundsCanceler !== null) {
      this.loadBackgroundsCanceler();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { background } = this.props;

    // if you have a custom background, and the previous background was not a custom background
    if (
      background &&
      background.hasCustomBackground &&
      prevProps.background &&
      background.hasCustomBackground !==
        prevProps.background.hasCustomBackground
    ) {
      // collapse it if you already have config in your custom background
      this.setState({
        customizeCollapsed: !this.isCustomBackgroundEmpty(background),
      });
    }
  }

  isCustomBackgroundEmpty = (background: Background | null): boolean => {
    if (background === null) {
      return false;
    }

    if (background.customBackground === null) {
      return false;
    }

    const {
      name,
      description,
      featuresBackground,
      characteristicsBackground,
      backgroundType,
    } = background.customBackground;

    return (
      name === null &&
      description === null &&
      featuresBackground === null &&
      characteristicsBackground === null &&
      backgroundType === null
    );
  };

  hasCharacteristics = (
    backgroundDefinition: BackgroundDefinitionContract | null
  ): boolean => {
    if (backgroundDefinition === null) {
      return false;
    }

    let { flaws, ideals, bonds, personalityTraits } = backgroundDefinition;
    return (
      (flaws !== null && flaws.length !== 0) ||
      (ideals !== null && ideals.length !== 0) ||
      (bonds !== null && bonds.length !== 0) ||
      (personalityTraits !== null && personalityTraits.length !== 0)
    );
  };

  getBackgroundData = (): BackgroundDefinitionContract[] => {
    const { backgroundData } = this.state;
    const { currentBackground } = this.props;

    let data: BackgroundDefinitionContract[] = [...backgroundData];

    if (
      currentBackground !== null &&
      !backgroundData.some(
        (background) =>
          currentBackground !== null &&
          currentBackground.definition !== null &&
          background.id === currentBackground.definition.id
      )
    ) {
      if (currentBackground.definition !== null) {
        data.push(currentBackground.definition);
      }
    }

    return data;
  };

  getNoteContent = (noteType: string): string => {
    const { notes } = this.props;

    return notes[noteType] ? notes[noteType] : "";
  };

  getTraitContent = (traitType: string): string => {
    const { traits } = this.props;

    return traits[traitType] ? traits[traitType] : "";
  };

  handleSaveNote = (noteType: string, content: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.noteSet(noteType, content));
  };

  handleSaveTrait = (traitType: string, content: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.traitSet(traitType, content));
  };

  handleHairChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.hairSet(value));
  };

  handleSkinChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.skinSet(value));
  };

  handleEyesChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.eyesSet(value));
  };

  handleHeightChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.heightSet(value));
  };

  handleWeightChange = (value: string): void => {
    const { dispatch } = this.props;
    let parsedValue = HelperUtils.parseInputInt(value);
    dispatch(characterActions.weightSet(parsedValue));
  };

  handleAgeChange = (value: string): void => {
    const { dispatch } = this.props;
    let parsedValue = HelperUtils.parseInputInt(value);
    dispatch(characterActions.ageSet(parsedValue));
  };

  handleTransformValueToNumberOnBlur = (value: string): number | null => {
    const parsedValue = HelperUtils.parseInputInt(value);
    let clampedValue: number | null = null;
    if (parsedValue !== null) {
      clampedValue = HelperUtils.clampInt(
        parsedValue,
        CHARACTER_DESCRIPTION_NUMBER_VALUE.MIN,
        CHARACTER_DESCRIPTION_NUMBER_VALUE.MAX
      );
    }

    return clampedValue;
  };

  handleGenderChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.genderSet(value));
  };

  handleBackgroundChangePromise = (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch, background } = this.props;

    const newValueParsed = HelperUtils.parseInputInt(newValue);

    if (newValueParsed === -1) {
      dispatch(characterActions.backgroundHasCustomSetRequest(true));
      accept();
    } else {
      if (background && background.hasCustomBackground) {
        const backgroundData = this.getBackgroundData();
        const selectedBackground = backgroundData.find(
          (background) => background.id === newValueParsed
        );

        let modalHeading: string = selectedBackground
          ? "Change Background"
          : "Remove Background";

        dispatch(
          confirmModalActions.create({
            conClsNames: ["confirm-modal-background"],
            heading: modalHeading,
            content: (
              <div className="">
                {selectedBackground ? (
                  <p>
                    Are you sure you want to change from your current{" "}
                    <strong>Custom Background</strong> to{" "}
                    <strong>{selectedBackground.name}</strong>?
                  </p>
                ) : (
                  <p>
                    Are you sure you want to remove your current{" "}
                    <strong>Custom Background</strong>?
                  </p>
                )}
              </div>
            ),
            onConfirm: () => {
              dispatch(characterActions.backgroundChoose(newValueParsed));
              accept();
            },
            onCancel: () => {
              reject();
            },
          })
        );
      } else {
        dispatch(characterActions.backgroundChoose(newValueParsed));
        accept();
      }
    }
  };

  handleChoiceChange = (
    choiceId: string,
    choiceType: number,
    choiceSubType: number | null,
    optionValue: any
  ): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.backgroundChoiceSetRequest(
        choiceType,
        choiceId,
        optionValue
      )
    );
  };

  handleAlignmentChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.alignmentSet(HelperUtils.parseInputInt(value)));
  };

  handleLifestyleChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.lifestyleSet(HelperUtils.parseInputInt(value)));
  };

  handleFaithChange = (value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.faithSet(value));
  };

  handleCustomBackgroundSave = (properties: any): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.backgroundCustomSetRequest(properties));
    this.setState({
      customizeCollapsed: true,
    });
  };

  handleConfigureClick = (evt: React.MouseEvent): void => {
    this.setState((prevState) => ({
      customizeCollapsed: !prevState.customizeCollapsed,
    }));
  };

  handleBackgroundSuggestionUse = (
    traitKey: string,
    idx: number,
    diceRoll: number,
    description: string | null
  ): void => {
    const { dispatch } = this.props;

    let newTraitContent: string = this.getTraitContent(traitKey);
    if (newTraitContent.length) {
      newTraitContent += "\n";
    }
    if (description) {
      newTraitContent += description;
    }

    dispatch(characterActions.traitSet(traitKey, newTraitContent));

    let toastTraitType: string = "";
    switch (traitKey) {
      case "personalityTraits":
        toastTraitType = "Personality Trait";
        break;
      case "ideals":
        toastTraitType = "Ideal";
        break;
      case "bonds":
        toastTraitType = "Bond";
        break;
      case "flaws":
        toastTraitType = "Flaw";
        break;
      default:
      // not implemented
    }

    let descriptionMessage: string = "";
    if (description) {
      descriptionMessage =
        description.length > 70
          ? description.substr(0, 70) + "..."
          : description;
    }
    dispatch(
      toastMessageActions.toastSuccess(
        `${toastTraitType} added to Personal Characteristics section`,
        `${diceRoll} - ${descriptionMessage}`
      )
    );
  };

  handleSpeciesTraitChoiceChange = (
    speciesTraitId,
    choiceId,
    choiceType,
    optionValue
  ): void => {
    const { dispatch } = this.props;

    dispatch(
      characterActions.racialTraitChoiceSetRequest(
        speciesTraitId,
        choiceType,
        choiceId,
        optionValue
      )
    );
  };

  renderBackgroundGroupChoices = (choices: Choice[]): React.ReactNode => {
    const { choiceInfo } = this.props;
    return (
      <div>
        <div className="description-manage-background-choices-items">
          {choices.map((choice) => {
            let choiceId = ChoiceUtils.getId(choice);
            let options = ChoiceUtils.getOptions(choice);

            const availableOptions: Array<FeatureChoiceOption> = options.map(
              (option) => ({
                ...option,
                value: option.id,
              })
            );

            return (
              <DetailChoice
                {...choice}
                choice={choice}
                key={choiceId ? choiceId : ""}
                options={availableOptions}
                onChange={this.handleChoiceChange}
                choiceInfo={choiceInfo}
              />
            );
          })}
        </div>
      </div>
    );
  };

  getSuggestionsHelpText = (traitKey: string, label: string): string => {
    let text = `Describe your character's ${label}`;
    switch (traitKey) {
      case "personalityTraits":
        text =
          "What is your character like? How do their Ability Scores, like Wisdom or Charisma, contribute to their personality?";
        break;
      case "ideals":
        text =
          "What drives and motivates your character? What values do they hold most important? What are they fighting for?";
        break;
      case "bonds":
        text =
          "Whom does your character care most about? To what place do they feel a special connection? What is their most treasured possession?";
        break;
      case "flaws":
        text =
          "What are your character's vices or weaknesses? What do other people not like about them? What traits do they not like about themself? You can also consider their Ability Scores here.";
        break;
      default:
    }
    return text;
  };

  renderTextareaSuggestionList = (
    label: string,
    traitKey: string,
    restrictionLabel?: string
  ): React.ReactNode => {
    const { background } = this.props;

    if (
      background &&
      background.definition &&
      background.definition[traitKey]
    ) {
      return background.definition[traitKey].length > 0 ? (
        <div className="description-suggestion">
          <div className="description-suggestion-info">
            {this.getSuggestionsHelpText(traitKey, label)}
          </div>
          <div className="description-suggestion-heading">Suggestions</div>
          <SuggestionTable
            tableLabel={
              label + (restrictionLabel ? ` (${restrictionLabel})` : "")
            }
            dieLabel={`d${background.definition[traitKey].length}`}
            suggestions={background.definition[traitKey]}
            onSuggestionUse={this.handleBackgroundSuggestionUse.bind(
              this,
              traitKey
            )}
          />
        </div>
      ) : (
        <div className="description-suggestion">
          <div className="description-suggestion-info">
            {this.getSuggestionsHelpText(traitKey, label)}
          </div>
        </div>
      );
    }

    return (
      <div className="description-suggestion">
        <div className="description-suggestion-info">
          {this.getSuggestionsHelpText(traitKey, label)}
        </div>
        <div className="description-suggestion-heading">Suggestions</div>
        <div className="description-suggestion-missing">
          <p>Choose a background to get suggestions.</p>
        </div>
      </div>
    );
    //`
  };

  renderBackgroundSuggestionsList = (
    suggestions: BackgroundCharacteristicContract[] | null,
    label: string,
    traitKey: string
  ): React.ReactNode => {
    if (suggestions === null) {
      return null;
    }

    return (
      <SuggestionTable
        tableLabel={label}
        dieLabel={`d${suggestions.length}`}
        suggestions={suggestions}
        onSuggestionUse={this.handleBackgroundSuggestionUse.bind(
          this,
          traitKey
        )}
      />
    );
  };

  renderBackgroundSuggestionsUi = (
    backgroundDefinition: BackgroundDefinitionContract
  ): React.ReactNode => {
    const { flaws, ideals, bonds, personalityTraits } = backgroundDefinition;

    return (
      <div className="background-suggestions">
        {personalityTraits?.length
          ? this.renderBackgroundSuggestionsList(
              personalityTraits,
              "Personality Traits (Choose Two)",
              "personalityTraits"
            )
          : null}
        {ideals?.length
          ? this.renderBackgroundSuggestionsList(ideals, "Ideals", "ideals")
          : null}
        {bonds?.length
          ? this.renderBackgroundSuggestionsList(bonds, "Bonds", "bonds")
          : null}
        {flaws?.length
          ? this.renderBackgroundSuggestionsList(flaws, "Flaws", "flaws")
          : null}
      </div>
    );
  };

  renderBackgroundDetailChoiceGroup = (
    choices: Choice[],
    label: string
  ): React.ReactNode => {
    const selectedDefaultChoices = choices.filter((choice) =>
      ChoiceUtils.isOnlyDefaultSelected(choice)
    );
    let description: string = "";
    if (selectedDefaultChoices.length) {
      description = selectedDefaultChoices
        .map((choice) => {
          let defaultSubtypes = ChoiceUtils.getDefaultSubtypes(choice);
          return defaultSubtypes ? defaultSubtypes[0] : "";
        })
        .join(", ");
    }

    const renderableChoices = choices.filter(
      (choice) => !ChoiceUtils.isOnlyDefaultSelected(choice)
    );

    return (
      <div>
        {choices.length > 0 && (
          <div className="description-manage-background-proficiency">
            <span className="description-manage-background-proficiency-label">
              {label}:
            </span>
            {description && (
              <HtmlContent
                className="description-manage-background-proficiency-desc"
                html={description}
                withoutTooltips
              />
            )}
          </div>
        )}
        {renderableChoices.length > 0 &&
          this.renderBackgroundGroupChoices(renderableChoices)}
      </div>
    );
  };

  renderBackgroundLanguageChoiceGroup = (
    choices: Choice[],
    label: string
  ): React.ReactNode => {
    const selectedDefaultChoices = choices.filter((choice) =>
      ChoiceUtils.isOnlyDefaultSelected(choice)
    );
    let description: string = "";
    if (selectedDefaultChoices.length) {
      description = selectedDefaultChoices
        .map((choice) => {
          let defaultSubtypes = ChoiceUtils.getDefaultSubtypes(choice);
          return defaultSubtypes ? defaultSubtypes[0] : "";
        })
        .join(", ");
    }

    const renderableChoices = choices.filter(
      (choice) => !ChoiceUtils.isOnlyDefaultSelected(choice)
    );

    const languageCollapsibleHeader: React.ReactNode = (
      <CollapsibleHeader heading={label} metaItems={["Background Language"]} />
    );

    const classNames = ["description-manage-background-feature"];
    const hasTodoChoices: boolean = choices.some(
      (choice) => ChoiceUtils.getOptionValue(choice) === null
    );
    if (hasTodoChoices) {
      classNames.push("collapsible-todo");
    }

    return (
      choices.length > 0 && (
        <Collapsible clsNames={classNames} trigger={languageCollapsibleHeader}>
          <div className="description-manage-background-proficiency">
            {description && (
              <HtmlContent
                className="description-manage-background-proficiency-desc"
                html={description}
                withoutTooltips
              />
            )}
          </div>
          {renderableChoices.length > 0 &&
            this.renderBackgroundGroupChoices(renderableChoices)}
        </Collapsible>
      )
    );
  };

  renderBackgroundChoices = (
    background: Background | null
  ): React.ReactNode => {
    if (background === null) {
      return null;
    }

    const choices = BackgroundUtils.getChoices(background);

    const skillChoices = choices.filter((choice) => {
      let label = ChoiceUtils.getLabel(choice);
      const test = label ? label.toLowerCase() : "";
      return test.includes("choose") && test.includes("skill");
    });

    const toolChoices = choices.filter((choice) => {
      let label = ChoiceUtils.getLabel(choice);
      const test = label ? label.toLowerCase() : "";
      return (
        test.includes("choose") &&
        (test.includes("tool") ||
          test.includes("instrument") ||
          test.includes("gaming set"))
      );
    });

    const languageChoices = choices.filter((choice) => {
      let label = ChoiceUtils.getLabel(choice);
      const test = label ? label.toLowerCase() : "";
      return test.includes("choose") && test.includes("language");
    });

    return (
      <>
        {this.renderBackgroundDetailChoiceGroup(
          skillChoices,
          "Skill Proficiencies"
        )}
        {this.renderBackgroundDetailChoiceGroup(
          toolChoices,
          "Tool Proficiencies"
        )}
        {this.renderBackgroundLanguageChoiceGroup(languageChoices, "Languages")}
      </>
    );
  };

  renderBackgroundFeature = (
    backgroundDefinition: BackgroundDefinitionContract,
    metaItems: string[] = []
  ): React.ReactNode => {
    const { featureName, featureDescription } = backgroundDefinition;

    // Having a background feature is optional, based on whether there is a
    // feature description or not. Technically, there could be a feature description
    // and no feature name, which is ok.
    if (!featureDescription) {
      return null;
    }

    const featureCollapsibleHeader: React.ReactNode = (
      <CollapsibleHeader
        heading={featureName || "Feature"}
        metaItems={["Background Feature", ...metaItems]}
      />
    );

    return (
      <Collapsible
        trigger={featureCollapsibleHeader}
        clsNames={["description-manage-background-feature"]}
      >
        <HtmlContent html={featureDescription} withoutTooltips />
      </Collapsible>
    );
  };

  renderBackgroundDetailsUi = (): React.ReactNode => {
    const { background, isMobile, characterFeaturesManager } = this.props;

    if (background === null) {
      return null;
    }

    const shortDescription = BackgroundUtils.getShortDescription(background);

    return (
      <div>
        {isMobile ? (
          <CollapsibleContent className="description-manage-background-description">
            {shortDescription || ""}
          </CollapsibleContent>
        ) : (
          <HtmlContent
            className="description-manage-background-description"
            html={shortDescription ? shortDescription : ""}
            withoutTooltips
          />
        )}

        {this.renderBackgroundChoices(background)}
        {background.definition &&
          this.renderBackgroundFeature(background.definition)}

        {background.featLists.map((fl) => (
          <GrantedFeat featList={fl} key={fl.definition.id} />
        ))}

        {this.hasCharacteristics(background.definition) && (
          <Collapsible
            clsNames={["description-manage-background-feature"]}
            trigger={"Suggested Characteristics"}
          >
            {background.definition &&
              this.renderBackgroundSuggestionsUi(background.definition)}
          </Collapsible>
        )}
      </div>
    );
  };

  renderCustomBackgroundUI = (): React.ReactNode => {
    const { customizeCollapsed } = this.state;
    const { background } = this.props;

    if (background === null) {
      return null;
    }

    if (background.customBackground === null) {
      return null;
    }

    const {
      name,
      description,
      featuresBackground,
      characteristicsBackground,
      backgroundType,
    } = background.customBackground;

    let suggestedHeader: React.ReactNode;
    if (characteristicsBackground) {
      let metaItems: string[] = [];
      if (characteristicsBackground.name) {
        metaItems.push(characteristicsBackground.name);
      }
      suggestedHeader = (
        <CollapsibleHeader
          heading={"Suggested Characteristics"}
          metaItems={metaItems}
        />
      );
    }

    return (
      <div>
        {!customizeCollapsed && (
          <CustomBackgroundManager
            backgroundData={this.getBackgroundData()}
            name={name}
            description={description}
            featureId={featuresBackground ? featuresBackground.id : null}
            characteristicsId={
              characteristicsBackground ? characteristicsBackground.id : null
            }
            modifierType={backgroundType}
            onSave={this.handleCustomBackgroundSave}
          />
        )}

        <PageSubHeader>{name}</PageSubHeader>

        {description && (
          <div className="description-manage-background-description custom-background-description">
            {description}
          </div>
        )}

        {this.renderBackgroundChoices(background)}
        {featuresBackground &&
          this.renderBackgroundFeature(featuresBackground, [
            featuresBackground.name ? featuresBackground.name : "",
          ])}

        {characteristicsBackground &&
          this.hasCharacteristics(characteristicsBackground) && (
            <Collapsible trigger={suggestedHeader}>
              {this.renderBackgroundSuggestionsUi(characteristicsBackground)}
            </Collapsible>
          )}
      </div>
    );
  };

  renderBackgroundUiContent = (): React.ReactNode => {
    const { customizeCollapsed } = this.state;
    const { background, getGroupedOptionsBySourceCategory } = this.props;

    const backgroundOptions: Array<HtmlSelectOption | HtmlSelectOptionGroup> = [
      {
        label: "Custom Background",
        value: -1,
      },
      {
        label: "---------",
        disabled: true,
        value: "-----",
      },
      ...getGroupedOptionsBySourceCategory(this.getBackgroundData()),
    ];

    let backgroundId: number | null = null;
    if (background) {
      if (background.hasCustomBackground) {
        backgroundId = -1;
      } else if (background.definition) {
        backgroundId = BackgroundUtils.getId(background);
      }
    }

    let clsNames: string[] = ["custom-background-customize-header"];
    if (customizeCollapsed) {
      clsNames.push("custom-background-customize-header-closed");
    } else {
      clsNames.push("custom-background-customize-header-opened");
    }

    return (
      <React.Fragment>
        <div className="ct-character-tools__marketplace-callout">
          Looking for something not in the list below? Unlock all official
          options in the <Link href="/marketplace">Marketplace</Link>.
        </div>
        <div className="description-manage-background-chooser-con">
          <div className="description-manage-background-chooser-field">
            <Select
              onChangePromise={this.handleBackgroundChangePromise}
              options={backgroundOptions}
              value={backgroundId}
              clsNames={["description-manage-background-chooser"]}
            />
          </div>
          {background && background.hasCustomBackground && (
            <div className="description-manage-background-chooser-extra">
              <div
                className={clsNames.join(" ")}
                onClick={this.handleConfigureClick}
              >
                <div className="custom-background-customize-heading">
                  Configure
                </div>
                <div className="custom-background-customize-trigger" />
              </div>
            </div>
          )}
        </div>
        {background &&
          !background.hasCustomBackground &&
          this.renderBackgroundDetailsUi()}
        {background &&
          background.hasCustomBackground &&
          this.renderCustomBackgroundUI()}
      </React.Fragment>
    );
  };

  renderBackgroundUi = (): React.ReactNode => {
    const { loadingStatus } = this.state;

    let contentNode: React.ReactNode;
    if (loadingStatus === DataLoadingStatusEnum.LOADED) {
      contentNode = this.renderBackgroundUiContent();
    } else {
      contentNode = <LoadingPlaceholder />;
    }

    return (
      <div className="description-manage-background">
        <PageSubHeader>Choose Origin: Background</PageSubHeader>
        {contentNode}
      </div>
    );
  };

  renderInformationCollapsible = (): React.ReactNode => {
    const { ruleData, languages, currentBackground } = this.props;
    if (languages.length === 0 || currentBackground === null) {
      return null;
    }

    let definitionKeys: string[] = [];
    if (currentBackground) {
      definitionKeys.push(
        DefinitionUtils.hack__generateDefinitionKey(
          BackgroundUtils.getEntityTypeId(currentBackground),
          BackgroundUtils.getId(currentBackground)
        )
      );
    }

    if (languages.length > 0) {
      definitionKeys = definitionKeys.concat(
        languages.map((language) => {
          const entityType = ModifierUtils.getEntityTypeId(language) ?? 0;
          const entityId = ModifierUtils.getEntityId(language) ?? 0;

          return DefinitionUtils.hack__generateDefinitionKey(
            entityType,
            entityId
          );
        })
      );
    }

    const builderText = RuleDataUtils.getBuilderHelperTextByDefinitionKeys(
      definitionKeys,
      ruleData,
      Constants.DisplayConfigurationTypeEnum.LANGUAGE
    );

    return <HelperTextAccordion builderHelperText={builderText} />;
  };

  render() {
    const {
      ruleData,
      hair,
      skin,
      eyes,
      height,
      weight,
      age,
      gender,
      faith,
      alignment,
      lifestyleData,
      lifestyle,
    } = this.props;

    const charDetailsHeader: React.ReactNode = (
      <CollapsibleHeader
        metaItems={["Alignment", "Faith", "Lifestyle"]}
        heading="Character Details"
      />
    );

    const physicalCharHeader: React.ReactNode = (
      <CollapsibleHeader
        metaItems={[
          "Hair",
          "Skin",
          "Eyes",
          "Height",
          "Weight",
          "Age",
          "Gender",
        ]}
        heading="Physical Characteristics"
      />
    );

    const personalCharHeader: React.ReactNode = (
      <CollapsibleHeader
        metaItems={["Personality", "Ideals", "Bonds", "Flaws"]}
        heading="Personal Characteristics"
      />
    );

    const notesHeader: React.ReactNode = (
      <CollapsibleHeader
        metaItems={["Organizations", "Allies", "Enemies", "Backstory", "Other"]}
        heading="Notes"
      />
    );

    const alignmentOptions = RuleDataUtils.getAlignmentOptions(ruleData);

    let alignmentDescriptionNode: React.ReactNode;
    if (alignment !== null && alignment.description !== null) {
      alignmentDescriptionNode = (
        <HtmlContent
          className="description-manage-alignment-desc"
          html={alignment.description}
          withoutTooltips
        />
      );
    }

    const lifestyleOptions = lifestyleData.map((lifestyle) => ({
      label: `${lifestyle.name} ${
        lifestyle.cost === "-" ? "" : `(${lifestyle.cost})`
      }`,
      value: lifestyle.id,
    }));

    const numberInputAttributes = {
      min: CHARACTER_DESCRIPTION_NUMBER_VALUE.MIN,
      max: CHARACTER_DESCRIPTION_NUMBER_VALUE.MAX,
    } as HTMLAttributes<HTMLInputElement>;

    return (
      <Page clsNames={["description-manage"]}>
        <PageBody>
          <div className="description-manage-information">
            {this.renderInformationCollapsible()}
          </div>
          {this.renderBackgroundUi()}
          <Collapsible trigger={charDetailsHeader}>
            <div className="description-manage-alignment">
              <label className="description-manage-alignment-label">
                Alignment
              </label>
              <Select
                options={alignmentOptions}
                value={alignment === null ? null : alignment.id}
                onChange={this.handleAlignmentChange}
              />
              {alignmentDescriptionNode}
            </div>
            <div className="description-manage-faith">
              <FormInputField
                label="Faith"
                initialValue={faith}
                onBlur={this.handleFaithChange}
                inputAttributes={
                  {
                    spellCheck: false,
                    autoComplete: "off",
                  } as HTMLAttributes<HTMLInputElement>
                }
                maxLength={512}
              />
            </div>
            <div className="description-manage-lifestyle">
              <label className="description-manage-lifestyle-label">
                Lifestyle
              </label>
              <Select
                options={lifestyleOptions}
                value={lifestyle === null ? null : lifestyle.id}
                onChange={this.handleLifestyleChange}
              />
              {lifestyle !== null && (
                <CollapsibleContent className="description-manage-lifestyle-desc">
                  {lifestyle.description ? lifestyle.description : ""}
                </CollapsibleContent>
              )}
            </div>
          </Collapsible>
          <Collapsible trigger={physicalCharHeader}>
            <FormInputField
              label="Hair"
              initialValue={hair}
              onBlur={this.handleHairChange}
              maxLength={50}
            />
            <FormInputField
              label="Skin"
              initialValue={skin}
              onBlur={this.handleSkinChange}
              maxLength={50}
            />
            <FormInputField
              label="Eyes"
              initialValue={eyes}
              onBlur={this.handleEyesChange}
              maxLength={50}
            />
            <FormInputField
              label="Height"
              initialValue={height}
              onBlur={this.handleHeightChange}
              maxLength={50}
            />
            <FormInputField
              label="Weight (lbs)"
              type={"number"}
              initialValue={weight}
              onBlur={this.handleWeightChange}
              transformValueOnBlur={this.handleTransformValueToNumberOnBlur}
              inputAttributes={numberInputAttributes}
            />
            <FormInputField
              label="Age (Years)"
              type={"number"}
              initialValue={age}
              onBlur={this.handleAgeChange}
              transformValueOnBlur={this.handleTransformValueToNumberOnBlur}
              inputAttributes={numberInputAttributes}
            />
            <FormInputField
              label="Gender"
              initialValue={gender}
              onBlur={this.handleGenderChange}
              maxLength={128}
            />
          </Collapsible>
          <Collapsible
            trigger={personalCharHeader}
            clsNames={["description-manage-personal"]}
          >
            <EditorWithDialog
              heading={<h3>Personality Traits</h3>}
              editButtonLabel="Edit Traits"
              addButtonLabel="Add Traits"
              placeholder="Add traits here..."
              content={this.getTraitContent(
                Constants.TraitTypeEnum.PERSONALITY_TRAITS
              )}
              onSave={this.handleSaveTrait.bind(
                this,
                Constants.TraitTypeEnum.PERSONALITY_TRAITS
              )}
              extraNode={this.renderTextareaSuggestionList(
                "Personality Traits",
                "personalityTraits",
                "Choose Two"
              )}
            />
            <EditorWithDialog
              heading={<h3>Ideals</h3>}
              editButtonLabel="Edit Ideals"
              addButtonLabel="Add Ideals"
              placeholder="Add ideals here..."
              content={this.getTraitContent(Constants.TraitTypeEnum.IDEALS)}
              onSave={this.handleSaveTrait.bind(
                this,
                Constants.TraitTypeEnum.IDEALS
              )}
              extraNode={this.renderTextareaSuggestionList("Ideals", "ideals")}
            />
            <EditorWithDialog
              heading={<h3>Bonds</h3>}
              editButtonLabel="Edit Bonds"
              addButtonLabel="Add Bonds"
              placeholder="Add bonds here..."
              content={this.getTraitContent(Constants.TraitTypeEnum.BONDS)}
              onSave={this.handleSaveTrait.bind(
                this,
                Constants.TraitTypeEnum.BONDS
              )}
              extraNode={this.renderTextareaSuggestionList("Bonds", "bonds")}
            />
            <EditorWithDialog
              heading={<h3>Flaws</h3>}
              editButtonLabel="Edit Flaws"
              addButtonLabel="Add Flaws"
              placeholder="Add flaws here..."
              content={this.getTraitContent(Constants.TraitTypeEnum.FLAWS)}
              onSave={this.handleSaveTrait.bind(
                this,
                Constants.TraitTypeEnum.FLAWS
              )}
              extraNode={this.renderTextareaSuggestionList("Flaws", "flaws")}
            />
          </Collapsible>
          <Collapsible trigger={notesHeader}>
            <EditorWithDialog
              heading={<h3>Organizations</h3>}
              editButtonLabel="Edit Notes"
              addButtonLabel="Add Notes"
              placeholder="Add organization notes here..."
              content={this.getNoteContent(Constants.NoteKeyEnum.ORGANIZATIONS)}
              onSave={this.handleSaveNote.bind(
                this,
                Constants.NoteKeyEnum.ORGANIZATIONS
              )}
              extraNode={
                <p className="description-suggestion-info">
                  Are there any important organizations your character belongs
                  to? Any societies, orders, cults, or agencies?
                </p>
              }
            />
            <EditorWithDialog
              heading={<h3>Allies</h3>}
              editButtonLabel="Edit Notes"
              addButtonLabel="Add Notes"
              placeholder="Add allies here..."
              content={this.getNoteContent(Constants.NoteKeyEnum.ALLIES)}
              onSave={this.handleSaveNote.bind(
                this,
                Constants.NoteKeyEnum.ALLIES
              )}
              extraNode={
                <p className="description-suggestion-info">
                  With whom does your character associate? When in need of aid,
                  do they seek out their kinfolk, followers of their deity, or
                  other members of their order? What groups or individuals are
                  they aligned with?
                </p>
              }
            />
            <EditorWithDialog
              heading={<h3>Enemies</h3>}
              editButtonLabel="Edit Notes"
              addButtonLabel="Add Notes"
              placeholder="Add enemies here..."
              content={this.getNoteContent(Constants.NoteKeyEnum.ENEMIES)}
              onSave={this.handleSaveNote.bind(
                this,
                Constants.NoteKeyEnum.ENEMIES
              )}
              extraNode={
                <p className="description-suggestion-info">
                  Who does your character fear or fight? Have they sworn a vow
                  to rid the world of undead? Is there an order or organization
                  they are opposed to? Are there any specific foes from their
                  past?
                </p>
              }
            />
            <EditorWithDialog
              heading={<h3>Backstory</h3>}
              editButtonLabel="Edit Notes"
              addButtonLabel="Add Notes"
              placeholder="Add a backstory..."
              content={this.getNoteContent(Constants.NoteKeyEnum.BACKSTORY)}
              onSave={this.handleSaveNote.bind(
                this,
                Constants.NoteKeyEnum.BACKSTORY
              )}
              extraNode={
                <p className="description-suggestion-info">
                  Talk about your character's origins. Where are they from? How
                  did they end up adventuring? How did they choose their class?
                </p>
              }
            />
            <EditorWithDialog
              heading={<h3>Other</h3>}
              editButtonLabel="Edit Notes"
              addButtonLabel="Add Notes"
              placeholder="Add additional notes here..."
              content={this.getNoteContent(Constants.NoteKeyEnum.OTHER)}
              onSave={this.handleSaveNote.bind(
                this,
                Constants.NoteKeyEnum.OTHER
              )}
              extraNode={
                <p className="description-suggestion-info">
                  Anything at all you'd like to mention about your character.
                </p>
              }
            />
          </Collapsible>
        </PageBody>
      </Page>
    );
  }
}

const mapStateToProps = (state: BuilderAppState) => {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    background: rulesEngineSelectors.getBackgroundInfo(state),
    currentBackground: rulesEngineSelectors.getBackground(state),
    alignmentData: ruleDataSelectors.getAlignments(state),
    lifestyleData: ruleDataSelectors.getLifestyles(state),
    alignment: rulesEngineSelectors.getAlignment(state),
    lifestyle: rulesEngineSelectors.getLifestyle(state),
    faith: rulesEngineSelectors.getFaith(state),
    traits: rulesEngineSelectors.getCharacterTraits(state),
    notes: rulesEngineSelectors.getCharacterNotes(state),
    hair: rulesEngineSelectors.getHair(state),
    skin: rulesEngineSelectors.getSkin(state),
    eyes: rulesEngineSelectors.getEyes(state),
    height: rulesEngineSelectors.getHeight(state),
    weight: rulesEngineSelectors.getWeight(state),
    age: rulesEngineSelectors.getAge(state),
    gender: rulesEngineSelectors.getGender(state),
    isMobile: appEnvSelectors.getIsMobile(state),
    choiceInfo: rulesEngineSelectors.getChoiceInfo(state),
    loadAvailableBackgrounds:
      apiCreatorSelectors.makeLoadAvailableBackgrounds(state),
    species: rulesEngineSelectors.getRace(state),
    featLookup: rulesEngineSelectors.getFeatLookup(state),
    loadAvailableFeats: apiCreatorSelectors.makeLoadAvailableFeats(state),
    prerequisiteData: rulesEngineSelectors.getPrerequisiteData(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    optionalOriginLookup: rulesEngineSelectors.getOptionalOriginLookup(state),
    definitionPool: serviceDataSelectors.getDefinitionPool(state),
    languages: rulesEngineSelectors.getLanguageModifiers(state),
  };
};

const DescriptionManageContainer = (props) => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const { getGroupedOptionsBySourceCategory } = useSource();

  return (
    <DescriptionManage
      characterFeaturesManager={characterFeaturesManager}
      getGroupedOptionsBySourceCategory={getGroupedOptionsBySourceCategory}
      {...props}
    />
  );
};

export default ConnectedBuilderPage(
  DescriptionManageContainer,
  RouteKey.DESCRIPTION_MANAGE,
  mapStateToProps
);
