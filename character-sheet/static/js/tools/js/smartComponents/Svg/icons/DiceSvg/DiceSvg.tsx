import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class DiceSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-dice-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 16 18">
        <path
          d="M8 0L0 4.4702V13.5298L8 18L15.4286 13.8278L16 13.4702V4.4702L8 0ZM6.85714 4.94702L3.48571 10.1921L1.37143 5.42384L6.85714 4.94702ZM4.57143
                    10.7285L8 5.30464L11.4286 10.7285H4.57143ZM12.4571 10.1921L9.14286 4.94702L14.5714 5.36424L12.4571 10.1921ZM8.57143 1.66887L12.8 4.05298L8.57143
                    3.69536V1.66887ZM7.42857 1.66887V3.69536L3.2 4.05298L7.42857 1.66887ZM1.14286 7.62914L2.68571 11.2053L1.14286 12.1589V7.62914ZM1.71429 13.1722L3.25714
                    12.2185L5.77143 15.4967L1.71429 13.1722ZM4.57143 11.9205H10.8571L8 16.3907L4.57143 11.9205ZM10.2286 15.4371L12.7429 12.1589L14.2857 13.1126L10.2286
                    15.4371ZM13.4286 11.2649L13.3143 11.2053L14.8571 7.62914V12.1589L13.4286 11.2649Z"
          fill={fillColor}
        />
      </BaseSvg>
    );
  }
}
