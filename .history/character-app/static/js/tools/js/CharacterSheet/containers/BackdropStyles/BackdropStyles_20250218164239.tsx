import jss, { StyleSheet } from "jss";
import preset from "jss-preset-default";
import React from "react";

import { BackdropInfo } from "../../character-rules-engine/es";

import { DDB_MEDIA_URL } from "../../../../../constants";

interface Props {
  backdrop: BackdropInfo;
}
export default class BackdropStyles extends React.PureComponent<Props> {
  sheet: StyleSheet | null = null;

  componentDidMount() {
    jss.setup(preset());
    this.renderStyleSheet(this.props);
  }

  componentWillUnmount() {
    this.removeStyleSheet();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    this.removeStyleSheet();
    this.renderStyleSheet(this.props);
  }

  renderStyleSheet = (props: Props): void => {
    const { backdrop } = props;

    if (backdrop.backdropAvatarUrl !== null) {
      this.sheet = jss.createStyleSheet({});

      if (this.sheet !== null) {
        let breakpointRules: Record<string, string> = [
          { width: 768, height: 152, image: backdrop.backdropAvatarUrl },
          { width: 1024, height: 218, image: backdrop.backdropAvatarUrl },
          { width: 1200, height: 230, image: backdrop.backdropAvatarUrl },
          {
            width: 1921,
            height: 230,
            image:
              backdrop.smallBackdropAvatarUrl === null
                ? ""
                : backdrop.smallBackdropAvatarUrl,
          },
          {
            width: 2561,
            height: 230,
            image:
              backdrop.largeBackdropAvatarUrl === null
                ? ""
                : backdrop.largeBackdropAvatarUrl,
          },
        ].reduce((acc, breakpoint) => {
          acc[`@media (min-width: ${breakpoint.width}px)`] = {
            background: `url(${breakpoint.image}) no-repeat center ${breakpoint.height}px, url(${DDB_MEDIA_URL}/attachments/0/84/background_texture.png) #f9f9f9 !important`,
          };
          return acc;
        }, {});

        this.sheet.addRules({
          "@global": {
            "html body.body-rpgcharacter-sheet": breakpointRules,
          },
        });

        this.sheet.attach();
      }
    }
  };

  removeStyleSheet = (): void => {
    if (this.sheet) {
      jss.removeStyleSheet(this.sheet);
      this.sheet = null;
    }
  };

  render() {
    return null;
  }
}
