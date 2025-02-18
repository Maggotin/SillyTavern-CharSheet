import React from "react";
import { connect } from "react-redux";

import { syncTransactionSelectors } from "../../character-rules-engine/es";

import { BuilderAppState } from "../../typings";
import { SyncBlockerLoadingPlaceholder } from "./SynchronousBlockerLoadingPlaceholder";

let showBlockerTimerId: number;
let hideBlockerTimerId: number;

interface Props {
  waitDelayToShow: number;
  waitDelayToHide: number;
  className: string;
  syncActive: boolean;
}
interface State {
  showBlocker: boolean;
  transitioning: boolean;
}
class SynchronousBlocker extends React.PureComponent<Props, State> {
  static defaultProps = {
    waitDelayToShow: 300,
    waitDelayToHide: 0,
    className: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      showBlocker: false,
      transitioning: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { syncActive, waitDelayToShow, waitDelayToHide } = this.props;

    if (syncActive === prevProps.syncActive) {
      return;
    }

    if (prevState.transitioning) {
      return;
    }

    if (syncActive) {
      window.clearTimeout(hideBlockerTimerId);
      this.setState({
        transitioning: true,
      });
      showBlockerTimerId = window.setTimeout(() => {
        this.setState({
          showBlocker: true,
          transitioning: false,
        });
      }, waitDelayToShow);
    } else {
      window.clearTimeout(showBlockerTimerId);
      if (waitDelayToHide) {
        this.setState({
          transitioning: true,
        });
        hideBlockerTimerId = window.setTimeout(() => {
          this.setState({
            showBlocker: false,
            transitioning: false,
          });
        }, waitDelayToHide);
      } else {
        this.setState({
          showBlocker: false,
        });
      }
    }
  }

  handleOverlayClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
  };

  renderContent = (): React.ReactNode => {
    const { children } = this.props;

    if (children) {
      return children;
    }

    return <SyncBlockerLoadingPlaceholder />;
  };

  render() {
    const { transitioning } = this.state;
    const { syncActive, className } = this.props;

    const classNames: Array<string> = ["sync-blocker", className];
    if (syncActive) {
      classNames.push("sync-blocker-active");
    } else {
      classNames.push("sync-blocker-inactive");
    }
    if (transitioning) {
      classNames.push("sync-blocker-transition-in-out");
    }

    return (
      <div className={classNames.join(" ")} onClick={this.handleOverlayClick}>
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state: BuilderAppState) {
  return {
    syncActive: syncTransactionSelectors.getActive(state),
  };
}

export default connect(mapStateToProps)(SynchronousBlocker);
