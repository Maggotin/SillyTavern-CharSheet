import { FC, HTMLAttributes } from "react";
import { v4 as uuidv4 } from "uuid";

import { BuilderHelperTextInfoContract } from "../../character-rules-engine";

import { Accordion } from "~/components/Accordion";
import { CollapsibleContent } from "~/components/CollapsibleContent";
import { HelperTextAccordion } from "~/components/HelperTextAccordion";

import styles from "./styles.module.css";

export interface ConfirmSpeciesContentProps
  extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  helpItems: BuilderHelperTextInfoContract[];
  speciesTraits: { name: string; description: string | null }[];
}

export const ConfirmSpeciesContent: FC<ConfirmSpeciesContentProps> = ({
  heading,
  helpItems,
  speciesTraits,
  ...props
}) => {
  return (
    <div {...props}>
      <h3>{heading}</h3>
      {helpItems.length > 0 && (
        <HelperTextAccordion builderHelperText={helpItems} />
      )}
      {speciesTraits.length > 0 && (
        <div>
          {speciesTraits.map(({ name, description }) => {
            return (
              <Accordion
                summary={name}
                key={uuidv4()}
                variant="paper"
                forceShow
              >
                <CollapsibleContent className={styles.description}>
                  {description}
                </CollapsibleContent>
              </Accordion>
            );
          })}
        </div>
      )}
    </div>
  );
};
