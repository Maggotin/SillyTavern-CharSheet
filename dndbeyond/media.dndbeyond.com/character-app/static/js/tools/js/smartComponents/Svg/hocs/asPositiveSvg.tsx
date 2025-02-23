import * as React from "react";

import { SvgConstantPositiveTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asPositiveSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsPositiveSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asPositiveSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantPositiveTheme.fill,
      secondaryFillColor: SvgConstantPositiveTheme.secondaryFill,
      className: "ddbc-svg--positive",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
