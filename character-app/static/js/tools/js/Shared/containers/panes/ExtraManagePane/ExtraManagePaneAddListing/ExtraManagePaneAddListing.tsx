import React, { useState } from "react";

import { HelperUtils } from "@dndbeyond/character-rules-engine/es";

import SimpleQuantity from "../../../../components/SimpleQuantity";
import { ThemeButton } from "../../../../components/common/Button";
import { PagedListingProps } from "../ExtraManagePane";
import ExtraManagePaneListingExtra from "../ExtraManagePaneListingExtra";

interface Props extends PagedListingProps {
  isReadonly: boolean;
  minimum?: number;
  maximum?: number;
}
export const ExtraManagePaneAddListing: React.FC<Props> = ({
  isReadonly,
  minimum = 1,
  maximum = 10,
  extra,
  collapsibleComponentProps,
  ContentComponent,
  contentComponentProps,
  onAdd,
  showQuantity = true,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ExtraManagePaneListingExtra
      headerCallout={
        <ThemeButton onClick={() => onAdd(extra, 1)} size="small">
          Add
        </ThemeButton>
      }
      {...collapsibleComponentProps}
    >
      <ContentComponent {...contentComponentProps} />
      {!isReadonly && showQuantity && (
        <div className="ct-extra-manage-pane__quantity">
          <div className="ct-extra-manage-pane__quantity-manager">
            <SimpleQuantity
              quantity={quantity}
              minimum={minimum}
              maximum={maximum}
              onUpdate={(quantity) => setQuantity(quantity)}
              isReadonly={isReadonly}
            />
          </div>
          <div className="ct-extra-manage-pane__quantity-action">
            <ThemeButton
              onClick={() =>
                onAdd(extra, HelperUtils.clampInt(quantity, minimum, maximum))
              }
              size="small"
            >
              Add {quantity}
            </ThemeButton>
          </div>
        </div>
      )}
    </ExtraManagePaneListingExtra>
  );
};

export default ExtraManagePaneAddListing;
