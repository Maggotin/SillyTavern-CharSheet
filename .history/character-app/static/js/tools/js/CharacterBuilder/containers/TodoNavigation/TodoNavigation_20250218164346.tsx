import React from "react";
import { connect } from "react-redux";

import {
  DisabledChevronLeftSvg,
  DisabledChevronRightSvg,
  LightChevronLeftSvg,
  LightChevronRightSvg,
} from "../../character-components/es";

import { Link } from "~/components/Link";

import { appEnvSelectors } from "../../../Shared/selectors";
import { navigationConfig } from "../../config";
import { builderSelectors } from "../../selectors";
import { BuilderAppState } from "../../typings";
import { NavigationUtils } from "../../utils";

interface PrevProps {
  disabled: boolean;
}
class TodoNavigationPrev extends React.PureComponent<PrevProps> {
  static defaultProps = {
    disabled: false,
  };

  render() {
    const { disabled } = this.props;

    let conClassNames: Array<string> = [
      "builder-navigation-large-action",
      "builder-navigation-large-action-prev",
    ];
    if (disabled) {
      conClassNames.push("builder-navigation-large-action-disabled");
      conClassNames.push("builder-navigation-large-action-prev-disabled");
    }

    return (
      <div className={conClassNames.join(" ")}>
        <div className="builder-navigation-large-action-icon">
          {disabled ? <DisabledChevronLeftSvg /> : <LightChevronLeftSvg />}
        </div>
        <div className="builder-navigation-large-action-text">Prev</div>
      </div>
    );
  }
}

interface NextProps {
  disabled: boolean;
}
class TodoNavigationNext extends React.PureComponent<NextProps> {
  static defaultProps = {
    disabled: false,
  };

  render() {
    const { disabled } = this.props;

    let conClassNames: Array<string> = [
      "builder-navigation-large-action",
      "builder-navigation-large-action-next",
    ];
    if (disabled) {
      conClassNames.push("builder-navigation-large-action-disabled");
      conClassNames.push("builder-navigation-large-action-next-disabled");
    }

    return (
      <div className={conClassNames.join(" ")}>
        <div className="builder-navigation-large-action-text">Next</div>
        <div className="builder-navigation-large-action-icon">
          {disabled ? <DisabledChevronRightSvg /> : <LightChevronRightSvg />}
        </div>
      </div>
    );
  }
}

interface Props {
  prevRouteDef: any;
  nextRouteDef: any;
  builderMethod: string | null;
  isMobile: boolean;
  characterId: number | null;
}
class TodoNavigation extends React.PureComponent<Props> {
  handleNavClick = (): void => {
    window.scrollTo(0, 0);
  };

  renderNonMobileUi = (): React.ReactNode => {
    const { prevRouteDef, nextRouteDef, characterId } = this.props;

    return (
      <div className="builder-navigation-large">
        {prevRouteDef !== null ? (
          <Link
            className="builder-navigation-large-link"
            href={prevRouteDef.path.replace(":characterId", characterId)}
            onClick={this.handleNavClick}
            useRouter
          >
            <TodoNavigationPrev />
          </Link>
        ) : (
          <div className="builder-navigation-large-link">
            <TodoNavigationPrev disabled={true} />
          </div>
        )}
        {nextRouteDef !== null ? (
          <Link
            className="builder-navigation-large-link"
            href={nextRouteDef.path.replace(":characterId", characterId)}
            onClick={this.handleNavClick}
            useRouter
          >
            <TodoNavigationNext />
          </Link>
        ) : (
          <div className="builder-navigation-large-link">
            <TodoNavigationNext disabled={true} />
          </div>
        )}
      </div>
    );
  };

  renderMobileUi = (): React.ReactNode => {
    const { prevRouteDef, nextRouteDef, characterId } = this.props;

    return (
      <div className="builder-navigation">
        {prevRouteDef !== null ? (
          <Link
            className="builder-navigation-link"
            href={prevRouteDef.path.replace(":characterId", characterId)}
            onClick={this.handleNavClick}
            useRouter
          >
            &lt; Prev
          </Link>
        ) : (
          <div className="builder-navigation-link builder-navigation-link-disabled">
            &lt; Prev
          </div>
        )}
        {nextRouteDef !== null ? (
          <Link
            className="builder-navigation-link"
            href={nextRouteDef.path.replace(":characterId", characterId)}
            onClick={this.handleNavClick}
            useRouter
          >
            Next &gt;
          </Link>
        ) : (
          <div className="builder-navigation-link builder-navigation-link-disabled">
            Next &gt;
          </div>
        )}
      </div>
    );
  };

  render() {
    const { isMobile, builderMethod } = this.props;

    if (builderMethod === null) {
      return null;
    }

    return isMobile ? this.renderMobileUi() : this.renderNonMobileUi();
  }
}

function mapStateToProps(state: BuilderAppState, ownProps): Props {
  const currentPath = ownProps.pathname;
  const characterId = ownProps.characterId;
  const currentRouteDef = navigationConfig.getCurrentRouteDef(currentPath);

  let prevRouteDef, nextRouteDef;
  if (currentRouteDef === null) {
    prevRouteDef = null;
    nextRouteDef = null;
  } else {
    prevRouteDef = NavigationUtils.getAvailablePrevRoute(
      currentRouteDef,
      state
    );
    nextRouteDef = NavigationUtils.getAvailableNextRoute(
      currentRouteDef,
      state
    );
  }

  return {
    prevRouteDef,
    nextRouteDef,
    builderMethod: builderSelectors.getBuilderMethod(state),
    isMobile: appEnvSelectors.getIsMobile(state),
    characterId,
  };
}

export default connect(mapStateToProps)(TodoNavigation);
