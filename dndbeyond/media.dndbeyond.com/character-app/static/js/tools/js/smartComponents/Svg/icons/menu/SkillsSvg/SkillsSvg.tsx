import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../../BaseSvg";

export default class SkillsSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 146 144" className={className}>
        <g fill={fillColor}>
          <polygon points="70.124 83.965 64.12 107.979 40.107 113.983 64.12 119.986 70.124 144 76.127 119.986 100.141 113.983 76.127 107.979" />
          <polygon points="112.148 20.442 120.525 45.571 145.654 53.948 120.525 62.324 112.148 87.454 103.772 62.324 78.642 53.948 103.772 45.571" />
          <path d="M27.7357796,31.981862 L37.104806,0.751773927 L46.4738324,31.981862 L73.3633378,41.940938 L46.4738324,51.9000141 L37.104806,83.1301022 L27.7357796,51.9000141 L0.846274211,41.940938 L27.7357796,31.981862 Z M37.104806,23.0953598 L32.9660154,36.8913285 L19.3320697,41.940938 L32.9660154,46.9905476 L37.104806,60.7865163 L41.2435966,46.9905476 L54.8775423,41.940938 L41.2435966,36.8913285 L37.104806,23.0953598 Z" />
        </g>
      </BaseSvg>
    );
  }
}
