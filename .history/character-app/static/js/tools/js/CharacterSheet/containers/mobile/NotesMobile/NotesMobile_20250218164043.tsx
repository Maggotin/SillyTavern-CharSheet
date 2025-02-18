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
import Notes from "../../Notes";

interface Props extends DispatchProp {
  theme: CharacterTheme;
}
class NotesMobile extends React.PureComponent<Props> {
  render() {
    const { theme } = this.props;

    return (
      <SubsectionMobile className="ct-notes-mobile">
        <MobileDivider label="Notes" theme={theme} />
        <section>
          <h2 style={visuallyHidden}>Notes</h2>
          <Notes />
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

export default connect(mapStateToProps)(NotesMobile);
