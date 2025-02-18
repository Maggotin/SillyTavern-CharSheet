import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import MobileDivider from "../../../components/MobileDivider";
import SubsectionMobile from "../../../components/SubsectionMobile";
import { SheetAppState } from "../../../typings";
import Actions from "../../Actions";

interface Props extends DispatchProp {
  theme: CharacterTheme;
}
class ActionsMobile extends React.PureComponent<Props> {
  render() {
    const { theme } = this.props;

    return (
      <SubsectionMobile>
        <section className="ct-actions-mobile">
          <h2 style={visuallyHidden}>Actions</h2>
          <MobileDivider label="Actions" theme={theme} />
          <Actions showNotes={false} />
          <MobileDivider isEnd={true} theme={theme} />
        </section>
      </SubsectionMobile>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(ActionsMobile);
