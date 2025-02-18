import React from "react";

import { Checkbox, Select } from "@dndbeyond/character-components/es";
import {
  Constants,
  FormatUtils,
  HtmlSelectOption,
  AccessUtils,
} from "@dndbeyond/character-rules-engine/es";

import { CollapsibleContent } from "~/components/CollapsibleContent";
import { Link } from "~/components/Link";

export interface AffectedFeatureInfo {
  name: string;
  definitionKey: string;
  disabled: boolean;
}
interface OptionalFeatureProps {
  name: string;
  requiredLevel?: number;
  description: string | null;
  featureType: Constants.FeatureTypeEnum | null;
  definitionKey: string;
  affectedFeatureDefinitionKey: string | null;
  isSelected: boolean;
  onSelection: (
    definitionKey: string,
    affectedFeatureDefinitionKey: string | null
  ) => void;
  onRemoveSelectionPromise?: (
    definitionKey: string,
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
  onChangeReplacementPromise?: (
    definitionKey: string,
    newAffectedDefinitionKey: string | null,
    oldAffectedDefinitionKey: string | null,
    accept: () => void,
    reject: () => void
  ) => void;
  affectedFeatures: Array<AffectedFeatureInfo>;
  accessType: Constants.AccessTypeEnum;
}
export class OptionalFeature extends React.PureComponent<
  OptionalFeatureProps,
  {}
> {
  handleSelection = (isEnabled: boolean): void => {
    const { featureType, onSelection, definitionKey, affectedFeatures } =
      this.props;

    switch (featureType) {
      case Constants.FeatureTypeEnum.REPLACEMENT: {
        if (isEnabled) {
          const affectedFeatureDefinitionKey: string | null =
            affectedFeatures.length === 1
              ? affectedFeatures[0].definitionKey
              : null;

          onSelection(definitionKey, affectedFeatureDefinitionKey);
        }
        break;
      }

      case Constants.FeatureTypeEnum.ADDITIONAL: {
        if (isEnabled) {
          onSelection(definitionKey, null);
        }

        break;
      }

      default:
      //not implemented
    }
  };

  transformDefinitionKey = (definitionKey: string): string | null => {
    return definitionKey.length ? definitionKey : null;
  };

  handleReplacementChangePromise = (
    newAffectedDefinitionKey: string,
    oldAffectedDefinitionKey: string,
    accept: () => void,
    reject: () => void
  ) => {
    const { onChangeReplacementPromise, definitionKey } = this.props;

    if (onChangeReplacementPromise) {
      onChangeReplacementPromise(
        definitionKey,
        this.transformDefinitionKey(newAffectedDefinitionKey),
        this.transformDefinitionKey(oldAffectedDefinitionKey),
        accept,
        reject
      );
    }
  };

  handleUnselectPromise = (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => {
    const { onRemoveSelectionPromise, definitionKey } = this.props;

    if (onRemoveSelectionPromise) {
      onRemoveSelectionPromise(definitionKey, newIsEnabled, accept, reject);
    }
  };

  renderReplacements = (): React.ReactNode => {
    const {
      affectedFeatures,
      isSelected,
      featureType,
      affectedFeatureDefinitionKey,
    } = this.props;

    if (!affectedFeatures.length) {
      return null;
    }

    const introText: Array<string> = ["Replaces:"];
    const disabledText: string = "(already replaced)";
    if (affectedFeatures.length === 1) {
      introText.push(affectedFeatures[0].name);
      if (affectedFeatures[0].disabled) {
        introText.push(disabledText);
      }
    }

    const options: Array<HtmlSelectOption> = [];
    if (affectedFeatures.length > 1) {
      affectedFeatures.forEach((feature) => {
        const label: Array<string> = [feature.name];
        if (feature.disabled) {
          label.push(disabledText);
        }

        options.push({
          label: label.join(" "),
          value: feature.definitionKey,
          disabled: feature.disabled,
        });
      });
    }

    const classNames: Array<string> = ["ct-optional-feature__select"];

    if (
      featureType === Constants.FeatureTypeEnum.REPLACEMENT &&
      isSelected &&
      affectedFeatureDefinitionKey === null
    ) {
      classNames.push("ct-optional-feature__select--todo");
    }

    return (
      <React.Fragment>
        <div className="ct-optional-feature__type">{introText.join(" ")}</div>
        {options.length > 1 && (
          <div className={classNames.join(" ")}>
            <Select
              options={options}
              value={affectedFeatureDefinitionKey}
              onChangePromise={this.handleReplacementChangePromise}
              disabled={!isSelected}
              preventClickPropagating={true}
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  renderFeatureTypeContent = (): React.ReactNode => {
    const { featureType } = this.props;

    switch (featureType) {
      case Constants.FeatureTypeEnum.ADDITIONAL:
        return (
          <div className="ct-optional-feature__type">Additional feature</div>
        );

      case Constants.FeatureTypeEnum.REPLACEMENT:
        return this.renderReplacements();

      default:
        return null;
    }
  };

  renderDescription = (): React.ReactNode => {
    const { description, accessType } = this.props;

    let contentNode: React.ReactNode = null;
    if (AccessUtils.isAccessible(accessType)) {
      contentNode = description ? (
        <CollapsibleContent className="ct-optional-feature__description">
          {description}
        </CollapsibleContent>
      ) : null;
    } else {
      contentNode = (
        <div className="ct-character-tools__marketplace-callout">
          To fully unlock this feature, check out the{" "}
          <Link href="/marketplace">Marketplace</Link>.
        </div>
      );
    }

    return contentNode;
  };

  render() {
    const { isSelected, name, affectedFeatures, requiredLevel } = this.props;

    const isDisabled: boolean =
      affectedFeatures.length === 1 && affectedFeatures[0].disabled;

    const classNames: Array<string> = ["ct-optional-feature"];
    if (isDisabled) {
      classNames.push("ct-optional-feature--is-disabled");
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-optional-feature__selection">
          <div className="ct-optional-feature__checkmark">
            <Checkbox
              initiallyEnabled={isSelected}
              onChange={this.handleSelection}
              stopPropagation={true}
              onChangePromise={
                isSelected ? this.handleUnselectPromise : undefined
              }
              isInteractive={!isDisabled}
            />
          </div>
        </div>
        <div className="ct-optional-feature__primary">
          <div className="ct-optional-feature__name">{name}</div>
          {requiredLevel && (
            <div className="ct-optional-feature__level">
              {`${FormatUtils.ordinalize(requiredLevel)} level`}
            </div>
          )}
          {this.renderDescription()}
          <div className="ct-optional-feature__secondary">
            {this.renderFeatureTypeContent()}
          </div>
        </div>
      </div>
    );
  }
}

export default OptionalFeature;
