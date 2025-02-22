import clsx from "clsx";
import { FC, HTMLAttributes, useState } from "react";
import { useDispatch } from "react-redux";

import { Select } from "@dndbeyond/character-components/es";

import { Accordion } from "~/components/Accordion";
import { Button } from "~/components/Button";
import { Toggle } from "~/components/Toggle";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { builderActions } from "~/tools/js/CharacterBuilder/actions";
import ClassDisplaySimple from "~/tools/js/CharacterBuilder/components/ClassDisplaySimple";
import SpeciesDisplaySimple from "~/tools/js/CharacterBuilder/components/SpeciesDisplaySimple";
import { ClassDefinitionContract, RaceDefinitionContract } from "~/types";

import { PortraitName } from "../../components/PortraitName";
import { ClassChoose } from "../ClassChoose";
import { SpeciesChoose } from "../SpeciesChoose";
import styles from "./styles.module.css";

export interface RandomBuildProps extends HTMLAttributes<HTMLDivElement> {}

export const RandomBuild: FC<RandomBuildProps> = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { raceUtils, ruleData, helperUtils } = useCharacterEngine();

  const [species, setSpecies] = useState<RaceDefinitionContract | null>(null);
  const [charClass, setCharClass] = useState<ClassDefinitionContract | null>(
    null
  );
  const [name, setName] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [allowMulticlass, setAllowMulticlass] = useState(false);
  const [allowFeats, setAllowFeats] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);

  const handleSubmit = (): void => {
    dispatch(
      builderActions.randomBuildRequest(
        level,
        species ? raceUtils.getEntityRaceId(species) : null,
        species ? raceUtils.getEntityRaceTypeId(species) : null,
        charClass ? charClass.id : null,
        allowMulticlass,
        allowFeats,
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
  const handleLevelChange = (level: string): void => {
    setLevel(helperUtils.parseInputInt(level));
  };
  const handleToggleAllowMulticlass = (): void => {
    setAllowMulticlass(!allowMulticlass);
  };
  const handleToggleAllowFeats = (): void => {
    setAllowFeats(!allowFeats);
  };

  const levels = Array.from(
    new Array(ruleData.maxCharacterLevel),
    (val, index) => index + 1
  );

  return (
    <div className={clsx([styles.page, className])} {...props}>
      <h1 className={styles.title}>Random Build</h1>
      <p>
        Create a randomized character. Make it completely random, or make
        choices in some categories and randomize the rest. Once you've made your
        selections, click <strong>Create Character</strong> to generate a
        character sheet and start playing!
      </p>
      <hr className={styles.divider} />
      <div className={styles.levelSelect}>
        <label className={styles.label} id="choose-level">
          Choose Level
        </label>
        <Select
          className={styles.select}
          placeholder={"--"}
          options={levels.map((level) => ({
            value: level,
            label: level,
          }))}
          onChange={handleLevelChange}
          aria-labelledby="choose-level"
          value={level}
        />
      </div>
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
      <div className={styles.toggle}>
        <label className={styles.label} id="allow-multiclass-label">
          Allow Multiclass
        </label>
        <Toggle
          onClick={handleToggleAllowMulticlass}
          checked={allowMulticlass}
          color="secondary"
          aria-labelledby="allow-multiclass-label"
        />
      </div>
      <div className={styles.toggle}>
        <label className={styles.label} id="allow-feats-label">
          Allow Feats
        </label>
        <Toggle
          onClick={handleToggleAllowFeats}
          checked={allowFeats}
          color="secondary"
          aria-labelledby="allow-feats-label"
        />
      </div>
      <PortraitName hidePortrait fullWidth handleNameUpdate={setName} />
      <Button
        className={styles.submitButton}
        onClick={handleSubmit}
        variant="builder"
      >
        Create Character
      </Button>
    </div>
  );
};
