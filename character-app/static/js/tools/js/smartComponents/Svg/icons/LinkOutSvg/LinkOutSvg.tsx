import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class LinkOutSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-link-out-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 18 18">
        <path
          d="M16.7068 1.293C16.8028 1.389 16.8758 1.5 16.9248 1.619C16.9728 1.735 16.9998 1.863 16.9998 1.997V2V7C16.9998 7.553 16.5518 8 15.9998
                 8C15.4478 8 14.9998 7.553 14.9998 7V4.414L8.7068 10.707C8.5118 10.902 8.2558 11 7.9998 11C7.7438 11 7.4878 10.902 7.2928 10.707C6.9028 10.316
                 6.9028 9.683 7.2928 9.293L13.5858 3H10.9998C10.4478 3 9.9998 2.553 9.9998 2C9.9998 1.447 10.4478 1 10.9998 1H15.9998H16.0028C16.1368 1 16.2648
                 1.027 16.3808 1.075C16.4998 1.124 16.6108 1.197 16.7068 1.293ZM12 10.9999C12 10.4469 12.448 9.9999 13 9.9999C13.552 9.9999 14 10.4469 14
                 10.9999V15.9999C14 16.5529 13.552 16.9999 13 16.9999H2C1.448 16.9999 1 16.5529 1 15.9999V4.9999C1 4.4469 1.448 3.9999 2 3.9999H7C7.552
                 3.9999 8 4.4469 8 4.9999C8 5.5529 7.552 5.9999 7 5.9999H3V14.9999H12V10.9999Z"
          fill={fillColor}
        />
      </BaseSvg>
    );
  }
}
