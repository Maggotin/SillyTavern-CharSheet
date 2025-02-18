import React, { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  AbilityLookup,
  Action,
  ActionUtils,
  BaseFeat,
  characterActions,
  CharacterFeaturesManager,
  CharacterTheme,
  DataOriginRefData,
  FeatManager,
  Race,
  RaceUtils,
  RacialTrait,
  RacialTraitUtils,
  RuleData,
  rulesEngineSelectors,
  SnippetData,
  Spell,
  SpellUtils,
} from "../../character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  PaneComponentEnum,
  PaneIdentifiersRacialTrait,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { SpeciesTraitFeatureSnippet } from "../../../../CharacterSheet/components/FeatureSnippet";
import { CharacterFeaturesManagerContext } from "../../../managers/CharacterFeaturesManagerContext";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";

interface Props extends DispatchProp {
  species: Race | null;
  identifiers: PaneIdentifiersRacialTrait | null;
  feats: Array<BaseFeat>;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  characterFeaturesManager: CharacterFeaturesManager;
  paneContext: PaneInfo;
}
interface State {
  speciesTrait: RacialTrait | null;
}
class SpeciesTraitPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { species, identifiers } = this.props;

    if (
      species !== prevProps.species ||
      identifiers !== prevProps.identifiers
    ) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { species, identifiers } = props;

    let foundSpeciesTrait: RacialTrait | null | undefined = null;
    if (species !== null && identifiers !== null) {
      foundSpeciesTrait = RaceUtils.getVisibleRacialTraits(species).find(
        (speciesTrait) =>
          identifiers.id === RacialTraitUtils.getId(speciesTrait)
      );
    }

    return {
      speciesTrait: foundSpeciesTrait ? foundSpeciesTrait : null,
    };
  };

  handleActionUseSet = (action: Action, uses: number): void => {
    const { dispatch } = this.props;

    const id = ActionUtils.getId(action);
    const entityTypeId = ActionUtils.getEntityTypeId(action);
    if (id !== null && entityTypeId !== null) {
      dispatch(
        characterActions.actionUseSet(
          id,
          entityTypeId,
          uses,
          ActionUtils.getDataOriginType(action)
        )
      );
    }
  };

  handleSpellUseSet = (spell: Spell, uses: number): void => {
    const { dispatch } = this.props;

    const mappingId = SpellUtils.getMappingId(spell);
    const mappingEntityTypeId = SpellUtils.getMappingEntityTypeId(spell);
    if (mappingId !== null && mappingEntityTypeId !== null) {
      dispatch(
        characterActions.spellUseSet(
          mappingId,
          mappingEntityTypeId,
          uses,
          SpellUtils.getDataOriginType(spell)
        )
      );
    }
  };

  handleSpellDetailShow = (spell: Spell): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    const mappingId = SpellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryPush(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  handleSpeciesTraitShow = (speciesTrait: RacialTrait): void => {
    const {
      paneContext: { paneHistoryStart },
    } = this.props;
    paneHistoryStart(
      PaneComponentEnum.SPECIES_TRAIT_DETAIL,
      PaneIdentifierUtils.generateRacialTrait(
        RacialTraitUtils.getId(speciesTrait)
      )
    );
  };

  handleActionShow = (action: Action): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    const mappingId = ActionUtils.getMappingId(action);
    const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);
    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryPush(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  handleFeatShow = (feat: FeatManager): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;
    paneHistoryPush(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(feat.getId())
    );
  };

  render() {
    const { speciesTrait } = this.state;
    const {
      species,
      feats,
      abilityLookup,
      snippetData,
      ruleData,
      dataOriginRefData,
      isReadonly,
      proficiencyBonus,
      theme,
      characterFeaturesManager,
    } = this.props;

    if (species === null || speciesTrait === null) {
      return <PaneInitFailureContent />;
    }

    let fullName = RaceUtils.getFullName(species);
    let portrait = RaceUtils.getPortraitAvatarUrl(species);

    return (
      <div
        className="ct-racial-trait-pane"
        key={RacialTraitUtils.getId(speciesTrait)}
      >
        <Header
          parent={fullName}
          preview={portrait && <Preview imageUrl={portrait} />}
        >
          {RacialTraitUtils.getName(speciesTrait)}
        </Header>
        <SpeciesTraitFeatureSnippet
          speciesTrait={speciesTrait}
          onActionUseSet={this.handleActionUseSet}
          onActionClick={this.handleActionShow}
          onSpellUseSet={this.handleSpellUseSet}
          onSpellClick={this.handleSpellDetailShow}
          onFeatureClick={this.handleSpeciesTraitShow}
          showHeader={false}
          showDescription={true}
          feats={feats}
          snippetData={snippetData}
          ruleData={ruleData}
          abilityLookup={abilityLookup}
          dataOriginRefData={dataOriginRefData}
          isReadonly={isReadonly}
          proficiencyBonus={proficiencyBonus}
          theme={theme}
          onFeatClick={this.handleFeatShow}
          featuresManager={characterFeaturesManager}
        />
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    species: rulesEngineSelectors.getRace(state),
    feats: rulesEngineSelectors.getBaseFeats(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
  };
}

const SpeciesTraitPaneWrapper = (props) => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const { pane } = useSidebar();

  return (
    <SpeciesTraitPane
      characterFeaturesManager={characterFeaturesManager}
      paneContext={pane}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(SpeciesTraitPaneWrapper);
