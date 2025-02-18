import { Dispatch } from "react";

import {
  Action,
  ActionUtils,
  characterActions,
  Spell,
  SpellUtils,
} from "@dndbeyond/character-rules-engine/es";

export const handleActionUseSet = (
  action: Action,
  uses: number,
  dispatch: Dispatch<any>
): void => {
  const id = ActionUtils.getId(action);
  const entityTypeId = ActionUtils.getEntityTypeId(action);
  const dataOriginType = ActionUtils.getDataOriginType(action);

  if (id !== null && entityTypeId !== null) {
    dispatch(
      characterActions.actionUseSet(id, entityTypeId, uses, dataOriginType)
    );
  }
};

export const handleSpellUseSet = (
  spell: Spell,
  uses: number,
  dispatch: Dispatch<any>
): void => {
  const mappingId = SpellUtils.getMappingId(spell);
  const mappingEntityTypeId = SpellUtils.getMappingEntityTypeId(spell);
  const dataOriginType = SpellUtils.getDataOriginType(spell);

  if (
    mappingId !== null &&
    mappingEntityTypeId !== null &&
    dataOriginType !== null
  ) {
    dispatch(
      characterActions.spellUseSet(
        mappingId,
        mappingEntityTypeId,
        uses,
        dataOriginType
      )
    );
  }
};
