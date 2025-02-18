import * as React from "react";

import {
  DarkAbjurationSvg,
  DarkConjurationSvg,
  DarkDivinationSvg,
  DarkEnchantmentSvg,
  DarkEvocationSvg,
  DarkIllusionSvg,
  DarkNecromancySvg,
  DarkTransmutationSvg,
  GrayAbjurationSvg,
  GrayConjurationSvg,
  GrayDivinationSvg,
  GrayEnchantmentSvg,
  GrayEvocationSvg,
  GrayIllusionSvg,
  GrayNecromancySvg,
  GrayTransmutationSvg,
  LightAbjurationSvg,
  LightConjurationSvg,
  LightDivinationSvg,
  LightEnchantmentSvg,
  LightEvocationSvg,
  LightIllusionSvg,
  LightNecromancySvg,
  LightTransmutationSvg,
} from "../../Svg";
import { SpellSchoolPropType } from "../IconConstants";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  school: SpellSchoolPropType;
  themeMode?: "dark" | "gray" | "light";
  className?: string;
}
const SpellSchoolIcon: React.FunctionComponent<Props> = ({
  className = "",
  themeMode = "dark",
  school,
}) => {
  const DarkSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (school) {
      case "abjuration":
        return DarkAbjurationSvg;
      case "conjuration":
        return DarkConjurationSvg;
      case "divination":
        return DarkDivinationSvg;
      case "enchantment":
        return DarkEnchantmentSvg;
      case "evocation":
        return DarkEvocationSvg;
      case "illusion":
        return DarkIllusionSvg;
      case "necromancy":
        return DarkNecromancySvg;
      case "transmutation":
        return DarkTransmutationSvg;
      default:
        return null;
    }
  };

  const GraySvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (school) {
      case "abjuration":
        return GrayAbjurationSvg;
      case "conjuration":
        return GrayConjurationSvg;
      case "divination":
        return GrayDivinationSvg;
      case "enchantment":
        return GrayEnchantmentSvg;
      case "evocation":
        return GrayEvocationSvg;
      case "illusion":
        return GrayIllusionSvg;
      case "necromancy":
        return GrayNecromancySvg;
      case "transmutation":
        return GrayTransmutationSvg;
      default:
        return null;
    }
  };

  const LightSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (school) {
      case "abjuration":
        return LightAbjurationSvg;
      case "conjuration":
        return LightConjurationSvg;
      case "divination":
        return LightDivinationSvg;
      case "enchantment":
        return LightEnchantmentSvg;
      case "evocation":
        return LightEvocationSvg;
      case "illusion":
        return LightIllusionSvg;
      case "necromancy":
        return LightNecromancySvg;
      case "transmutation":
        return LightTransmutationSvg;
      default:
        return null;
    }
  };

  let classNames: Array<string> = [
    className,
    "ddbc-spell-school-icon",
    `ddbc-spell-school-icon--${school}`,
  ];

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

export default SpellSchoolIcon;
