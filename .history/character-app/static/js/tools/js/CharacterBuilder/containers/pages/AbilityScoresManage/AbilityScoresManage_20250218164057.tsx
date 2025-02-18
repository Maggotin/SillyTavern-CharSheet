import React from "react";
import { DispatchProp } from "react-redux";

import {
  Collapsible,
  CollapsibleHeaderContent,
  CollapsibleHeading,
  LightDiceSvg,
} from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  characterActions,
  CharacterConfiguration,
  CharacterPreferences,
  CharClass,
  ChoiceData,
  ClassUtils,
  Constants,
  DefinitionPool,
  DefinitionUtils,
  FeatDefinitionContract,
  FeatLookup,
  OptionalOriginLookup,
  PrerequisiteData,
  Race,
  RaceUtils,
  RacialTraitUtils,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  serviceDataSelectors,
} from "../../rules-engine/es";
import { Dice } from "@dndbeyond/dice";

import { AbilityScoreManager } from "~/components/AbilityScoreManager";
import { HelperTextAccordion } from "~/components/HelperTextAccordion";
import { useAbilities } from "~/hooks/useAbilities";
import { RouteKey } from "~/subApps/builder/constants";

import { appEnvActions } from "../../../../Shared/actions/appEnv";
import {
  apiCreatorSelectors,
  appEnvSelectors,
} from "../../../../Shared/selectors";
import AbilityScoreManagerManual from "../../../components/AbilityScoreManagerManual";
import AbilityScoreManagerPointBuy from "../../../components/AbilityScoreManagerPointBuy";
import AbilityScoreManagerStandardArray from "../../../components/AbilityScoreManagerStandardArray";
import { Button } from "../../../components/Button";
import { Page } from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import { PageHeader } from "../../../components/PageHeader";
import SpeciesTraitList from "../../../components/SpeciesTraitList";
import { AbilityScoreDiceManager } from "../../AbilityScoreDiceManager";
import AbilityScoreTypeChooser from "../../AbilityScoreTypeChooser";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

interface Props extends DispatchProp {
  abilities: AbilityManager[];
  configuration: CharacterConfiguration;
  diceEnabled: boolean;
  species: Race;
  featLookup: FeatLookup;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<FeatDefinitionContract[]>>;
  choiceInfo: ChoiceData;
  prerequisiteData: PrerequisiteData;
  preferences: CharacterPreferences;
  optionalOriginLookup: OptionalOriginLookup;
  definitionPool: DefinitionPool;
  charClasses: CharClass[];
  ruleData: RuleData;
}
class AbilityScoresManage extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleDiceEnable = (): void => {
    const { dispatch, diceEnabled } = this.props;

    if (diceEnabled) {
      return;
    }

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

  renderAbilityScoreManager = (): React.ReactNode => {
    const { abilities, configuration } = this.props;

    switch (configuration.abilityScoreType) {
      case Constants.AbilityScoreTypeEnum.MANUAL:
        return <AbilityScoreManagerManual abilities={abilities} />;

      case Constants.AbilityScoreTypeEnum.STANDARD_ARRAY:
        return <AbilityScoreManagerStandardArray abilities={abilities} />;

      case Constants.AbilityScoreTypeEnum.POINT_BUY:
        return <AbilityScoreManagerPointBuy abilities={abilities} />;

      default:
      // not implemented
    }

    return null;
  };

  renderAbilityDice = (): React.ReactNode => {
    const { diceEnabled } = this.props;

    if (!diceEnabled) {
      return (
        <div className="ability-score-dice-control">
          <span className="ability-score-dice-control-text">
            Enable digital dice to assist with rolling your ability scores:
          </span>
          <Button size="medium" onClick={this.handleDiceEnable}>
            <LightDiceSvg />
            <span className="ability-score-dice-control-button-text">
              Use Dice
            </span>
          </Button>
        </div>
      );
    }

    let headingNode: React.ReactNode = (
      <CollapsibleHeading>Dice Roll Groups</CollapsibleHeading>
    );

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={headingNode} />
    );

    return (
      <Collapsible
        header={headerNode}
        className="ability-score-dice"
        initiallyCollapsed={false}
      >
        <AbilityScoreDiceManager />
      </Collapsible>
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

  renderSpeciesTraits() {
    const {
      species,
      featLookup,
      loadAvailableFeats,
      choiceInfo,
      prerequisiteData,
      preferences,
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
        [Constants.DisplayConfigurationTypeEnum.ABILITY_SCORE]
      );

    return (
      filteredSpeciesTraits.length > 0 && (
        <SpeciesTraitList
          speciesTraits={filteredSpeciesTraits}
          featLookup={featLookup}
          loadAvailableFeats={loadAvailableFeats}
          handleSpeciesTraitChoiceChange={this.handleSpeciesTraitChoiceChange}
          choiceInfo={choiceInfo}
          prerequisiteData={prerequisiteData}
          preferences={preferences}
          optionalOriginLookup={optionalOriginLookup}
          definitionPool={definitionPool}
          speciesName={RaceUtils.getFullName(species)}
        />
      )
    );
  }

  renderInformationCollapsible = (): React.ReactNode => {
    const { ruleData, charClasses, species } = this.props;
    if (charClasses.length === 0 || species === null) {
      return null;
    }

    let definitionKeys: string[] = [];
    if (species) {
      definitionKeys.push(
        DefinitionUtils.hack__generateDefinitionKey(
          RaceUtils.getEntityRaceTypeId(species),
          RaceUtils.getEntityRaceId(species)
        )
      );
    }

    if (charClasses.length > 0) {
      definitionKeys = definitionKeys.concat(
        charClasses.map((charClass) =>
          DefinitionUtils.hack__generateDefinitionKey(
            ClassUtils.getMappingEntityTypeId(charClass),
            ClassUtils.getId(charClass)
          )
        )
      );
    }

    const builderText = RuleDataUtils.getBuilderHelperTextByDefinitionKeys(
      definitionKeys,
      ruleData,
      Constants.DisplayConfigurationTypeEnum.ABILITY_SCORE
    );

    return <HelperTextAccordion builderHelperText={builderText} />;
  };

  render() {
    const { configuration, abilities } = this.props;

    return (
      <Page>
        <PageBody>
          <PageHeader>Ability Scores</PageHeader>
          <AbilityScoreTypeChooser initialOptionRemoved={false} />
          {this.renderInformationCollapsible()}
          {this.renderAbilityScoreManager()}
          {configuration.abilityScoreType ===
            Constants.AbilityScoreTypeEnum.MANUAL && this.renderAbilityDice()}
          {this.renderSpeciesTraits()}
          <PageHeader>Score Calculations</PageHeader>
          <p>
            Calculations, including the base scores you set above and any
            modifiers, are found below. You can also override any automatic
            calculations or modify them under each ability summary.
          </p>
          <div className="ability-score-calcs">
            {abilities.map((ability) => (
              <AbilityScoreManager
                ability={ability}
                showHeader={true}
                isReadonly={false}
                isBuilder={true}
              />
            ))}
          </div>
        </PageBody>
      </Page>
    );
  }
}

function AbilityScoresManageContainer(props) {
  const abilities = useAbilities();
  return <AbilityScoresManage {...props} abilities={abilities} />;
}

export default ConnectedBuilderPage(
  AbilityScoresManageContainer,
  RouteKey.ABILITY_SCORES_MANAGE,
  (state) => {
    return {
      configuration: rulesEngineSelectors.getCharacterConfiguration(state),
      diceEnabled: appEnvSelectors.getDiceEnabled(state),
      species: rulesEngineSelectors.getRace(state),
      featLookup: rulesEngineSelectors.getFeatLookup(state),
      loadAvailableFeats: apiCreatorSelectors.makeLoadAvailableFeats(state),
      choiceInfo: rulesEngineSelectors.getChoiceInfo(state),
      prerequisiteData: rulesEngineSelectors.getPrerequisiteData(state),
      preferences: rulesEngineSelectors.getCharacterPreferences(state),
      optionalOriginLookup: rulesEngineSelectors.getOptionalOriginLookup(state),
      definitionPool: serviceDataSelectors.getDefinitionPool(state),
      charClasses: rulesEngineSelectors.getClasses(state),
      ruleData: rulesEngineSelectors.getRuleData(state),
    };
  }
);
