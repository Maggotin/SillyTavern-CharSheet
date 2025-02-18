import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  Note,
  FormatUtils,
  Constants,
  NoteUtils,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";

import Damage from "../Damage";
import { AoeTypeIcon, DisadvantageIcon } from "../Icons";
import { AoeTypePropType } from "../Icons/IconConstants";

interface Props {
  notes: Array<Note>;
  className: string;
  theme: CharacterTheme;
}
export default class NoteComponents extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  renderPlainText = (note: Note): React.ReactNode => {
    const { theme } = this.props;
    let classNames: Array<string> = [
      "ddbc-note-components__component",
      "ddbc-note-components__component--plain",
    ];

    if (note.data.displayIntention) {
      classNames.push(
        `ddbc-note-components__component--${note.data.displayIntention}`
      );
    }

    if (theme.isDarkMode) {
      classNames.push("ddbc-note-components__component--dark-mode");
    }

    return <span className={classNames.join(" ")}>{note.data.text}</span>;
  };

  renderTooltip = (note: Note): React.ReactNode => {
    const { theme } = this.props;
    let classNames: Array<string> = [
      "ddbc-note-components__component",
      "ddbc-note-components__component--tooltip",
    ];

    if (note.data.displayIntention) {
      classNames.push(
        `ddbc-note-components__component--${note.data.displayIntention}`
      );
    }

    if (theme.isDarkMode) {
      classNames.push("ddbc-note-components__component--dark-mode");
    }

    return (
      <Tooltip
        className={classNames.join(" ")}
        title={note.data.tooltip}
        tippyOpts={note.data.tooltipOpts}
        isDarkMode={theme.isDarkMode}
      >
        {note.data.text}
      </Tooltip>
    );
  };

  renderDistance = (note: Note): React.ReactNode => {
    const { theme } = this.props;
    let classNames: Array<string> = [
      "ddbc-note-components__component",
      "ddbc-note-components__component--distance",
    ];

    return (
      <span className={classNames.join(" ")}>
        <NumberDisplay type="distanceInFt" number={note.data.distance} />
      </span>
    );
  };

  renderAoeIcon = (note: Note): React.ReactNode => {
    const { theme } = this.props;
    let classNames: Array<string> = [
      "ddbc-note-components__component",
      "ddbc-note-components__component--aoe-icon",
    ];

    return (
      <span className={classNames.join(" ")}>
        <AoeTypeIcon
          type={FormatUtils.slugify(note.data.type) as AoeTypePropType}
          themeMode={theme?.isDarkMode ? "gray" : "dark"}
        />
      </span>
    );
    //`
  };

  renderDamage = (note: Note): React.ReactNode => {
    const { theme } = this.props;
    let classNames: Array<string> = [
      "ddbc-note-components__component",
      "ddbc-note-components__component--damage",
    ];

    return (
      <span className={classNames.join(" ")}>
        <Damage
          theme={theme}
          type={note.data.type}
          damage={note.data.damage}
          info={note.data.info}
        />
      </span>
    );
  };

  renderDisadvantageIcon = (note: Note): React.ReactNode => {
    const { theme } = this.props;

    let classNames: Array<string> = [
      "ddbc-note-components__component",
      "ddbc-note-components__component--disadvantage-icon",
    ];

    return (
      <span className={classNames.join(" ")}>
        <DisadvantageIcon theme={theme} />
      </span>
    );
  };

  renderGroup = (
    notes: Array<Note> | null,
    separator: string = " ",
    key: string | number | null = null
  ): React.ReactNode => {
    if (notes === null) {
      return null;
    }

    return (
      <React.Fragment key={key ? key : "start-note-group-key"}>
        {notes.map((note, idx): React.ReactNode => {
          if (note === null) {
            return null;
          }

          return (
            <React.Fragment key={`${NoteUtils.getType(note)}-${idx}`}>
              {this.renderNote(note)}
              {idx + 1 < notes.length ? separator : ""}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  };

  renderNote = (note: Note | null): React.ReactNode => {
    if (note === null) {
      return null;
    }

    switch (NoteUtils.getType(note)) {
      case Constants.NoteTypeEnum.PLAIN_TEXT:
        return this.renderPlainText(note);
      case Constants.NoteTypeEnum.TOOLTIP:
        return this.renderTooltip(note);
      case Constants.NoteTypeEnum.DISTANCE:
        return this.renderDistance(note);
      case Constants.NoteTypeEnum.AOE_ICON:
        return this.renderAoeIcon(note);
      case Constants.NoteTypeEnum.DAMAGE:
        return this.renderDamage(note);
      case Constants.NoteTypeEnum.DISADVANTAGE_ICON:
        return this.renderDisadvantageIcon(note);
      case Constants.NoteTypeEnum.GROUP:
        return this.renderGroup(
          note.data.notes,
          note.data.separator,
          note.data.key
        );
      default:
      // not implement
    }

    return null;
  };

  render() {
    const { notes, className } = this.props;

    let classNames: Array<string> = [className, "ddbc-note-components"];

    return (
      <div className={classNames.join(" ")}>
        {this.renderGroup(notes, ", ")}
      </div>
    );
  }
}
