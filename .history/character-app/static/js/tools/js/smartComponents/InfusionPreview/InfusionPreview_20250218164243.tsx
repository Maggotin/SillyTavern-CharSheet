import * as React from "react";

import {
  AccessUtils,
  FormatUtils,
  Infusion,
  InfusionChoiceLookup,
  InfusionUtils,
  RuleData,
  RuleDataUtils,
  SnippetData,
} from "../../character-rules-engine/es";

import MarketplaceCta from "../MarketplaceCta";
import Snippet from "../Snippet";

interface Props {
  infusion: Infusion;
  infusionChoiceLookup: InfusionChoiceLookup;
  snippetData: SnippetData;
  ruleData: RuleData;
  onClick?: (infusion: Infusion) => void;
  proficiencyBonus: number;
}
class InfusionPreview extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, infusion } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(infusion);
    }
  };

  renderDescription = (): React.ReactNode => {
    const { infusion, ruleData, snippetData, proficiencyBonus } = this.props;

    let contentNode: React.ReactNode;

    if (AccessUtils.isAccessible(InfusionUtils.getAccessType(infusion))) {
      let classLevel: number | null =
        InfusionUtils.getSelectedModifierData(infusion)?.value ?? null;

      contentNode = (
        <Snippet
          snippetData={snippetData}
          classLevel={classLevel}
          proficiencyBonus={proficiencyBonus}
        >
          {InfusionUtils.getSnippet(infusion)}
        </Snippet>
      );
    } else {
      const sources = InfusionUtils.getSources(infusion);

      let sourceNames: Array<string> = [];
      if (sources.length > 0) {
        sources.forEach((source) => {
          let sourceInfo = RuleDataUtils.getSourceDataInfo(
            source.sourceId,
            ruleData
          );

          if (sourceInfo !== null && sourceInfo.description !== null) {
            sourceNames.push(sourceInfo.description);
          }
        });
      }

      contentNode = (
        <MarketplaceCta
          showImage={false}
          sourceName={
            sourceNames.length > 0
              ? FormatUtils.renderNonOxfordCommaList(sourceNames)
              : null
          }
          description="To unlock this infusion, check out the Marketplace to view purchase options."
        />
      );
    }

    return contentNode;
  };

  render() {
    const { infusion } = this.props;

    return (
      <div className="ddbc-infusion-preview" onClick={this.handleClick}>
        <div className="ddbc-infusion-preview__name">
          Infusion: {InfusionUtils.getName(infusion)}
        </div>
        <div className="ddbc-infusion-preview__snippet">
          {this.renderDescription()}
        </div>
      </div>
    );
  }
}

export default InfusionPreview;
