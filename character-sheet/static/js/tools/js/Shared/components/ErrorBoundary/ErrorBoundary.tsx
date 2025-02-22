import React from "react";

import { Link } from "~/components/Link";

import config from "../../../config";
import { ErrorUtils } from "../../utils";

interface Props {}
interface State {
  hasError: boolean;
  errorId: string | null;
}
export default class ErrorBoundary extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, componentInfo: React.ErrorInfo) {
    console.error("ERROR >>>", error);
    ErrorUtils.dispatchException(error, {
      componentInfo,
    });
  }

  handleBack = (): void => {
    window.history.back();
  };

  renderErrorUi = (): React.ReactNode => {
    const { errorId } = this.state;

    return (
      <div className="ct-error-boundary">
        <div className="ct-error-boundary__header">
          <div className="ct-error-boundary__heading">
            A beholder has appeared and ruined everything
          </div>
        </div>
        <div className="ct-error-boundary__content">
          <p>
            The error that summoned it has been logged and the D&amp;D Beyond
            team will hit the forge to make repairs.{" "}
            <Link href="#" onClick={this.handleBack}>
              Back to Previous Page
            </Link>
          </p>
        </div>
        <div className="ct-error-boundary__reporting">
          {errorId !== null && (
            <p>
              Error Code:{" "}
              <span className="ct-error-boundary__code">{errorId}</span>
            </p>
          )}
          <p>
            Version:{" "}
            <span className="ct-error-boundary__code">{config.version}</span>
          </p>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.renderErrorUi();
    }
    return this.props.children;
  }
}
