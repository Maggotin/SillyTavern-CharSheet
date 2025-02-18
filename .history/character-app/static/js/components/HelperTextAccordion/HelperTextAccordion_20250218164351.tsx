import { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import { BuilderHelperTextInfoContract } from "../../character-rules-engine";

import { DdbBadgeSvg } from "~/tools/js/smartComponents/Svg";

import { Accordion, AccordionProps } from "../Accordion";
import { HtmlContent } from "../HtmlContent";
import styles from "./styles.module.css";

export interface HelperTextAccordionProps
  extends Omit<AccordionProps, "summary"> {
  builderHelperText: BuilderHelperTextInfoContract[];
}

export const HelperTextAccordion: FC<HelperTextAccordionProps> = ({
  builderHelperText,
  ...props
}) => {
  return (
    <>
      {builderHelperText.map((helperText, idx) => (
        <Accordion
          {...props}
          key={uuidv4()}
          summary={
            <span className={styles.summary}>
              <DdbBadgeSvg /> {helperText.label}
            </span>
          }
        >
          <HtmlContent html={helperText.description} />
        </Accordion>
      ))}
    </>
  );
};
