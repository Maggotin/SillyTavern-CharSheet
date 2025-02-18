import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  BeveledBoxSvg517x660,
  BeveledBoxSvg623x660,
  BoxBackground,
} from "@dndbeyond/character-components/es";
import {
  characterSelectors,
  CharacterStatusSlug,
  CharacterTheme,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { TabList } from "~/components/TabList";

import Subsection from "../../../Shared/components/Subsection";
import { StyleSizeTypeEnum } from "../../../Shared/reducers/appEnv";
import { appEnvSelectors } from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import { SheetAppState } from "../../typings";
import Actions from "../Actions";
import Description from "../Description";
import Equipment from "../Equipment";
import Extras from "../Extras";
import Features from "../Features";
import Notes from "../Notes";
import Spells from "../Spells";
import styles from "./styles.module.css";

const TAB_KEY = {
  ACTIONS: "ACTIONS",
  SPELLS: "SPELLS",
  EQUIPMENT: "EQUIPMENT",
  DESCRIPTION: "DESCRIPTION",
  NOTES: "NOTES",
  FEATURES_TRAITS: "FEATURES_TRAITS",
  EXTRAS: "EXTRAS",
};

interface Props extends DispatchProp {
  hasSpells: boolean;
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  isReadonly: boolean;
  characterStatus: string | null;
}

class PrimaryBox extends React.PureComponent<Props, {}> {
  render() {
    const { hasSpells, dimensions, theme, isReadonly, characterStatus } =
      this.props;

    let isPremade = CharacterStatusSlug.PREMADE === characterStatus;

    let BoxBackgroundComponent: React.ComponentType = BeveledBoxSvg517x660;
    if (dimensions.styleSizeType > StyleSizeTypeEnum.DESKTOP) {
      BoxBackgroundComponent = BeveledBoxSvg623x660;
    }

    return (
      <Subsection name="Primary Box">
        <div
          className={`ct-primary-box ${
            theme.isDarkMode ? "ct-primary-box--dark-mode" : ""
          }`}
        >
          <BoxBackground
            StyleComponent={BoxBackgroundComponent}
            theme={theme}
          />
          <TabList
            className={styles.tabList}
            tabs={[
              {
                label: "Actions",
                content: <Actions />,
                className: "ct-primary-box__tab--actions",
                id: TAB_KEY.ACTIONS,
              },
              hasSpells
                ? {
                    label: "Spells",
                    content: <Spells />,
                    className: "ct-primary-box__tab--spells",
                    id: TAB_KEY.SPELLS,
                  }
                : null,
              {
                label: "Inventory",
                content: <Equipment />,
                className: "ct-primary-box__tab--equipment",
                id: TAB_KEY.EQUIPMENT,
              },
              {
                label: "Features & Traits",
                content: <Features />,
                className: "ct-primary-box__tab--features",
                id: TAB_KEY.FEATURES_TRAITS,
              },
              !isReadonly || isPremade
                ? {
                    label: "Background",
                    content: <Description theme={theme} />,
                    className: "ct-primary-box__tab--description",
                    id: TAB_KEY.DESCRIPTION,
                  }
                : null,
              !isReadonly || isPremade
                ? {
                    label: "Notes",
                    content: <Notes />,
                    className: "ct-primary-box__tab--notes",
                    id: TAB_KEY.NOTES,
                  }
                : null,
              {
                label: "Extras",
                content: <Extras />,
                className: "ct-primary-box__tab--extras",
                id: TAB_KEY.EXTRAS,
              },
            ]}
          />
        </div>
      </Subsection>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    hasSpells: rulesEngineSelectors.hasSpells(state),
    dimensions: appEnvSelectors.getDimensions(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    characterStatus: characterSelectors.getStatusSlug(state),
  };
}

export default connect(mapStateToProps)(PrimaryBox);
