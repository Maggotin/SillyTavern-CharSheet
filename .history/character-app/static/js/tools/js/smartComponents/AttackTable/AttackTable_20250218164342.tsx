import {
  AbilityLookup,
  Action,
  Attack,
  CharacterTheme,
  Constants,
  DataOriginRefData,
  Item,
  RuleData,
  Spell,
  SpellCasterInfo,
  WeaponSpellDamageGroup,
} from "../../character-rules-engine/es";
import { IRollContext } from "../../dice";
import CombatActionAttack from "../CombatAttack/CombatActionAttack";
import CombatItemAttack from "../CombatAttack/CombatItemAttack";
import CombatSpellAttack from "../CombatAttack/CombatSpellAttack";
import { useMemo } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface AttackTableProps extends React.HTMLAttributes<HTMLElement> {
  theme: CharacterTheme;
  showNotes?: boolean;
  diceEnabled?: boolean;  
  attacks: Array<Attack>;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  abilityLookup: AbilityLookup;
  ruleData: RuleData;
  spellCasterInfo: SpellCasterInfo;
  onAttackClick?: (attack: Attack) => void;
  rollContext: IRollContext;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
};

export const AttackTable = ({
  theme,
  attacks,
  weaponSpellDamageGroups,
  ruleData,
  abilityLookup,
  spellCasterInfo,
  onAttackClick,
  dataOriginRefData,
  proficiencyBonus,
  rollContext,

  showNotes = true,
  diceEnabled = false,

  ...props
}: AttackTableProps) => {
  const columnClassNameBase = useMemo(() => [
    styles.col,
    theme?.isDarkMode && styles.darkMode,
  ], [theme]);

  const getColumnClass = (addtionalClass: string) => clsx([
    ...columnClassNameBase,
    addtionalClass,
  ]);

  const renderedAttacks = useMemo(
    (): React.ReactNode => !!attacks.length
      ? attacks.map((attack): React.ReactNode => {
        const commonCombatAttackProps = {
          key: attack.key,
          attack,
          ruleData,
          abilityLookup,
          onClick: onAttackClick,
          showNotes,
          diceEnabled,
          theme,
          rollContext,
          proficiencyBonus,
          className: styles.attack,
        };

        switch (attack.type) {
          case Constants.AttackSourceTypeEnum.ACTION:
          case Constants.AttackSourceTypeEnum.CUSTOM:
            return (
              <CombatActionAttack
                action={attack.data as Action}
                {...commonCombatAttackProps}
              />
            );

          case Constants.AttackSourceTypeEnum.ITEM:
            return (
              <CombatItemAttack
                item={attack.data as Item}
                weaponSpellDamageGroups={weaponSpellDamageGroups}
                {...commonCombatAttackProps}
              />
            );

          case Constants.AttackSourceTypeEnum.SPELL:
            return (
              <CombatSpellAttack
                spell={attack.data as Spell}
                spellCasterInfo={spellCasterInfo}
                dataOriginRefData={dataOriginRefData}
                {...commonCombatAttackProps}
              />
            );

          default:
            return null;
        }
      })
      : (
        <div className={clsx([
          styles.default,
          theme?.isDarkMode && styles.darkMode,
        ])}>
          Equip weapons or add spells to see your attacks here.
        </div>
      ),
    [
      attacks,
      ruleData,
      abilityLookup,
      onAttackClick,
      showNotes,
      diceEnabled,
      theme,
      rollContext,
      proficiencyBonus,
      weaponSpellDamageGroups,
      spellCasterInfo,
      dataOriginRefData
    ]
  );

  return  (
    <div {...props}>
        <div className={styles.tableHeader}>
          <div className={getColumnClass(styles.icon)} />
          <div className={getColumnClass(styles.name)}>
            Attack
          </div>
          <div className={getColumnClass(styles.range)}>
            Range
          </div>
          <div className={getColumnClass(styles.tohit)}>
            Hit / DC
          </div>
          <div className={getColumnClass(styles.damage)}>
            Damage
          </div>
          {showNotes && (
            <div className={getColumnClass(styles.notes)}>
              Notes
            </div>
          )}
        </div>
        <div data-testid="attack-table-content">
          {renderedAttacks}
        </div>
    </div>
  );
};
