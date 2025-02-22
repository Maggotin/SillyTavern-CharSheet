import * as React from "react";

import { SvgConstantDisabledTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asDisabledSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsDisabledSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asDisabledSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantDisabledTheme.fill,
      secondaryFillColor: SvgConstantDisabledTheme.secondaryFill,
      className: "ddbc-svg--disabled",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
