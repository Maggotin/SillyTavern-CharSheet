import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

import { rulesEngineSelectors } from "@dndbeyond/character-rules-engine";

import { Dialog } from "~/components/Dialog";
import { useSheetContext } from "~/subApps/sheet/contexts/Sheet";
import {
  ActionsIcon,
  AttributesIcon,
  DescriptionIcon,
  EquipmentIcon,
  ExtrasIcon,
  FeatureTraitsIcon,
  NotesIcon,
  ProficienciesSvg,
  SkillsIcon,
  SpellsIcon,
} from "~/svgs";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import { SectionButton } from "../SectionButton";
import styles from "./styles.module.css";

export interface SectionMenuProps extends HTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose: (e?: MouseEvent) => void;
}

export const SectionMenu: FC<SectionMenuProps> = ({
  className,
  open,
  ...props
}) => {
  const { setMobileActiveSectionId: setId } = useSheetContext();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const hasSpells = useSelector(rulesEngineSelectors.hasSpells);

  return createPortal(
    <>
      <Dialog
        className={clsx([styles.sectionNav, className])}
        open={open}
        modal
        {...props}
      >
        <SectionButton
          className={styles.fullWidth}
          onClick={() => setId("main")}
        >
          <AttributesIcon />
          <span>
            Abilities, Saves, Senses
            <span className={styles.mobile}>
              , Proficiencies, Training, Skills
            </span>
          </span>
        </SectionButton>
        <SectionButton
          className={styles.mobile}
          onClick={() => setId("skills")}
        >
          <SkillsIcon />
          Skills
        </SectionButton>
        <SectionButton onClick={() => setId("actions")}>
          <ActionsIcon />
          Actions
        </SectionButton>
        <SectionButton onClick={() => setId("equipment")}>
          <EquipmentIcon />
          Inventory
        </SectionButton>
        {hasSpells && (
          <SectionButton onClick={() => setId("spells")}>
            <SpellsIcon />
            Spells
          </SectionButton>
        )}
        <SectionButton onClick={() => setId("features_traits")}>
          <FeatureTraitsIcon />
          Features & Traits
        </SectionButton>
        <SectionButton
          className={styles.mobile}
          onClick={() => setId("proficiencies")}
        >
          <ProficienciesSvg />
          <span>Proficiencies & Training</span>
        </SectionButton>
        {!isReadonly && (
          <SectionButton onClick={() => setId("description")}>
            <DescriptionIcon />
            Background
          </SectionButton>
        )}
        {!isReadonly && (
          <SectionButton onClick={() => setId("notes")}>
            <NotesIcon />
            Notes
          </SectionButton>
        )}
        <SectionButton
          className={hasSpells ? styles.fullWidth : ""}
          onClick={() => setId("extras")}
        >
          <ExtrasIcon />
          Extras
        </SectionButton>
      </Dialog>
      {open && <div className={styles.backdrop} />}
    </>,
    document.body
  );
};
