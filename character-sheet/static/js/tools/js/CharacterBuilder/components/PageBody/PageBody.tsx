import { FC, HTMLAttributes } from "react";
import { useSelector } from "react-redux";

import { BuilderMethod } from "~/subApps/builder/constants";

import { PortraitName } from "../../../../../subApps/builder/components/PortraitName";
import { builderSelectors } from "../../selectors";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const PageBody: FC<Props> = ({ children, ...props }) => {
  const builderMethod = useSelector(builderSelectors.getBuilderMethod);

  return (
    <div className="builder-page-body" {...props}>
      {builderMethod === BuilderMethod.STEP_BY_STEP && (
        <div className="builder-page-body-character-name">
          <PortraitName useDefaultCharacterName={true} />
        </div>
      )}
      {children}
    </div>
  );
};
