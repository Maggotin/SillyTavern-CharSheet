import clsx from "clsx";
import React from "react";

interface Props {
  className?: string,
}
export default class EditorBox extends React.PureComponent<Props> {
  render() {
    const { children, className } = this.props;

    return <div className={clsx(["ct-editor-box", className])}>{children}</div>;
  }
}
