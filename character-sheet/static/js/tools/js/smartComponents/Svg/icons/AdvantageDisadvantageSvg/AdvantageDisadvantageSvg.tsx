import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class AdvantageDisadvantageSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    fillColor: "#3BAE1D",
    secondaryFillColor: "#C53131",
  };

  render() {
    const { fillColor, secondaryFillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-advantage-disadvantage-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 24 24">
        <g id="svgPathAdvantage" fill={fillColor}>
          <path d="M10.241 0.13251L14.5471 2.50087L11.6548 10.1452L9.69909 5H7.3009L3.5 15H5.89819L6.66742 12.8676H10.3326L10.4752 13.2629L6.90213 22.7064L5.91835 19.7551L0.25904 16.6425C0.0992659 16.5546 0 16.3867 0 16.2043V5.79562C0 5.61327 0.0992665 5.44539 0.259041 5.35751L9.75904 0.13251C9.90908 0.0499869 10.0909 0.0499871 10.241 0.13251Z" />
          <path d="M9.63876 10.8529L8.50754 7.73529L7.37632 10.8529H9.63876Z" />
        </g>
        <g id="svgPathDisadvantage" fill={secondaryFillColor}>
          <path d="M13.7592 23.8675L9.45312 21.4991L12.5002 13.4457V18H15.8054C19.0058 18 21.0002 15.9265 21.0002 13C21.0002 10.0735 19.0058 8 15.8054 8H14.5606L17.0981 1.29358L18.0818 4.24492L23.7411 7.35754C23.9009 7.44542 24.0002 7.61331 24.0002 7.79565V18.2044C24.0002 18.3867 23.9009 18.5546 23.7411 18.6425L14.2411 23.8675C14.0911 23.95 13.9093 23.95 13.7592 23.8675Z" />
          <path d="M18.7275 13C18.7275 11.3088 17.6916 10.0147 15.7899 10.0147H14.6956V15.9853H15.7899C17.6916 15.9853 18.7275 14.7059 18.7275 13Z" />
        </g>
      </BaseSvg>
    );
  }
}
