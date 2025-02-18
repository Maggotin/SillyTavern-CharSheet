import React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
} from "../../character-components/es";

interface Props {
  headerCallout: React.ReactNode;
  heading: React.ReactNode;
  metaItems: Array<React.ReactNode>;
}
export const ExtraManagePaneListingExtra: React.FC<Props> = ({
  headerCallout,
  heading,
  metaItems,
  children,
}) => {
  let header: React.ReactNode = (
    <CollapsibleHeaderContent
      heading={heading}
      metaItems={metaItems}
      callout={headerCallout}
    />
  );

  return (
    <Collapsible
      layoutType={"minimal"}
      header={header}
      className="ct-extra-manage-pane__extra"
    >
      {children}
    </Collapsible>
  );
};

export default ExtraManagePaneListingExtra;
