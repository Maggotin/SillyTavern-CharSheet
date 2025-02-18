import * as React from "react";

import { Constants } from "../../character-rules-engine/es";

import {
  DarkCharismaSvg,
  DarkConstitutionSvg,
  DarkDexteritySvg,
  DarkIntelligenceSvg,
  DarkStrengthSvg,
  DarkWisdomSvg,
  LightCharismaSvg,
  LightConstitutionSvg,
  LightDexteritySvg,
  LightIntelligenceSvg,
  LightStrengthSvg,
  LightWisdomSvg,
} from "../../Svg";

//TODO should dynamically create props based on which component and expected props, for now this is duplicated from InjectedSvgProps hocTypings.ts
interface SvgInjectedProps {
  className?: string;
}
interface Props {
  statId: Constants.AbilityStatEnum;
  themeMode?: "dark" | "light";
  className: string;
}
export default class AbilityIcon extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  getDarkSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    const { statId } = this.props;

    switch (statId) {
      case Constants.AbilityStatEnum.CHARISMA:
        return DarkCharismaSvg;
      case Constants.AbilityStatEnum.CONSTITUTION:
        return DarkConstitutionSvg;
      case Constants.AbilityStatEnum.DEXTERITY:
        return DarkDexteritySvg;
      case Constants.AbilityStatEnum.INTELLIGENCE:
        return DarkIntelligenceSvg;
      case Constants.AbilityStatEnum.STRENGTH:
        return DarkStrengthSvg;
      case Constants.AbilityStatEnum.WISDOM:
        return DarkWisdomSvg;
      default:
        return null;
    }
  };

  getLightSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    const { statId } = this.props;

    switch (statId) {
      case Constants.AbilityStatEnum.CHARISMA:
        return LightCharismaSvg;
      case Constants.AbilityStatEnum.CONSTITUTION:
        return LightConstitutionSvg;
      case Constants.AbilityStatEnum.DEXTERITY:
        return LightDexteritySvg;
      case Constants.AbilityStatEnum.INTELLIGENCE:
        return LightIntelligenceSvg;
      case Constants.AbilityStatEnum.STRENGTH:
        return LightStrengthSvg;
      case Constants.AbilityStatEnum.WISDOM:
        return LightWisdomSvg;
      default:
        return null;
    }
  };

  render() {
    const { themeMode, className } = this.props;

    let classNames: Array<string> = [className, "ddbc-ability-icon"];

    let SvgIcon: React.ComponentType<SvgInjectedProps> | null = null;

    switch (themeMode) {
      case "light":
        SvgIcon = this.getLightSvg();
        break;
      case "dark":
      default:
        SvgIcon = this.getDarkSvg();
    }

    if (SvgIcon === null) {
      return null;
    }

    return <SvgIcon className={classNames.join(" ")} />;
  }
}
