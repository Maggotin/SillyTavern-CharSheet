import clsx from "clsx";
import { orderBy } from "lodash";
import React from "react";

import { Checkbox } from "~/components/Checkbox";
import { HtmlContent } from "~/components/HtmlContent";

import { Accordion } from "../../../../../../components/Accordion";
import styles from "./styles.module.css";
import { CheckboxInfo } from "./typings";

export enum CheckboxVariant {
  BUILDER = "builder",
  SIDEBAR = "sidebar",
  DEFAULT = "default",
}

interface Props {
  checkboxes: Array<CheckboxInfo>;
  heading: React.ReactNode;
  description: React.ReactNode;
  checkUncheckAllEnabled?: boolean;
  onCheckUncheckAll?: CheckboxInfo;
  showAccordion?: boolean;
  accordionHeading?: string;
  themed?: boolean;
  darkMode?: boolean;
  variant?: "builder" | "sidebar" | "default";
  allText?: string;
}

export const FormCheckBoxesField: React.FC<Props> = ({
  heading,
  description,
  checkboxes,
  showAccordion,
  checkUncheckAllEnabled,
  onCheckUncheckAll,
  themed,
  darkMode,
  accordionHeading = "Options",
  variant = CheckboxVariant.DEFAULT,
  allText = "All",
}) => {
  const sortedChecks = orderBy(checkboxes, "sortOrder");
  const allChecksEnabled = sortedChecks.every(
    (checkbox) => checkbox.initiallyEnabled
  );

  if (!checkboxes.length) {
    return null;
  }

  const renderSingleCheckbox = () => {
    const [checkbox] = sortedChecks;

    return (
      <div
        className={clsx([
          styles.checkboxesContainer,
          variant === CheckboxVariant.SIDEBAR &&
            styles.checkboxesContainerSidebar,
        ])}
      >
        <div className={styles.summary}>
          <div
            className={clsx([
              styles.summaryHeadingGroup,
              styles.summaryHeadingGroupSingle,
            ])}
          >
            <div
              className={clsx([
                styles.summaryHeading,
                variant === CheckboxVariant.SIDEBAR &&
                  styles.summaryHeadingSidebar,
                darkMode && styles.summaryHeadingSidebarDark,
              ])}
            >
              {heading}
            </div>
            <div className={styles.checkbox}>
              <Checkbox
                checked={checkbox.initiallyEnabled}
                aria-label={checkbox.label}
                onClick={checkbox.onChange}
                onChangePromise={checkbox.onChangePromise}
                themed={themed}
                darkMode={darkMode}
                disabled={checkbox.enabled === false}
                variant={variant}
              />
            </div>
          </div>
          {description && (
            <div
              className={clsx([
                styles.summaryDescription,
                variant === CheckboxVariant.SIDEBAR &&
                  styles.summaryDescriptionSidebar,
                darkMode && styles.darkMode,
              ])}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCheckboxes = () => {
    return (
      <div className={styles.container}>
        {sortedChecks.map((checkbox, idx) => (
          <div
            className={styles.checkboxWrapper}
            key={idx}
            data-testid="content-preference-checkbox"
          >
            <div className={styles.group} key={idx}>
              <div className={styles.checkbox}>
                <Checkbox
                  checked={checkbox.initiallyEnabled}
                  aria-label={checkbox.label}
                  onClick={checkbox.onChange}
                  onChangePromise={checkbox.onChangePromise}
                  themed={themed}
                  darkMode={darkMode}
                  disabled={checkbox.enabled === false}
                  variant={variant}
                />
              </div>
              <div
                className={clsx([
                  styles.groupLabel,
                  variant === CheckboxVariant.DEFAULT &&
                    styles.groupLabelDefault,
                ])}
              >
                {checkbox.label}
              </div>
            </div>
            {checkbox.description && (
              <HtmlContent
                html={checkbox.description}
                className={clsx([
                  styles.description,
                  variant === CheckboxVariant.DEFAULT &&
                    styles.descriptionDefault,
                ])}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  return checkboxes.length > 1 ||
    variant === CheckboxVariant.BUILDER ||
    variant === CheckboxVariant.DEFAULT ? (
    <div
      className={clsx(
        [styles.checkboxesContainer],
        variant === CheckboxVariant.SIDEBAR && styles.checkboxesContainerSidebar
      )}
    >
      {((variant === CheckboxVariant.SIDEBAR && !showAccordion) ||
        variant === CheckboxVariant.BUILDER ||
        variant === CheckboxVariant.DEFAULT) && (
        <div className={styles.summary}>
          <div className={styles.summaryHeadingGroup}>
            {checkUncheckAllEnabled &&
              onCheckUncheckAll &&
              variant === CheckboxVariant.DEFAULT && (
                <Checkbox
                  checked={allChecksEnabled}
                  aria-label="Check/Uncheck all"
                  onClick={onCheckUncheckAll.onChange}
                  themed={themed}
                  darkMode={darkMode}
                  variant={variant}
                />
              )}
            <div
              className={clsx([
                styles.summaryHeading,
                variant === CheckboxVariant.SIDEBAR &&
                  styles.summaryHeadingSidebar,
                darkMode && styles.summaryHeadingSidebarDark,
                variant === CheckboxVariant.DEFAULT &&
                  styles.summaryHeadingDefault,
              ])}
            >
              {heading}
            </div>
          </div>
          {description && (
            <div
              className={clsx([
                styles.summaryDescription,
                variant === CheckboxVariant.SIDEBAR &&
                  styles.summaryDescriptionSidebar,
                darkMode && styles.darkMode,
              ])}
            >
              {description}
            </div>
          )}
        </div>
      )}

      {variant === CheckboxVariant.BUILDER && checkUncheckAllEnabled ? (
        <div className={styles.summaryBuilder}>
          <div className={styles.summaryHeadingGroup}>
            {checkUncheckAllEnabled && onCheckUncheckAll && (
              <Checkbox
                checked={allChecksEnabled}
                aria-label="Check/Uncheck all"
                onClick={onCheckUncheckAll.onChange}
                themed={themed}
                darkMode={darkMode}
                variant={variant}
              />
            )}
            <div className={styles.summaryHeadingAll}>{allText}</div>
          </div>
        </div>
      ) : null}

      {showAccordion ? (
        <Accordion
          summary={
            variant !== CheckboxVariant.SIDEBAR ? accordionHeading : heading
          }
          variant="text"
          resetOpen={!allChecksEnabled}
          className={clsx([
            styles.accordion,
            variant === CheckboxVariant.BUILDER && styles.accordionBuilder,
            variant === CheckboxVariant.SIDEBAR && styles.accordionSidebar,
            variant === CheckboxVariant.SIDEBAR &&
              darkMode &&
              styles.accordionHeadingDark,
          ])}
        >
          {variant === CheckboxVariant.SIDEBAR && (
            <p className={clsx([styles.accordionSidebarDescription])}>
              {description}
            </p>
          )}
          {renderCheckboxes()}
        </Accordion>
      ) : (
        renderCheckboxes()
      )}
    </div>
  ) : (
    renderSingleCheckbox()
  );
};
