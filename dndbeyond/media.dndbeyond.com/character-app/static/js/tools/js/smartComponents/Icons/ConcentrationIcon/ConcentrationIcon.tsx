import clsx from "clsx";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import { Tooltip } from "~/components/Tooltip";

import {
  DarkConcentrationSvg,
  GrayConcentrationSvg,
  LightConcentrationSvg,
} from "../../Svg";
import styles from "./styles.module.css";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  themeMode?: "dark" | "gray" | "light";
  className: string;
}
export default class ConcentrationIcon extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    themeMode: "dark",
  };

  render() {
    const { themeMode, className, ...props } = this.props;
    const id = uuidv4();

    let SvgIcon: React.ComponentType<SvgInjectedProps> | null = null;

    switch (themeMode) {
      case "light":
        SvgIcon = LightConcentrationSvg;
        break;
      case "gray":
        SvgIcon = GrayConcentrationSvg;
        break;
      case "dark":
      default:
        SvgIcon = DarkConcentrationSvg;
    }

    if (SvgIcon === null) {
      return null;
    }

    return (
      <div
        className={clsx([styles.concentrationIcon, className])}
        data-tooltip-id={id}
        data-tooltip-content="Concentration"
      >
        <SvgIcon className={styles.svg} {...props} />
        <Tooltip id={id} />
      </div>
    );
  }
}
