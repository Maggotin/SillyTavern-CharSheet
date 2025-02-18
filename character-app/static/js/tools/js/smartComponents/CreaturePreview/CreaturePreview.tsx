import * as React from "react";

import {
  Creature,
  CreatureUtils,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

interface Props {
  creature: Creature;
  ruleData: RuleData;
  onClick?: (creature: Creature) => void;
}
export class CreaturePreview extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, creature } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(creature);
    }
  };

  renderMetaText = (): React.ReactNode => {
    const { ruleData, creature } = this.props;

    let metaItems: Array<string> = [];

    const sizeInfo = CreatureUtils.getSizeInfo(creature);
    let size: string | null = "";
    if (sizeInfo !== null) {
      size = sizeInfo.name;
    }

    let description: string = `${size} ${CreatureUtils.getTypeName(
      creature,
      ruleData
    )}`.trim();
    if (description.length) {
      metaItems.push(description);
    }

    return (
      <div className="ddbc-creature-preview__meta">
        {metaItems.map((metaItem, idx) => (
          <span className="ddbc-creature-preview__meta-item" key={idx}>
            {metaItem}
          </span>
        ))}
      </div>
    );
  };

  render() {
    const { creature } = this.props;

    const imageStyles: React.CSSProperties = {
      backgroundImage: `url(${CreatureUtils.getAvatarUrl(creature)})`,
    };

    return (
      <div className="ddbc-creature-preview" onClick={this.handleClick}>
        <div className="ddbc-creature-preview__avatar" style={imageStyles} />
        <div className="ddbc-creature-preview__name">
          {CreatureUtils.getName(creature)}
          {this.renderMetaText()}
        </div>
      </div>
    );
  }
}

export default CreaturePreview;
