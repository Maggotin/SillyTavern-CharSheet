import * as React from "react";

import { SvgConstantBuilderTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asBuilderSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsBuilderSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asBuilderSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantBuilderTheme.fill,
      secondaryFillColor: SvgConstantBuilderTheme.secondaryFill,
      className: "ddbc-svg--builder",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
