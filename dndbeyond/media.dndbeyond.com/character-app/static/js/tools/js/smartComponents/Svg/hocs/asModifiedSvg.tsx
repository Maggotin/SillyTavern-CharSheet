import * as React from "react";

import { SvgConstantModifiedTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asModifiedSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsModifiedSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asModifiedSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantModifiedTheme.fill,
      secondaryFillColor: SvgConstantModifiedTheme.secondaryFill,
      className: "ddbc-svg--modified",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
