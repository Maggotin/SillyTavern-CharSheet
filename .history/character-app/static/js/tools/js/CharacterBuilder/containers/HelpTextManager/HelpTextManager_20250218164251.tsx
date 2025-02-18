import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterConfiguration,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { builderActions } from "../../actions";
import { BuilderAppState } from "../../typings";

interface Props extends DispatchProp {
  configuration: CharacterConfiguration;
}
interface State {
  enabled: boolean;
}
class HelpTextManager extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const { configuration } = props;

    this.state = {
      enabled:
        configuration.showHelpText === null
          ? false
          : configuration.showHelpText,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { configuration } = this.props;

    this.setState({
      enabled:
        configuration.showHelpText === null
          ? false
          : configuration.showHelpText,
    });
  }

  handleHelpTextChange = (evt: React.MouseEvent): void => {
    const { dispatch } = this.props;
    const { enabled } = this.state;

    const isEnabled = !enabled;
    this.setState({
      enabled: isEnabled,
    });

    dispatch(builderActions.showHelpTextSet(isEnabled));
  };

  render() {
    const { enabled } = this.state;

    let classNames: Array<string> = ["help-text-manager"];
    if (enabled) {
      classNames.push("help-text-manager-enabled");
    } else {
      classNames.push("help-text-manager-disabled");
    }

    return (
      <div className={classNames.join(" ")} onClick={this.handleHelpTextChange}>
        <div className="help-text-manager-icon" />
      </div>
    );
  }
}

function mapStateToProps(state: BuilderAppState) {
  return {
    configuration: rulesEngineSelectors.getCharacterConfiguration(state),
  };
}

export default connect(mapStateToProps)(HelpTextManager);
