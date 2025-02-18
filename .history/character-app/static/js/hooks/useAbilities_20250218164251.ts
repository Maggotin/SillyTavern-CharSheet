import { useContext, useEffect, useState } from "react";

import {
  AbilityManager,
  FeaturesManager,
} from "../../character-rules-engine/es";

import { AttributesManagerContext } from "~/tools/js/Shared/managers/AttributesManagerContext";

export function useAbilities() {
  const { attributesManager } = useContext(AttributesManagerContext);

  const [abilities, setAbilities] = useState<Array<AbilityManager>>([]);

  useEffect(() => {
    async function onUpdate() {
      const abilities = await attributesManager.getAbilities();

      setAbilities(abilities);
    }
    return FeaturesManager.subscribeToUpdates({ onUpdate });
  }, [attributesManager, setAbilities]);

  return abilities;
}
