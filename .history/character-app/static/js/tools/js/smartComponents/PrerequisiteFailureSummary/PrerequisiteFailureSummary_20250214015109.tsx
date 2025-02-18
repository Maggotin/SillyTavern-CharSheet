import clsx from "clsx";
import * as React from "react";

import { PrerequisiteFailure } from "@dndbeyond/character-rules-engine/es";

interface Props {
  className: string;
  failures: Array<Array<PrerequisiteFailure>>;
}

export default class PrerequisiteFailureSummary extends React.PureComponent<
  Props,
  {}
> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { failures, className } = this.props;

    let strings: string = failures
      .map((failure) =>
        failure
          .map((failureAnd) => failureAnd.data.requiredDescription)
          .reduce((acc, desc, idx) => {
            let connector: string = "";
            if (idx < failure.length - 2) {
              connector = ", ";
            } else if (idx < failure.length - 1) {
              connector = " and ";
            }
            acc += `${desc}${connector}`;
            return acc;
          }, "")
      )
      .join(" or ");
    return (
      <div className={clsx(["ddbc-prerequisite-failure-summary", className])}>
        Missing: {strings.length > 0 ? strings : "Unknown"}
      </div>
    );
  }
}
