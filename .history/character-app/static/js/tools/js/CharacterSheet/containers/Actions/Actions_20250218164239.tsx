import { visuallyHidden } from "@mui/utils";
import React, { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  AbilityLookup,
  Action,
  ActionUtils,
  Activatable,
  Attack,
  AttacksPerActionInfo,
  BaseInventoryContract,
  BasicActionContract,
  characterActions,
  CharacterTheme,
  CharClass,
  ClassFeature,
  ClassUtils,
  Constants,
  DataOriginRefData,
  Feat,
  FeatureUtils,
  FeatUtils,
  Hack__BaseCharClass,
  InventoryLookup,
  InventoryManager,
  Item,
  ItemManager,
  ItemUtils,
  RacialTrait,
  RacialTraitUtils,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  SnippetData,
  Spell,
  SpellCasterInfo,
  SpellUtils,
  WeaponSpellDamageGroup,
} from "../../character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";

import { Link } from "~/components/Link";
import { TabFilter } from "~/components/TabFilter";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import {
  PaneComponentEnum,
  PaneIdentifiers,
} from "~/subApps/sheet/components/Sidebar/types";

import { InventoryManagerContext } from "../../../Shared/managers/InventoryManagerContext";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../Shared/selectors";
import { SharedAppState } from "../../../Shared/stores/typings";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import { ActionsList } from "../../components/ActionsList";

type AttackGroups = Record<string, Array<Attack>>;

interface ActionListConfig {
  onBasicActionClick: (basicAction: BasicActionContract) => void;
  onActionClick: (action: Action) => void;
  onActionUseSet: (action: Action, used: number) => void;
  onSpellClick: (spell: Spell) => void;
  onSpellUseSet: (spell: Spell, used: number) => void;
  onAttackClick: (attack: Attack) => void;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  snippetData: SnippetData;
  spellCasterInfo: SpellCasterInfo;
  showNotes: boolean;
  abilityLookup: AbilityLookup;
  ruleData: RuleData;
  inventoryLookup: InventoryLookup;
  isInteractive: boolean;
  diceEnabled: boolean;
  theme: CharacterTheme;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  rollContext: IRollContext;
}

interface Props extends DispatchProp {
  showNotes: boolean;

  activatables: Array<Activatable>;
  attacks: Array<Attack>;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  attacksPerActionInfo: AttacksPerActionInfo;
  ritualSpells: Array<Spell>;
  abilityLookup: AbilityLookup;
  inventoryLookup: InventoryLookup;
  ruleData: RuleData;
  snippetData: SnippetData;
  spellCasterInfo: SpellCasterInfo;
  isReadonly: boolean;
  diceEnabled: boolean;
  theme: CharacterTheme;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  characterRollContext: IRollContext;
  inventoryManager: InventoryManager;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}

interface State {
  attackGroups: AttackGroups;
}

class Actions extends React.PureComponent<Props, State> {
  static defaultProps = {
    showNotes: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { attacks } = this.props;

    if (attacks !== prevProps.attacks) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { attacks } = props;

    let attackGroups: AttackGroups = {};
    attackGroups["ACTIONS"] = attacks.filter(
      (attack) => attack.activation === Constants.ActivationTypeEnum.ACTION
    );
    attackGroups["BONUS_ACTIONS"] = attacks.filter(
      (attack) =>
        attack.activation === Constants.ActivationTypeEnum.BONUS_ACTION
    );
    attackGroups["REACTIONS"] = attacks.filter(
      (attack) => attack.activation === Constants.ActivationTypeEnum.REACTION
    );
    attackGroups["OTHER"] = attacks.filter(
      (attack) =>
        attack.activation !== Constants.ActivationTypeEnum.ACTION &&
        attack.activation !== Constants.ActivationTypeEnum.BONUS_ACTION &&
        attack.activation !== Constants.ActivationTypeEnum.REACTION
    );

    return {
      attackGroups,
    };
  };

  getActionListConfig = (): ActionListConfig => {
    const {
      weaponSpellDamageGroups,
      ruleData,
      abilityLookup,
      inventoryLookup,
      spellCasterInfo,
      snippetData,
      showNotes,
      isReadonly,
      diceEnabled,
      theme,
      dataOriginRefData,
      proficiencyBonus,
      characterRollContext,
    } = this.props;

    return {
      onBasicActionClick: this.handleBasicActionShow,
      onActionClick: this.handleActionShow,
      onActionUseSet: this.handleActionUseSet,
      onSpellClick: this.handleSpellDetailShow,
      onSpellUseSet: this.handleSpellUseSet,
      onAttackClick: this.handleAttackClick,
      weaponSpellDamageGroups,
      abilityLookup,
      inventoryLookup,
      ruleData,
      snippetData,
      spellCasterInfo,
      showNotes,
      isInteractive: !isReadonly,
      diceEnabled,
      theme,
      dataOriginRefData,
      proficiencyBonus,
      rollContext: characterRollContext,
    };
  };

  handleActionUseSet = (action: Action, uses: number): void => {
    const { dispatch } = this.props;

    const dataOrigin = ActionUtils.getDataOrigin(action);
    const dataOriginType = ActionUtils.getDataOriginType(action);

    if (dataOriginType === Constants.DataOriginTypeEnum.ITEM) {
      const itemData = dataOrigin.primary as BaseInventoryContract;
      const item = ItemManager.getItem(ItemUtils.getMappingId(itemData));
      item.handleItemLimitedUseSet(uses);
    } else {
      const id = ActionUtils.getId(action);
      const entityTypeId = ActionUtils.getEntityTypeId(action);
      if (id !== null && entityTypeId !== null) {
        dispatch(
          characterActions.actionUseSet(id, entityTypeId, uses, dataOriginType)
        );
      }
    }
  };

  handleSpellUseSet = (spell: Spell, uses: number): void => {
    const { dispatch } = this.props;

    const mappingId = SpellUtils.getMappingId(spell);
    const mappingEntityTypeId = SpellUtils.getMappingEntityTypeId(spell);
    const dataOriginType = SpellUtils.getDataOriginType(spell);

    if (mappingId && mappingEntityTypeId) {
      dispatch(
        characterActions.spellUseSet(
          mappingId,
          mappingEntityTypeId,
          uses,
          dataOriginType
        )
      );
    }
  };

  handleSpellDetailShow = (spell: Spell): void => {
    const { paneHistoryStart } = this.props;

    let spellMappingId = SpellUtils.getMappingId(spell);
    const dataOriginType = SpellUtils.getDataOriginType(spell);
    const dataOrigin = SpellUtils.getDataOrigin(spell);

    if (spellMappingId !== null) {
      let paneComponent: PaneComponentEnum;
      let identifiers: PaneIdentifiers;
      if (dataOriginType === Constants.DataOriginTypeEnum.CLASS) {
        paneComponent = PaneComponentEnum.CLASS_SPELL_DETAIL;
        identifiers = PaneIdentifierUtils.generateClassSpell(
          ClassUtils.getMappingId(dataOrigin.primary as Hack__BaseCharClass),
          spellMappingId
        );
      } else {
        paneComponent = PaneComponentEnum.CHARACTER_SPELL_DETAIL;
        identifiers =
          PaneIdentifierUtils.generateCharacterSpell(spellMappingId);
      }
      paneHistoryStart(paneComponent, identifiers);
    }
  };

  // this is not being used downstream is marked for deletion, was used in ActionsList
  handleClassFeatureShow = (
    feature: ClassFeature,
    charClass: CharClass
  ): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(
      PaneComponentEnum.CLASS_FEATURE_DETAIL,
      PaneIdentifierUtils.generateClassFeature(
        FeatureUtils.getId(feature),
        ClassUtils.getMappingId(charClass)
      )
    );
  };

  // this is not being used downstream is marked for deletion, was used in ActionsList
  handleRacialTraitShow = (racialTrait: RacialTrait): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(
      PaneComponentEnum.SPECIES_TRAIT_DETAIL,
      PaneIdentifierUtils.generateRacialTrait(
        RacialTraitUtils.getId(racialTrait)
      )
    );
  };

  // this is not being used downstream is marked for deletion, was used in ActionsList
  handleFeatShow = (feat: Feat): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(FeatUtils.getId(feat))
    );
  };

  handleActionShow = (action: Action): void => {
    const { paneHistoryStart } = this.props;

    const id = ActionUtils.getMappingId(action);
    const entityTypeId = ActionUtils.getMappingEntityTypeId(action);
    if (id === null) {
      return;
    }

    let dataOriginType = ActionUtils.getDataOriginType(action);

    let paneComponentType: PaneComponentEnum = PaneComponentEnum.ACTION;
    let paneComponentIdentifiers: PaneIdentifiers =
      PaneIdentifierUtils.generateAction(id, entityTypeId);

    if (dataOriginType === Constants.DataOriginTypeEnum.CUSTOM) {
      paneComponentType = PaneComponentEnum.CUSTOM_ACTION;
      paneComponentIdentifiers = PaneIdentifierUtils.generateCustomAction(id);
    }

    paneHistoryStart(paneComponentType, paneComponentIdentifiers);
  };

  handleManageCustomActionsShow = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.CUSTOM_ACTIONS);
  };

  handleBasicActionShow = (basicAction: BasicActionContract): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(
      PaneComponentEnum.BASIC_ACTION,
      PaneIdentifierUtils.generateBasicAction(basicAction.id)
    );
  };

  handleAttackClick = (attack: Attack): void => {
    const { paneHistoryStart } = this.props;

    let paneComponentType: PaneComponentEnum | null = null;
    let paneComponentIdentifiers: PaneIdentifiers | null = null;

    switch (attack.type) {
      case Constants.AttackSourceTypeEnum.ACTION: {
        const action = attack.data as Action;
        const mappingId = ActionUtils.getMappingId(action);
        const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

        if (mappingId !== null && mappingEntityTypeId !== null) {
          paneComponentType = PaneComponentEnum.ACTION;
          paneComponentIdentifiers = PaneIdentifierUtils.generateAction(
            mappingId,
            mappingEntityTypeId
          );
        }
        break;
      }
      case Constants.AttackSourceTypeEnum.CUSTOM: {
        const action = attack.data as Action;
        const mappingId = ActionUtils.getMappingId(action);
        const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

        if (mappingId !== null && mappingEntityTypeId !== null) {
          paneComponentType = PaneComponentEnum.CUSTOM_ACTION;
          paneComponentIdentifiers = PaneIdentifierUtils.generateAction(
            mappingId,
            mappingEntityTypeId
          );
        }
        break;
      }
      case Constants.AttackSourceTypeEnum.ITEM: {
        paneComponentType = PaneComponentEnum.ITEM_DETAIL;
        paneComponentIdentifiers = PaneIdentifierUtils.generateItem(
          ItemUtils.getMappingId(attack.data as Item)
        );
        break;
      }
      case Constants.AttackSourceTypeEnum.SPELL: {
        const spell: Spell = attack.data as Spell;
        const mappingId = SpellUtils.getMappingId(spell);
        const dataOriginType = SpellUtils.getDataOriginType(spell);
        const dataOrigin = SpellUtils.getDataOrigin(spell);

        if (mappingId !== null) {
          if (dataOriginType === Constants.DataOriginTypeEnum.CLASS) {
            paneComponentType = PaneComponentEnum.CLASS_SPELL_DETAIL;
            paneComponentIdentifiers = PaneIdentifierUtils.generateClassSpell(
              ClassUtils.getMappingId(
                dataOrigin.primary as Hack__BaseCharClass
              ),
              mappingId
            );
          } else {
            paneComponentType = PaneComponentEnum.CHARACTER_SPELL_DETAIL;
            paneComponentIdentifiers =
              PaneIdentifierUtils.generateCharacterSpell(mappingId);
          }
        }
        break;
      }
      default:
      // not implemented
    }

    if (paneComponentType !== null) {
      paneHistoryStart(paneComponentType, paneComponentIdentifiers);
    }
  };

  renderManageCustomLink = (): React.ReactNode => {
    const { isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <Link
        useTheme={true}
        className="ct-actions__manage-custom-link"
        onClick={this.handleManageCustomActionsShow}
      >
        Manage Custom
      </Link>
    );
  };

  renderActionsHeader = (): React.ReactNode => {
    const { attacksPerActionInfo, theme } = this.props;

    return (
      <React.Fragment>
        <div className="ct-actions__attacks-heading">
          Actions &bull;{" "}
          <span
            className={`ct-actions__attacks-per-action ${
              theme?.isDarkMode
                ? "ct-actions__attacks-per-action--dark-mode"
                : ""
            }`}
          >
            Attacks per Action: {attacksPerActionInfo.value}
          </span>
        </div>
        {attacksPerActionInfo.restriction && (
          <div className="ct-actions__attacks-restriction">
            {attacksPerActionInfo.restriction}
          </div>
        )}
      </React.Fragment>
    );
  };

  render() {
    const { attackGroups } = this.state;
    const { activatables, ritualSpells, ruleData } = this.props;

    let actionGroups: Record<string, Array<Activatable>> = {};
    actionGroups["ACTIONS"] = activatables.filter(
      (a) =>
        a.activation.activationType === Constants.ActivationTypeEnum.ACTION &&
        a.type !== Constants.ActivatableTypeEnum.CLASS_SPELL &&
        a.type !== Constants.ActivatableTypeEnum.CHARACTER_SPELL
    );
    actionGroups["BONUS_ACTIONS"] = activatables.filter(
      (a) =>
        a.activation.activationType ===
        Constants.ActivationTypeEnum.BONUS_ACTION
    );
    actionGroups["REACTIONS"] = activatables.filter(
      (a) =>
        a.activation.activationType === Constants.ActivationTypeEnum.REACTION
    );
    actionGroups["OTHER"] = activatables.filter(
      (a) =>
        a.activation.activationType !== Constants.ActivationTypeEnum.ACTION &&
        a.activation.activationType !==
          Constants.ActivationTypeEnum.BONUS_ACTION &&
        a.activation.activationType !== Constants.ActivationTypeEnum.REACTION
    );

    let otherBasicActions: Array<BasicActionContract> = [
      ...RuleDataUtils.getActivationTypeBasicActions(
        Constants.ActivationTypeEnum.NO_ACTION,
        ruleData
      ),
      ...RuleDataUtils.getActivationTypeBasicActions(
        Constants.ActivationTypeEnum.MINUTE,
        ruleData
      ),
      ...RuleDataUtils.getActivationTypeBasicActions(
        Constants.ActivationTypeEnum.HOUR,
        ruleData
      ),
      ...RuleDataUtils.getActivationTypeBasicActions(
        Constants.ActivationTypeEnum.SPECIAL,
        ruleData
      ),
    ];

    let limitedUseActionGroups: Record<string, Array<Activatable>> = {};
    limitedUseActionGroups["ACTIONS"] = activatables.filter(
      (a) =>
        a.activation.activationType === Constants.ActivationTypeEnum.ACTION &&
        a.limitedUse
    );
    limitedUseActionGroups["BONUS_ACTIONS"] = activatables.filter(
      (a) =>
        a.activation.activationType ===
          Constants.ActivationTypeEnum.BONUS_ACTION && a.limitedUse
    );
    limitedUseActionGroups["REACTIONS"] = activatables.filter(
      (a) =>
        a.activation.activationType === Constants.ActivationTypeEnum.REACTION &&
        a.limitedUse
    );
    limitedUseActionGroups["OTHER"] = activatables.filter(
      (a) =>
        a.activation.activationType !== Constants.ActivationTypeEnum.ACTION &&
        a.activation.activationType !==
          Constants.ActivationTypeEnum.BONUS_ACTION &&
        a.activation.activationType !== Constants.ActivationTypeEnum.REACTION &&
        a.limitedUse
    );

    let limitedUseRitualSpells = ritualSpells.filter((spell) =>
      SpellUtils.getLimitedUse(spell)
    );

    const actionListData: ActionListConfig = {
      ...this.getActionListConfig(),
    };

    const hasLimitedUse =
      !!limitedUseActionGroups["ACTIONS"].length ||
      !!limitedUseActionGroups["BONUS_ACTIONS"].length ||
      !!limitedUseActionGroups["REACTIONS"].length ||
      !!limitedUseActionGroups["OTHER"].length ||
      !!limitedUseRitualSpells.length;

    const hasAttackGroups =
      !!attackGroups["ACTIONS"].length ||
      !!attackGroups["BONUS_ACTIONS"].length ||
      !!attackGroups["REACTIONS"].length ||
      !!attackGroups["OTHER"].length;

    return (
      <section className="ct-actions">
        <h2 style={visuallyHidden}>Actions</h2>
        <TabFilter
          filters={[
            ...(!hasAttackGroups
              ? []
              : [
                  {
                    label: "Attack",
                    content: (
                      <>
                        {this.renderManageCustomLink()}
                        <ActionsList
                          heading={this.renderActionsHeader()}
                          attacks={attackGroups["ACTIONS"]}
                          {...actionListData}
                        />
                        <ActionsList
                          heading="Bonus Actions"
                          attacks={attackGroups["BONUS_ACTIONS"]}
                          {...actionListData}
                        />
                        <ActionsList
                          heading="Reactions"
                          attacks={attackGroups["REACTIONS"]}
                          {...actionListData}
                        />
                        <ActionsList
                          heading="Other"
                          attacks={attackGroups["OTHER"]}
                          {...actionListData}
                        />
                      </>
                    ),
                  },
                ]),
            {
              label: "Action",
              content: (
                <>
                  {this.renderManageCustomLink()}
                  <ActionsList
                    heading={this.renderActionsHeader()}
                    actions={actionGroups["ACTIONS"]}
                    attacks={attackGroups["ACTIONS"]}
                    basicActions={RuleDataUtils.getActivationTypeBasicActions(
                      Constants.ActivationTypeEnum.ACTION,
                      ruleData
                    )}
                    {...actionListData}
                  />
                </>
              ),
            },
            {
              label: "Bonus Action",
              content: (
                <>
                  {this.renderManageCustomLink()}
                  <ActionsList
                    heading="Bonus Actions"
                    actions={actionGroups["BONUS_ACTIONS"]}
                    attacks={attackGroups["BONUS_ACTIONS"]}
                    basicActions={RuleDataUtils.getActivationTypeBasicActions(
                      Constants.ActivationTypeEnum.BONUS_ACTION,
                      ruleData
                    )}
                    {...actionListData}
                  />
                </>
              ),
            },
            {
              label: "Reaction",
              content: (
                <>
                  {this.renderManageCustomLink()}
                  <ActionsList
                    heading="Reactions"
                    actions={actionGroups["REACTIONS"]}
                    attacks={attackGroups["REACTIONS"]}
                    basicActions={RuleDataUtils.getActivationTypeBasicActions(
                      Constants.ActivationTypeEnum.REACTION,
                      ruleData
                    )}
                    {...actionListData}
                  />
                </>
              ),
            },
            {
              label: "Other",
              content: (
                <>
                  {this.renderManageCustomLink()}
                  <ActionsList
                    heading="Other"
                    actions={actionGroups["OTHER"]}
                    attacks={attackGroups["OTHER"]}
                    basicActions={otherBasicActions}
                    ritualSpells={ritualSpells}
                    showActivationInfo
                    {...actionListData}
                  />
                </>
              ),
            },
            ...(!hasLimitedUse
              ? []
              : [
                  {
                    label: "Limited Use",
                    content: (
                      <>
                        {this.renderManageCustomLink()}
                        <ActionsList
                          heading="Actions"
                          actions={limitedUseActionGroups["ACTIONS"]}
                          {...actionListData}
                        />
                        <ActionsList
                          heading="Bonus Actions"
                          actions={limitedUseActionGroups["BONUS_ACTIONS"]}
                          {...actionListData}
                        />
                        <ActionsList
                          heading="Reactions"
                          actions={limitedUseActionGroups["REACTIONS"]}
                          {...actionListData}
                        />
                        <ActionsList
                          heading="Other"
                          actions={limitedUseActionGroups["OTHER"]}
                          ritualSpells={limitedUseRitualSpells}
                          showActivationInfo
                          {...actionListData}
                        />
                      </>
                    ),
                  },
                ]),
          ]}
        />
      </section>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    activatables: rulesEngineSelectors.getActivatables(state),
    attacks: rulesEngineSelectors.getAttacks(state),
    weaponSpellDamageGroups:
      rulesEngineSelectors.getWeaponSpellDamageGroups(state),
    attacksPerActionInfo: rulesEngineSelectors.getAttacksPerActionInfo(state),
    ritualSpells: rulesEngineSelectors.getRitualSpells(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    inventoryLookup: rulesEngineSelectors.getInventoryLookup(state),
    spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    characterRollContext:
      characterRollContextSelectors.getCharacterRollContext(state),
  };
}

const ActionsContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <Actions
      inventoryManager={inventoryManager}
      paneHistoryStart={paneHistoryStart}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(ActionsContainer);
