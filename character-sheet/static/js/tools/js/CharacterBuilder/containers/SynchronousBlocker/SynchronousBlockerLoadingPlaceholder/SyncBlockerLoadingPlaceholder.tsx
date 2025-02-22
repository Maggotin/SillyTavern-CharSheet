import React from "react";

import { AnimatedLoadingRingSvg } from "@dndbeyond/character-components/es";

interface Props {}
export default class SyncBlockerLoadingPlaceholder extends React.PureComponent<Props> {
  render() {
    return (
      <div className="sync-blocker-group">
        <div className="sync-blocker-logo" />
        <AnimatedLoadingRingSvg className="sync-blocker-anim" />
      </div>
    );
  }
}
