import React from "react";

import { AnimatedLoadingRingSvg } from "@dndbeyond/character-components/es";

interface Props {
  isFinished: boolean;
  hideDelay: number;
}
interface State {
  isVisible: boolean;
}
export default class LoadingBlocker extends React.PureComponent<Props, State> {
  static defaultProps = {
    hideDelay: 2000,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isVisible: !props.isFinished,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { isFinished, hideDelay } = this.props;

    if (!prevProps.isFinished && isFinished) {
      setTimeout(() => {
        this.setState({
          isVisible: false,
        });
      }, hideDelay);
    }
  }

  render() {
    const { isVisible } = this.state;
    const { isFinished } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <div
        className={`ct-loading-blocker ${
          isFinished ? " ct-loading-blocker--finished" : ""
        }`}
      >
        <div className="ct-loading-blocker__logo" />
        <AnimatedLoadingRingSvg className="ct-loading-blocker__anim" />
      </div>
    );
  }
}
