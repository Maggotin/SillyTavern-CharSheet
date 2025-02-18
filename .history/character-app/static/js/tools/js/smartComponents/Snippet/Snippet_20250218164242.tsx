import * as React from "react";
import JsxParser from "react-jsx-parser";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  Constants,
  EntityLimitedUseContract,
  LevelScaleContract,
  SnippetContextData,
  SnippetData,
  SnippetUtils,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";

interface Props {
  snippetData: SnippetData;
  levelScale?: LevelScaleContract | null;
  classLevel?: number | null;
  limitedUse?: EntityLimitedUseContract | null;
  className: string;
  parseSnippet: boolean;
  theme?: CharacterTheme;
  proficiencyBonus: number;
}
export default class Snippet extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    parseSnippet: true,
  };

  convertSnippetToHtml = (snippetString: string): string => {
    const {
      levelScale,
      classLevel,
      limitedUse,
      snippetData,
      proficiencyBonus,
      theme,
    } = this.props;

    let contextData: SnippetContextData = {};
    if (levelScale) {
      contextData.levelScale = levelScale;
    }
    if (classLevel) {
      contextData.classLevel = classLevel;
    }
    if (limitedUse) {
      contextData.limitedUse = limitedUse;
    }

    const snippetChunks = SnippetUtils.generateSnippetChunks(
      snippetString,
      contextData,
      snippetData,
      proficiencyBonus
    );
    const htmlChunkString: string = snippetChunks
      .map((contentChunk) => {
        switch (contentChunk.type) {
          case Constants.SnippetContentChunkTypeEnum.TAG:
            switch (contentChunk.data.type) {
              case Constants.SnippetTagDataTypeEnum.ERROR:
                let messageParts: Array<string> = [];
                if (contentChunk.data.raw.trim()) {
                  messageParts.push(contentChunk.data.raw);
                }
                messageParts.push(contentChunk.data.value);
                return `<span class="ddbc-snippet__tag--error" title="${
                  contentChunk.data.raw
                }">${messageParts.join(" - ")}</span>`;

              case Constants.SnippetTagDataTypeEnum.NUMBER:
                return `<Tooltip isDarkMode="${theme?.isDarkMode}" title="${
                  contentChunk.data.raw
                }"><span class="ddbc-snippet__tag">${contentChunk.data.value.toLocaleString()}</span></Tooltip>`;

              case Constants.SnippetTagDataTypeEnum.STRING:
              default:
                return `<Tooltip isDarkMode="${theme?.isDarkMode}" title="${contentChunk.data.raw}"><span class="ddbc-snippet__tag">${contentChunk.data.value}</span></Tooltip>`;
            }

          case Constants.SnippetContentChunkTypeEnum.TEXT:
          default:
            return contentChunk.data;
        }
      })
      .join("");

    const finalHtmlString: string = htmlChunkString
      .replace(/[{}]/g, "")
      .replace(/\s*\n+?\s*\n*/g, "</p><p>");

    return `<p>${finalHtmlString}</p>`;
  };

  render() {
    const { children, className, parseSnippet, theme } = this.props;

    if (!children) {
      return null;
    }

    let classNames: Array<string> = ["ddbc-snippet", className];
    if (parseSnippet) {
      classNames.push("ddbc-snippet--parsed");
    } else {
      classNames.push("ddbc-snippet--unparsed");
    }
    if (theme?.isDarkMode) {
      classNames.push("ddbc-snippet--dark-mode");
    }

    let contentNode: React.ReactNode;
    if (typeof children === "string") {
      if (parseSnippet) {
        contentNode = (
          <JsxParser
            className="ddbc-snippet__content"
            components={{ Tooltip }}
            jsx={this.convertSnippetToHtml(children)}
          />
        );
      } else {
        contentNode = (
          <HtmlContent className="ddbc-snippet__content" html={children} />
        );
      }
    }

    return <div className={classNames.join(" ")}>{contentNode}</div>;
  }
}
