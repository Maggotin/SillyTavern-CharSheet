import React from "react";

import {
  Constants,
  CharacterTraits,
} from "../../rules-engine/es";

interface Props {
  traits: CharacterTraits;
  traitKey: string;
  label?: string;
  fallback: string;
  onClick?: (traitKey: string) => void;
}
export default class TraitContent extends React.PureComponent<Props> {
  static defaultProps = {
    fallback: "+ Add",
  };

  handleTraitShow = (evt: React.MouseEvent): void => {
    const { traitKey, onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(traitKey);
    }
  };

  render() {
    const { traits, traitKey, label, fallback } = this.props;

    let traitData = traits[traitKey as Constants.TraitTypeEnum];
    let hasContent: boolean = !!traitData;
    let content: string = !!traitData ? traitData : fallback;

    let classNames: Array<string> = ["ct-trait-content"];
    if (!hasContent) {
      classNames.push("ct-trait-content--no-content");
    }

    return (
      <div className={classNames.join(" ")} onClick={this.handleTraitShow}>
        {label && <div className="ct-trait-content__heading">{label}</div>}
        <div className="ct-trait-content__content">{content}</div>
      </div>
    );
  }
}
