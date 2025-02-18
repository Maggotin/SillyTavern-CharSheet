import * as React from "react";

import {
  CharacterTheme,
  Constants,
  DataOrigin,
  EntityUtils,
} from "../../rules-engine/es";

import { ItemName } from "~/components/ItemName";

interface Props {
  dataOrigin: DataOrigin;
  tryParent?: boolean;
  onClick?: (dataOrigin: DataOrigin) => void;
  className: string;
  theme: CharacterTheme;
}

export default class DataOriginName extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, dataOrigin } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(dataOrigin);
    }
  };

  render() {
    const { dataOrigin, className, tryParent } = this.props;

    let displayNode: React.ReactNode;

    switch (dataOrigin.type) {
      case Constants.DataOriginTypeEnum.ITEM:
        displayNode = <ItemName item={dataOrigin.primary} />;
        break;

      default:
        displayNode = EntityUtils.getDataOriginName(
          dataOrigin,
          undefined,
          tryParent
        );
    }

    let classNames: Array<string> = [className, "ddbc-data-origin-name"];

    return (
      <span className={classNames.join(" ")} onClick={this.handleClick}>
        {displayNode}
      </span>
    );
  }
}
