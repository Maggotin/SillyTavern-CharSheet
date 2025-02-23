import * as React from "react";

import { SvgConstantDarkModePositiveTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asDarkModePositiveSvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsDarkModePositiveSvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asDarkModePositiveSvg(${getDisplayName(
      WrappedComponent
    )})`;

    static defaultProps = {
      fillColor: SvgConstantDarkModePositiveTheme.fill,
      secondaryFillColor: SvgConstantDarkModePositiveTheme.secondaryFill,
      className: "ddbc-svg--positive",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
