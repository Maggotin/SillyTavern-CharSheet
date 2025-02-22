import React, { useContext } from "react";

import { Select } from "@dndbeyond/character-components/es";
import { FeatList, FormatUtils } from "@dndbeyond/character-rules-engine";

import { FeatDetail } from "~/subApps/sheet/components/Sidebar/panes/FeatsManagePane/FeatDetail";
import Collapsible, {
  CollapsibleHeader,
} from "~/tools/js/Shared/components/legacy/common/Collapsible";
import { CharacterFeaturesManagerContext } from "~/tools/js/Shared/managers/CharacterFeaturesManagerContext";

type GrantedFeatProps = {
  featList: FeatList;
  requiredLevel?: number;
};

export const GrantedFeat: React.FC<GrantedFeatProps> = ({
  featList,
  requiredLevel,
}) => {
  // Only show the Feat List section if there is something to show.
  if (featList.isEmpty()) {
    return null;
  }

  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  let featContent: React.ReactNode | undefined;
  let selectBox: React.ReactNode | undefined;
  let infoMessage: React.ReactNode | undefined;
  let hasUnfinishedChoices = featList.hasChoiceToMake();
  let subtitleItems = ["Granted Feat"];

  // Show a message when the character already has every feat in the feat list from somewhere else.
  if (featList.alreadyHasEveryFeat() && featList.chosenFeatId === null) {
    infoMessage = <p>This feat already exists on your character.</p>;
  } else {
    // Show the feat details if a feat has been chosen from the feat list.
    if (featList.chosenFeatId !== null) {
      const featId = featList.chosenFeatId;
      const featManager = characterFeaturesManager.getFeatById(featId);

      if (featManager !== null) {
        const needToChooseFeatOptions =
          featManager.getUnfinishedChoices().length > 0;
        hasUnfinishedChoices = hasUnfinishedChoices || needToChooseFeatOptions;

        featContent = <FeatDetail featManager={featManager} />;

        if (featManager.isHiddenFeat()) {
          subtitleItems = []; // don't call it a feat if it isn't really a feat.
        }

        const choiceCount = featManager.getChoices().length;
        if (choiceCount) {
          subtitleItems.push(
            `${choiceCount} Choice${choiceCount !== 1 ? "s" : ""}`
          );
        }
      }
    }

    // When there is more than one feat in the list, show the select box to choose one.
    if (!featList.isSingleFeat()) {
      selectBox = (
        <Select
          onChangePromise={(...args) => featList.handleChoiceSelected(...args)}
          options={featList.availableChoices}
          value={featList.chosenFeatId !== null ? featList.chosenFeatId : -1}
          clsNames={["description-manage-background-granted-feat-chooser"]}
        />
      );
    }
  }

  if (requiredLevel) {
    subtitleItems.push(`${FormatUtils.ordinalize(requiredLevel)} level`);
  }

  // Build the Collapsible Box and its header.
  const headerClasses = ["description-manage-background-granted-feat"];
  if (hasUnfinishedChoices) {
    headerClasses.push("collapsible-todo"); // Add the blue checkmark
  }

  const header: React.ReactNode = (
    <CollapsibleHeader
      heading={featList.definition.name}
      metaItems={subtitleItems}
    />
  );

  return (
    <Collapsible
      trigger={header}
      clsNames={headerClasses}
      key={featList.definition.id}
    >
      {infoMessage}
      {selectBox}
      {featContent}
    </Collapsible>
  );
};
