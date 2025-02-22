import Color from "color";
import * as React from "react";

import { ThemedSvgProps } from "./hocTypings";
import { getDisplayName } from "./utils";

export function asThemedWithOpacitySvg<
  C extends React.ComponentType<React.ComponentProps<C>>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent: C) {
  return class AsThemedWithOpacitSvg extends React.PureComponent<ThemedSvgProps> {
    static displayName = `asThemedWithOpacitySvg(${getDisplayName(
      WrappedComponent
    )})`;

    static defaultProps = {
      className: "ddbc-svg--themed",
    };

    render() {
      return (
        <WrappedComponent
          {...(this.props as any)}
          fillColor={Color(this.props.theme.themeColor)
            .alpha(0.4)
            .rgb()
            .string()}
          backgroundColor={this.props.theme.backgroundColor}
        />
      );
    }
  };
}
