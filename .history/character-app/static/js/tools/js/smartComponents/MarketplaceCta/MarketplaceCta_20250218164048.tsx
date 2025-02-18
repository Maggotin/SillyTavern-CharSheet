import React from "react";

import { FormatUtils } from "../../rules-engine/es";

interface Props {
  sourceName: string | null;
  sourceNames?: Array<string>;
  url: string;
  description: string | null;
  showImage: boolean;
}
export default class MarketplaceCta extends React.PureComponent<Props> {
  static defaultProps = {
    sourceName: null,
    url: "/marketplace",
    description: null,
    showImage: true,
  };

  render() {
    const { sourceName, sourceNames, url, description, showImage } = this.props;
    const allSourceNames: Array<string> = [];

    if (sourceName) {
      allSourceNames.push(sourceName);
    }

    if (sourceNames) {
      allSourceNames.push(...sourceNames);
    }

    return (
      <div className="ddbc-marketplace-cta">
        <a href={url} target="_blank">
          <div className="ddbc-marketplace-cta__content">
            {showImage && <div className="ddbc-marketplace-cta__image" />}
            {allSourceNames.length > 0 && (
              <div className="ddbc-marketplace-cta__header">
                <div className="ddbc-marketplace-cta__header-intro">
                  Available in
                </div>
                <div className="ddbc-marketplace-cta__header-title">
                  {FormatUtils.renderNonOxfordCommaList(allSourceNames)}
                </div>
              </div>
            )}
            {description && (
              <div className="ddbc-marketplace-cta__description">
                {description}
              </div>
            )}
            <div className="ddbc-marketplace-cta__cta">
              <div className="ddbc-marketplace-cta__cta-button">
                Go To Marketplace
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
