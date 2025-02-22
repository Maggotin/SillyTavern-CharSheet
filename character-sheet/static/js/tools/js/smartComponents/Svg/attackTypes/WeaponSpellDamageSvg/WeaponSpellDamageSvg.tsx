import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const WeaponSpellDamageSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 21.97 22.38">
      <path
        fill={fillColor}
        d="M14.28 2.7l-.06.06.04-.15.02.09zM13.81 7.36l.45-1.83.45 1.83 1.59.5-1.53.27-.51 1.88-.5-1.88-.88-.16-.64-.11.78-.25.79-.25zM10.79 8.33l1.82.32-.32.82-1.5-1.14zM7.98 14.83l2.04.65-1.97.34-.65 2.42-.65-2.42-1.94-.34 2.01-.65.04-.16.54-2.18.47 1.88.11.46z"
      />
      <path
        fill={fillColor}
        d="M.7 15.79l.05.01-.3.05 3.69-3.11L.15 9.35h4.11L0 0l5.52 4.58-.92-3.53L6.74 2.8 8.18.43l1.01 3.86L12.58.98l-1.31 4.85 2.95-3.07-.99 4.05-3.11 1-2.83-2.16a.927.927 0 00-.59-.21 1.002 1.002 0 00-.84 1.57l1.38 1.98-1.25 5.09z"
      />
      <path
        fill={fillColor}
        d="M7.71 9.66l2.75 3.96-1.62.47-.04-.01-1.09-4.42z"
      />
      <path
        fill={fillColor}
        d="M21.97 21.03l-.7.65-.64.7-3.32-3.39-2.22 2.26-1.12-.81 2.05-2.03-2.04-2.58-.11-.14-2.69-3.41-4.59-5.81 5.16 4.36 6.42 5.44 1.87-1.89.81 1.11-2.27 2.23 3.39 3.31zM14.55 3.76l-.27-1.06 1.16-1.2-.89 2.26z"
      />
    </BaseSvg>
  );
};

export default WeaponSpellDamageSvg;
