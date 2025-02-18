import React from "react";

import { CharacterTheme } from "../../character-rules-engine/es";

interface Props {
  StyleComponent: React.ComponentType<any>;
  theme: CharacterTheme;
  className: string;
}
export default class BoxBackground extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { StyleComponent, theme, className } = this.props;

    let classNames: Array<string> = ["ddbc-box-background", className];

    return (
      <div className={classNames.join(" ")}>
        <StyleComponent theme={theme} />
      </div>
    );
  }
}
