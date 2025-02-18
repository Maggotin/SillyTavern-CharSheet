import { visuallyHidden } from "@mui/utils";
import React from "react";

import {
  BoxBackground,
  SquaredBoxSvg228x338,
  SquaredBoxSvg278x338,
} from "../../character-components/es";
import {
  CharacterTheme,
  ProficiencyGroup,
} from "../../character-rules-engine/es";

import { StyleSizeTypeEnum } from "../../../Shared/reducers/appEnv";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import ProficiencyGroups from "../ProficiencyGroups";

interface Props {
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  proficiencyGroups: Array<ProficiencyGroup>;
  onClick?: () => void;
}
export default class ProficiencyGroupsBox extends React.PureComponent<Props> {
  render() {
    const { dimensions, theme, proficiencyGroups, onClick } = this.props;

    let BoxBackgroundComponent: React.ComponentType = SquaredBoxSvg228x338;
    if (
      dimensions.styleSizeType > StyleSizeTypeEnum.DESKTOP ||
      dimensions.styleSizeType <= StyleSizeTypeEnum.TABLET
    ) {
      BoxBackgroundComponent = SquaredBoxSvg278x338;
    }

    return (
      <section className="ct-proficiency-groups-box">
        <BoxBackground StyleComponent={BoxBackgroundComponent} theme={theme} />
        <h2 style={visuallyHidden}>Proficiencies and Languages</h2>
        <ProficiencyGroups
          proficiencyGroups={proficiencyGroups}
          onClick={onClick}
          theme={theme}
        />
      </section>
    );
  }
}
