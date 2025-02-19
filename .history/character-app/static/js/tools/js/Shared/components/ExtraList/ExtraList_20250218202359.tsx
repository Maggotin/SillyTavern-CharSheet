import { orderBy } from "lodash";
import React from "react";

import {
  CharacterTheme,
  ExtraManager,
} from "@dndbeyond/character-rules-engine/es";

import { ExtraRow } from "../ExtraRow";

interface Props {
  extras: Array<ExtraManager>;
  showNotes: boolean;
  onShow?: (extra: ExtraManager) => void;
  onStatusChange?: (extra: ExtraManager, newStatus: boolean) => void;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export default class ExtraList extends React.PureComponent<Props, {}> {
  static defaultProps = {
    showNotes: true,
    isReadonly: false,
  };

  render() {
    const { extras, showNotes, onShow, onStatusChange, isReadonly, theme } =
      this.props;

    let orderedExtras: Array<ExtraManager> = orderBy(extras, (extra) =>
      extra.getName()
    );

    return (
      <div className="ct-extra-list">
        <div className="ct-extra-list__row-header">
          <div className="ct-extra-list__colstcs-extra-list__col--preview" />
          <div className="ct-extra-list__colstcs-extra-list__col--primary">
            Name
          </div>
          <div className="ct-extra-list__colstcs-extra-list__col--ac">AC</div>
          <div className="ct-extra-list__colstcs-extra-list__col--hp">
            Hit Points
          </div>
          <div className="ct-extra-list__colstcs-extra-list__col--speed">
            Speed
          </div>
          {showNotes && (
            <div className="ct-extra-list__colstcs-extra-list__col--notes">
              Notes
            </div>
          )}
        </div>
        <div className="ct-extra-list__items">
          {orderedExtras.map((extra, idx) => (
            <ExtraRow
              theme={theme}
              key={`${idx}-${extra.getUniqueKey()}`}
              extra={extra}
              onShow={onShow}
              onStatusChange={onStatusChange}
              showNotes={showNotes}
              isReadonly={isReadonly}
            />
          ))}
        </div>
      </div>
    );
  }
}
