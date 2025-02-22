import { useLayoutEffect } from "react";

import { SheetProvider } from "~/subApps/sheet/contexts/Sheet";

import ErrorBoundary from "../../../Shared/components/ErrorBoundary";
import CharacterSheet from "../CharacterSheet";

export function CharacterSheetContainer({
  authEndpoint,
}: {
  authEndpoint: string;
}) {
  useLayoutEffect(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.add(
        "site",
        "body-rpgcharacter-sheet",
        "site-dndbeyond",
        "body-rpgcharacter",
        "body-rpgcharacter-details"
      );
    return () => {
      document
        .getElementsByTagName("body")[0]
        .classList.remove(
          "site",
          "body-rpgcharacter-sheet",
          "site-dndbeyond",
          "body-rpgcharacter",
          "body-rpgcharacter-details"
        );
    };
  }, []);

  return (
    <ErrorBoundary>
      <SheetProvider>
        <CharacterSheet authEndpoint={authEndpoint} />
      </SheetProvider>
    </ErrorBoundary>
  );
}

export default CharacterSheetContainer;
