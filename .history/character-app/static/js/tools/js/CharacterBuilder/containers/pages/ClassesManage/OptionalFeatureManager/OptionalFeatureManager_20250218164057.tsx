import axios, { Canceler } from "axios";
import React from "react";

import {
  MarketplaceCta,
  LoadingPlaceholder,
} from "@dndbeyond/character-components/es";
import {
  ApiAdapterUtils,
  CharClass,
  ClassFeature,
  ClassFeatureUtils,
  Constants,
  DefinitionPool,
  DefinitionPoolUtils,
  DefinitionUtils,
  OptionalClassFeature,
  OptionalClassFeatureLookup,
  OptionalClassFeatureUtils,
  ClassUtils,
  HelperUtils,
  RuleData,
} from "../../rules-engine/es";

import { Link } from "~/components/Link";

import DataLoadingStatusEnum from "../../../../../Shared/constants/DataLoadingStatusEnum";
import {
  ApiClassFeatureResponseData,
  ApiClassFeaturesRequest,
} from "../../../../../Shared/selectors/composite/apiCreator";
import { AppLoggerUtils, TypeScriptUtils } from "../../../../../Shared/utils";
import { OptionalFeature } from "../../../../components/OptionalFeature";
import { AffectedFeatureInfo } from "../../../../components/OptionalFeature/OptionalFeature";
import { PageSubHeader } from "../../../../components/PageSubHeader";

interface OptionalFeatureManagerProps {
  charClass: CharClass;
  definitionPool: DefinitionPool;
  optionalClassFeatureLookup: OptionalClassFeatureLookup;
  loadAvailableOptionalClassFeatures?: ApiClassFeaturesRequest | null;
  onDefinitionsLoaded?: (definitionData: ApiClassFeatureResponseData) => void;
  onSelection: (
    definitionKey: string,
    affectedClassFeatureDefinitionKey: string | null
  ) => void;
  onChangeReplacementPromise?: (
    definitionKey: string,
    newAffectedDefinitionKey: string | null,
    oldAffectedDefinitionKey: string | null,
    accept: () => void,
    reject: () => void
  ) => void;
  onRemoveSelectionPromise?: (
    definitionKey: string,
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
  ruleData: RuleData;
}
interface OptionalFeatureManagerState {
  loadingStatus: DataLoadingStatusEnum;
}
export class OptionalFeatureManager extends React.PureComponent<
  OptionalFeatureManagerProps,
  OptionalFeatureManagerState
> {
  loadOptionalOriginsCanceler: null | Canceler = null;

  constructor(props: OptionalFeatureManagerProps) {
    super(props);

    this.state = {
      loadingStatus: DataLoadingStatusEnum.NOT_LOADED,
    };
  }

  componentDidMount() {
    const { loadAvailableOptionalClassFeatures, onDefinitionsLoaded } =
      this.props;

    const { loadingStatus } = this.state;

    if (
      loadAvailableOptionalClassFeatures &&
      loadingStatus === DataLoadingStatusEnum.NOT_LOADED
    ) {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADING,
      });

      loadAvailableOptionalClassFeatures({
        cancelToken: new axios.CancelToken((c) => {
          this.loadOptionalOriginsCanceler = c;
        }),
      })
        .then((response) => {
          let data = ApiAdapterUtils.getResponseData(response);
          if (data?.definitionData.length && onDefinitionsLoaded) {
            onDefinitionsLoaded(data);
          }

          this.setState({
            loadingStatus: DataLoadingStatusEnum.LOADED,
          });
          this.loadOptionalOriginsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    } else {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADED,
      });
    }
  }

  componentWillUnmount(): void {
    if (this.loadOptionalOriginsCanceler !== null) {
      this.loadOptionalOriginsCanceler();
    }
  }

  getAffectedFeatureInfos = (
    optionalClassFeature: ClassFeature
  ): Array<AffectedFeatureInfo> => {
    const { definitionPool, charClass } = this.props;

    return ClassFeatureUtils.getAffectedFeatureDefinitionKeys(
      optionalClassFeature
    )
      .map((definitionKey: string) =>
        ClassFeatureUtils.simulateClassFeature(definitionKey, definitionPool)
      )
      .filter(TypeScriptUtils.isNotNullOrUndefined)
      .map((affectedClassFeature: ClassFeature) => {
        const definitionKey =
          ClassFeatureUtils.getDefinitionKey(affectedClassFeature);
        let disabled = ClassUtils.getOptionalClassFeatures(charClass).some(
          (optionalFeatureMapping: OptionalClassFeature) =>
            OptionalClassFeatureUtils.getDefinitionKey(
              optionalFeatureMapping
            ) !== ClassFeatureUtils.getDefinitionKey(optionalClassFeature) &&
            OptionalClassFeatureUtils.getAffectedClassFeatureDefinitionKey(
              optionalFeatureMapping
            ) === definitionKey
        );

        return {
          name: ClassFeatureUtils.getName(affectedClassFeature),
          definitionKey,
          disabled,
        };
      });
  };

  renderOptionalFeatureCta = (): React.ReactNode => {
    return (
      <div className="ct-optional-feature-manager__content">
        <div className="ct-optional-feature-manager__content--empty">
          <span>
            You currently have no available optional class features for this
            class
          </span>
          <div className="ct-character-tools__marketplace-callout">
            Unlock all official options in the{" "}
            <Link href="/marketplace">Marketplace</Link> or create them for{" "}
            <Link href="/my-creations">Homebrew</Link> Subclasses.
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { loadingStatus } = this.state;
    const {
      definitionPool,
      charClass,
      optionalClassFeatureLookup,
      onChangeReplacementPromise,
      onRemoveSelectionPromise,
      onSelection,
    } = this.props;

    let contentNode: React.ReactNode;
    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      contentNode = <LoadingPlaceholder />;
    } else {
      let availableOptionalFeatures: Array<ClassFeature> =
        DefinitionPoolUtils.getTypedDefinitionList(
          Constants.DefinitionTypeEnum.CLASS_FEATURE,
          definitionPool
        )
          .map((featureDefinition) =>
            ClassFeatureUtils.simulateClassFeature(
              DefinitionUtils.getDefinitionKey(featureDefinition),
              definitionPool
            )
          )
          .filter(TypeScriptUtils.isNotNullOrUndefined)
          .filter((classFeature) =>
            ClassFeatureUtils.isValidClassClassFeature(charClass, classFeature)
          )
          .filter(
            (classFeature) =>
              ClassFeatureUtils.getFeatureType(classFeature) !==
              Constants.FeatureTypeEnum.GRANTED
          );

      let availableOptionalClassFeatureLookup =
        HelperUtils.generateNonNullLookup(
          availableOptionalFeatures,
          ClassFeatureUtils.getDefinitionKey
        );

      const unEntitledOptionalClassFeatures: Array<ClassFeature> = [];
      Object.keys(optionalClassFeatureLookup).forEach((definitionKey) => {
        if (
          !availableOptionalClassFeatureLookup.hasOwnProperty(definitionKey)
        ) {
          const classFeature = ClassFeatureUtils.simulateClassFeature(
            definitionKey,
            definitionPool
          );
          if (
            classFeature &&
            ClassFeatureUtils.isValidClassClassFeature(charClass, classFeature)
          ) {
            unEntitledOptionalClassFeatures.push(classFeature);
          }
        }
      });

      const consolidatedOptionalOrigins = [
        ...availableOptionalFeatures,
        ...unEntitledOptionalClassFeatures,
      ].filter(
        (feature) =>
          !ClassFeatureUtils.getHideInContext(
            feature,
            Constants.AppContextTypeEnum.BUILDER
          )
      );

      if (!consolidatedOptionalOrigins.length) {
        contentNode = this.renderOptionalFeatureCta();
      } else {
        const replacementFeatures: Array<ClassFeature> = [];
        const additionalFeatures: Array<ClassFeature> = [];
        consolidatedOptionalOrigins.forEach((feature) => {
          switch (ClassFeatureUtils.getFeatureType(feature)) {
            case Constants.FeatureTypeEnum.ADDITIONAL:
              additionalFeatures.push(feature);
              break;
            case Constants.FeatureTypeEnum.REPLACEMENT:
              replacementFeatures.push(feature);
              break;
            default:
            //not implemented
          }
        });

        contentNode = (
          <div className="ct-optional-feature-manager__content">
            {replacementFeatures.length > 0 && (
              <React.Fragment>
                <PageSubHeader>Replacement Features</PageSubHeader>
                {ClassUtils.deriveOrderedClassFeatures(replacementFeatures).map(
                  (feature) => {
                    const optionalFeatureMapping =
                      HelperUtils.lookupDataOrFallback(
                        optionalClassFeatureLookup,
                        ClassFeatureUtils.getDefinitionKey(feature)
                      );
                    const affectedFeatureDefinitionKey: string | null =
                      optionalFeatureMapping
                        ? OptionalClassFeatureUtils.getAffectedClassFeatureDefinitionKey(
                            optionalFeatureMapping
                          )
                        : null;

                    return (
                      <OptionalFeature
                        key={ClassFeatureUtils.getDefinitionKey(feature)}
                        name={ClassFeatureUtils.getName(feature)}
                        description={ClassFeatureUtils.getDescription(feature)}
                        requiredLevel={ClassFeatureUtils.getRequiredLevel(
                          feature
                        )}
                        featureType={ClassFeatureUtils.getFeatureType(feature)}
                        definitionKey={ClassFeatureUtils.getDefinitionKey(
                          feature
                        )}
                        affectedFeatureDefinitionKey={
                          affectedFeatureDefinitionKey
                        }
                        isSelected={!!optionalFeatureMapping ?? false}
                        onSelection={onSelection}
                        onChangeReplacementPromise={onChangeReplacementPromise}
                        onRemoveSelectionPromise={onRemoveSelectionPromise}
                        affectedFeatures={this.getAffectedFeatureInfos(feature)}
                        accessType={ClassFeatureUtils.getAccessType(feature)}
                      />
                    );
                  }
                )}
              </React.Fragment>
            )}
            {additionalFeatures.length > 0 && (
              <React.Fragment>
                <PageSubHeader>Additional Features</PageSubHeader>
                {ClassUtils.deriveOrderedClassFeatures(additionalFeatures).map(
                  (feature) => {
                    const optionalFeatureMapping =
                      HelperUtils.lookupDataOrFallback(
                        optionalClassFeatureLookup,
                        ClassFeatureUtils.getDefinitionKey(feature)
                      );
                    const affectedFeatureDefinitionKey: string | null =
                      optionalFeatureMapping
                        ? OptionalClassFeatureUtils.getAffectedClassFeatureDefinitionKey(
                            optionalFeatureMapping
                          )
                        : null;

                    return (
                      <OptionalFeature
                        key={ClassFeatureUtils.getDefinitionKey(feature)}
                        name={ClassFeatureUtils.getName(feature)}
                        description={ClassFeatureUtils.getDescription(feature)}
                        requiredLevel={ClassFeatureUtils.getRequiredLevel(
                          feature
                        )}
                        featureType={ClassFeatureUtils.getFeatureType(feature)}
                        definitionKey={ClassFeatureUtils.getDefinitionKey(
                          feature
                        )}
                        affectedFeatureDefinitionKey={
                          affectedFeatureDefinitionKey
                        }
                        isSelected={!!optionalFeatureMapping ?? false}
                        onSelection={onSelection}
                        onChangeReplacementPromise={onChangeReplacementPromise}
                        onRemoveSelectionPromise={onRemoveSelectionPromise}
                        affectedFeatures={this.getAffectedFeatureInfos(feature)}
                        accessType={ClassFeatureUtils.getAccessType(feature)}
                      />
                    );
                  }
                )}
              </React.Fragment>
            )}
          </div>
        );
      }
    }

    return (
      <div className="ct-optional-feature-manager">
        <div className="ct-optional-feature-manager__intro">
          Unlike the features in the Player’s Handbook, you don’t gain the
          features here automatically. Consulting with your DM, you decide
          whether to gain a feature in this section if you meet the level
          requirement noted in the feature’s description. These features can be
          selected separately from one another; you can use some, all, or none
          of them.
        </div>
        {contentNode}
      </div>
    );
  }
}

export default OptionalFeatureManager;
