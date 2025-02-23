import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../../BaseSvg";

export default class ProficienciesSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 145 144" className={className}>
        <defs>
          <polygon
            id="icon---prof@2x-a"
            points=".789 .79 42.018 .79 42.018 41.998 .789 41.998"
          />
          <polygon
            id="icon---prof@2x-c"
            points="0 0 124.418 0 124.418 124.416 0 124.416"
          />
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(102 102)">
            <mask id="icon---prof@2x-b" fill="#fff">
              <use xlinkHref="#icon---prof@2x-a" />
            </mask>
            <path
              fill={fillColor}
              d="M38.571,38.5722 C36.315,40.8342 33.273,41.9982 30.315,41.9982 C27.357,41.9982 24.315,40.8342 22.059,38.5722 L0.789,17.3082 C7.185,12.7902 12.789,7.1802 17.307,0.7902 L38.571,22.0602 C43.173,26.6562 43.173,33.9762 38.571,38.5722"
              mask="url(#icon---prof@2x-b)"
            />
          </g>
          <path
            fill={fillColor}
            d="M66.1038 73.8924L58.3098 73.8924 52.4478 38.6784C51.4398 32.6484 56.0898 27.1524 62.2098 27.1524 68.3238 27.1524 72.9798 32.6484 71.9718 38.6784L66.1038 73.8924zM70.0008 89.4726C70.0008 93.7746 66.5088 97.2606 62.2068 97.2606 57.9048 97.2606 54.4188 93.7746 54.4188 89.4726 54.4188 85.1706 57.9048 81.6786 62.2068 81.6786 66.5088 81.6786 70.0008 85.1706 70.0008 89.4726"
          />
          <mask id="icon---prof@2x-d" fill="#fff">
            <use xlinkHref="#icon---prof@2x-c" />
          </mask>
          <path
            fill={fillColor}
            d="M108.6198,62.25 C108.6198,87.762 87.7578,108.618 62.1678,108.618 C36.6558,108.618 15.7998,87.762 15.7998,62.25 C15.7998,36.654 36.6558,15.798 62.1678,15.798 C87.7578,15.798 108.6198,36.654 108.6198,62.25 M62.1678,0 C27.8838,0 -0.0042,27.882 -0.0042,62.166 C-0.0042,96.534 27.8838,124.416 62.1678,124.416 C96.5298,124.416 124.4178,96.534 124.4178,62.166 C124.4178,27.882 96.5298,0 62.1678,0"
            mask="url(#icon---prof@2x-d)"
          />
        </g>
      </BaseSvg>
    );
  }
}
