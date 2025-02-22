import { ActionsManagerProvider } from "./ActionsManagerContext";
import { AttributesManagerProvider } from "./AttributesManagerContext";
import { CharacterFeaturesManagerProvider } from "./CharacterFeaturesManagerContext";
import { CoinManagerProvider } from "./CoinManagerContext";
import { ExtrasManagerProvider } from "./ExtrasManagerContext";
import { InventoryManagerProvider } from "./InventoryManagerContext";
import { SpellsManagerProvider } from "./SpellsManagerContext";

export function Managers(props) {
  return (
    <ActionsManagerProvider>
      <AttributesManagerProvider>
        <ExtrasManagerProvider>
          <SpellsManagerProvider>
            <CharacterFeaturesManagerProvider>
              <InventoryManagerProvider>
                <CoinManagerProvider>{props.children}</CoinManagerProvider>
              </InventoryManagerProvider>
            </CharacterFeaturesManagerProvider>
          </SpellsManagerProvider>
        </ExtrasManagerProvider>
      </AttributesManagerProvider>
    </ActionsManagerProvider>
  );
}
