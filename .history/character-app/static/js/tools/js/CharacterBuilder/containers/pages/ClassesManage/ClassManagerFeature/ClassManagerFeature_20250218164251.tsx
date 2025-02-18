import axios, { Canceler } from "axios";
import React from "react";

import { LoadingPlaceholder } from "@dndbeyond/character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  BaseItemDefinitionContract,
  CharacterPreferences,
  CharClass,
  ChoiceData,
  ChoiceUtils,
  ClassDefinitionContract,
  ClassFeature,
  ClassFeatureUtils,
  ClassUtils,
  Constants,
  DefinitionPool,
  EntitledEntity,
  Feat,
  FeatDefinitionContract,
  FeatLookup,
  FeatUtils,
  FormatUtils,
  HelperUtils,
  InfusionChoice,
  InfusionChoiceUtils,
  InfusionDefinitionContract,
  InfusionUtils,
  KnownInfusionUtils,
  Modifier,
  OptionalClassFeatureLookup,
  OptionalClassFeatureUtils,
  PrerequisiteData,
  RuleData,
  RuleDataUtils,
  SourceData,
  TypeValueLookup,
} from "../../character-rules-engine/es";

import { CollapsibleContent } from "~/components/CollapsibleContent";
import { FeatureChoice } from "~/components/FeatureChoice";
import { Link } from "~/components/Link";
import { GrantedFeat } from "~/tools/js/CharacterBuilder/components/GrantedFeat/GrantedFeat";

import InfusionChoiceManager from "../../../../../Shared/components/InfusionChoiceManager";
import {
  Collapsible,
  CollapsibleHeader,
} from "../../../../../Shared/components/legacy/common/Collapsible";
import DataLoadingStatusEnum from "../../../../../Shared/constants/DataLoadingStatusEnum";
import { AppLoggerUtils, TypeScriptUtils } from "../../../../../Shared/utils";

interface Props {
  isActive: boolean;
  charClass: CharClass;
  choiceInfo: ChoiceData;
  feature: ClassFeature;
  prerequisiteData: PrerequisiteData;
  isStartingClass: boolean;
  preferences: CharacterPreferences;
  globalModifiers: Array<Modifier>;
  typeValueLookup: TypeValueLookup;
  ruleData: RuleData;
  definitionPool: DefinitionPool;
  knownInfusionLookup: Record<string, InfusionChoice>;
  knownReplicatedItems: Array<string>;
  onChoiceChange?: (
    classFeatureId: number,
    choiceId: string,
    type: any,
    value: number | null,
    parentChoiceId: string | null
  ) => void;
  onInfusionChoiceItemChangePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    itemDefinitionKey: string,
    itemName: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceItemDestroyPromise?: (
    infusionChoiceKey: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceChangePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceDestroyPromise?: (
    infusionChoiceKey: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceCreatePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ) => void;
  loadAvailableSubclasses: (
    baseClassId: number,
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<ClassDefinitionContract>>>;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<FeatDefinitionContract>>>;
  loadAvailableEquipment: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  loadAvailableInfusions: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<
    ApiResponse<EntitledEntity<InfusionDefinitionContract>>
  >;
  onDefinitionsLoaded?: (
    definitions: Array<InfusionDefinitionContract>,
    accessTypes: Record<string, number>
  ) => void;
  featLookup: FeatLookup;
  optionalClassFeatureLookup: OptionalClassFeatureLookup;
}
interface State {
  featData: Array<Feat>;
  subclassData: Array<ClassDefinitionContract>;
  hasFeatChoice: boolean;
  hasSubclassChoice: boolean;
  collapsibleOpened: boolean;
  featLoadingStatus: DataLoadingStatusEnum;
  subclassLoadingStatus: DataLoadingStatusEnum;
}
export default class ClassManagerFeature extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    isActive: true,
    featLookup: {},
  };

  loadFeatsCanceler: null | Canceler = null;
  loadSubclassesCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      featData: [],
      subclassData: [],
      hasFeatChoice: false,
      hasSubclassChoice: false,
      collapsibleOpened: false,
      featLoadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
      subclassLoadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
    };
  }

  componentDidMount(): void {
    this.setState(
      {
        hasFeatChoice: this.hasFeatChoice(this.props),
        hasSubclassChoice: this.hasSubclassChoice(this.props),
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
    const { feature } = this.props;
    const { collapsibleOpened } = this.state;

    if (feature !== prevProps.feature) {
      this.setState(
        {
          hasFeatChoice: this.hasFeatChoice(this.props),
          hasSubclassChoice: this.hasSubclassChoice(this.props),
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

  conditionallyLoadFeatData = (): void => {
    const { loadAvailableFeats, loadAvailableSubclasses, charClass } =
      this.props;
    const {
      hasFeatChoice,
      hasSubclassChoice,
      featLoadingStatus,
      subclassLoadingStatus,
      collapsibleOpened,
    } = this.state;

    if (
      hasFeatChoice &&
      collapsibleOpened &&
      featLoadingStatus === DataLoadingStatusEnum.NOT_INITIALIZED
    ) {
      this.setState({
        featLoadingStatus: DataLoadingStatusEnum.LOADING,
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
            featLoadingStatus: DataLoadingStatusEnum.LOADED,
          });
          this.loadFeatsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }

    if (
      hasSubclassChoice &&
      collapsibleOpened &&
      subclassLoadingStatus === DataLoadingStatusEnum.NOT_INITIALIZED
    ) {
      this.setState({
        subclassLoadingStatus: DataLoadingStatusEnum.LOADING,
      });

      loadAvailableSubclasses(ClassUtils.getId(charClass), {
        cancelToken: new axios.CancelToken((c) => {
          this.loadSubclassesCanceler = c;
        }),
      })
        .then((response) => {
          let subclassData: Array<ClassDefinitionContract> = [];

          const data = ApiAdapterUtils.getResponseData(response);
          if (data !== null) {
            subclassData = data;
          }

          this.setState({
            subclassData,
            subclassLoadingStatus: DataLoadingStatusEnum.LOADED,
          });
          this.loadSubclassesCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }
  };

  componentWillUnmount(): void {
    if (this.loadFeatsCanceler !== null) {
      this.loadFeatsCanceler();
    }
    if (this.loadSubclassesCanceler !== null) {
      this.loadSubclassesCanceler();
    }
  }

  hasFeatChoice = (props: Props): boolean => {
    const { feature } = props;

    const choices = ClassFeatureUtils.getChoices(feature);
    return choices.some(
      (choice) =>
        ChoiceUtils.getType(choice) ===
        Constants.BuilderChoiceTypeEnum.FEAT_CHOICE_OPTION
    );
  };

  hasSubclassChoice = (props: Props): boolean => {
    const { feature } = props;

    const choices = ClassFeatureUtils.getChoices(feature);
    return choices.some(
      (choice) =>
        ChoiceUtils.getType(choice) ===
        Constants.BuilderChoiceTypeEnum.SUB_CLASS_OPTION
    );
  };

  isDataLoaded = (): boolean => {
    const {
      hasSubclassChoice,
      hasFeatChoice,
      subclassLoadingStatus,
      featLoadingStatus,
    } = this.state;

    if (hasSubclassChoice) {
      if (subclassLoadingStatus !== DataLoadingStatusEnum.LOADED) {
        return false;
      }
    }
    if (hasFeatChoice) {
      if (featLoadingStatus !== DataLoadingStatusEnum.LOADED) {
        return false;
      }
    }

    return true;
  };

  handleCollapsibleOpened = (): void => {
    this.setState({
      collapsibleOpened: true,
    });
  };

  handleChoiceChange = (
    id: string,
    type: number,
    value: any,
    parentChoiceId: string | null
  ): void => {
    const { onChoiceChange, feature } = this.props;

    if (onChoiceChange) {
      onChoiceChange(
        ClassFeatureUtils.getId(feature),
        id,
        type,
        HelperUtils.parseInputInt(value),
        parentChoiceId
      );
    }
  };

  getAvailableInfusionChoices = (): Array<InfusionChoice> => {
    const { feature } = this.props;

    return ClassFeatureUtils.getInfusionChoices(feature).filter(
      InfusionChoiceUtils.validateIsAvailable
    );
  };

  getInfusionChoiceCount = (): number => {
    return this.getAvailableInfusionChoices().length;
  };

  getTodoInfusionChoiceCount = (): number => {
    return this.getAvailableInfusionChoices().filter(
      (infusionChoice) =>
        InfusionChoiceUtils.getKnownInfusion(infusionChoice) === null
    ).length;
  };

  getInfusionItemChoiceCount = (): number => {
    return this.getAvailableInfusionChoices().filter((infusionChoice) => {
      const knownInfusion =
        InfusionChoiceUtils.getKnownInfusion(infusionChoice);
      if (knownInfusion === null) {
        return false;
      }
      const simulatedInfusion =
        KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
      if (simulatedInfusion === null) {
        return false;
      }
      return (
        InfusionUtils.getType(simulatedInfusion) ===
        Constants.InfusionTypeEnum.REPLICATE
      );
    }).length;
  };

  getTodoInfusionItemChoiceCount = (): number => {
    return this.getAvailableInfusionChoices().filter((infusionChoice) => {
      const knownInfusion =
        InfusionChoiceUtils.getKnownInfusion(infusionChoice);
      if (knownInfusion === null) {
        return false;
      }
      const simulatedInfusion =
        KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
      if (simulatedInfusion === null) {
        return false;
      }
      if (
        InfusionUtils.getType(simulatedInfusion) !==
        Constants.InfusionTypeEnum.REPLICATE
      ) {
        return false;
      }
      if (KnownInfusionUtils.getItemId(knownInfusion) !== null) {
        return false;
      }
      return true;
    }).length;
  };

  getChoiceCount = (): number => {
    const { feature } = this.props;
    return ClassFeatureUtils.getChoices(feature).length;
  };

  getTodoChoiceCount = (): number => {
    const { feature } = this.props;
    return ClassFeatureUtils.getChoices(feature).filter(ChoiceUtils.isTodo)
      .length;
  };

  getTotalChoiceCount = (): number => {
    return (
      this.getChoiceCount() +
      this.getInfusionChoiceCount() +
      this.getInfusionItemChoiceCount()
    );
  };

  getTotalTodoCount = (): number => {
    return (
      this.getTodoChoiceCount() +
      this.getTodoInfusionChoiceCount() +
      this.getTodoInfusionItemChoiceCount()
    );
  };

  getSubclassSources = (
    subclass: ClassDefinitionContract
  ): Array<SourceData> => {
    const { ruleData } = this.props;

    if (subclass.sources === null) {
      return [];
    }

    return subclass.sources
      .map((sourceMapping) =>
        HelperUtils.lookupDataOrFallback(
          RuleDataUtils.getSourceDataLookup(ruleData),
          sourceMapping.sourceId
        )
      )
      .filter(TypeScriptUtils.isNotNullOrUndefined);
  };

  getSubclassData = (): Array<ClassDefinitionContract> => {
    const { subclassData } = this.state;
    const { charClass } = this.props;

    let data: Array<ClassDefinitionContract> = [...subclassData];

    let existingSubclass = ClassUtils.getSubclass(charClass);
    if (
      existingSubclass !== null &&
      !data.some(
        (classDefinition) =>
          existingSubclass !== null &&
          classDefinition.id === existingSubclass.id
      )
    ) {
      data.push(existingSubclass);
    }

    return data;
  };

  getClassFeatureDescription = (): string => {
    const { feature, isStartingClass } = this.props;

    const multiClassDescription =
      ClassFeatureUtils.getMultiClassDescription(feature);
    if (
      !isStartingClass &&
      multiClassDescription &&
      multiClassDescription.length > 0
    ) {
      return multiClassDescription;
    }

    const description = ClassFeatureUtils.getDescription(feature);
    return description === null ? "" : description;
  };

  renderHeader = (): React.ReactNode => {
    const { feature, optionalClassFeatureLookup, definitionPool } = this.props;

    const choiceCount = this.getTotalChoiceCount();
    let metaItems: Array<string> = [];
    if (choiceCount) {
      metaItems.push(`${choiceCount} Choice${choiceCount !== 1 ? "s" : ""}`);
    }
    metaItems.push(
      `${FormatUtils.ordinalize(
        ClassFeatureUtils.getRequiredLevel(feature)
      )} level`
    );

    const featureType = ClassFeatureUtils.getFeatureType(feature);
    if (featureType !== Constants.FeatureTypeEnum.GRANTED) {
      metaItems.push("Optional Class Feature");
    }
    if (featureType === Constants.FeatureTypeEnum.REPLACEMENT) {
      const optionalFeature = HelperUtils.lookupDataOrFallback(
        optionalClassFeatureLookup,
        ClassFeatureUtils.getDefinitionKey(feature)
      );

      if (optionalFeature) {
        const affectedDefinitionKey =
          OptionalClassFeatureUtils.getAffectedClassFeatureDefinitionKey(
            optionalFeature
          );
        if (affectedDefinitionKey) {
          const replacedFeature = ClassFeatureUtils.simulateClassFeature(
            affectedDefinitionKey,
            definitionPool
          );

          if (replacedFeature) {
            metaItems.push(
              `Replaces ${ClassFeatureUtils.getName(replacedFeature)}`
            );
          }
        }
      }
    }

    return (
      <CollapsibleHeader
        metaItems={metaItems}
        heading={ClassFeatureUtils.getName(feature)}
      />
    );
  };

  renderChoices = (): React.ReactNode => {
    const { isActive, feature, charClass } = this.props;
    const { featData } = this.state;

    if (!isActive) {
      return null;
    }

    const choices = ClassFeatureUtils.getChoices(feature);

    if (choices === null) {
      return null;
    }

    return choices.map((choice) => (
      <FeatureChoice
        choice={choice}
        charClass={charClass}
        feature={feature}
        featsData={featData}
        subclassData={this.getSubclassData()}
        onChoiceChange={this.handleChoiceChange}
        key={ChoiceUtils.getId(choice)}
      />
    ));
  };

  render() {
    const {
      isActive,
      charClass,
      definitionPool,
      ruleData,
      globalModifiers,
      typeValueLookup,
      loadAvailableInfusions,
      loadAvailableEquipment,
      onInfusionChoiceItemChangePromise,
      onInfusionChoiceItemDestroyPromise,
      onInfusionChoiceCreatePromise,
      onInfusionChoiceDestroyPromise,
      onInfusionChoiceChangePromise,
      onDefinitionsLoaded,
      knownReplicatedItems,
      knownInfusionLookup,
      feature,
    } = this.props;
    const { hasSubclassChoice, hasFeatChoice } = this.state;

    // If the class feature grants feats, render those instead of the class feature.
    if (feature.featLists.length > 0) {
      return feature.featLists.map((fl) => (
        <GrantedFeat
          featList={fl}
          key={fl.definition.id}
          requiredLevel={ClassFeatureUtils.getRequiredLevel(feature)}
        />
      ));
    }

    const conClsNames: Array<string> = ["class-manager-feature-name"];
    let contentNode: React.ReactNode;

    if (isActive) {
      if (this.getTotalTodoCount() > 0) {
        conClsNames.push("collapsible-todo");
      }

      if (hasFeatChoice || hasSubclassChoice) {
        if (this.isDataLoaded()) {
          contentNode = this.renderChoices();
        } else {
          contentNode = <LoadingPlaceholder />;
        }
      } else {
        contentNode = this.renderChoices();
      }
    }

    return (
      <Collapsible
        trigger={this.renderHeader()}
        clsNames={conClsNames}
        onOpened={this.handleCollapsibleOpened}
      >
        <CollapsibleContent className="class-manager-feature-description">
          {this.getClassFeatureDescription()}
        </CollapsibleContent>
        {isActive && hasSubclassChoice && (
          <div className="ct-character-tools__marketplace-callout">
            Looking for something not in the list below? Unlock all official
            options in the <Link href="/marketplace">Marketplace</Link>.
          </div>
        )}
        {contentNode}
        {isActive && (
          <InfusionChoiceManager
            infusionChoices={this.getAvailableInfusionChoices()}
            contextLevel={ClassUtils.getLevel(charClass)}
            definitionPool={definitionPool}
            ruleData={ruleData}
            globalModifiers={globalModifiers}
            typeValueLookup={typeValueLookup}
            knownInfusionLookup={knownInfusionLookup}
            knownReplicatedItems={knownReplicatedItems}
            loadAvailableInfusions={loadAvailableInfusions}
            loadAvailableEquipment={loadAvailableEquipment}
            onInfusionChoiceItemChangePromise={
              onInfusionChoiceItemChangePromise
            }
            onInfusionChoiceItemDestroyPromise={
              onInfusionChoiceItemDestroyPromise
            }
            onInfusionChoiceChangePromise={onInfusionChoiceChangePromise}
            onInfusionChoiceDestroyPromise={onInfusionChoiceDestroyPromise}
            onInfusionChoiceCreatePromise={onInfusionChoiceCreatePromise}
            onDefinitionsLoaded={onDefinitionsLoaded}
          />
        )}
      </Collapsible>
    );
  }
}
