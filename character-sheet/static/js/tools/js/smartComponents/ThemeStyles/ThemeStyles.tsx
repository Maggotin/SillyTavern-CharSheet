import Color from "color";
import preset from "jss-preset-default";
import jss, { StyleSheet } from "jss";
import * as React from "react";

import {
  Constants,
  DecorationInfo,
  DecorationUtils,
} from '../../../../../src/character-rules-engine';

import { SvgConstantDarkModeBackgroundColor } from './componentConstants';

interface Props {
  baseUrl: string;
  decorationInfo: DecorationInfo;
  desktopStartWidth: number;
  desktopLargeStartWidth: number;
  insertionPointElId: string;
}

export default class ThemeStyles extends React.PureComponent<Props> {
  static defaultProps = {
    baseUrl: "",
    desktopStartWidth: 1024,
    desktopLargeStartWidth: 1200,
    insertionPointElId: "site",
  };

  sheet: StyleSheet | null = null;

  borderClassNames: string = `& .ct-spells-level-casting,
                                & .ct-features__management-link,
                                & .ct-spells-spell + .ct-spells-spell,
                                & .ct-inventory-item + .ct-inventory-item,
                                & .ct-attunement__item + .ct-attunement__item,
                                & .ct-feats-manage-pane__feat,
                                & .ct-equipment__overview,
                                & .ct-saving-throws-pane__details,
                                & .ct-saving-throws-pane__description,
                                & .ct-sense-manage-pane__customize,
                                & .ct-sense-manage-pane__description,
                                & .ct-proficiencies-pane__proficiency + .ct-proficiencies-pane__proficiency,
                                & .ct-proficiency-groups__group + .ct-proficiency-groups__group,
                                & .ct-proficiencies-pane__groups,
                                & .ct-skill-pane__customize,
                                & .ct-skill-pane__description,
                                & .ct-skills__col--skill,
                                & .ct-skills__col--modifier,
                                & .ct-ability-pane__description,
                                & .ct-speed-manage-pane__customize,
                                & .ct-speed-manage-pane__description,
                                & .ct-armor-manage-pane__items,
                                & .ct-armor-manage-pane__customize,
                                & .ct-armor-manage-pane__description,
                                & .ct-health-manager__deathsaves,
                                & .ct-health-manager__restore-life,
                                & .ct-health-manager__health,
                                & .ct-health-manager__overrides,
                                & .ct-defense-manage-pane__custom,
                                & .ct-condition-manage-pane__condition--special,
                                & .ct-currency-pane__currency + .ct-currency-pane__currency,
                                & .ct-currency-pane__adjuster,
                                & .ct-currency-pane__lifestyle,
                                & .ct-currency-pane__total,
                                & .ct-extra-manage-pane__group-heading,
                                & .ct-extra-manage-pane__extra,
                                & .ct-extra-manage-pane__extras,
                                & .ct-item-detail__customize,
                                & .ct-item-detail__customize,
                                & .ct-item-detail__description,
                                & .ct-item-detail__actions,
                                & .ct-spell-caster,
                                & .ct-spell-detail__customize,
                                & .ct-spell-detail__properties,
                                & .ct-spell-detail__description,
                                & .ct-action-detail__customize,
                                & .ct-action-detail__properties,
                                & .ct-action-detail__description,
                                & .ct-action-detail__limited-uses,
                                & .ct-background-pane__data,
                                & .line,
                                & .ct-feat-pane__prerequisite,
                                & .ct-feat-pane__footer,
                                & .ct-infusions__infusion + .ct-infusions__infusion,
                                & .ct-infusions__infusion-item + .ct-infusions__infusion-item,
                                & .ct-infusion-choice-pane__step,
                                & .ct-infusion-choice-pane__actions,
                                & .ct-infusion-choice-pane__description,
                                & .ct-infusion-choice-pane__ui-group,
                                & .ct-campaign-pane__header,
                                & .ct-campaign-pane__characters,
                                & .ct-campaign-pane__character,
                                & .ct-campaign-pane__character + .ct-campaign-pane__character,
                                & .ct-inventory__actions--collapsed,
                                & .ct-equipment-manage-pane__custom,
                                & .ct-item-detail-abilities__limited-uses,
                                & .ct-item-detail-abilities__spells,
                                & .ct-decorate-pane__preferences,
                                & .ct-decorate-pane__current-selections,
                                & .ct-decorate-pane__preferences-content,
                                & .ct-item-detail__class-customize,
                                & .ct-main-mobile__campaign,
                                & .ct-item-detail__infusion,
                                & .ct-currency-pane__lifestyle-detail,
                                & .ct-currency-pane__subheader,
                                & .ct-preferences-pane__field-heading,
                                & .ct-vehicle-pane__customize,
                                & .ct-custom-action-pane__customize,
                                & .ct-custom-action-pane__actions`;

  componentDidMount() {
    const { insertionPointElId } = this.props;
    let setupConfig = preset();
    const insertionPointElement = document.getElementById(insertionPointElId);
    if (insertionPointElement) {
      setupConfig = {
        ...setupConfig,
        insertionPoint: insertionPointElement,
      };
    }
    jss.setup(setupConfig);
    this.renderStyleSheet(this.props);
  }

  componentWillUnmount() {
    this.removeStyleSheet();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    this.removeStyleSheet();
    this.renderStyleSheet(this.props);
  }

  renderStyleSheet = (props: Props): void => {
    const { decorationInfo } = props;
    const isDarkMode = DecorationUtils.isDarkMode(decorationInfo);
    const theme = DecorationUtils.getCharacterTheme(decorationInfo);
    const { themeColor, isDefault } = theme;
    this.sheet = jss.createStyleSheet({});
    const themeButtonTextColor = Color(themeColor).isDark() ? "white" : "black";
    if ((!isDefault && themeColor) || (isDarkMode && themeColor)) {
      this.sheet.addRules({
        "@global": {
          ".ddbc": {
            "&-exclusive-checkbox--dark-mode": {
              borderColor: themeColor,
              "& .ddbc-exclusive-checkbox__slot + .ddbc-exclusive-checkbox__slot": {
                borderColor: themeColor,
                "&::before": {
                  backgroundColor: themeColor,
                  color: themeButtonTextColor,
                },
              },
            },
            "&-character-avatar": {
              "&__portrait": {
                borderColor: themeColor,
              },
            },
            "&-toggle-field": {
              "&--is-enabled": {
                backgroundColor: Color(themeColor).lightness(80).rgb().string(),
              },
              "&--is-enabled &__nub": {
                backgroundColor: themeColor,
              },
            },
          },
          ".stcs": {
            "&-character-sheet--dark-mode, &-sidebar--is-dark-mode": {
              colorScheme: "dark",
              "& .stcs-section-placeholder__icon": {
                borderColor: themeColor,
              },
              "& .stcs-campaign-pane__character-preview": {
                borderColor: themeColor,
              },
              "& .stcs-content-group__header": {
                borderColor: Color(themeColor).alpha(0.4).rgb().string(),
              },
              "& .stcs-skills__col--stat-modified": {
                color: themeColor,
              },
              "& .starting-equipment-rule-slots": {
                backgroundColor: Constants.CharacterColorEnum.DARKMODE_BLACK,
                color: "var(--character-muted-color)",
                borderColor: themeColor,
                "& .starting-equipment-rule-slot": {
                  borderColor: themeColor,
                },
                "&__subheader": {
                  borderColor: themeColor,
                },
              },
            },
            "&-quick-nav": {
              "&__toggle": {
                backgroundColor: themeColor,
              },
              "&__edge-toggle": {
                backgroundColor: themeColor,
              },
              "&__button": {
                borderColor: themeColor,
                "&:hover": {
                  borderColor: Color(themeColor).darken(0.1).rgb().string(),
                },
              },
            },
            "&-combat-tablet": {
              "&__cta": {
                "&-button": {
                  borderColor: themeColor,
                },
              },
            },
            "&-combat-mobile": {
              borderColor: themeColor,
              "&__cta": {
                "&-button": {
                  borderColor: themeColor,
                },
              },
              "&__extras": {
                borderColor: themeColor,
              },
            },
            "&-spells-mobile": {
              "&__tab": {
                "&-level": {
                  "&-callout": {
                    backgroundColor: themeColor,
                  },
                },
              },
            },
            "&-status-summary-mobile": {
              "&__health": {
                borderColor: themeColor,
              },
              "&__button": {
                borderColor: themeColor,
                "&--active": {
                  backgroundColor: themeColor,
                },
              },
            },
            "&-character-header": {
              "&__group": {
                "&--game-log": {
                  borderColor: themeColor,
                },
              },
            },
            "&-character-header-desktop": {
              "&__button": {
                borderColor: themeColor,
              },
            },
            "&-character-header-tablet": {
              "&__button": {
                borderColor: themeColor,
              },
            },
            "&-tablet-box": {
              "&__border": {
                borderColor: themeColor,
              },
            },
            "&-tablet-group": {
              "&__header": {
                "&-content": {
                  color: themeColor,
                },
              },
            },
            "&-content-group": {
              "&__header-content": {
                color: themeColor,
              },
            },
            "&-class-detail": {
              "&__name": {
                color: themeColor,
              },
            },
            "&-creature-manage-pane": {
              "&__group": {
                "&-heading": {
                  color: themeColor,
                },
              },
            },
          },
          ".spell-caster": {
            "&-action": {
              "&-identifier, &-count": {
                borderColor: themeColor,
                color: themeColor,
              },
            },
          },
          ".body-rpgcharacter-sheet .site-bar": {
            borderColor: themeColor,
          },
          ".site .stcs-character-sheet--dark-mode .stcs, .site .stcs-sidebar--is-dark-mode .stcs": {
            "&-theme-button--filled.stcs-button": {
              backgroundColor: themeColor,
              color: themeButtonTextColor,
              "&:focus": {
                color: themeButtonTextColor,
                backgroundColor: themeColor,
                boxShadow: `0 0 3px 1px ${Color(themeColor)
                  .darken(0.2)
                  .alpha(0.2)
                  .rgb()
                  .string()}`,
              },
              "&:disabled, &:disabled:hover": {
                backgroundColor: Color(
                  Constants.CharacterColorEnum.DARKMODE_BLACK
                )
                  .lighten(0.4)
                  .rgb()
                  .string(),
                boxShadow: "unset",
                color: "#627481",
              },
              "&:hover, &:active": {
                color: themeButtonTextColor,
                backgroundColor: Color(themeColor).darken(0.1).rgb().string(),
                boxShadow: `0 0 10px 2px ${Color(themeColor)
                  .darken(0.2)
                  .rgb()
                  .string()} inset`,
              },
            },
          },
          ".site .stcs-character-sheet--dark-mode": {
            "& .ddbc": {
              "&-saving-throws-summary": {
                "& .integrated-dice__container": {
                  "&:hover": {
                    border: "0",
                    backgroundColor: "transparent",
                  },
                  "&:hover ~ .ddbc-saving-throw-selection-small-box-svg": {
                    fill: Color(themeColor).alpha(0.2).rgb().string(),
                  },
                  "&:hover ~ .ddbc-saving-throw-selection-box-svg": {
                    fill: Color(themeColor).alpha(0.2).rgb().string(),
                  },
                },
                "& .ddbc-saving-throw-selection-small-box-svg path": {
                  stroke: Color(themeColor).rgb().string(),
                },
                "& .ddbc-saving-throw-selection-box-svg path": {
                  stroke: Color(themeColor).rgb().string(),
                },
              },
            },
            ".stcs-inventory__action": {
              color: Color(themeColor).rgb().string(),
            },
          },
        },
      });
    }

    if (this.sheet) {
      this.sheet.attach();
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