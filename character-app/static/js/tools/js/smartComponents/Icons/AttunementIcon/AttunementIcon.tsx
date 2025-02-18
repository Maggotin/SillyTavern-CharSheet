import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import { Tooltip } from "~/components/Tooltip";
import { useCharacterTheme } from "~/contexts/CharacterTheme";

import { DarkAttunementSvg, GrayAttunementSvg } from "../../Svg";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  className?: string;
  showTooltip?: boolean;
}
const AttunementIcon: React.FunctionComponent<Props> = ({
  className = "",
  showTooltip = true,
}) => {
  const { isDarkMode } = useCharacterTheme();
  let classNames: Array<string> = [className, "ddbc-attunement-icon"];

  let SvgIcon: React.ComponentType<SvgInjectedProps> = isDarkMode
    ? GrayAttunementSvg
    : DarkAttunementSvg;

  const tooltipId = `attunmentIcon-${uuidv4()}`;

  return (
    <>
      <span
        className={classNames.join(" ")}
        data-tooltip-id={tooltipId}
        data-tooltip-content="Item is Attuned"
      >
        <SvgIcon className="ddbc-attunement-icon__icon" />
      </span>
      {showTooltip && <Tooltip id={tooltipId} />}
    </>
  );
};

export default AttunementIcon;
