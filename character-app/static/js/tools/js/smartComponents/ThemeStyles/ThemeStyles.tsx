import Color from "color";
import jss, { StyleSheet } from "jss";
import preset from "jss-preset-default";
import * as React from "react";

import {
  Constants,
  DecorationInfo,
  DecorationUtils,
} from "@dndbeyond/character-rules-engine/es";

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

  borderClassNames: string = `& stcs-spells-level-casting,
                                & stcs-features__management-link,
                                & stcs-spells-spell + stcs-spells-spell,
                                & stcs-inventory-item + stcs-inventory-item,
                                & stcs-attunement__item + stcs-attunement__item,
                                & stcs-feats-manage-pane__feat,
                                & stcs-equipment__overview,
                                & stcs-saving-throws-pane__details,
                                & stcs-saving-throws-pane__description,
                                & stcs-sense-manage-pane__customize,
                                & stcs-sense-manage-pane__description,
                                & stcs-proficiencies-pane__proficiency + stcs-proficiencies-pane__proficiency,
                                & stcs-proficiency-groups__group + stcs-proficiency-groups__group,
                                & stcs-proficiencies-pane__groups,
                                & stcs-skill-pane__customize,
                                & stcs-skill-pane__description,
                                & stcs-skills__col--skill,
                                & stcs-skills__col--modifier,
                                & stcs-ability-pane__description,
                                & stcs-speed-manage-pane__customize,
                                & stcs-speed-manage-pane__description,
                                & stcs-armor-manage-pane__items,
                                & stcs-armor-manage-pane__customize,
                                & stcs-armor-manage-pane__description,
                                & stcs-health-manager__deathsaves,
                                & stcs-health-manager__restore-life,
                                & stcs-health-manager__health,
                                & stcs-health-manager__overrides,
                                & stcs-defense-manage-pane__custom,
                                & stcs-condition-manage-pane__condition--special,
                                & stcs-currency-pane__currency + stcs-currency-pane__currency,
                                & stcs-currency-pane__adjuster,
                                & stcs-currency-pane__lifestyle,
                                & stcs-currency-pane__total,
                                & stcs-extra-manage-pane__group-heading,
                                & stcs-extra-manage-pane__extra,
                                & stcs-extra-manage-pane__extras,
                                & stcs-item-detail__customize,
                                & stcs-item-detail__customize,
                                & stcs-item-detail__description,
                                & stcs-item-detail__actions,
                                & stcs-spell-caster,
                                & stcs-spell-detail__customize,
                                & stcs-spell-detail__properties,
                                & stcs-spell-detail__description,
                                & stcs-action-detail__customize,
                                & stcs-action-detail__properties,
                                & stcs-action-detail__description,
                                & stcs-action-detail__limited-uses,
                                & stcs-background-pane__data,
                                & .line,
                                & stcs-feat-pane__prerequisite,
                                & stcs-feat-pane__footer,
                                & stcs-infusions__infusion + stcs-infusions__infusion,
                                & stcs-infusions__infusion-item + stcs-infusions__infusion-item,
                                & stcs-infusion-choice-pane__step,
                                & stcs-infusion-choice-pane__actions,
                                & stcs-infusion-choice-pane__description,
                                & stcs-infusion-choice-pane__ui-group,
                                & stcs-campaign-pane__header,
                                & stcs-campaign-pane__characters,
                                & stcs-campaign-pane__character,
                                & stcs-campaign-pane__character + stcs-campaign-pane__character,
                                & stcs-inventory__actions--collapsed,
                                & stcs-equipment-manage-pane__custom,
                                & stcs-item-detail-abilities__limited-uses,
                                & stcs-item-detail-abilities__spells,
                                & stcs-decorate-pane__preferences,
                                & stcs-decorate-pane__current-selections,
                                & stcs-decorate-pane__preferences-content,
                                & stcs-item-detail__class-customize,
                                & stcs-main-mobile__campaign,
                                & stcs-item-detail__infusion,
                                & stcs-currency-pane__lifestyle-detail,
                                & stcs-currency-pane__subheader,
                                & stcs-preferences-pane__field-heading,
                                & stcs-vehicle-pane__customize,
                                & stcs-custom-action-pane__customize,
                                & stcs-custom-action-pane__actions`;

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
              "& stcs-section-placeholder__icon": {
                borderColor: themeColor,
              },
              "& stcs-campaign-pane__character-preview": {
                borderColor: themeColor,
              },
              "& stcs-content-group__header": {
                borderColor: Color(themeColor).alpha(0.4).rgb().string(),
              },
              "& stcs-skills__col--stat-modified": {
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
              "& stcs-equipment__builder-link-text, & stcs-extra-manage-pane__group-heading":
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
              "& .ddbc-combat-attack__damage, & stcs-spells-spell__damage, & .ddbc-spell-damage-effect":
                {
                  "& .integrated-dice__container:hover": {
                    borderWidth: "2px",
                  },
                },
              "& stcs-slot-manager": {
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
              "& .ddbc-combat-attack__damage, & stcs-spells-spell__damage, & .ddbc-spell-damage-effect, stcs-reset-pane__hitdie-manager":
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
              "& stcs-spells-filter, & stcs-inventory-filter, & stcs-extras-filter":
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
            "&-theme-button--filledstcs-button": {
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
            "&-theme-button--outlinestcs-button": {
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
          ".site stcs-character-sheet--dark-mode .ct, .site stcs-sidebar--is-dark-mode .ct":
            {
              "&-theme-button--filledstcs-button": {
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
              "&-theme-button--outlinestcs-button": {
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
          ".site stcs-character-sheet--dark-mode": {
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
          "stcs-inventory__action": {
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
