import * as React from "react";

import {
  AbilityLookup,
  Attack,
  CharacterTheme,
  Constants,
  DiceUtils,
  FormatUtils,
  Item,
  ItemUtils,
  RuleData,
  RuleDataUtils,
  WeaponSpellDamageGroup,
} from "@dndbeyond/character-rules-engine/es";
import {
  Dice,
  RollType,
  DiceEvent,
  RollKind,
  IRollContext,
} from "@dndbeyond/dice";
import StarIcon from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/star.svg";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { ItemName } from "~/components/ItemName";
import { NumberDisplay } from "~/components/NumberDisplay";
import Tooltip from "~/tools/js/commonComponents/Tooltip";

import DamageDice from "../../Dice/DamageDice/DamageDice";
import { AttackTypeIcon } from "../../Icons";
import NoteComponents from "../../NoteComponents";
import { DiceComponentUtils } from "../../utils";
import CombatAttack from "../CombatAttack";

interface Props {
  attack: Attack;
  item: Item;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  onClick?: (attack: Attack) => void;
  abilityLookup: AbilityLookup;
  ruleData: RuleData;
  showNotes: boolean;
  className: string;
  diceEnabled: boolean;
  theme: CharacterTheme;
  rollContext: IRollContext;
  proficiencyBonus: number;
}

interface State {
  isCriticalHit: boolean;
}
class CombatItemAttack extends React.PureComponent<Props, State> {
  diceEventHandler: (eventData: any) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      isCriticalHit: false,
    };
  }

  static defaultProps = {
    showNotes: true,
    className: "",
    diceEnabled: false,
  };

  componentDidMount = () => {
    this.diceEventHandler = DiceComponentUtils.setupResetCritStateOnRoll(
      ItemUtils.getName(this.props.attack.data as Item),
      this
    );
  };

  componentWillUnmount = () => {
    Dice.removeEventListener(DiceEvent.ROLL, this.diceEventHandler);
  };

  handleClick = (): void => {
    const { onClick, attack } = this.props;

    if (onClick) {
      onClick(attack);
    }
  };

  renderNotes = (): React.ReactNode => {
    const {
      item,
      weaponSpellDamageGroups,
      ruleData,
      abilityLookup,
      showNotes,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!showNotes) {
      return null;
    }

    return (
      <div className="ddbc-combat-item-attack__notes">
        <NoteComponents
          notes={ItemUtils.getNoteComponents(
            item,
            weaponSpellDamageGroups,
            ruleData,
            abilityLookup,
            proficiencyBonus
          )}
          theme={theme}
        />
      </div>
    );
  };

  handleRoll = (wasCrit: boolean) => {
    this.setState({ isCriticalHit: wasCrit });
  };

  render() {
    const {
      attack,
      item,
      weaponSpellDamageGroups,
      showNotes,
      diceEnabled,
      theme,
      rollContext,
      className,
    } = this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    const { isCriticalHit } = this.state;

    const toHit = ItemUtils.getToHit(item);
    const proficiency = ItemUtils.hasProficiency(item);
    const metaItems = ItemUtils.getMetaItems(item);
    const type = ItemUtils.getType(item);
    const damage = ItemUtils.getDamage(item);
    const damageType = ItemUtils.getDamageType(item);
    const attackType = ItemUtils.getAttackType(item);
    let attackTypeName: string = "";
    if (attackType) {
      attackTypeName = RuleDataUtils.getAttackTypeRangeName(attackType);
    }
    const versatileDamage = ItemUtils.getVersatileDamage(item);
    const reach = ItemUtils.getReach(item);
    const range = ItemUtils.getRange(item);
    const longRange = ItemUtils.getLongRange(item);
    const isHexWeapon = ItemUtils.isHexWeapon(item);
    const isPactWeapon = ItemUtils.isPactWeapon(item);
    const isDedicatedWeapon = ItemUtils.isDedicatedWeapon(item);
    const isLegacy = ItemUtils.isLegacy(item);

    let combinedMetaItems: Array<string> = [];

    if (isLegacy) {
      combinedMetaItems.push("Legacy");
    }
    if (type === Constants.WeaponTypeEnum.AMMUNITION) {
      combinedMetaItems.push("Ammunition");
    } else {
      if (isHexWeapon || isPactWeapon || isDedicatedWeapon) {
        if (isHexWeapon) {
          combinedMetaItems.push("Hex Weapon");
        }
        if (isPactWeapon) {
          combinedMetaItems.push("Pact Weapon");
        }
        if (isDedicatedWeapon) {
          combinedMetaItems.push("Dedicated Weapon");
        }
      } else {
        combinedMetaItems.push(`${attackTypeName} Weapon`);
      }
    }
    if (ItemUtils.isOffhand(item)) {
      combinedMetaItems.push("Dual Wield");
    }
    if (ItemUtils.isAdamantine(item)) {
      combinedMetaItems.push("Adamantine");
    }
    if (ItemUtils.isSilvered(item)) {
      combinedMetaItems.push("Silvered");
    }
    if (ItemUtils.isCustomized(item)) {
      combinedMetaItems.push("Customized");
    }
    if (ItemUtils.getMasteryName(item)) {
      combinedMetaItems.push("Mastery");
    }
    combinedMetaItems = [...combinedMetaItems, ...metaItems];

    let versatileDamageNode: React.ReactNode;
    if (versatileDamage) {
      versatileDamageNode = (
        <DamageDice
          damage={DiceComponentUtils.getDamageDiceNotation(
            versatileDamage,
            isCriticalHit
          )}
          type={damageType}
          isVersatile={true}
          diceNotation={DiceUtils.renderDice(versatileDamage)}
          rollType={RollType.Damage}
          rollAction={ItemUtils.getName(attack.data as Item)}
          rollKind={isCriticalHit ? RollKind.CriticalHit : RollKind.None}
          diceEnabled={diceEnabled}
          advMenu={true}
          themeColor={theme.themeColor}
          rollContext={rollContext}
          theme={theme}
          rollTargetOptions={
            messageTargetOptions
              ? Object.values(messageTargetOptions?.entities)
              : undefined
          }
          rollTargetDefault={defaultMessageTargetOption}
          userId={userId}
        />
      );
    }
    let classNames: Array<string> = ["ddbc-combat-item-attack__damage"];
    if (versatileDamage) {
      classNames.push("ddb-combat-item-attack__damage--is-versatile");
    }

    let damageNode: React.ReactNode;
    if (damage === null) {
      damageNode = null;
    } else {
      damageNode = (
        <DamageDice
          damage={DiceComponentUtils.getDamageDiceNotation(
            damage,
            isCriticalHit
          )}
          type={damageType}
          diceNotation={
            typeof damage === "number"
              ? damage.toString()
              : DiceUtils.renderDice(damage)
          }
          rollType={RollType.Damage}
          rollAction={ItemUtils.getName(attack.data as Item)}
          rollKind={isCriticalHit ? RollKind.CriticalHit : RollKind.None}
          diceEnabled={diceEnabled}
          advMenu={true}
          themeColor={theme.themeColor}
          rollContext={rollContext}
          theme={theme}
          rollTargetOptions={
            messageTargetOptions
              ? Object.values(messageTargetOptions?.entities)
              : undefined
          }
          rollTargetDefault={defaultMessageTargetOption}
          userId={userId}
        />
      );
    }

    let damageDisplayNode: React.ReactNode = (
      <div className={classNames.join(" ")}>
        {damageNode}
        {versatileDamageNode}
      </div>
    );

    const showRange: boolean =
      attackType === Constants.AttackTypeRangeEnum.RANGED ||
      ItemUtils.hasWeaponProperty(item, Constants.WeaponPropertyEnum.THROWN) ||
      ItemUtils.hasWeaponProperty(item, Constants.WeaponPropertyEnum.RANGE);

    let rangeValue: React.ReactNode;
    let rangeLabel: React.ReactNode;
    if (showRange) {
      rangeValue = (
        <React.Fragment>
          <span
            className={`ddbc-combat-attack__range-value-close ${
              theme.isDarkMode
                ? "ddbc-combat-attack__range-value-close--dark-mode"
                : ""
            }`}
          >
            {range}
          </span>
          {longRange !== null && (
            <span
              className={`ddbc-combat-attack__range-value-long ${
                theme.isDarkMode
                  ? "ddbc-combat-attack__range-value-long--dark-mode"
                  : ""
              }`}
            >
              ({longRange})
            </span>
          )}
        </React.Fragment>
      );
      rangeLabel = "";
    } else {
      rangeValue = <NumberDisplay type="distanceInFt" number={reach} />;
    }

    let filteredWeaponSpellDamageGroups =
      ItemUtils.getApplicableWeaponSpellDamageGroups(
        item,
        weaponSpellDamageGroups
      );

    let iconKey: string = `weapon-${FormatUtils.slugify(attackTypeName)}`;
    if (filteredWeaponSpellDamageGroups.length) {
      iconKey = "weapon-spell-damage";
    }
    let attackClassNames: Array<string> = [
      "ddbc-combat-attack--item",
      `ddbc-combat-item-attack--${FormatUtils.slugify(attackTypeName)}`,
      className,
    ];
    if (isCriticalHit) {
      attackClassNames.push("ddbc-combat-attack--crit");
    }
    return (
      <CombatAttack
        attack={attack}
        className={attackClassNames.join(" ")}
        icon={
          <>
            {ItemUtils.getMasteryName(item) && (
              <Tooltip title="Weapon Mastery" isDarkMode={theme.isDarkMode}>
                <StarIcon
                  style={{ fill: theme.themeColor, marginLeft: "1px" }}
                />
              </Tooltip>
            )}
            <AttackTypeIcon
              actionType={Constants.ActionTypeEnum.WEAPON}
              rangeType={attackType ?? Constants.AttackTypeRangeEnum.MELEE}
              themeMode={theme.isDarkMode ? "gray" : "dark"}
              className={`ddbc-combat-attack__icon-img--${iconKey}`}
              overrideType={
                filteredWeaponSpellDamageGroups.length ? "weapon-spell" : null
              }
            />
          </>
        }
        name={<ItemName item={item} />}
        metaItems={combinedMetaItems}
        rangeValue={rangeValue}
        rangeLabel={rangeLabel}
        isProficient={proficiency}
        toHit={toHit}
        damage={damageDisplayNode}
        notes={this.renderNotes()}
        showNotes={showNotes}
        onClick={this.handleClick}
        diceEnabled={diceEnabled}
        onRoll={this.handleRoll}
        rollContext={rollContext}
        theme={theme}
      />
    );
  }
}

CombatItemAttack.contextType = GameLogContext;

export default CombatItemAttack;
