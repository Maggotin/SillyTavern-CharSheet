import * as React from "react";

import { SvgConstantLightTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asLightSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsLightSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asLightSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantLightTheme.fill,
      secondaryFillColor: SvgConstantLightTheme.secondaryFill,
      className: "ddbc-svg--light",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
