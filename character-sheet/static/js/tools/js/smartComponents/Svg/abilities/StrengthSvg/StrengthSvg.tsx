import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

export default class StrengthSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor, secondaryFillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 35.11 37.7" className={className}>
        <path
          fill={fillColor}
          d="M22.23,9.42a7.43,7.43,0,0,1,.24,4.07c4.91.71,6.94,4.19,7.33,6.13l.31,1.54-1.54.31a13.16,13.16,0,0,1-2.62.27h0a11.71,11.71,0,0,1-1.86-.15l.76,1.1a8.79,8.79,0,0,1,.2,9,8.83,8.83,0,0,1-1,1.46C28.5,34.87,27,37.7,31,37.7s6.91-24.39,0-27.49C29.34,9.27,24.62,9.18,22.23,9.42Z"
        />
        <path
          fill={fillColor}
          d="M8.34,12.46l3.4-2.82C8.38,9.27.45,1.55.7,1.91,1.78,7.79,8.34,12.46,8.34,12.46Z"
        />
        <path
          fill={fillColor}
          d="M28.47,19.93s-1.05-5.21-8.05-5c0,0,2.73-4.68-2.25-9.32C13,.82,3.57,0,3.57,0S16.34,6.63,14.9,11.22c0,0-6.06,2.36-6.73,5.78s-1.41,5.12-6.36,8.32c0,0-2,1.88-1.79,2.89s5.12,6.7,7.48,6.52,7.7-1.79,11.73-.88,7.35-6.26,4.55-10.24a34.73,34.73,0,0,1-3.37-5.38S23.3,21,28.47,19.93Z"
        />
        <path
          fill={secondaryFillColor}
          d="M10.52,21.8a6.75,6.75,0,0,1,5.53-5s-1.81.95-1.87,1.36,1,1.45-.26,2.73C12.38,22.39,11.17,19.78,10.52,21.8Z"
        />
      </BaseSvg>
    );
  }
}
