import { useContext, useEffect, useState } from "react";

import {
  ExtraManager,
  FeaturesManager,
} from "@dndbeyond/character-rules-engine/es";

import { ExtrasManagerContext } from "~/tools/js/Shared/managers/ExtrasManagerContext";

//TODO: need to look at subscribeToUpdates for how many times its being called on state updates
export function useExtras() {
  const { extrasManager } = useContext(ExtrasManagerContext);

  const [extras, setExtras] = useState<Array<ExtraManager>>(
    extrasManager.getCharacterExtraManagers()
  );

  useEffect(() => {
    const onUpdate = () => {
      setExtras(extrasManager.getCharacterExtraManagers());
    };
    return FeaturesManager.subscribeToUpdates({ onUpdate });
  }, [extrasManager]);

  return extras;
}
