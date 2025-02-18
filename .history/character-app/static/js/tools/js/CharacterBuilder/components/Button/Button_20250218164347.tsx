import React from "react";

import { Button } from "../../character-components/es";

interface withBuilderProps {
  clsNames: Array<string>;
}
function withBuilderButton<P extends object, C>(
  WrappedComponent: React.JSXElementConstructor<P> & C
) {
  type Props = JSX.LibraryManagedAttributes<C, P>;
  return class WithBuilderButton extends React.PureComponent<
    Props & withBuilderProps
  > {
    static defaultProps = {
      clsNames: [],
    };

    render() {
      const { children, clsNames } = this.props;

      return (
        <WrappedComponent
          {...(this.props as any)}
          clsNames={[...clsNames, "builder-button"]}
        >
          {children}
        </WrappedComponent>
      );
    }
  };
}

export default withBuilderButton(Button);
