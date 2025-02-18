import * as React from "react";

import {
  DarkConeSvg,
  DarkCubeSvg,
  DarkCylinderSvg,
  DarkLineSvg,
  DarkSphereSvg,
  DarkSquareSvg,
  GrayConeSvg,
  GrayCubeSvg,
  GrayCylinderSvg,
  GrayLineSvg,
  GraySphereSvg,
  GraySquareSvg,
  LightConeSvg,
  LightCubeSvg,
  LightCylinderSvg,
  LightLineSvg,
  LightSphereSvg,
  LightSquareSvg,
} from "../../Svg";
import { AoeTypePropType } from "../IconConstants";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  type?: AoeTypePropType;
  themeMode?: "dark" | "gray" | "light";
  className?: string;
}
const AoeTypeIcon: React.FunctionComponent<Props> = ({
  className = "",
  themeMode = "dark",
  type,
}) => {
  const DarkSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (type) {
      case "cone":
        return DarkConeSvg;
      case "cube":
        return DarkCubeSvg;
      case "cylinder":
        return DarkCylinderSvg;
      case "line":
        return DarkLineSvg;
      case "sphere":
      case "emanation":
        return DarkSphereSvg;
      case "square":
        return DarkSquareSvg;
      default:
        return null;
    }
  };

  const GraySvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (type) {
      case "cone":
        return GrayConeSvg;
      case "cube":
        return GrayCubeSvg;
      case "cylinder":
        return GrayCylinderSvg;
      case "line":
        return GrayLineSvg;
      case "sphere":
      case "emanation":
        return GraySphereSvg;
      case "square":
        return GraySquareSvg;
      default:
        return null;
    }
  };

  const LightSvg = (): React.ComponentType<SvgInjectedProps> | null => {
    switch (type) {
      case "cone":
        return LightConeSvg;
      case "cube":
        return LightCubeSvg;
      case "cylinder":
        return LightCylinderSvg;
      case "line":
        return LightLineSvg;
      case "sphere":
      case "emanation":
        return LightSphereSvg;
      case "square":
        return LightSquareSvg;
      default:
        return null;
    }
  };

  let classNames: Array<string> = [
    className,
    "ddbc-aoe-type-icon",
    `ddbc-aoe-type-icon--${type}`,
  ];

  let SvgIcon: React.ComponentType<SvgInjectedProps> | null = null;

  switch (themeMode) {
    case "light":
      SvgIcon = LightSvg();
      break;
    case "gray":
      SvgIcon = GraySvg();
      break;
    case "dark":
    default:
      SvgIcon = DarkSvg();
  }

  if (SvgIcon === null) {
    return null;
  }

  return <SvgIcon className={classNames.join(" ")} />;
};

export default AoeTypeIcon;
