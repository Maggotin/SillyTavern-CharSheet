import { useSelector } from "react-redux";

import {
  ClassUtils,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import SpellSlotManager from "../../../../CharacterSheet/containers/SpellSlotManager";
import ClassSpellManager from "../../../components/ClassSpellManager";

export default function SpellManagePane() {
  const classSpellLists = useSelector(rulesEngineSelectors.getClassSpellLists);
  const entityValueLookup = useSelector(
    rulesEngineSelectors.getCharacterValueLookupByEntity
  );
  const dataOriginRefData = useSelector(
    rulesEngineSelectors.getDataOriginRefData
  );
  const proficiencyBonus = useSelector(
    rulesEngineSelectors.getProficiencyBonus
  );
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);

  if (!classSpellLists.length) {
    return (
      <div className="ct-spell-manage-pane__default">
        You do not have spellcasting or pact magic spells to manage. The spells
        that appear for your character were gained through other class features,
        species traits, feats, or items.
      </div>
    );
  }

  return (
    <div className="ct-spell-manage-pane">
      <SpellSlotManager />
      {classSpellLists.map((classSpellList) => (
        <ClassSpellManager
          {...classSpellList}
          key={ClassUtils.getMappingId(classSpellList.charClass)}
          hasMultipleSpellClasses={classSpellLists.length > 1}
          entityValueLookup={entityValueLookup}
          dataOriginRefData={dataOriginRefData}
          isPrepareMaxed={!!classSpellList.isPrepareMaxed}
          proficiencyBonus={proficiencyBonus}
          theme={theme}
        />
      ))}
    </div>
  );
}
