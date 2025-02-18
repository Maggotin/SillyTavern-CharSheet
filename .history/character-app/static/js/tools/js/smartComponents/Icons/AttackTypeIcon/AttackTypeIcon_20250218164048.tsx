import * as React from "react";

import { Constants } from "../../rules-engine/es";

import {
  DarkMeleeSpellSvg,
  DarkMeleeWeaponSvg,
  DarkRangedSpellSvg,
  DarkRangedWeaponSvg,
  DarkThrownSvg,
  DarkUnarmedStrikeSvg,
  DarkWeaponSpellDamageSvg,
  GrayMeleeSpellSvg,
  GrayMeleeWeaponSvg,
  GrayRangedSpellSvg,
  GrayRangedWeaponSvg,
  GrayThrownSvg,
  GrayUnarmedStrikeSvg,
  GrayWeaponSpellDamageSvg,
  LightMeleeSpellSvg,
  LightMeleeWeaponSvg,
  LightRangedSpellSvg,
  LightRangedWeaponSvg,
  LightThrownSvg,
  LightUnarmedStrikeSvg,
  LightWeaponSpellDamageSvg,
} from "../../Svg";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  actionType: Constants.ActionTypeEnum | null;
  rangeType: Constants.AttackTypeRangeEnum;
  themeMode?: "dark" | "gray" | "light";
  className?: string;
  overrideType?: "weapon-spell" | null;
}
const AttackTypeIcon: React.FunctionComponent<Props> = ({
  className = "",
  themeMode = "dark",
  actionType,
  rangeType,
  overrideType,
}) => {
  const DarkSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (true) {
      case actionType === Constants.ActionTypeEnum.GENERAL &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return DarkUnarmedStrikeSvg;
      case actionType === Constants.ActionTypeEnum.GENERAL &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return DarkThrownSvg;
      case actionType === Constants.ActionTypeEnum.SPELL &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return DarkMeleeSpellSvg;
      case actionType === Constants.ActionTypeEnum.SPELL &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return DarkRangedSpellSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        overrideType === "weapon-spell":
        return DarkWeaponSpellDamageSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return DarkMeleeWeaponSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return DarkRangedWeaponSvg;
      default:
        return null;
    }
  };

  const GraySvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (true) {
      case actionType === Constants.ActionTypeEnum.GENERAL &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return GrayUnarmedStrikeSvg;
      case actionType === Constants.ActionTypeEnum.GENERAL &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return GrayThrownSvg;
      case actionType === Constants.ActionTypeEnum.SPELL &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return GrayMeleeSpellSvg;
      case actionType === Constants.ActionTypeEnum.SPELL &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return GrayRangedSpellSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        overrideType === "weapon-spell":
        return GrayWeaponSpellDamageSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return GrayMeleeWeaponSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return GrayRangedWeaponSvg;
      default:
        return null;
    }
  };

  const LightSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (true) {
      case actionType === Constants.ActionTypeEnum.GENERAL &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return LightUnarmedStrikeSvg;
      case actionType === Constants.ActionTypeEnum.GENERAL &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return LightThrownSvg;
      case actionType === Constants.ActionTypeEnum.SPELL &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return LightMeleeSpellSvg;
      case actionType === Constants.ActionTypeEnum.SPELL &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return LightRangedSpellSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        overrideType === "weapon-spell":
        return LightWeaponSpellDamageSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        rangeType === Constants.AttackTypeRangeEnum.MELEE:
        return LightMeleeWeaponSvg;
      case actionType === Constants.ActionTypeEnum.WEAPON &&
        rangeType === Constants.AttackTypeRangeEnum.RANGED:
        return LightRangedWeaponSvg;
      default:
        return null;
    }
  };

  let classNames: Array<string> = [
    className,
    "ddbc-attack-type-icon",
    `ddbc-attack-type-icon--${actionType}-${rangeType}`,
  ];

  if (overrideType) {
    classNames.push(`ddbc-attack-type-icon--${overrideType}`);
  }

  let SvgIcon: React.ComponentType<SvgInjectedProps> | null = null;

  switch (themeMode) {
    case "light":
      SvgIcon = LightSvg();
      break;
    case "gray":
      SvgIcon = GraySvg();
      break;
    case "dark":
    default:
      SvgIcon = DarkSvg();
  }

  if (SvgIcon === null) {
    return null;
  }

  return <SvgIcon className={classNames.join(" ")} />;
};

export default AttackTypeIcon;
