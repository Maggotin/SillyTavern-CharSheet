import * as React from "react";

import { SvgConstantGrayTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asGraySvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsGraySvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asGraySvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantGrayTheme.fill,
      secondaryFillColor: SvgConstantGrayTheme.secondaryFill,
      className: "ddbc-svg--gray",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
