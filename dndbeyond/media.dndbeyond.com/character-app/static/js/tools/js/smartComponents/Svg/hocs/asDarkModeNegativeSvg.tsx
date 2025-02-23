import * as React from "react";

import { SvgConstantDarkModeNegativeTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asDarkModeNegativeSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsDarkModeNegativeSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asDarkModeNegativeSvg(${getDisplayName(
      WrappedComponent
    )})`;

    static defaultProps = {
      fillColor: SvgConstantDarkModeNegativeTheme.fill,
      secondaryFillColor: SvgConstantDarkModeNegativeTheme.secondaryFill,
      className: "ddbc-svg--positive",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
