import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../../BaseSvg";

export default class NotesSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 157 143" className={className}>
        <g fill={fillColor} transform="translate(.76)">
          <polygon points="142.167 41.629 142.167 100.538 69.905 100.538 50.269 117.033 104.465 117.033 132.742 142.167 132.742 117.033 155.52 117.033 155.52 41.629" />
          <path d="M22.7781818,120.174545 L22.7781818,87.9709091 L0,87.9709091 L0,0 L128.029091,0 L128.029091,87.9709091 L58.9090909,87.9709091 L22.7781818,120.174545 Z M11.7818182,76.1890909 L34.56,76.1890909 L34.56,94.2545455 L54.9818182,76.1890909 L117.032727,76.1890909 L117.032727,11.7818182 L12.5672727,11.7818182 L12.5672727,76.1890909 L11.7818182,76.1890909 Z" />
        </g>
      </BaseSvg>
    );
  }
}
