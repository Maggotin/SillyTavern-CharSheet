import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import SubsectionTablet from "../../../components/SubsectionTablet";
import TabletBox from "../../../components/TabletBox";
import { SheetAppState } from "../../../typings";
import Features from "../../Features";

interface Props extends DispatchProp {
  theme: CharacterTheme;
}
class FeaturesTablet extends React.PureComponent<Props> {
  render() {
    const { theme } = this.props;

    return (
      <SubsectionTablet className="ct-features-tablet">
        <TabletBox
          header="Features & Traits"
          className="ct-actions-tablet"
          theme={theme}
        >
          <section>
            <h2 style={visuallyHidden}>Features and Traits</h2>
            <Features />
          </section>
        </TabletBox>
      </SubsectionTablet>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(FeaturesTablet);
