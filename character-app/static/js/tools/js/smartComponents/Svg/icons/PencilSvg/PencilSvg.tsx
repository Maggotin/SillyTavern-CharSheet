import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class PencilSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-pencil-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 15 14">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.828181 12.0217C0.625019 13.125 1.12507 13.75 2.33489 13.5284L5.177 12.8479C5.67077 12.7297 6.12217 12.4771 6.48119 12.118L13.4476 5.15165C14.3262 4.27297 14.3262 2.84835 13.4476 1.96967L12.3869 0.90901C11.5082 0.0303294 10.0836 0.0303308 9.20493 0.90901L2.23855 7.87539C1.87953 8.23441 1.62691 8.68581 1.50869 9.17959L0.828181 12.0217ZM12.3869 4.09099L11.3852 5.09272L9.26385 2.9714L10.2656 1.96967C10.5585 1.67678 11.0334 1.67678 11.3262 1.96967L12.3869 3.03033C12.6798 3.32322 12.6798 3.7981 12.3869 4.09099ZM4.56587 11.4518L2.38184 11.9748L2.90477 9.79074C2.94584 9.61921 3.03155 9.4616 3.15319 9.33389L8.20322 4.03206L10.3245 6.15338L5.02271 11.2034C4.895 11.3251 4.73739 11.4108 4.56587 11.4518Z"
          fill={fillColor}
        />
      </BaseSvg>
    );
  }
}
