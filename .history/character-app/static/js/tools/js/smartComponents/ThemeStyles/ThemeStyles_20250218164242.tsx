import Color from "color";
import jss, { StyleSheet } from "jss";
import preset from "jss-preset-default";
import * as React from "react";

import {
  Constants,
  DecorationInfo,
  DecorationUtils,
} from "../../character-rules-engine/es";

import { SvgConstantDarkModeBackgroundColor } from "../componentConstants";

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
    let insertionPointElement = document.getElementById(insertionPointElId);
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

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    this.removeStyleSheet();
    this.renderStyleSheet(this.props);
  }

  renderStyleSheet = (props: Props): void => {
    const { decorationInfo, desktopStartWidth, desktopLargeStartWidth } = props;

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
              "& .ddbc-exclusive-checkbox__slot + .ddbc-exclusive-checkbox__slot":
                {
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
            "&-number-bar": {
              "&__option": {
                "&--active": {
                  backgroundColor: themeColor,
                  "&:hover": {
                    backgroundColor: Color(themeColor)
                      .darken(0.1)
                      .rgb()
                      .string(),
                  },
                },
                "&--implied": {
                  backgroundColor: Color(themeColor)
                    .lightness(80)
                    .rgb()
                    .string(),
                  "&:hover": {
                    backgroundColor: Color(themeColor)
                      .lightness(80)
                      .darken(0.1)
                      .rgb()
                      .string(),
                  },
                },
              },
            },
            "&-collapsible": {
              "&--opened > &__header": {
                borderColor: themeColor,
              },
            },
            "&-xp-bar": {
              "&__progress-inner": {
                backgroundColor: themeColor,
              },
              "&__progress-marker": {
                "&::before": {
                  backgroundColor: themeColor,
                },
              },
            },
            "&-popout-menu": {
              "&::before": {
                borderBottomColor: themeColor,
              },
            },
            "&-campaign-summary": {
              borderColor: themeColor,
            },
          },
          ".ct": {
            "&-character-sheet--dark-mode, &-sidebar--is-dark-mode": {
              colorScheme: "dark",
              "& .ct-section-placeholder__icon": {
                borderColor: themeColor,
              },
              "& .ct-campaign-pane__character-preview": {
                borderColor: themeColor,
              },
              "& .ct-content-group__header": {
                borderColor: Color(themeColor).alpha(0.4).rgb().string(),
              },
              "& .ct-skills__col--stat-modified": {
                color: themeColor,
              },
              "& .starting-equipment-rule-slots": {
                backgroundColor: Constants.CharacterColorEnum.DARKMODE_BLACK,
                color: "var(--character-muted-color)",
                borderColor: themeColor,
                "& .starting-equipment-rule-slot": {
                  "&-disabled, &-inactive": {
                    backgroundColor: "rgba(55, 75, 89, 0.86)",
                  },
                  "& + .starting-equipment-rule-slot": {
                    borderColor: themeColor,
                    "&::before": {
                      backgroundColor: themeColor,
                      color: themeButtonTextColor,
                    },
                  },
                },
              },
              "& .ct-equipment__builder-link-text, & .ct-extra-manage-pane__group-heading":
                {
                  color: themeColor,
                },
              "& .integrated-dice__container": {
                borderColor: themeColor,
                color: "#fff",
                "&:hover": {
                  backgroundColor: Color(themeColor).alpha(0.2).string(),
                  border: `1px solid ${Color(themeColor)
                    .lighten(0.1)
                    .string()}`,
                },
              },
              "& .ddbc-combat-attack__damage, & .ct-spells-spell__damage, & .ddbc-spell-damage-effect":
                {
                  "& .integrated-dice__container:hover": {
                    borderWidth: "2px",
                  },
                },
              "& .ct-slot-manager": {
                "&__slot": {
                  boxShadow: "unset",
                  backgroundColor: SvgConstantDarkModeBackgroundColor,
                  "&--used": {
                    borderColor: themeColor,
                    "&::before": {
                      backgroundColor: themeColor,
                    },
                  },
                },
              },
              "& .ddbc-combat-attack__damage, & .ct-spells-spell__damage, & .ddbc-spell-damage-effect, .ct-reset-pane__hitdie-manager":
                {
                  "& .integrated-dice__container:hover": {
                    borderWidth: "2px",
                  },
                  "& .integrated-dice__container": {
                    borderColor: themeColor,
                    borderStyle: "solid",
                    color: "#fff",
                    backgroundColor: "unset",
                    "&:hover": {
                      backgroundColor: Color(themeColor).alpha(0.2).string(),
                      border: `1px solid ${Color(themeColor)
                        .lighten(0.1)
                        .string()}`,
                    },
                  },
                },
              [this.borderClassNames]: {
                borderColor: Color(themeColor).alpha(0.4).rgb().string(),
              },
              "& .line": {
                backgroundColor: Color(themeColor).alpha(0.4).rgb().string(),
              },
              "& .ct-spells-filter, & .ct-inventory-filter, & .ct-extras-filter":
                {
                  "&__clear": {
                    color: themeColor,
                  },
                  "&__advanced-callout": {
                    backgroundColor: themeColor,
                    color: themeButtonTextColor,
                  },
                  "&__active": {
                    backgroundColor: themeColor,
                    color: themeButtonTextColor,
                    "&:hover": {
                      backgroundColor: Color(themeColor)
                        .darken(0.1)
                        .rgb()
                        .string(),
                    },
                    "&-remove-icon": {
                      color: themeButtonTextColor,
                      "&:hover": {
                        backgroundColor: Color(themeColor)
                          .darken(0.1)
                          .rgb()
                          .string(),
                      },
                    },
                  },
                  "&__adv": {
                    "&-filter": {
                      "&-button": {
                        backgroundColor:
                          Constants.CharacterColorEnum.DARKMODE_BLACK,
                        color: "var(--character-muted-color)",
                        "&:hover": {
                          backgroundColor: Color(themeColor)
                            .darken(0.2)
                            .alpha(0.2)
                            .rgb()
                            .string(),
                        },
                        "&--active": {
                          backgroundColor: themeColor,
                          color: themeButtonTextColor,
                          "&:hover": {
                            backgroundColor: Color(themeColor)
                              .darken(0.1)
                              .rgb()
                              .string(),
                          },
                        },
                      },
                    },
                  },
                },
            },

            "&-box-background": {
              "&__content": {
                borderColor: themeColor,
              },
            },
            "&-slot-manager": {
              "&__slot": {
                "&--used": {
                  "&::before": {
                    backgroundColor: themeColor,
                  },
                },
              },
            },
            "&-spells": {
              "&__tab": {
                "&-level": {
                  "&-callout": {
                    backgroundColor: themeColor,
                  },
                },
              },
            },
            "&-spells-filter, &-inventory-filter": {
              "&__active": {
                backgroundColor: themeColor,
                "&:hover": {
                  backgroundColor: Color(themeColor).darken(0.1).rgb().string(),
                },
                "&-remove": {
                  "&:hover": {
                    backgroundColor: Color(themeColor)
                      .darken(0.2)
                      .rgb()
                      .string(),
                  },
                },
              },
              "&__clear": {
                color: themeColor,
              },
              "&__advanced": {
                "&-callout": {
                  backgroundColor: themeColor,
                },
              },
              "&__adv": {
                "&-filter": {
                  "&-button": {
                    "&--active": {
                      backgroundColor: themeColor,
                      "&:hover": {
                        backgroundColor: Color(themeColor)
                          .darken(0.1)
                          .rgb()
                          .string(),
                      },
                    },
                  },
                },
              },
            },
            "&-spell-caster": {
              "&__casting": {
                "&-action": {
                  "&-count": {
                    color: themeColor,
                    borderColor: themeColor,
                  },
                },
              },
            },
            "&-spell-manager": {
              "&__spell": {
                "&-always": {
                  color: themeColor,
                },
              },
            },
            "&-xp-pane": {
              "&__change-type": {
                "&--active": {
                  borderColor: themeColor,
                },
              },
            },
            "&-campaign-pane": {
              "&__character-name-text": {
                color: themeColor,
              },
              "&__character-preview": {
                borderColor: themeColor,
              },
            },
            "&-character-manage-pane": {
              "&__summary-avatar": {
                borderColor: themeColor,
              },
              "&__class-list": {
                "&-item": {
                  "&-level": {
                    borderColor: themeColor,
                  },
                },
              },
            },
            "&-currency-pane": {
              "&__total": {
                borderColor: themeColor,
              },
              "&__subheader": {
                borderColor: themeColor,
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
          ".site .ddbc": {
            "&-theme-link": {
              color: themeColor,
              "&:focus, &:active, &:hover": {
                color: themeColor,
              },
            },
          },
          ".site .ct": {
            "&-theme-button--filled.ct-button": {
              backgroundColor: themeColor,

              "&:focus": {
                color: "#fff",
                backgroundColor: themeColor,
                boxShadow: `0 0 3px 1px ${Color(themeColor)
                  .darken(0.2)
                  .alpha(0.2)
                  .rgb()
                  .string()}`,
              },
              "&:hover, &:active": {
                color: "#fff",
                backgroundColor: Color(themeColor).darken(0.1).rgb().string(),
                boxShadow: `0 0 10px 2px ${Color(themeColor)
                  .darken(0.2)
                  .rgb()
                  .string()} inset`,
              },
            },
            "&-theme-button--outline.ct-button": {
              backgroundColor: "#fff",
              color: themeColor,
              borderColor: themeColor,

              "&:focus": {
                backgroundColor: "#fff",
                color: themeColor,
                boxShadow: `0 0 3px 1px ${Color(themeColor)
                  .darken(0.2)
                  .alpha(0.2)
                  .rgb()
                  .string()}`,
              },
              "&:hover, &:active": {
                backgroundColor: "#fff",
                color: themeColor,
                boxShadow: `0 0 2px ${Color(themeColor)
                  .darken(0.1)
                  .rgb()
                  .string()}`,
              },
            },
          },
          ".site .ct-character-sheet--dark-mode .ct, .site .ct-sidebar--is-dark-mode .ct":
            {
              "&-theme-button--filled.ct-button": {
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
              "&-theme-button--outline.ct-button": {
                backgroundColor: "#10161adb",
                color: "white",
                borderColor: themeColor,

                "&:focus": {
                  backgroundColor: Color(themeColor).alpha(0.2).rgb().string(),
                  color: "white",
                  boxShadow: `0 0 3px 1px ${Color(themeColor)
                    .darken(0.2)
                    .alpha(0.2)
                    .rgb()
                    .string()}`,
                },
                "&:hover, &:active": {
                  backgroundColor: Color(themeColor).alpha(0.2).rgb().string(),
                  color: "white",
                  boxShadow: `0 0 2px ${Color(themeColor)
                    .darken(0.1)
                    .rgb()
                    .string()}`,
                },
                "&:disabled, &:disabled:hover": {
                  color: "#627481",
                  boxShadow: "unset",
                  backgroundColor: "#000",
                  borderColor: "#627481",
                },
              },
              "&-theme-input": {
                backgroundColor: "#10161adb",
                color: "white",
                borderColor: themeColor,

                "&:focus": {
                  backgroundColor: "#10161adb",
                  color: "white",
                  boxShadow: `0 0 3px 1px ${Color(themeColor)
                    .darken(0.2)
                    .alpha(0.2)
                    .rgb()
                    .string()}`,
                },
                "&:hover, &:active": {
                  backgroundColor: "#10161adb",
                  color: "white",
                  boxShadow: `0 0 2px ${Color(themeColor)
                    .darken(0.1)
                    .rgb()
                    .string()}`,
                },
              },
            },
          ".site .ct-character-sheet--dark-mode": {
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
          },
          ".ct-inventory__action": {
            color: Color(themeColor).rgb().string(),
          },
        },
      } as any);
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
