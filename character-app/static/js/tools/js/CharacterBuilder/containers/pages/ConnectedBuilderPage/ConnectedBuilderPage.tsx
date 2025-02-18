import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

import { navigationConfig } from "../../../config";
import { BuilderAppState } from "../../../typings";
import { NavigationUtils } from "../../../utils";

interface Props {
  isPageAccessible: boolean;
  redirectRoute?: string | null;
}
const BuilderPage = (Wrapped) =>
  class extends React.PureComponent<Props> {
    render() {
      const { isPageAccessible, redirectRoute } = this.props;

      if (!isPageAccessible && redirectRoute) {
        return <Navigate to={redirectRoute} />;
      }

      return (
        <div>
          <Wrapped {...this.props} />
        </div>
      );
    }
  };

const ConnectedBuilderPage = (
  Wrapped,
  routeKey,
  wrappedMapStateToProps = (state: BuilderAppState): any => ({})
) => {
  function mapStateToProps(state: BuilderAppState) {
    // const isPageAccessible = checkIsRouteAccessible(routeKey, state);

    const isPageAccessible = NavigationUtils.checkStdBuilderPageRequirements(
      navigationConfig.getRouteDef(routeKey),
      state
    );

    return {
      ...wrappedMapStateToProps(state),
      isPageAccessible,
      redirectRoute: isPageAccessible
        ? null
        : NavigationUtils.getAvailableRouteRedirect(routeKey, state),
    };
  }

  return connect(mapStateToProps)(BuilderPage(Wrapped));
};

export default ConnectedBuilderPage;
