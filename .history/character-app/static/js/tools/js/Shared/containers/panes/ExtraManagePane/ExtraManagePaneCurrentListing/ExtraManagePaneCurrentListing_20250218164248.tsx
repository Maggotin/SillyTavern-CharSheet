import React from "react";

import { MarketplaceCta } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  Creature,
  ExtraManager,
  RuleData,
  VehicleManager,
} from "../../character-rules-engine/es";

import { Reference } from "~/components/Reference";
import { CreatureBlock } from "~/subApps/sheet/components/CreatureBlock";

import VehicleBlock from "../../../../components/VehicleBlock";
import { RemoveButton } from "../../../../components/common/Button";
import { ComponentUtils } from "../../../../utils";
import ExtraManagePaneListingExtra from "../ExtraManagePaneListingExtra";

interface Props {
  extra: ExtraManager;
  ruleData: RuleData;
  onRemove: (extra: ExtraManager) => void;
  theme: CharacterTheme;
}

export const ExtraManagePaneCurrentListing: React.FC<Props> = ({
  extra,
  ruleData,
  onRemove,
  theme,
}) => {
  const extraData = extra.getExtraData();

  let label: string = "Extra";
  let ContentComponent: React.ReactNode;

  if (extra.isCreature()) {
    label = "Creature";
    ContentComponent = (
      <CreatureBlock
        variant="default"
        creature={extraData as Creature}
        ruleData={ruleData}
        className="ddbc-creature-block"
      />
    );
  } else if (extra.isVehicle()) {
    label = "Vehicle";
    const vehicle = extraData as VehicleManager;
    ContentComponent = vehicle.isAccessible() ? (
      <VehicleBlock
        theme={theme}
        {...ComponentUtils.generateVehicleBlockProps(vehicle)}
      />
    ) : (
      <MarketplaceCta
        sourceNames={extra.getSourceNames()}
        description={`To unlock this ${label}, check out the Marketplace to view purchase options.`}
      />
    );
  }

  const References = extra.isHomebrew()
    ? [<Reference isDarkMode={theme.isDarkMode} name="Homebrew" />]
    : extra
        .getSourceNames()
        .map((sourceName) => (
          <Reference name={sourceName} isDarkMode={theme.isDarkMode} />
        ));

  return (
    <ExtraManagePaneListingExtra
      headerCallout={<RemoveButton onClick={() => onRemove(extra)} />}
      metaItems={[...extra.getMetaText(), ...References]}
      heading={extra.getName()}
    >
      {ContentComponent}
    </ExtraManagePaneListingExtra>
  );
};

export default ExtraManagePaneCurrentListing;
