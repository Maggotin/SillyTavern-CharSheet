import * as React from "react";

import { Constants } from "@dndbeyond/character-rules-engine/es";

import {
  DarkBlindedSvg,
  LightBlindedSvg,
  DarkCharmedSvg,
  LightCharmedSvg,
  DarkDeafenedSvg,
  LightDeafenedSvg,
  LightExhaustedSvg,
  DarkExhaustedSvg,
  LightFrightenedSvg,
  DarkFrightenedSvg,
  LightGrappledSvg,
  DarkGrappledSvg,
  DarkIncapacitatedSvg,
  LightIncapacitatedSvg,
  LightInvisibleSvg,
  DarkInvisibleSvg,
  DarkParalyzedSvg,
  LightParalyzedSvg,
  DarkPetrifiedSvg,
  LightPetrifiedSvg,
  LightPoisonedSvg,
  DarkPoisonedSvg,
  LightProneSvg,
  DarkProneSvg,
  LightRestrainedSvg,
  DarkRestrainedSvg,
  LightStunnedSvg,
  DarkStunnedSvg,
  LightUnconsciousSvg,
  DarkUnconsciousSvg,
} from "../../Svg";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  conditionType: Constants.ConditionIdEnum;
  className: string;
  isDarkMode: boolean;
}

const iconMap = {
  [Constants.ConditionIdEnum.BLINDED]: {
    light: LightBlindedSvg,
    dark: DarkBlindedSvg,
  },
  [Constants.ConditionIdEnum.CHARMED]: {
    light: LightCharmedSvg,
    dark: DarkCharmedSvg,
  },
  [Constants.ConditionIdEnum.DEAFENED]: {
    light: LightDeafenedSvg,
    dark: DarkDeafenedSvg,
  },
  [Constants.ConditionIdEnum.EXHAUSTION]: {
    light: LightExhaustedSvg,
    dark: DarkExhaustedSvg,
  },
  [Constants.ConditionIdEnum.FRIGHTENED]: {
    light: LightFrightenedSvg,
    dark: DarkFrightenedSvg,
  },
  [Constants.ConditionIdEnum.GRAPPLED]: {
    light: LightGrappledSvg,
    dark: DarkGrappledSvg,
  },
  [Constants.ConditionIdEnum.INCAPACITATED]: {
    light: LightIncapacitatedSvg,
    dark: DarkIncapacitatedSvg,
  },
  [Constants.ConditionIdEnum.INVISIBLE]: {
    light: LightInvisibleSvg,
    dark: DarkInvisibleSvg,
  },
  [Constants.ConditionIdEnum.PARALYZED]: {
    light: LightParalyzedSvg,
    dark: DarkParalyzedSvg,
  },
  [Constants.ConditionIdEnum.PETRIFIED]: {
    light: LightPetrifiedSvg,
    dark: DarkPetrifiedSvg,
  },
  [Constants.ConditionIdEnum.POISONED]: {
    light: LightPoisonedSvg,
    dark: DarkPoisonedSvg,
  },
  [Constants.ConditionIdEnum.PRONE]: {
    light: LightProneSvg,
    dark: DarkProneSvg,
  },
  [Constants.ConditionIdEnum.RESTRAINED]: {
    light: LightRestrainedSvg,
    dark: DarkRestrainedSvg,
  },
  [Constants.ConditionIdEnum.STUNNED]: {
    light: LightStunnedSvg,
    dark: DarkStunnedSvg,
  },
  [Constants.ConditionIdEnum.UNCONSCIOUS]: {
    light: LightUnconsciousSvg,
    dark: DarkUnconsciousSvg,
  },
};

export default class ConditionIcon extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, conditionType, isDarkMode } = this.props;

    let classNames: Array<string> = [className, "ddbc-condition-icon"];

    let SvgIcon: React.ComponentType<SvgInjectedProps> | null =
      iconMap[conditionType]?.[isDarkMode ? "light" : "dark"] ?? null;

    if (SvgIcon === null) {
      return null;
    }

    return <SvgIcon className={classNames.join(" ")} />;
  }
}
