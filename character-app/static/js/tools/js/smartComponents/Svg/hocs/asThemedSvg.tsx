import * as React from "react";

import { ThemedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asThemedSvg<
  C extends React.ComponentType<React.ComponentProps<C>>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsThemedSvg extends React.PureComponent<ThemedSvgProps> {
    static displayName = `asThemedSvg(${getDisplayName(WrappedComponent)})`;

    static defaultProps = {
      className: "ddbc-svg--themed",
    };

    render() {
      return (
        <WrappedComponent
          {...(this.props as any)}
          fillColor={this.props.theme.themeColor}
          backgroundColor={this.props.theme.backgroundColor}
        />
      );
    }
  };
}
