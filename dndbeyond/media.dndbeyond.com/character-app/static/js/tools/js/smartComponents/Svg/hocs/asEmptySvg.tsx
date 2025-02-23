import * as React from "react";

import { SvgConstantEmptyTheme } from "../SvgConstants";
import { InjectedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asEmptySvg<
  C extends React.ComponentType<React.ComponentProps<C> & InjectedSvgProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsEmptySvg extends React.PureComponent<
    ResolvedProps & InjectedSvgProps
  > {
    static displayName = `asEmptySvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      fillColor: SvgConstantEmptyTheme.fill,
      secondaryFillColor: SvgConstantEmptyTheme.secondaryFill,
      className: "ddbc-svg--empty",
    };

    render() {
      return <WrappedComponent {...(this.props as any)} />;
    }
  };
}
