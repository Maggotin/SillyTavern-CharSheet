import * as React from "react";

import { SvgConstantDarkTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asDarkSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsDarkSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asDarkSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantDarkTheme.fill,
      secondaryFillColor: SvgConstantDarkTheme.secondaryFill,
      className: "ddbc-svg--dark",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
