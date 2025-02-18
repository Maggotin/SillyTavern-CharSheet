import axios, { Canceler } from "axios";
import React from "react";

import { LoadingPlaceholder } from "../../character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  CharacterPreferences,
  ChoiceData,
  ChoiceUtils,
  Constants,
  CoreUtils,
  DefinitionPool,
  Feat,
  FeatDefinitionContract,
  FeatLookup,
  FeatUtils,
  HelperUtils,
  OptionalOriginLookup,
  OptionalOriginUtils,
  PrerequisiteData,
  RacialTrait,
  RacialTraitUtils,
} from "../../character-rules-engine/es";

import { FeatureChoice } from "~/components/FeatureChoice";
import { HtmlContent } from "~/components/HtmlContent";

import {
  Collapsible,
  CollapsibleHeader,
} from "../../../../../Shared/components/legacy/common/Collapsible";
import DataLoadingStatusEnum from "../../../../../Shared/constants/DataLoadingStatusEnum";
import { AppLoggerUtils } from "../../../../../Shared/utils";

interface Props {
  speciesTrait: RacialTrait;
  choiceInfo: ChoiceData;
  preferences: CharacterPreferences;
  prerequisiteData: PrerequisiteData;
  featLookup: FeatLookup;
  onChoiceChange: (
    speciesTraitId: number,
    choiceId: string,
    type: number,
    value: any
  ) => void;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<FeatDefinitionContract>>>;
  optionalOriginLookup: OptionalOriginLookup;
  definitionPool: DefinitionPool;
  speciesName?: string | null;
}
interface State {
  featData: Array<Feat>;
  hasFeatChoice: boolean;
  collapsibleOpened: boolean;
  loadingStatus: DataLoadingStatusEnum;
}
export default class SpeciesManageSpeciesTrait extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      featData: [],
      hasFeatChoice: false,
      collapsibleOpened: false,
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
    };
  }

  loadFeatsCanceler: null | Canceler = null;

  componentDidMount(): void {
    this.setState(
      {
        hasFeatChoice: this.hasFeatChoice(this.props),
      },
      () => {
        this.conditionallyLoadFeatData();
      }
    );
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { speciesTrait } = this.props;
    const { collapsibleOpened } = this.state;

    if (speciesTrait !== prevProps.speciesTrait) {
      this.setState(
        {
          hasFeatChoice: this.hasFeatChoice(this.props),
        },
        () => {
          this.conditionallyLoadFeatData();
        }
      );
    }
    if (collapsibleOpened && !prevState.collapsibleOpened) {
      this.conditionallyLoadFeatData();
    }
  }

  componentWillUnmount(): void {
    if (this.loadFeatsCanceler !== null) {
      this.loadFeatsCanceler();
    }
  }

  conditionallyLoadFeatData = (): void => {
    const { loadAvailableFeats } = this.props;
    const { hasFeatChoice, loadingStatus, collapsibleOpened } = this.state;

    if (
      hasFeatChoice &&
      collapsibleOpened &&
      loadingStatus === DataLoadingStatusEnum.NOT_INITIALIZED
    ) {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADING,
      });

      loadAvailableFeats({
        cancelToken: new axios.CancelToken((c) => {
          this.loadFeatsCanceler = c;
        }),
      })
        .then((response) => {
          let featData: Array<Feat> = [];

          const data = ApiAdapterUtils.getResponseData(response);
          if (data !== null) {
            featData = data.map((definition) =>
              FeatUtils.simulateFeat(definition)
            );
          }

          this.setState({
            featData,
            loadingStatus: DataLoadingStatusEnum.LOADED,
          });
          this.loadFeatsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }
  };

  getFeatData = (existingFeatId: number | null): Array<Feat> => {
    const { featData } = this.state;
    const { featLookup } = this.props;

    let data: Array<Feat> = [...featData];

    if (existingFeatId !== null) {
      let existingFeat = HelperUtils.lookupDataOrFallback(
        featLookup,
        existingFeatId
      );
      if (
        existingFeat !== null &&
        !data.some((feat) => FeatUtils.getId(feat) === existingFeatId)
      ) {
        data.push(existingFeat);
      }
    }

    return data;
  };

  hasFeatChoice = (props: Props): boolean => {
    const { speciesTrait } = props;

    const choices = RacialTraitUtils.getChoices(speciesTrait);
    return choices.some(
      (choice) =>
        ChoiceUtils.getType(choice) ===
        Constants.BuilderChoiceTypeEnum.FEAT_CHOICE_OPTION
    );
  };

  handleCollapsibleOpened = (): void => {
    this.setState({
      collapsibleOpened: true,
    });
  };

  handleChoiceChange = (choiceId: string, type: number, value: any): void => {
    const { onChoiceChange, speciesTrait } = this.props;

    if (onChoiceChange) {
      onChoiceChange(
        RacialTraitUtils.getId(speciesTrait),
        choiceId,
        type,
        HelperUtils.parseInputInt(value)
      );
    }
  };

  renderHeader = (): React.ReactNode => {
    const { speciesTrait, optionalOriginLookup, definitionPool, speciesName } =
      this.props;
    let name = RacialTraitUtils.getName(speciesTrait);
    const displayConfiguration =
      RacialTraitUtils.getDisplayConfiguration(speciesTrait);
    const addName = displayConfiguration
      ? CoreUtils.getDisplayConfigurationValue(
          Constants.DisplayConfigurationTypeEnum.RACIAL_TRAIT,
          displayConfiguration
        ) === Constants.DisplayConfigurationValueEnum.ON
      : false;
    if (speciesName && addName) {
      // TODO get species name
      name = `${name} (${speciesName})`;
    }

    const choices = RacialTraitUtils.getChoices(speciesTrait);

    let metaItems: Array<string> = [];
    if (choices.length) {
      metaItems.push(
        `${choices.length} Choice${choices.length !== 1 ? "s" : ""}`
      );
    }

    const featureType = RacialTraitUtils.getFeatureType(speciesTrait);

    const addOrigin = displayConfiguration
      ? CoreUtils.getDisplayConfigurationValue(
          Constants.DisplayConfigurationTypeEnum.RACIAL_TRAIT,
          displayConfiguration
        ) === Constants.DisplayConfigurationValueEnum.OFF
      : false;

    if (featureType !== Constants.FeatureTypeEnum.GRANTED || addOrigin) {
      metaItems.push("Origin");
    }
    if (featureType === Constants.FeatureTypeEnum.REPLACEMENT) {
      name = `Origin ${name}`;

      const optionalOrigin = HelperUtils.lookupDataOrFallback(
        optionalOriginLookup,
        RacialTraitUtils.getDefinitionKey(speciesTrait)
      );

      if (optionalOrigin) {
        const affectedDefinitionKey =
          OptionalOriginUtils.getAffectedRacialTraitDefinitionKey(
            optionalOrigin
          );
        if (affectedDefinitionKey) {
          const replacedSpeciesTrait = RacialTraitUtils.simulateRacialTrait(
            affectedDefinitionKey,
            definitionPool
          );

          if (replacedSpeciesTrait) {
            metaItems.push(
              `Replaces ${RacialTraitUtils.getName(replacedSpeciesTrait)}`
            );
          }
        }
      }
    }

    return <CollapsibleHeader metaItems={metaItems} heading={name} />;
  };

  renderChoices = (): React.ReactNode => {
    const { speciesTrait } = this.props;
    const { featData } = this.state;

    const choices = RacialTraitUtils.getChoices(speciesTrait);

    if (choices === null) {
      return null;
    }

    return choices.map((choice) => (
      <FeatureChoice
        choice={choice}
        featsData={featData}
        onChoiceChange={this.handleChoiceChange}
        key={ChoiceUtils.getId(choice)}
      />
    ));
  };

  render() {
    const { speciesTrait } = this.props;
    const { hasFeatChoice, loadingStatus } = this.state;

    const description = RacialTraitUtils.getDescription(speciesTrait);
    const choices = RacialTraitUtils.getChoices(speciesTrait);

    const hasTodoChoices: boolean = choices.some(
      (choice) => ChoiceUtils.getOptionValue(choice) === null
    );

    const conClsNames: Array<string> = ["race-detail-racial-trait-name"];
    if (hasTodoChoices) {
      conClsNames.push("collapsible-todo");
    }

    let contentNode: React.ReactNode;
    if (hasFeatChoice) {
      if (loadingStatus === DataLoadingStatusEnum.LOADED) {
        contentNode = this.renderChoices();
      } else {
        contentNode = <LoadingPlaceholder />;
      }
    } else {
      contentNode = this.renderChoices();
    }

    return (
      <Collapsible
        trigger={this.renderHeader()}
        clsNames={conClsNames}
        onOpened={this.handleCollapsibleOpened}
      >
        <HtmlContent
          className="race-detail-racial-trait-description"
          html={description ? description : ""}
          withoutTooltips
        />
        {contentNode}
      </Collapsible>
    );
  }
}
