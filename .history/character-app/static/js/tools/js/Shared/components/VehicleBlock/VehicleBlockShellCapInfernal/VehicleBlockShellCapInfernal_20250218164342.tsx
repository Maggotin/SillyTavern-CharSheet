import React from "react";

import { BaseSvg } from "../../character-components/es";

interface Props {
  className: string;
  invertY: boolean;
  invertX: boolean;
}
export default class VehicleBlockShellCapInfernal extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    invertY: false,
    invertX: false,
  };

  render() {
    const { className, invertY, invertX } = this.props;

    let classNames: Array<string> = [
      "ct-vehicle-block__shell-cap-infernal",
      className,
    ];

    if (invertY) {
      classNames.push("ct-vehicle-block__shell-cap--invert-y");
    }
    if (invertX) {
      classNames.push("ct-vehicle-block__shell-cap--invert-x");
    }

    return (
      <BaseSvg viewBox="0 0 2711.9 133.1" className={classNames.join(" ")}>
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="1355.95"
            y1="37.16"
            x2="1355.95"
            y2="138.66"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#562c32" />
            <stop offset="1" stopColor="#88817b" />
          </linearGradient>
        </defs>
        <polygon
          fill="#3c203c"
          points="2711.9 46.18 2711.9 133.1 0 133.1 0 46.18 37.9 76.19 308.9 76.19 1074.9 25.19 782.9 76.19 883.9 76.19 1260.38 0 1032.9 76.19 1169.9 76.19 1336.9 4.19 1253.9 76.19 1322.9 76.19 1355.9 8.19 1355.9 8.6 1356 8.19 1389 76.19 1458 76.19 1375 4.19 1542 76.19 1679 76.19 1451.52 0 1828 76.19 1929 76.19 1637 25.19 2403 76.19 2674 76.19 2711.9 46.18"
        />
        <polygon
          fill="url(#linear-gradient)"
          points="1355.9 27.19 1382.24 86.99 1486.93 86.99 1434.72 41.7 1539.77 86.99 1745.25 86.99 1620.57 45.23 1826.92 86.99 2053.61 86.99 1838.59 49.44 2402.64 86.99 2677.76 86.99 2701.1 68.51 2701.1 122.3 10.8 122.3 10.8 68.51 34.14 86.99 309.26 86.99 873.31 49.44 658.29 86.99 884.98 86.99 1091.33 45.23 966.65 86.99 1172.13 86.99 1277.18 41.7 1224.97 86.99 1329.66 86.99 1355.9 27.19"
        />
      </BaseSvg>
    );
  }
}
