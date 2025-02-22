import clsx from "clsx";
import React, { FC } from "react";
import { useDispatch } from "react-redux";

import ArrowRightIcon from "@dndbeyond/fontawesome-cache/svgs/solid/arrow-right.svg";

import { Button } from "~/components/Button";
import { ConfirmModal } from "~/components/ConfirmModal";
import { DialogProps } from "~/components/Dialog";
import { Reference } from "~/components/Reference";
import { SummaryList } from "~/components/SummaryList";
import { AppContextTypeEnum, DisplayConfigurationTypeEnum } from "~/constants";
import { isNotNullOrUndefined } from "~/helpers/validation";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { Feat, RacialTraitContract as RacialTrait } from "~/types";

import { useSpeciesContext } from "../../contexts/Species";
import { ConfirmSpeciesContent } from "./ConfirmSpeciesContent";
import { ConfirmSpeciesHeader } from "./ConfirmSpeciesHeader";
import styles from "./styles.module.css";

export interface ConfirmSpeciesModalProps extends DialogProps {
  feats?: Feat[];
}

export const ConfirmSpeciesModal: FC<ConfirmSpeciesModalProps> = ({
  className,
  feats,
  onClose,
  ...props
}) => {
  const dispatch = useDispatch();
  const {
    characterActions: { raceChoose },
    definitionUtils: { hack__generateDefinitionKey: generateDefinitionKey },
    featUtils: { getId: getFeatId, getName: getFeatName },
    raceUtils: {
      deriveCalledOutRacialTraits,
      deriveOrderedRacialTraits,
      deriveVisibleRacialTraits: deriveVisibleTraits,
      getDefinitionRacialTraits,
      getEntityRaceId,
      getEntityRaceTypeId,
      getFeatIds,
      getMoreDetailsUrl,
    },
    racialTraitUtils: {
      filterRacialTraitsByDisplayConfigurationType: filterRacialTraits,
      getName: getRacialTraitName,
      getDescription: getRacialTraitDescription,
      simulateRacialTraitFromContract,
    },
    ruleData,
    ruleDataUtils: {
      getBuilderHelperTextByDefinitionKeys: getHelperText,
      getSourceDataInfo,
    },
    race: species,
  } = useCharacterEngine();
  const { defaultSpeciesImageUrl: defaultImageUrl, selectedSpecies } =
    useSpeciesContext();

  const { description, fullName, isLegacy, portraitAvatarUrl, sources } =
    selectedSpecies || {};

  const previewUrl = portraitAvatarUrl || defaultImageUrl;

  let missingFeatDependencies: Feat[] = [];

  if (feats && species && selectedSpecies) {
    let speciesFeatIds = getFeatIds(species);
    let confirmSpeciesFeatIds = getFeatIds(selectedSpecies);
    feats.forEach((feat) => {
      if (
        speciesFeatIds.includes(getFeatId(feat)) &&
        !confirmSpeciesFeatIds.includes(getFeatId(feat))
      ) {
        missingFeatDependencies.push(feat);
      }
    });
  }

  // Get listing url for species
  const moreDetailsUrl = selectedSpecies
    ? getMoreDetailsUrl(selectedSpecies)
    : "";

  // Get species traits
  const speciesTraits =
    selectedSpecies && getDefinitionRacialTraits(selectedSpecies);

  const simulatedSpeciesTraits = speciesTraits?.map((speciesTrait) =>
    simulateRacialTraitFromContract(speciesTrait)
  );

  const calledOutSpeciesTraits =
    simulatedSpeciesTraits &&
    deriveCalledOutRacialTraits(simulatedSpeciesTraits, ruleData);

  const onConfirm = () => {
    if (selectedSpecies) dispatch(raceChoose(selectedSpecies));
    onClose();
  };

  const definitionKey =
    (selectedSpecies &&
      generateDefinitionKey(
        getEntityRaceTypeId(selectedSpecies),
        getEntityRaceId(selectedSpecies)
      )) ||
    "";

  const builderText = getHelperText(
    [definitionKey],
    ruleData,
    DisplayConfigurationTypeEnum.RACIAL_TRAIT
  );

  const orderedSpeciesTraits: RacialTrait[] = speciesTraits
    ? deriveOrderedRacialTraits(speciesTraits)
    : [];

  let visibleSpeciesTraits: RacialTrait[] = deriveVisibleTraits(
    orderedSpeciesTraits,
    AppContextTypeEnum.BUILDER
  );

  visibleSpeciesTraits = filterRacialTraits(visibleSpeciesTraits, [
    DisplayConfigurationTypeEnum.RACIAL_TRAIT,
  ]);

  const sourceList = sources
    ?.map((sourceMapping) =>
      getSourceDataInfo(sourceMapping.sourceId, ruleData)
    )
    .filter(isNotNullOrUndefined)
    .map((source, idx) => (
      <React.Fragment key={`${source}-${idx}`}>
        {idx > 0 ? " / " : " "}
        <Reference name={source.description} />
      </React.Fragment>
    ));

  return (
    <ConfirmModal
      className={clsx([styles.confirmSpeciesModal, className])}
      onClose={onClose}
      heading={`${species ? "Confirm Change" : "Confirm"} Species`}
      onConfirm={onConfirm}
      {...props}
    >
      {missingFeatDependencies.length > 0 && (
        <div className="builder-message builder-message-warning">
          By changing your species, you will have invalid feat selection(s):
          {" " +
            missingFeatDependencies.map((feat) => getFeatName(feat)).join(", ")}
        </div>
      )}
      {selectedSpecies && (
        <div className={styles.content}>
          <ConfirmSpeciesHeader
            heading={fullName || ""}
            content={description || ""}
            imageUrl={previewUrl}
            isLegacy={isLegacy}
            sources={sourceList}
          />
          {calledOutSpeciesTraits && calledOutSpeciesTraits.length > 0 && (
            <SummaryList
              list={calledOutSpeciesTraits}
              title="Species Traits"
              className={styles.summaryList}
            />
          )}
          {moreDetailsUrl && (
            <div className={styles.detailsLink}>
              <Button
                href={moreDetailsUrl}
                variant="builder-text"
                size="x-small"
                target="_blank"
                rel="noreferrer"
              >
                {fullName} Details Page <ArrowRightIcon />
              </Button>
            </div>
          )}
          <ConfirmSpeciesContent
            heading={`${fullName} Traits`}
            helpItems={builderText}
            speciesTraits={visibleSpeciesTraits.map((trait) => ({
              name: getRacialTraitName(trait),
              description: getRacialTraitDescription(trait),
            }))}
          />
        </div>
      )}
    </ConfirmModal>
  );
};
