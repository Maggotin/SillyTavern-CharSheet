import React from "react";

import { BaseSvgProps } from "../../BaseSvg";

export default class AnimatedLoadingRingSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    fillColor: "#EC2127",
    secondaryFillColor: "#131315",
    className: "",
  };

  render() {
    const { fillColor, secondaryFillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-animated-loading-ring-svg"];

    if (className) {
      classNames.push(className);
    }

    const htmlContent: string = `<html><head><style>* {margin:0}</style></head><body style="background-color: transparent;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring-alt">
                        <rect x="0" y="0" width="100" height="100" fill="none" class="bk"/>
                        <circle cx="50" cy="50" r="40" stroke="${secondaryFillColor}" fill="none" stroke-width="10" stroke-linecap="round"/>
                        <circle cx="50" cy="50" r="40" stroke="${fillColor}" fill="none" stroke-width="6" stroke-linecap="round">
                            <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"/>
                            <animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"/>
                        </circle>
                    </svg></body></html>`;

    return (
      <iframe
        className={classNames.join(" ")}
        frameBorder="0"
        title="loading"
        style={{ backgroundColor: "transparent" }}
        src={`data:text/html;base64,${btoa(htmlContent)}`}
      ></iframe>
    );
  }
}
