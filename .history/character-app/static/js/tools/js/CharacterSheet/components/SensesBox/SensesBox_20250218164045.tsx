import { visuallyHidden } from "@mui/utils";
import React from "react";

import {
  BoxBackground,
  FancyBoxSvg230x200,
  FancyBoxSvg281x200,
} from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  SenseInfo,
} from "../../rules-engine/es";

import { StyleSizeTypeEnum } from "../../../Shared/reducers/appEnv";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import Senses from "../Senses";

interface Props {
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  senses: SenseInfo;
  onClick?: () => void;
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
}
export default class SensesBox extends React.PureComponent<Props> {
  render() {
    const {
      passiveInsight,
      passiveInvestigation,
      passivePerception,
      senses,
      onClick,
      dimensions,
      theme,
    } = this.props;

    let BoxBackgroundComponent: React.ComponentType = FancyBoxSvg230x200;
    let useSmallRowStyle: boolean = true;
    if (
      dimensions.styleSizeType > StyleSizeTypeEnum.DESKTOP ||
      dimensions.styleSizeType <= StyleSizeTypeEnum.TABLET
    ) {
      BoxBackgroundComponent = FancyBoxSvg281x200;
      useSmallRowStyle = false;
    }

    return (
      <section className="ct-senses-box">
        <BoxBackground StyleComponent={BoxBackgroundComponent} theme={theme} />
        <h2 style={visuallyHidden}>Senses</h2>
        <Senses
          senses={senses}
          passiveInsight={passiveInsight}
          passiveInvestigation={passiveInvestigation}
          passivePerception={passivePerception}
          onClick={onClick}
          theme={theme}
          rowStyle={useSmallRowStyle ? "small" : "normal"}
        />
      </section>
    );
  }
}
