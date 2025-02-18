import { sortBy } from "lodash";
import React from "react";

import {
  ClassSpellListSpellsLookup,
  BaseSpell,
  HelperUtils,
  ClassSpellListSpellInfo,
  ClassUtils,
  SpellUtils,
  FormatUtils,
} from "../../character-rules-engine/es";

import { SpellName } from "~/components/SpellName";

//This uses the common SpellName component due to builder modals not playing nice with the dataOriginRefData
//would revert back to the character-components SpellName if we ever changed the builder modals

interface Props {
  spellListIds: Array<number>;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
}
export default class SimpleClassSpellList extends React.PureComponent<
  Props,
  {}
> {
  getClassSpellsLookupByClassName = (): Record<string, Array<BaseSpell>> => {
    const { spellListIds, classSpellListSpellsLookup } = this.props;

    return spellListIds.reduce((acc, id) => {
      const classSpellListSpellInfos = HelperUtils.lookupDataOrFallback(
        classSpellListSpellsLookup,
        id
      );
      classSpellListSpellInfos?.forEach((info: ClassSpellListSpellInfo) => {
        const charClassName = ClassUtils.getName(info.charClass);
        if (charClassName) {
          if (!acc[charClassName]) {
            acc[charClassName] = [];
          }

          acc[charClassName].push(info.spell);
        }
      });

      return acc;
    }, {});
  };

  render() {
    const classSpellsLookup = this.getClassSpellsLookupByClassName();

    return (
      <div className="ct-simple-class-spell-list">
        {Object.keys(classSpellsLookup).map((charClassName) => {
          const sortedSpells = sortBy(classSpellsLookup[charClassName], [
            (spell) => SpellUtils.getLevel(spell),
            (spell) => SpellUtils.getName(spell),
          ]);

          return (
            <div
              className="ct-simple-class-spell-list__class"
              key={charClassName}
            >
              <strong>{charClassName}</strong>
              {sortedSpells.map((spell) => {
                return (
                  <div
                    className="ct-simple-class-spell-list__class-spell"
                    key={`${charClassName}-${SpellUtils.getUniqueKey(spell)}`}
                  >
                    <SpellName spell={spell} showLegacy={true} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
