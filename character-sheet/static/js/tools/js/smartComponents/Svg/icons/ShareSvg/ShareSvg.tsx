import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class ShareSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-share-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 50 60">
        <path
          fill={fillColor}
          d="M40.38461,0a9.61466,9.61466,0,0,0-9.61538,9.61538c0,.16527.05258.31551.0601.48077L15.74519,22.66827a9.4614,9.4614,0,0,0-6.12981-2.28366,9.61539,9.61539,0,0,0,0,19.23077,9.4614,9.4614,0,0,0,6.12981-2.28365L30.82933,49.90385c-.00752.16526-.0601.3155-.0601.48076a9.61539,9.61539,0,1,0,9.61538-9.61538,9.46142,9.46142,0,0,0-6.1298,2.28365L19.17067,30.48077c.00751-.16526.0601-.3155.0601-.48077s-.05259-.3155-.0601-.48077L34.25481,16.94711a9.46138,9.46138,0,0,0,6.1298,2.28366A9.61539,9.61539,0,1,0,40.38461,0Z"
        />
      </BaseSvg>
    );
  }
}
