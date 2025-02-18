import clsx from "clsx";
import { FC, HTMLAttributes, useState } from "react";
import { useDispatch } from "react-redux";

import { Accordion } from "~/components/Accordion";
import { Button } from "~/components/Button";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { builderActions } from "~/tools/js/CharacterBuilder/actions";
import ClassDisplaySimple from "~/tools/js/CharacterBuilder/components/ClassDisplaySimple";
import SpeciesDisplaySimple from "~/tools/js/CharacterBuilder/components/SpeciesDisplaySimple";
import { ClassDefinitionContract, RaceDefinitionContract } from "~/types";

import { PortraitName } from "../../components/PortraitName";
import { ClassChoose } from "../ClassChoose";
import { SpeciesChoose } from "../SpeciesChoose";
import styles from "./styles.module.css";

export interface QuickBuildProps extends HTMLAttributes<HTMLDivElement> {}

export const QuickBuild: FC<QuickBuildProps> = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { raceUtils, ruleData } = useCharacterEngine();

  const [species, setSpecies] = useState<RaceDefinitionContract | null>(null);
  const [charClass, setCharClass] = useState<ClassDefinitionContract | null>(
    null
  );
  const [name, setName] = useState("");
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);

  const handleSubmit = (): void => {
    dispatch(
      builderActions.quickBuildRequest(
        species ? raceUtils.getEntityRaceId(species) : null,
        species ? raceUtils.getEntityRaceTypeId(species) : null,
        charClass ? charClass.id : null,
        name
      )
    );
  };

  const handleSelectSpecies = (species: RaceDefinitionContract): void => {
    setSpecies(species);
  };
  const handleRemoveSpecies = (): void => {
    setSpecies(null);
    setIsSpeciesOpen(true);
  };
  const handleSelectClass = (charClass: ClassDefinitionContract): void => {
    setCharClass(charClass);
  };
  const handleRemoveClass = (): void => {
    setCharClass(null);
    setIsClassesOpen(true);
  };

  return (
    <div className={clsx([styles.page, className])} {...props}>
      <h1 className={styles.title}>Quick Build</h1>
      <p>
        To create a level 1 character with recommended starting options, choose
        a class and species below. You can provide a character name or leave it
        blank to randomize one.
      </p>
      <hr className={styles.divider} />
      {charClass ? (
        <ClassDisplaySimple
          onRequestChange={handleRemoveClass}
          charClass={charClass}
        />
      ) : (
        <Accordion
          className={styles.accordion}
          summary={<h3 className={styles.accordionHeading}>Choose Class</h3>}
          variant="text"
          resetOpen={isClassesOpen}
        >
          <ClassChoose showHeader={false} onQuickSelect={handleSelectClass} />
        </Accordion>
      )}
      {species ? (
        <SpeciesDisplaySimple
          onRequestAction={handleRemoveSpecies}
          headingText="Selected Species"
          species={species}
          ruleData={ruleData}
        />
      ) : (
        <Accordion
          className={styles.accordion}
          summary={<h3 className={styles.accordionHeading}>Choose Species</h3>}
          variant="text"
          resetOpen={isSpeciesOpen}
        >
          <SpeciesChoose
            showHeader={false}
            onQuickSelect={handleSelectSpecies}
          />
        </Accordion>
      )}
      <PortraitName hidePortrait fullWidth handleNameUpdate={setName} />
      <Button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!species || !charClass}
        variant="builder"
      >
        Create Character
      </Button>
    </div>
  );
};
