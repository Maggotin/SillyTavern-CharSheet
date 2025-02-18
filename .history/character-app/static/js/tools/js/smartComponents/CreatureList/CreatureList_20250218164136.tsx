import { orderBy } from "lodash";
import * as React from "react";

import {
  CharacterTheme,
  Creature,
  CreatureUtils,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

import CreatureListRow from "./CreatureListRow";

//TODO this component is currently replaced by ExtraList for Creatures and Vehicles as Extras
interface Props {
  className: string;
  creatures: Array<Creature>;
  showNotes: boolean;
  ruleData: RuleData;
  onShow: (id: number) => void;
  onStatusChange: (id: number, isActive: boolean) => void;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export default class CreatureList extends React.PureComponent<Props, {}> {
  static defaultProps = {
    showNotes: true,
    className: "",
  };

  render() {
    const {
      creatures,
      ruleData,
      showNotes,
      onShow,
      onStatusChange,
      isReadonly,
      className,
      theme,
    } = this.props;

    let orderedCreatures: Array<Creature> = orderBy(creatures, (creature) =>
      CreatureUtils.getName(creature)
    );
    let classNames: Array<string> = [className, "ddbc-creature-list"];

    return (
      <div className={classNames.join(" ")}>
        <div className="ddbc-creature-list__row-header">
          <div className="ddbc-creature-list__col ddbc-creature-list__col--preview" />
          <div className="ddbc-creature-list__col ddbc-creature-list__col--primary">
            Name
          </div>
          <div className="ddbc-creature-list__col ddbc-creature-list__col--ac">
            AC
          </div>
          <div className="ddbc-creature-list__col ddbc-creature-list__col--hp">
            Hit Points
          </div>
          <div className="ddbc-creature-list__col ddbc-creature-list__col--speed">
            Speed
          </div>
          {showNotes && (
            <div className="ddbc-creature-list__col ddbc-creature-list__col--notes">
              Notes
            </div>
          )}
          {/*<div className="ddbc-creature-list__col ddbc-creature-list__col--action">Active</div>*/}
        </div>
        <div className="ddbc-creature-list__items">
          {orderedCreatures.map((creature) => (
            <CreatureListRow
              key={CreatureUtils.getUniqueKey(creature)}
              creature={creature}
              ruleData={ruleData}
              onShow={onShow}
              onStatusChange={onStatusChange}
              showNotes={showNotes}
              isReadonly={isReadonly}
              theme={theme}
            />
          ))}
        </div>
      </div>
    );
  }
}
