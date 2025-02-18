import * as React from "react";

import { Constants } from "../../rules-engine/es";

import {
  GoldCoinSvg,
  SilverCoinSvg,
  CopperCoinSvg,
  ElectrumCoinSvg,
  PlatinumCoinSvg,
} from "../../Svg";

//TODO should dynamically create props based on which component and expected props, for now this is duplicated from InjectedSvgProps hocTypings.ts
interface SvgInjectedProps {
  className?: string;
}
interface Props {
  coinType: Constants.CoinTypeEnum;
  className: string;
}
export default class AbilityIcon extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, coinType } = this.props;

    let classNames: Array<string> = [className, "ddbc-ability-icon"];

    let SvgIcon: React.ComponentType<SvgInjectedProps> | null = null;

    switch (coinType) {
      case Constants.CoinTypeEnum.cp:
        SvgIcon = CopperCoinSvg;
        break;
      case Constants.CoinTypeEnum.ep:
        SvgIcon = ElectrumCoinSvg;
        break;
      case Constants.CoinTypeEnum.gp:
        SvgIcon = GoldCoinSvg;
        break;
      case Constants.CoinTypeEnum.pp:
        SvgIcon = PlatinumCoinSvg;
        break;
      case Constants.CoinTypeEnum.sp:
        SvgIcon = SilverCoinSvg;
        break;
      default:
        SvgIcon = null;
    }

    if (SvgIcon === null) {
      return null;
    }

    return <SvgIcon className={classNames.join(" ")} />;
  }
}
