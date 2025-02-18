import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import { appEnvSelectors } from "../../../../Shared/selectors";
import SubsectionTablet from "../../../components/SubsectionTablet";
import TabletBox from "../../../components/TabletBox";
import { SheetAppState } from "../../../typings";
import Actions from "../../Actions";

interface Props extends DispatchProp {
  isReadonly: boolean;
  theme: CharacterTheme;
}
class ActionsTablet extends React.PureComponent<Props> {
  render() {
    const { theme } = this.props;

    return (
      <SubsectionTablet>
        <TabletBox theme={theme} header="Actions" className="ct-actions-tablet">
          <section>
            <h2 style={visuallyHidden}>Actions</h2>
            <Actions />
          </section>
        </TabletBox>
      </SubsectionTablet>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(ActionsTablet);
