import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class PreferencesSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-preferences-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 14 15">
        <defs>
          <polygon
            id="PreferencesSvg-path-1"
            points="13.7538 14.6039 0 14.6039 0 0.0003 13.7538 0.0003 13.7538 14.6039"
          ></polygon>
        </defs>
        <g
          id="PreferencesSvg-Sheet"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="PreferencesSvg-Character-Drop-Down"
            transform="translate(-32.000000, -327.000000)"
          >
            <g
              id="PreferencesSvg-Page-1"
              transform="translate(32.000000, 327.000000)"
            >
              <mask id="PreferencesSvg-mask-2" fill="white">
                <use xlinkHref="#PreferencesSvg-path-1"></use>
              </mask>
              <g id="PreferencesSvg-Clip-2"></g>
              <path
                d="M6.8768,9.8273 C5.4818,9.8273 4.3518,8.6963 4.3518,7.3023 C4.3518,5.9073 5.4818,4.7763 6.8768,4.7763 C8.2718,4.7763 9.4018,5.9073 9.4018,7.3023 C9.4018,8.6963 8.2718,9.8273 6.8768,9.8273 M12.3888,7.3023 C12.3888,6.7963 12.3198,6.3073 12.1918,5.8423 L13.7538,4.5083 L12.3228,2.2583 L10.4508,3.1073 C9.8868,2.6263 9.2248,2.2553 8.4978,2.0323 L8.2098,0.0003 L5.5438,0.0003 L5.2558,2.0323 C4.5288,2.2553 3.8668,2.6253 3.3028,3.1073 L1.4308,2.2583 L-0.0002,4.5083 L1.5618,5.8423 C1.4338,6.3073 1.3648,6.7963 1.3648,7.3023 C1.3648,7.8073 1.4338,8.2963 1.5618,8.7623 L-0.0002,10.0953 L1.4308,12.3463 L3.3028,11.4963 C3.8668,11.9783 4.5288,12.3483 5.2558,12.5713 L5.5438,14.6043 L8.2098,14.6043 L8.4978,12.5713 C9.2248,12.3483 9.8868,11.9783 10.4508,11.4963 L12.3228,12.3463 L13.7538,10.0953 L12.1918,8.7623 C12.3198,8.2963 12.3888,7.8073 12.3888,7.3023"
                id="Fill-1"
                fill={fillColor}
                mask="url(#PreferencesSvg-mask-2)"
              />
            </g>
          </g>
        </g>
      </BaseSvg>
    );
  }
}
