import * as React from "react";

import { SvgConstantNegativeTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asNegativeSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsNegativeSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asNegativeSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantNegativeTheme.fill,
      secondaryFillColor: SvgConstantNegativeTheme.secondaryFill,
      className: "ddbc-svg--negative",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
