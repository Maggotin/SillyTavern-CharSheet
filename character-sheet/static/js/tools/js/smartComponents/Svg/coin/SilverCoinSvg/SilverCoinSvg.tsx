import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

export default class SilverCoinSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className } = this.props;

    return (
      <BaseSvg viewBox="0 0 24 24" className={className}>
        <path
          clipRule="evenodd"
          d="m2.49372 21c-.3779 0-.61528-.4138-.42875-.7473l9.50623-16.99932c.189-.33784.6686-.33784.8576 0l9.5062 16.99932c.1866.3335-.0508.7473-.4287.7473zm9.50628-5c.6904 0 1.25-.5596 1.25-1.25s-.5596-1.25-1.25-1.25-1.25.5596-1.25 1.25.5596 1.25 1.25 1.25z"
          fill="#a59e98"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="m2.06497 20.2527c-.18653.3335.05085.7473.42875.7473h19.01258c.3779 0 .6153-.4138.4287-.7473l-9.5062-16.99932c-.189-.33784-.6686-.33784-.8576 0zm10.15323-12.30742c-.0954-.17063-.341-.17063-.4364 0l-5.69332 10.18092c-.09319.1666.02727.372.21819.372h11.38663c.191 0 .3114-.2054.2182-.372z"
          fill="#99938d"
          fillRule="evenodd"
        />
        <path
          d="m12 17.25c1.3807 0 2.5-1.1193 2.5-2.5 0-.1714-.0173-.3388-.0501-.5005.1919.3752.3001.8002.3001 1.2505 0 1.5188-1.2312 2.75-2.75 2.75s-2.75-1.2312-2.75-2.75c0-.4503.10824-.8753.30011-1.2505-.03286.1617-.05011.3291-.05011.5005 0 1.3807 1.1193 2.5 2.5 2.5z"
          fill="#857d76"
        />
        <circle cx="12" cy="14.75" fill="#a59e98" fillOpacity=".5" r="1.25" />
        <path
          d="m11.7819 7.94529c.0954-.17064.341-.17064.4364 0l5.6933 10.18091c.0932.1666-.0273.372-.2182.372h-.133l-5.3421-9.55291c-.0954-.17064-.341-.17064-.4364 0l-5.34216 9.55291h-.13298c-.19093 0-.31139-.2054-.2182-.372z"
          fill="#b5ada7"
        />
        <path
          d="m11.6724 11.3586c-.2371-.4211.1496-1.88397.5707-2.12106.1389-.07818.7171.84136.9542 1.26246l.5249 1.1414c.2371.4211.0879.9547-.3331 1.1918-.4211.2371-.9547.0879-1.1918-.3332z"
          fill="#b5ada7"
        />
        <path
          d="m11.4292 5.62102c-.2371-.42109.1496-1.88394.5707-2.12103.1389-.07818.7172.84137.9542 1.26246l3.0664 5.44615c.2371.4211.0879.9546-.3332 1.1917s-.9547.0879-1.1917-.3332z"
          fill="#cec6bf"
        />
      </BaseSvg>
    );
  }
}
