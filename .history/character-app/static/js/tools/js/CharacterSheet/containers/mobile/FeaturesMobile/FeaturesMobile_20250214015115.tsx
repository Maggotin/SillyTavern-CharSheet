import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import MobileDivider from "../../../components/MobileDivider";
import SubsectionMobile from "../../../components/SubsectionMobile";
import { SheetAppState } from "../../../typings";
import Features from "../../Features";

interface Props extends DispatchProp {
  theme: CharacterTheme;
}
class FeaturesMobile extends React.PureComponent<Props> {
  render() {
    const { theme } = this.props;

    return (
      <SubsectionMobile>
        <MobileDivider label="Features & Traits" theme={theme} />
        <section className="ct-features-mobile">
          <h2 style={visuallyHidden}>Features and Traits</h2>
          <Features />
        </section>
        <MobileDivider isEnd={true} theme={theme} />
      </SubsectionMobile>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(FeaturesMobile);
