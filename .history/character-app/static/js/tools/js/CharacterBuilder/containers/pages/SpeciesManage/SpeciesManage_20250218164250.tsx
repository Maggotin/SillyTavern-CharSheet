import React from "react";
import { DispatchProp } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";

import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  characterActions,
  CharacterPreferences,
  ChoiceData,
  ClassSpellListSpellsLookup,
  Constants,
  DefinitionPool,
  DefinitionUtils,
  EntitledEntity,
  FeatDefinitionContract,
  FeatLookup,
  HelperUtils,
  OptionalOriginLookup,
  OptionalOriginUtils,
  PrerequisiteData,
  Race,
  RaceUtils,
  RacialTraitDefinitionContract,
  RacialTraitUtils,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  serviceDataActions,
  serviceDataSelectors,
} from "../../character-rules-engine/es";

import { HelperTextAccordion } from "~/components/HelperTextAccordion";
import { HtmlContent } from "~/components/HtmlContent";
import { SummaryList } from "~/components/SummaryList";
import { TabList } from "~/components/TabList";
import { RouteKey } from "~/subApps/builder/constants";

import { confirmModalActions } from "../../../../Shared/actions/confirmModal";
import { SimpleClassSpellList } from "../../../../Shared/components/SimpleClassSpellList";
import { apiCreatorSelectors } from "../../../../Shared/selectors";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import SpeciesTraitList from "../../../components/SpeciesTraitList";
import { navigationConfig } from "../../../config";
import ConnectedBuilderPage from "../ConnectedBuilderPage";
import { OptionalOriginManager } from "./OptionalOriginManager";
import styles from "./styles.module.css";

interface Props extends DispatchProp {
  ruleData: RuleData;
  preferences: CharacterPreferences;
  prerequisiteData: PrerequisiteData;
  choiceInfo: ChoiceData;
  species: Race | null;
  featLookup: FeatLookup;
  definitionPool: DefinitionPool;
  optionalOriginLookup: OptionalOriginLookup;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  navigate: NavigateFunction;
  characterId: number;
  loadAvailableOptionalSpeciesTraits: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<
    ApiResponse<EntitledEntity<RacialTraitDefinitionContract>>
  >;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<FeatDefinitionContract[]>>;
}
class SpeciesManage extends React.PureComponent<Props> {
  handleChangeSpecies = (): void => {
    const { navigate, characterId } = this.props;
    navigate(
      navigationConfig
        .getRouteDefPath(RouteKey.RACE_CHOOSE)
        .replace(":characterId", characterId)
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

  handleDefinitionsLoaded = (
    entitledData: EntitledEntity<RacialTraitDefinitionContract>
  ): void => {
    const { dispatch } = this.props;

    dispatch(
      serviceDataActions.definitionPoolAdd(
        entitledData.definitionData,
        entitledData.accessTypes
      )
    );
  };

  handleOptionalOriginSelection = (
    definitionKey: string,
    affectedSpeciesTraitDefinitionKey: string | null
  ): void => {
    const { dispatch } = this.props;

    const speciesTraitId =
      DefinitionUtils.hack__getDefinitionKeyId(definitionKey);
    if (speciesTraitId === null) {
      return;
    }

    const affectedSpeciesTraitId = affectedSpeciesTraitDefinitionKey
      ? DefinitionUtils.hack__getDefinitionKeyId(
          affectedSpeciesTraitDefinitionKey
        )
      : null;

    dispatch(
      characterActions.optionalOriginCreate(
        speciesTraitId,
        affectedSpeciesTraitId
      )
    );
  };

  handleRemoveOptionalOriginSelectionPromise = (
    definitionKey: string,
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch, optionalOriginLookup, classSpellListSpellsLookup } =
      this.props;

    const optionalOrigin = HelperUtils.lookupDataOrFallback(
      optionalOriginLookup,
      definitionKey
    );
    if (optionalOrigin === null) {
      return;
    }

    const optionalSpeciesTrait =
      OptionalOriginUtils.getRacialTrait(optionalOrigin);
    if (optionalSpeciesTrait === null) {
      return;
    }

    const speciesTraitId = OptionalOriginUtils.getRacialTraitId(optionalOrigin);
    const spellListIds =
      OptionalOriginUtils.getRemoveMappingSpellListIds(optionalOrigin);
    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      dispatch(characterActions.optionalOriginDestroy(speciesTraitId));
      accept();
    } else {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove"],
          heading: "Customized Origin Warning",
          acceptBtnClsNames: ["character-button-remove"],
          content: (
            <div className="">
              <p>
                You are about to remove{" "}
                <strong>
                  {RacialTraitUtils.getName(optionalSpeciesTrait)}
                </strong>{" "}
                from your character.
              </p>
              <p>
                After doing so, the following spells provided by this feature
                will be removed from your character:
              </p>
              <SimpleClassSpellList
                spellListIds={spellListIds}
                classSpellListSpellsLookup={classSpellListSpellsLookup}
              />
            </div>
          ),
          onConfirm: () => {
            dispatch(characterActions.optionalOriginDestroy(speciesTraitId));
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleOnChangeOptionalOriginReplacementPromise = (
    definitionKey: string,
    newAffectedDefinitionKey: string | null,
    oldAffectedDefinitionKey: string | null,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch, optionalOriginLookup, classSpellListSpellsLookup } =
      this.props;

    if (newAffectedDefinitionKey === oldAffectedDefinitionKey) {
      return;
    }

    const optionalOrigin = HelperUtils.lookupDataOrFallback(
      optionalOriginLookup,
      definitionKey
    );
    if (optionalOrigin === null) {
      return;
    }

    const optionalSpeciesTrait =
      OptionalOriginUtils.getRacialTrait(optionalOrigin);
    if (optionalSpeciesTrait === null) {
      return;
    }

    const speciesTraitId = OptionalOriginUtils.getRacialTraitId(optionalOrigin);
    const newAffectedSpeciesTraitId: number | null = newAffectedDefinitionKey
      ? DefinitionUtils.hack__getDefinitionKeyId(newAffectedDefinitionKey)
      : null;

    const spellListIds =
      OptionalOriginUtils.getUpdateMappingSpellListIdsToRemove(optionalOrigin, {
        affectedRacialTraitId: newAffectedSpeciesTraitId,
      });
    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      dispatch(
        characterActions.optionalOriginSetRequest(
          speciesTraitId,
          newAffectedSpeciesTraitId
        )
      );
      accept();
    } else {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Customized Origin Warning",
          content: (
            <div className="">
              <p>
                You are about to change the Species Trait to be replaced by{" "}
                <strong>
                  {RacialTraitUtils.getName(optionalSpeciesTrait)}
                </strong>
              </p>
              <p>
                After doing so, the following spells provided by this feature
                will be removed from your character:
              </p>
              <SimpleClassSpellList
                spellListIds={spellListIds}
                classSpellListSpellsLookup={classSpellListSpellsLookup}
              />
            </div>
          ),
          onConfirm: () => {
            dispatch(
              characterActions.optionalOriginSetRequest(
                speciesTraitId,
                newAffectedSpeciesTraitId
              )
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

  renderSpeciesTraitsGroup = (): React.ReactNode => {
    const {
      species,
      loadAvailableFeats,
      choiceInfo,
      prerequisiteData,
      preferences,
      featLookup,
      optionalOriginLookup,
      definitionPool,
    } = this.props;

    if (!species) {
      return null;
    }

    const speciesTraits = RaceUtils.getVisibleRacialTraits(species);
    const filteredSpeciesTraits =
      RacialTraitUtils.filterRacialTraitsByDisplayConfigurationType(
        speciesTraits,
        [
          Constants.DisplayConfigurationTypeEnum.RACIAL_TRAIT,
          Constants.DisplayConfigurationTypeEnum.LANGUAGE,
        ]
      );

    return (
      <div className="race-detail-secondary">
        {filteredSpeciesTraits.length > 0 && (
          <div className="race-detail-racial-traits">
            <SpeciesTraitList
              speciesTraits={filteredSpeciesTraits}
              featLookup={featLookup}
              loadAvailableFeats={loadAvailableFeats}
              handleSpeciesTraitChoiceChange={
                this.handleSpeciesTraitChoiceChange
              }
              choiceInfo={choiceInfo}
              prerequisiteData={prerequisiteData}
              preferences={preferences}
              optionalOriginLookup={optionalOriginLookup}
              definitionPool={definitionPool}
            />
          </div>
        )}
      </div>
    );
  };

  renderSpeciesTraitsContent = () => {
    const { preferences } = this.props;

    if (preferences.enableOptionalOrigins) {
      return this.renderTabList();
    }

    return this.renderSpeciesTraitsGroup();
  };

  renderTabList = () => {
    const {
      species,
      optionalOriginLookup,
      loadAvailableOptionalSpeciesTraits,
      definitionPool,
      ruleData,
    } = this.props;

    if (!species) {
      return null;
    }

    return (
      <TabList
        className="manage-race-tabs"
        variant="collapse"
        tabs={[
          {
            label: "Species Traits",
            content: this.renderSpeciesTraitsGroup(),
            id: "traits",
          },
          {
            label: "Origin Manager",
            content: (
              <OptionalOriginManager
                species={species}
                definitionPool={definitionPool}
                optionalOriginLookup={optionalOriginLookup}
                onDefinitionsLoaded={this.handleDefinitionsLoaded}
                loadAvailableOptionalSpeciesTraits={
                  loadAvailableOptionalSpeciesTraits
                }
                onSelection={this.handleOptionalOriginSelection}
                onChangeReplacementPromise={
                  this.handleOnChangeOptionalOriginReplacementPromise
                }
                onRemoveSelectionPromise={
                  this.handleRemoveOptionalOriginSelectionPromise
                }
                ruleData={ruleData}
              />
            ),
            id: "Origin Manager",
          },
        ]}
      />
    );
  };

  renderInformationCollapsible = (): React.ReactNode => {
    const { ruleData, species } = this.props;
    if (species === null) {
      return null;
    }

    const definitionKey = DefinitionUtils.hack__generateDefinitionKey(
      RaceUtils.getEntityRaceTypeId(species),
      RaceUtils.getEntityRaceId(species)
    );
    const builderText = RuleDataUtils.getBuilderHelperTextByDefinitionKeys(
      [definitionKey],
      ruleData,
      Constants.DisplayConfigurationTypeEnum.RACIAL_TRAIT
    );

    return <HelperTextAccordion builderHelperText={builderText} />;
  };

  render() {
    const { species, ruleData } = this.props;

    //TODO render something else if species doesnt exist
    if (!species) {
      return null;
    }

    const fullName = RaceUtils.getFullName(species);
    const portraitAvatarUrl = RaceUtils.getPortraitAvatarUrl(species);
    const description = RaceUtils.getDescription(species);
    const moreDetailsUrl = RaceUtils.getMoreDetailsUrl(species);
    const previewUrl: string | null =
      portraitAvatarUrl ?? RuleDataUtils.getDefaultRaceImageUrl(ruleData);

    const descriptionClassNames: string[] = ["race-detail-description"];

    const calledOutSpeciesTraits = RaceUtils.getCalledOutRacialTraits(species);
    if (calledOutSpeciesTraits.length > 0) {
      descriptionClassNames.push("race-detail-description--hide-traits");
    }

    return (
      <Page>
        <PageBody>
          <div className="manage-race race-detail">
            <div className="race-detail-primary">
              <div className="race-detail-aside">
                <div className="race-detail-preview">
                  <img
                    className="race-detail-preview-img"
                    src={previewUrl ? previewUrl : ""}
                    alt=""
                  />
                </div>
                <div
                  className="manage-race-chosen-action"
                  onClick={this.handleChangeSpecies}
                >
                  Change Species
                </div>
              </div>
              <PageHeader>{fullName}</PageHeader>
              <HtmlContent
                className={descriptionClassNames.join(" ")}
                html={description ? description : ""}
                withoutTooltips
              />
              {calledOutSpeciesTraits.length > 0 && (
                <SummaryList
                  list={calledOutSpeciesTraits}
                  title="Species Traits"
                  className={styles.summaryList}
                />
              )}
              <div className="race-detail-more">
                <a
                  className="race-detail-more-link"
                  href={moreDetailsUrl ? moreDetailsUrl : ""}
                >
                  {fullName} Details Page
                </a>
              </div>
              {this.renderInformationCollapsible()}
            </div>
            {this.renderSpeciesTraitsContent()}
          </div>
        </PageBody>
      </Page>
    );
  }
}

const SpeciesManageWithHooks = (props) => {
  const navigate = useNavigate();
  return <SpeciesManage {...props} navigate={navigate} />;
};

export default ConnectedBuilderPage(
  SpeciesManageWithHooks,
  RouteKey.RACE_MANAGE,
  (state) => {
    return {
      characterId: rulesEngineSelectors.getId(state),
      species: rulesEngineSelectors.getRace(state),
      choiceInfo: rulesEngineSelectors.getChoiceInfo(state),
      ruleData: rulesEngineSelectors.getRuleData(state),
      prerequisiteData: rulesEngineSelectors.getPrerequisiteData(state),
      preferences: rulesEngineSelectors.getCharacterPreferences(state),
      featLookup: rulesEngineSelectors.getFeatLookup(state),
      definitionPool: serviceDataSelectors.getDefinitionPool(state),
      loadAvailableOptionalSpeciesTraits:
        apiCreatorSelectors.makeLoadAvailableOptionalRacialTraits(state),
      loadAvailableFeats: apiCreatorSelectors.makeLoadAvailableFeats(state),
      optionalOriginLookup: rulesEngineSelectors.getOptionalOriginLookup(state),
      classSpellListSpellsLookup:
        rulesEngineSelectors.getClassSpellListSpellsLookup(state),
    };
  }
);
