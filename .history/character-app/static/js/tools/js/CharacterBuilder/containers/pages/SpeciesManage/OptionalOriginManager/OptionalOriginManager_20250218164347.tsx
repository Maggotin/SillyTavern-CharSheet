import axios, { Canceler } from "axios";
import React from "react";

import { LoadingPlaceholder } from "../../character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  EntitledEntity,
  RacialTraitDefinitionContract,
  DefinitionPool,
  DefinitionPoolUtils,
  Constants,
  DefinitionUtils,
  RacialTrait,
  RacialTraitUtils,
  OptionalOrigin,
  Race,
  RaceUtils,
  OptionalOriginUtils,
  OptionalOriginLookup,
  HelperUtils,
  RuleData,
} from "../../character-rules-engine/es";

import { Link } from "~/components/Link";

import DataLoadingStatusEnum from "../../../../../Shared/constants/DataLoadingStatusEnum";
import { AppLoggerUtils, TypeScriptUtils } from "../../../../../Shared/utils";
import { OptionalFeature } from "../../../../components/OptionalFeature";
import { AffectedFeatureInfo } from "../../../../components/OptionalFeature/OptionalFeature";
import { PageSubHeader } from "../../../../components/PageSubHeader";

interface OptionalOriginManagerProps {
  species: Race;
  definitionPool: DefinitionPool;
  optionalOriginLookup: OptionalOriginLookup;
  loadAvailableOptionalSpeciesTraits?: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<
    ApiResponse<EntitledEntity<RacialTraitDefinitionContract>>
  >;
  onDefinitionsLoaded?: (
    definitionData: EntitledEntity<RacialTraitDefinitionContract>
  ) => void;
  onSelection: (
    definitionKey: string,
    affectedSpeciesTraitDefinitionKey: string | null
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
interface OptionalOriginManagerState {
  loadingStatus: DataLoadingStatusEnum;
}
export class OptionalOriginManager extends React.PureComponent<
  OptionalOriginManagerProps,
  OptionalOriginManagerState
> {
  loadOptionalOriginsCanceler: null | Canceler = null;

  constructor(props: OptionalOriginManagerProps) {
    super(props);

    this.state = {
      loadingStatus: DataLoadingStatusEnum.NOT_LOADED,
    };
  }

  componentDidMount() {
    const { loadAvailableOptionalSpeciesTraits, onDefinitionsLoaded } =
      this.props;

    const { loadingStatus } = this.state;

    if (
      loadAvailableOptionalSpeciesTraits &&
      loadingStatus === DataLoadingStatusEnum.NOT_LOADED
    ) {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADING,
      });

      loadAvailableOptionalSpeciesTraits({
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

  getAffectedFeatureInfos = (origin: RacialTrait): AffectedFeatureInfo[] => {
    const { definitionPool, species } = this.props;

    return RacialTraitUtils.getAffectedFeatureDefinitionKeys(origin)
      .map((definitionKey: string) =>
        RacialTraitUtils.simulateRacialTrait(definitionKey, definitionPool)
      )
      .filter(TypeScriptUtils.isNotNullOrUndefined)
      .map((affectedSpeciesTrait: RacialTrait) => {
        const definitionKey =
          RacialTraitUtils.getDefinitionKey(affectedSpeciesTrait);
        let disabled = RaceUtils.getOptionalOrigins(species).some(
          (originMapping: OptionalOrigin) =>
            OptionalOriginUtils.getDefinitionKey(originMapping) !==
              RacialTraitUtils.getDefinitionKey(origin) &&
            OptionalOriginUtils.getAffectedRacialTraitDefinitionKey(
              originMapping
            ) === definitionKey
        );

        return {
          name: RacialTraitUtils.getName(affectedSpeciesTrait),
          definitionKey,
          disabled,
        };
      });
  };

  renderOptionalOriginCta = (): React.ReactNode => {
    return (
      <div className="ct-optional-origin-manager__content">
        <div className="ct-optional-origin-manager__content--empty">
          <span>
            You currently have no available custom origins for this character
          </span>
          <div className="ct-character-tools__marketplace-callout">
            Unlock all official options in the{" "}
            <Link href="/marketplace">Marketplace</Link> or create them for{" "}
            <Link href="/my-creations">Homebrew</Link> Species.
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { loadingStatus } = this.state;
    const {
      definitionPool,
      species,
      optionalOriginLookup,
      onChangeReplacementPromise,
      onRemoveSelectionPromise,
      onSelection,
    } = this.props;

    let contentNode: React.ReactNode;
    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      contentNode = <LoadingPlaceholder />;
    } else {
      let availableOptionalOrigins: RacialTrait[] =
        DefinitionPoolUtils.getTypedDefinitionList(
          Constants.DefinitionTypeEnum.RACIAL_TRAIT,
          definitionPool
        )
          .map((speciesTraitDef) =>
            RacialTraitUtils.simulateRacialTrait(
              DefinitionUtils.getDefinitionKey(speciesTraitDef),
              definitionPool
            )
          )
          .filter(TypeScriptUtils.isNotNullOrUndefined)
          .filter((speciesTrait) =>
            RacialTraitUtils.isValidRaceRacialTrait(species, speciesTrait)
          )
          .filter(
            (speciesTrait) =>
              RacialTraitUtils.getFeatureType(speciesTrait) !==
              Constants.FeatureTypeEnum.GRANTED
          );

      let availableOptionalOriginLookup = HelperUtils.generateNonNullLookup(
        availableOptionalOrigins,
        RacialTraitUtils.getDefinitionKey
      );

      const unEntitledOptionalSpeciesTraits: RacialTrait[] = [];
      Object.keys(optionalOriginLookup).forEach((definitionKey) => {
        if (!availableOptionalOriginLookup.hasOwnProperty(definitionKey)) {
          const speciesTrait = RacialTraitUtils.simulateRacialTrait(
            definitionKey,
            definitionPool
          );
          if (
            speciesTrait &&
            RacialTraitUtils.isValidRaceRacialTrait(species, speciesTrait)
          ) {
            unEntitledOptionalSpeciesTraits.push(speciesTrait);
          }
        }
      });

      const consolidatedOptionalOrigins: RacialTrait[] = [
        ...availableOptionalOrigins,
        ...unEntitledOptionalSpeciesTraits,
      ].filter(
        (speciesTrait) =>
          !RacialTraitUtils.deriveHideInContext(
            speciesTrait,
            Constants.AppContextTypeEnum.BUILDER
          )
      );

      if (!consolidatedOptionalOrigins.length) {
        contentNode = this.renderOptionalOriginCta();
      } else {
        const replacementOrigins: RacialTrait[] = [];
        const additionalOrigins: RacialTrait[] = [];
        consolidatedOptionalOrigins.forEach((speciesTrait) => {
          switch (RacialTraitUtils.getFeatureType(speciesTrait)) {
            case Constants.FeatureTypeEnum.ADDITIONAL:
              additionalOrigins.push(speciesTrait);
              break;
            case Constants.FeatureTypeEnum.REPLACEMENT:
              replacementOrigins.push(speciesTrait);
              break;
            default:
            //not implemented
          }
        });

        contentNode = (
          <div className="ct-optional-origin-manager__content">
            {replacementOrigins.length > 0 && (
              <React.Fragment>
                <PageSubHeader>Replacement Traits</PageSubHeader>
                {RaceUtils.deriveOrderedRacialTraits(replacementOrigins).map(
                  (origin: RacialTrait) => {
                    const optionalOriginMapping =
                      HelperUtils.lookupDataOrFallback(
                        optionalOriginLookup,
                        RacialTraitUtils.getDefinitionKey(origin)
                      );
                    const affectedFeatureDefinitionKey = optionalOriginMapping
                      ? OptionalOriginUtils.getAffectedRacialTraitDefinitionKey(
                          optionalOriginMapping
                        )
                      : null;

                    return (
                      <OptionalFeature
                        key={RacialTraitUtils.getDefinitionKey(origin)}
                        name={`Origin ${RacialTraitUtils.getName(origin)}`}
                        description={RacialTraitUtils.getDescription(origin)}
                        featureType={RacialTraitUtils.getFeatureType(origin)}
                        definitionKey={RacialTraitUtils.getDefinitionKey(
                          origin
                        )}
                        affectedFeatureDefinitionKey={
                          affectedFeatureDefinitionKey
                        }
                        isSelected={!!optionalOriginMapping ?? false}
                        onSelection={onSelection}
                        onChangeReplacementPromise={onChangeReplacementPromise}
                        onRemoveSelectionPromise={onRemoveSelectionPromise}
                        affectedFeatures={this.getAffectedFeatureInfos(origin)}
                        accessType={RacialTraitUtils.getAccessType(origin)}
                      />
                    );
                  }
                )}
              </React.Fragment>
            )}
            {additionalOrigins.length > 0 && (
              <React.Fragment>
                <PageSubHeader>Additional Traits</PageSubHeader>
                {RaceUtils.deriveOrderedRacialTraits(additionalOrigins).map(
                  (origin: RacialTrait) => {
                    const optionalOriginMapping =
                      HelperUtils.lookupDataOrFallback(
                        optionalOriginLookup,
                        RacialTraitUtils.getDefinitionKey(origin)
                      );
                    const affectedFeatureDefinitionKey = optionalOriginMapping
                      ? OptionalOriginUtils.getAffectedRacialTraitDefinitionKey(
                          optionalOriginMapping
                        )
                      : null;

                    return (
                      <OptionalFeature
                        key={RacialTraitUtils.getDefinitionKey(origin)}
                        name={RacialTraitUtils.getName(origin)}
                        description={RacialTraitUtils.getDescription(origin)}
                        featureType={RacialTraitUtils.getFeatureType(origin)}
                        definitionKey={RacialTraitUtils.getDefinitionKey(
                          origin
                        )}
                        affectedFeatureDefinitionKey={
                          affectedFeatureDefinitionKey
                        }
                        isSelected={!!optionalOriginMapping ?? false}
                        onSelection={onSelection}
                        onChangeReplacementPromise={onChangeReplacementPromise}
                        onRemoveSelectionPromise={onRemoveSelectionPromise}
                        affectedFeatures={this.getAffectedFeatureInfos(origin)}
                        accessType={RacialTraitUtils.getAccessType(origin)}
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
      <div className="ct-optional-origin-manager">
        <div className="ct-optional-origin-manager__intro">
          The following options allow you to customize aspects of your character
          such as ability scores, languages, and certain proficiencies to fit
          the origin you have in mind.
        </div>
        {contentNode}
      </div>
    );
  }
}

export default OptionalOriginManager;
