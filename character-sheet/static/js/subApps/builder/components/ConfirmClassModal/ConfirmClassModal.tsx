import { orderBy } from "lodash";
import { FC, Fragment, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import ArrowRightIcon from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/arrow-right.svg";

import { Accordion } from "~/components/Accordion";
import { Button } from "~/components/Button";
import { CollapsibleContent } from "~/components/CollapsibleContent";
import { ConfirmModal } from "~/components/ConfirmModal";
import { DialogProps } from "~/components/Dialog";
import { HtmlContent } from "~/components/HtmlContent";
import { Reference } from "~/components/Reference";
import { isNotNullOrUndefined } from "~/helpers/validation";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { builderSelectors } from "~/tools/js/CharacterBuilder/selectors";

import styles from "./styles.module.css";

export interface ConfirmClassModalProps extends DialogProps {}

export const ConfirmClassModal: FC<ConfirmClassModalProps> = ({
  className,
  onClose,
  ...props
}) => {
  const dispatch = useDispatch();
  const confirmClass = useSelector(builderSelectors.getConfirmClass);
  const {
    ruleData,
    characterActions,
    ruleDataUtils: RuleDataUtils,
    formatUtils: FormatUtils,
  } = useCharacterEngine();

  const classFeatures = useMemo(() => {
    return orderBy(confirmClass?.classFeatures, [
      (classFeature) => classFeature.requiredLevel,
      (classFeature) => classFeature.displayOrder,
      (classFeature) => classFeature.name,
    ]);
  }, [confirmClass]);

  const onConfirm = () => {
    if (confirmClass) {
      dispatch(characterActions.classAddRequest(confirmClass, 1));
    }
    onClose();
  };

  return confirmClass ? (
    <ConfirmModal
      onClose={onClose}
      heading="Confirm Add Class"
      onConfirm={onConfirm}
      confirmButtonText="Add Class"
      {...props}
    >
      <>
        <div className={styles.confirmClassHeader}>
          <div>
            <h3 className={styles.name}>{confirmClass.name}</h3>
            {confirmClass?.sources
              ?.map((sourceMapping) =>
                RuleDataUtils.getSourceDataInfo(
                  sourceMapping.sourceId,
                  ruleData
                )
              )
              .filter(isNotNullOrUndefined)
              .map((source, idx) => (
                <Fragment key={uuidv4()}>
                  {idx > 0 ? " / " : " "}
                  <Reference name={source.description} />
                </Fragment>
              ))}
            {confirmClass.description && (
              <HtmlContent html={confirmClass.description} withoutTooltips />
            )}
          </div>
          {confirmClass.portraitAvatarUrl && (
            <img
              className={styles.image}
              src={confirmClass.portraitAvatarUrl}
              alt={confirmClass.name || "Class image"}
            />
          )}
        </div>
        {confirmClass.moreDetailsUrl && (
          <div className={styles.detailsLink}>
            <Button
              href={confirmClass.moreDetailsUrl}
              variant="builder-text"
              size="x-small"
              target="_blank"
              rel="noreferrer"
            >
              {confirmClass.name} Details Page <ArrowRightIcon />
            </Button>
          </div>
        )}
        <div className={styles.classFeatures}>
          {classFeatures.map((feature) => (
            <Accordion
              summary={feature.name}
              summaryMetaItems={
                feature.requiredLevel
                  ? [`${FormatUtils.ordinalize(feature.requiredLevel)} level`]
                  : undefined
              }
              key={uuidv4()}
              variant="paper"
              forceShow
            >
              <CollapsibleContent className={styles.description}>
                {feature.description}
              </CollapsibleContent>
            </Accordion>
          ))}
        </div>
      </>
    </ConfirmModal>
  ) : null;
};
