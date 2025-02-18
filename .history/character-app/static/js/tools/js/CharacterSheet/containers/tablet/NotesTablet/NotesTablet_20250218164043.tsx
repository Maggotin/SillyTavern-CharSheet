import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import SubsectionTablet from "../../../components/SubsectionTablet";
import TabletBox from "../../../components/TabletBox";
import { SheetAppState } from "../../../typings";
import Notes from "../../Notes";

interface Props extends DispatchProp {
  theme: CharacterTheme;
}
class NotesTablet extends React.PureComponent<Props> {
  render() {
    const { theme } = this.props;

    return (
      <SubsectionTablet>
        <TabletBox header="Notes" className="ct-notes-tablet" theme={theme}>
          <section>
            <h2 style={visuallyHidden}>Notes</h2>
            <Notes />
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

export default connect(mapStateToProps)(NotesTablet);
