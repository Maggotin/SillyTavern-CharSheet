import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

export default class GoldCoinSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className } = this.props;

    return (
      <BaseSvg viewBox="0 0 24 24" className={className}>
        <path
          d="m4 4.5c0-.27615.22385-.5.5-.5h15c.2761 0 .5.22385.5.5v1c0 .27615-.2239.5-.5.5 0 0-2 2.32653-2 6 0 3.6735 2 6 2 6 .2761 0 .5.2239.5.5v1c0 .2761-.2239.5-.5.5h-15c-.27615 0-.5-.2239-.5-.5v-1c0-.2761.22385-.5.5-.5 0 0 2-1.8673 2-6 0-4.13265-2-6-2-6-.27615 0-.5-.22385-.5-.5z"
          fill="#dd970e"
        />
        <path
          d="m9.99993 12c0-.6216-.03345-1.2128-.09414-1.7735l4.11311 1.0283c-.002.04-.0039.0802-.0056.1205l-4.07254 2.0363c.03844-.4517.05917-.9222.05917-1.4116z"
          fill="#eca825"
        />
        <path
          d="m9.79321 14.6034 4.21509-2.1076c.0516 1.5192.3351 2.8657.7046 4.0042h-5.36158c.17845-.5819.33016-1.214.44189-1.8966z"
          fill="#eca825"
        />
        <path
          d="m14.0189 11.2548-4.11311-1.0283c-.10897-1.00676-.30575-1.91549-.55447-2.7265h5.36158c-.3492 1.07581-.6215 2.3373-.694 3.7548z"
          fill="#ffb72c"
        />
        <path
          d="m6.26343 5.5h11.54557c-.1777.29323-.3708.64106-.5624 1.0399-.0702.14609-.1404.29953-.2097.4601h-9.99142c-.10248-.24281-.20889-.47037-.31689-.68278-.15543-.30571-.31301-.57786-.46516-.81722z"
          fill="#eca825"
        />
        <path
          clipRule="evenodd"
          d="m17.8089 5.5h-11.54556c.15215.23936.30973.51151.46516.81722.66607 1.31004 1.2715 3.19617 1.2715 5.68278 0 2.4866-.60543 4.3727-1.2715 5.6828-.15543.3057-.31301.5778-.46516.8172h11.54556c-.1777-.2932-.3708-.6411-.5624-1.0399-.6216-1.2941-1.2465-3.1649-1.2465-5.4601 0-2.29517.6249-4.166 1.2465-5.4601.1916-.39884.3847-.74667.5624-1.0399zm2.6911 12.5s-2-2.3265-2-6c0-3.67347 2-6 2-6 .2761 0 .5-.22385.5-.5v-2c0-.27615-.2239-.5-.5-.5h-17c-.27615 0-.5.22385-.5.5v2c0 .27615.22385.5.5.5 0 0 2 1.86735 2 6 0 4.1327-2 6-2 6-.27615 0-.5.2239-.5.5v2c0 .2761.22385.5.5.5h17c.2761 0 .5-.2239.5-.5v-2c0-.2761-.2239-.5-.5-.5z"
          fill="#c78727"
          fillRule="evenodd"
        />
        <path
          d="m8 4.25c0-.41421.33579-.75.75-.75h11c.4142 0 .75.33579.75.75s-.3358.75-.75.75h-11c-.41421 0-.75-.33579-.75-.75z"
          fill="#ffb72c"
        />
        <circle cx="6.75" cy="4.25" fill="#eca825" r=".75" />
      </BaseSvg>
    );
  }
}
