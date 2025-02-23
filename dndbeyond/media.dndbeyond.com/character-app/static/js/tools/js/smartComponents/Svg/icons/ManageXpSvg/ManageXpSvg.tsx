import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class ManageXpSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-manage-xp-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 16 8">
        <defs>
          <polygon
            id="ManageXpSvg-path-1"
            points="0.9639 8 7.751 8 7.751 0.0003 0.9639 0.0003"
          ></polygon>
        </defs>
        <g
          id="ManageXpSvg-Sheet"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="ManageXpSvg-Character-Drop-Down"
            transform="translate(-30.000000, -235.000000)"
          >
            <g
              id="ManageXpSvg-Page-1"
              transform="translate(30.000000, 235.000000)"
            >
              <polygon
                id="ManageXpSvg-Fill-1"
                fill={fillColor}
                points="5.733 0.00031 4.186 2.50631 2.615 0.00031 0.18 0.00031 2.794 3.89831 0 7.99931 2.447 7.99931 4.186 5.31331 5.925 7.99931 8.359 7.99931 5.576 3.88531 8.179 0.00031"
              ></polygon>
              <g
                id="ManageXpSvg-Group-4"
                transform="translate(8.000000, -0.000490)"
              >
                <mask id="ManageXpSvg-mask-2" fill="white">
                  <use xlinkHref="#ManageXpSvg-path-1"></use>
                </mask>
                <path
                  d="M4.6929,1.7393 L3.0259,1.7393 L3.0259,3.5383 L4.6929,3.5383 C5.2449,3.5383 5.6529,3.1903 5.6529,2.6513 C5.6529,2.0993 5.2449,1.7393 4.6929,1.7393 L4.6929,1.7393 Z M0.9639,0.0003 L4.9689,0.0003 C6.7679,0.0003 7.7519,1.2123 7.7519,2.6633 C7.7519,4.1023 6.7679,5.2893 4.9689,5.2893 L3.0259,5.2893 L3.0259,8.0003 L0.9639,8.0003 L0.9639,0.0003 Z"
                  id="ManageXpSvg-Fill-2"
                  fill={fillColor}
                  mask="url(#ManageXpSvg-mask-2)"
                ></path>
              </g>
            </g>
          </g>
        </g>
      </BaseSvg>
    );
  }
}
