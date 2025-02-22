import { orderBy } from "lodash";
import React, { HTMLAttributes, useMemo } from "react";
import { AttackTable } from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  Activatable,
  Attack,
  BasicActionContract,
  Constants,
  RuleData,
  SnippetData,
  Spell,
  SpellCasterInfo,
  SpellUtils,
  WeaponSpellDamageGroup,
  InventoryLookup,
  DataOriginRefData,
  HelperUtils,
  ActionUtils,
  BaseSpell,
  CharacterTheme,
  Action,
} from "@dndbeyond/character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import ActionSnippet from "../ActionSnippet";
import BasicActions from "../BasicActions";
import { FeatureSnippetSpells } from "../FeatureSnippet";
import clsx from "clsx";
import styles from "./styles.module.css";
import { ActionListSection } from "./ActionListSection";


interface ActionsListProps extends HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;
  theme: CharacterTheme;
  showNotes: boolean;
  diceEnabled?: boolean;
  isInteractive: boolean;
  showActivationInfo?: boolean;

  actions?: Array<Activatable>;
  basicActions?: Array<BasicActionContract>;
  ritualSpells?: Array<Spell>;
  attacks?: Array<Attack>;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  ruleData: RuleData;
  spellCasterInfo: SpellCasterInfo;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  rollContext: IRollContext;
  inventoryLookup: InventoryLookup;
  snippetData: SnippetData;
  
  // ActionHandlers
  onAttackClick: (attack: Attack) => void;
  onActionClick: (action: Action) => void;
  onBasicActionClick: (basicAction: BasicActionContract) => void;
  onActionUseSet: (action: Action, used: number) => void;
  onSpellClick: (spell: Spell) => void;
  onSpellUseSet: (spell: Spell, used: number) => void;
};

export const ActionsList = ({
  heading,
  theme,
  showNotes,
  isInteractive,
  diceEnabled = false,
  showActivationInfo = false,

  actions = [],
  basicActions = [],
  ritualSpells = [],
  attacks = [],
  weaponSpellDamageGroups,
  ruleData,
  spellCasterInfo,
  abilityLookup,
  dataOriginRefData,
  proficiencyBonus,
  rollContext,
  inventoryLookup,
  snippetData,
  // From ActionHandlers
  onAttackClick,
  onBasicActionClick,
  onActionClick,
  onActionUseSet,
  onSpellClick,
  onSpellUseSet,
  // From HTMLAttributes
  className,
  ...props
}: ActionsListProps) => {
  const { actionLookup } = useCharacterEngine();

  const isVisible = useMemo(
    () => !!basicActions.length
      || !!actions.length
      || !!ritualSpells.length
      || !!attacks.length,
    [basicActions, actions, ritualSpells, attacks]
  );
  
  const attackTableProps = {
    attacks,
    weaponSpellDamageGroups,
    ruleData,
    abilityLookup,
    spellCasterInfo,
    onAttackClick,
    showNotes,
    diceEnabled,
    theme,
    dataOriginRefData,
    proficiencyBonus,
    rollContext,
  };

  const spellSnippetProps = {
    onSpellClick,
    onSpellUseSet,
    ruleData,
    theme,
    abilityLookup,
    isInteractive,
    dataOriginRefData,
    proficiencyBonus,
  };

  const spells = useMemo(() => {
    let spells: Array<BaseSpell> = [];

    actions.forEach((action) => {
      switch (action.type) {
        case Constants.ActivatableTypeEnum.CLASS_SPELL:
        case Constants.ActivatableTypeEnum.CHARACTER_SPELL:
          spells.push(action.entity);
          break;
      }
    });

    return spells;
  }, [actions]);

  const orderedRitualSpells = useMemo(
    () => orderBy(
      ritualSpells,
      (spell) => SpellUtils.getName(spell)
    ),
    [ritualSpells]
  );

  const features = useMemo(() => actions.filter(
    a => a.type === Constants.ActivatableTypeEnum.ACTION)
      .map(feature => {
        const action = HelperUtils.lookupDataOrFallback(
          actionLookup,
          ActionUtils.getUniqueKey(feature.entity)
        );
        return (          
          <div
            className={styles.activatable}
            key={feature.key}
            data-testid="actions-list-activatable-feature"
          >
            <ActionSnippet
              theme={theme}
              action={action ?? feature.entity}
              onActionClick={onActionClick}
              onActionUseSet={onActionUseSet}
              abilityLookup={abilityLookup}
              inventoryLookup={inventoryLookup}
              ruleData={ruleData}
              snippetData={snippetData}
              isInteractive={isInteractive}
              showActivationInfo={showActivationInfo}
              activation={feature.activation}
              proficiencyBonus={proficiencyBonus}
            />
          </div>
        );
      }),
    [
      actions,
      actionLookup,
      theme,
      onActionClick,
      onActionUseSet,
      abilityLookup,
      inventoryLookup,
      ruleData,
      snippetData,
      isInteractive,
      showActivationInfo,
      proficiencyBonus,
    ]);

  return isVisible ? (
    <div className={clsx([styles.actionsList, className])} {...props}>
      <div
        className={clsx([styles.heading, theme.isDarkMode && styles.darkMode])}
        data-testid="actions-list-header"
      >
        {heading}
      </div>
      <div>
        {!!attacks.length && <AttackTable className={styles.attackTable} {...attackTableProps} />}

        {!!basicActions.length && (
          <ActionListSection headingText="Actions in Combat" testId="basic" theme={theme}>
            <BasicActions
              onActionClick={onBasicActionClick}
              basicActions={basicActions}
              theme={theme}
            />
          </ActionListSection>
        )}

        {!!spells.length && (
          <ActionListSection headingText="Spells" theme={theme}>
            <FeatureSnippetSpells layoutType={"compact"}  spells={spells} {...spellSnippetProps} />
          </ActionListSection>
        )}

        {!!ritualSpells.length && (
          <ActionListSection headingText="Ritual Spells" theme={theme}>
            <FeatureSnippetSpells layoutType={"compact"}  spells={orderedRitualSpells} {...spellSnippetProps} />
          </ActionListSection>
        )}

        {features}
      </div>
    </div>
  ) : null;
};
