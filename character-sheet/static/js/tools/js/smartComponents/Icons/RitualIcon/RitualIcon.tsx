import clsx from "clsx";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import { Tooltip } from "~/components/Tooltip";

import { DarkRitualSvg, GrayRitualSvg, LightRitualSvg } from "../../Svg";
import styles from "./styles.module.css";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  themeMode?: "dark" | "gray" | "light";
  className: string;
}
export default class RitualIcon extends React.PureComponent<Props> {
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
        SvgIcon = LightRitualSvg;
        break;
      case "gray":
        SvgIcon = GrayRitualSvg;
        break;
      case "dark":
      default:
        SvgIcon = DarkRitualSvg;
    }

    if (SvgIcon === null) {
      return null;
    }

    return (
      <div
        className={clsx([styles.ritualIcon, className])}
        data-tooltip-id={id}
        data-tooltip-content="Ritual"
      >
        <SvgIcon className={styles.svg} {...props} />
        <Tooltip id={id} />
      </div>
    );
  }
}
