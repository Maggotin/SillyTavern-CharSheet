import { useLayoutEffect } from "react";

import { BuilderProvider } from "~/subApps/builder/contexts/Builder";

import ErrorBoundary from "../../../Shared/components/ErrorBoundary";
import CharacterBuilder from "../CharacterBuilder";

export function CharacterBuilderContainer(props) {
  useLayoutEffect(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.add(
        "site",
        "body-rpgcharacterbuilder",
        "site-dndbeyond",
        "body-rpgcharacter"
      );
    return () => {
      document
        .getElementsByTagName("body")[0]
        .classList.remove(
          "site",
          "body-rpgcharacterbuilder",
          "site-dndbeyond",
          "body-rpgcharacter"
        );
    };
  }, []);
  return (
    <BuilderProvider>
      <ErrorBoundary>
        <CharacterBuilder />
      </ErrorBoundary>
    </BuilderProvider>
  );
}

export default CharacterBuilderContainer;
