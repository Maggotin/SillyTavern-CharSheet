import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "../../rules-engine/es";

import {
  DarkAcidSvg,
  GrayAcidSvg,
  LightAcidSvg,
  DarkBludgeoningSvg,
  GrayBludgeoningSvg,
  LightBludgeoningSvg,
  DarkColdSvg,
  GrayColdSvg,
  LightColdSvg,
  DarkFireSvg,
  GrayFireSvg,
  LightFireSvg,
  DarkForceSvg,
  GrayForceSvg,
  LightForceSvg,
  DarkLightningSvg,
  GrayLightningSvg,
  LightLightningSvg,
  DarkNecroticSvg,
  GrayNecroticSvg,
  LightNecroticSvg,
  DarkPiercingSvg,
  GrayPiercingSvg,
  LightPiercingSvg,
  DarkPoisonSvg,
  GrayPoisonSvg,
  LightPoisonSvg,
  DarkPsychicSvg,
  GrayPsychicSvg,
  LightPsychicSvg,
  DarkRadiantSvg,
  GrayRadiantSvg,
  LightRadiantSvg,
  DarkSlashingSvg,
  GraySlashingSvg,
  LightSlashingSvg,
  DarkThunderSvg,
  GrayThunderSvg,
  LightThunderSvg,
} from "../../Svg";
import { DamageTypePropType } from "../IconConstants";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  type: DamageTypePropType;
  showTooltip?: boolean;
  className?: string;
  theme?: CharacterTheme;
  themeMode?: "dark" | "gray" | "light";
}
const DamageTypeIcon: React.FunctionComponent<Props> = ({
  showTooltip = true,
  className = "",
  type,
  theme,
  themeMode = theme?.isDarkMode ? "gray" : "dark",
}) => {
  const DarkSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (type) {
      case "acid":
        return DarkAcidSvg;
      case "bludgeoning":
        return DarkBludgeoningSvg;
      case "cold":
        return DarkColdSvg;
      case "fire":
        return DarkFireSvg;
      case "force":
        return DarkForceSvg;
      case "lightning":
        return DarkLightningSvg;
      case "necrotic":
        return DarkNecroticSvg;
      case "piercing":
        return DarkPiercingSvg;
      case "poison":
        return DarkPoisonSvg;
      case "psychic":
        return DarkPsychicSvg;
      case "radiant":
        return DarkRadiantSvg;
      case "slashing":
        return DarkSlashingSvg;
      case "thunder":
        return DarkThunderSvg;
      default:
        return null;
    }
  };

  const GraySvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (type) {
      case "acid":
        return GrayAcidSvg;
      case "bludgeoning":
        return GrayBludgeoningSvg;
      case "cold":
        return GrayColdSvg;
      case "fire":
        return GrayFireSvg;
      case "force":
        return GrayForceSvg;
      case "lightning":
        return GrayLightningSvg;
      case "necrotic":
        return GrayNecroticSvg;
      case "piercing":
        return GrayPiercingSvg;
      case "poison":
        return GrayPoisonSvg;
      case "psychic":
        return GrayPsychicSvg;
      case "radiant":
        return GrayRadiantSvg;
      case "slashing":
        return GraySlashingSvg;
      case "thunder":
        return GrayThunderSvg;
      default:
        return null;
    }
  };

  const LightSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (type) {
      case "acid":
        return LightAcidSvg;
      case "bludgeoning":
        return LightBludgeoningSvg;
      case "cold":
        return LightColdSvg;
      case "fire":
        return LightFireSvg;
      case "force":
        return LightForceSvg;
      case "lightning":
        return LightLightningSvg;
      case "necrotic":
        return LightNecroticSvg;
      case "piercing":
        return LightPiercingSvg;
      case "poison":
        return LightPoisonSvg;
      case "psychic":
        return LightPsychicSvg;
      case "radiant":
        return LightRadiantSvg;
      case "slashing":
        return LightSlashingSvg;
      case "thunder":
        return LightThunderSvg;
      default:
        return null;
    }
  };

  let classNames: Array<string> = [
    className,
    "ddbc-damage-type-icon",
    `ddbc-damage-type-icon--${type}`,
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

  return (
    <span className={classNames.join(" ")} aria-label={`${type} damage`}>
      <Tooltip
        title={type}
        enabled={showTooltip}
        isDarkMode={theme?.isDarkMode}
      >
        <SvgIcon
          className={`ddbc-damage-type-icon__img ddbc-damage-type-icon__img--${type}`}
        />
      </Tooltip>
    </span>
  );
};

export default DamageTypeIcon;
