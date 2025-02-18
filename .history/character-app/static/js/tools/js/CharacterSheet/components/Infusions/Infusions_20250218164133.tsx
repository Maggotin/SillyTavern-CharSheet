import { keyBy } from "lodash";
import * as React from "react";

import {
  ItemPreview,
  Snippet,
  CreaturePreview,
} from "@dndbeyond/character-components/es";
import {
  AccessUtils,
  ClassUtils,
  Constants,
  Creature,
  CreatureLookup,
  CreatureUtils,
  HelperUtils,
  Infusion,
  InfusionChoice,
  InfusionChoiceUtils,
  InfusionModifierDataContract,
  InfusionUtils,
  InventoryLookup,
  Item,
  ItemUtils,
  KnownInfusionUtils,
  RuleData,
  SnippetData,
  Hack__BaseCharClass,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

interface Props {
  inventory: Array<Item>;
  creatures: Array<Creature>;
  infusionChoices: Array<InfusionChoice>;
  proficiencyBonus: number;
  snippetData: SnippetData;
  ruleData: RuleData;
  isReadonly: boolean;
  isMobile: boolean;
  theme: CharacterTheme;

  onInfusionChoiceShow?: (infusionChoice: InfusionChoice) => void;
  onItemShow?: (item: Item) => void;
  onCreatureShow?: (creature: Creature) => void;
}
interface State {
  inventoryLookup: InventoryLookup;
  creatureLookup: CreatureLookup;
}
export class Infusions extends React.PureComponent<Props, State> {
  static defaultProps = {
    isReadonly: false,
    isMobile: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      inventoryLookup: keyBy(props.inventory, (item) =>
        ItemUtils.getMappingId(item)
      ),
      creatureLookup: keyBy(props.creatures, (creature) =>
        CreatureUtils.getMappingId(creature)
      ),
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.inventory !== this.props.inventory ||
      prevProps.creatures !== this.props.creatures
    ) {
      this.setState({
        inventoryLookup: keyBy(this.props.inventory, (item) =>
          ItemUtils.getMappingId(item)
        ),
        creatureLookup: keyBy(this.props.creatures, (creature) =>
          CreatureUtils.getMappingId(creature)
        ),
      });
    }
  }

  handleItemClick = (item: Item): void => {
    const { onItemShow } = this.props;

    if (onItemShow) {
      onItemShow(item);
    }
  };

  handleCreatureClick = (creature: Creature): void => {
    const { onCreatureShow } = this.props;

    if (onCreatureShow) {
      onCreatureShow(creature);
    }
  };

  handleInfusionClick = (
    infusionChoice: InfusionChoice,
    evt: React.MouseEvent
  ): void => {
    const { onInfusionChoiceShow } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    if (onInfusionChoiceShow) {
      onInfusionChoiceShow(infusionChoice);
    }
  };

  renderDescription = (
    simulatedInfusion: Infusion,
    infusionChoice: InfusionChoice,
    selectedModifierData: InfusionModifierDataContract | null
  ): React.ReactNode => {
    const { snippetData, proficiencyBonus } = this.props;

    if (
      AccessUtils.isAccessible(InfusionUtils.getAccessType(simulatedInfusion))
    ) {
      let classLevel: number | null = selectedModifierData?.value ?? null;
      const dataOriginType =
        InfusionChoiceUtils.getDataOriginType(infusionChoice);

      if (
        dataOriginType === Constants.DataOriginTypeEnum.CLASS_FEATURE &&
        !classLevel
      ) {
        const dataOrigin = InfusionChoiceUtils.getDataOrigin(infusionChoice);
        classLevel = ClassUtils.getLevel(
          dataOrigin.parent as Hack__BaseCharClass
        );
      }

      return (
        <Snippet
          snippetData={snippetData}
          classLevel={classLevel}
          proficiencyBonus={proficiencyBonus}
        >
          {InfusionUtils.getSnippet(simulatedInfusion)}
        </Snippet>
      );
    }

    return (
      <div className="ct-infusions__infusion-empty">
        Check out the Marketplace to unlock this infusion.
      </div>
    );
  };

  renderInfusions = (): React.ReactNode => {
    const { inventoryLookup, creatureLookup } = this.state;
    const { infusionChoices, ruleData, theme } = this.props;

    return (
      <React.Fragment>
        {infusionChoices.map((infusionChoice) => {
          const knownInfusion =
            InfusionChoiceUtils.getKnownInfusion(infusionChoice);

          if (knownInfusion === null) {
            return null;
          }

          const simulatedInfusion =
            KnownInfusionUtils.getSimulatedInfusion(knownInfusion);

          if (simulatedInfusion === null) {
            return null;
          }

          const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);
          const infusionType = InfusionUtils.getType(simulatedInfusion);

          let item: Item | null = null;
          let creature: Creature | null = null;
          let selectedModifierData: InfusionModifierDataContract | null = null;
          if (infusion) {
            let inventoryMappingId =
              InfusionUtils.getInventoryMappingId(infusion);
            item = HelperUtils.lookupDataOrFallback(
              inventoryLookup,
              inventoryMappingId
            );
            let creatureMappingId =
              InfusionUtils.getCreatureMappingId(infusion);
            if (creatureMappingId !== null) {
              creature = HelperUtils.lookupDataOrFallback(
                creatureLookup,
                creatureMappingId
              );
            }
            selectedModifierData =
              InfusionUtils.getSelectedModifierData(infusion);
          }

          let itemNode: React.ReactNode;
          if (item) {
            itemNode = (
              <div className="ct-infusions__infusion-item">
                <ItemPreview
                  theme={theme}
                  item={item}
                  onClick={this.handleItemClick}
                />
              </div>
            );
          } else {
            itemNode = (
              <div className="ct-infusions__infusion-empty">
                No item infused
              </div>
            );
          }

          let creatureNode: React.ReactNode;
          if (creature) {
            creatureNode = (
              <div className="ct-infusions__infusion-item">
                <CreaturePreview
                  creature={creature}
                  ruleData={ruleData}
                  onClick={this.handleCreatureClick}
                />
              </div>
            );
          }

          let selectedModifierDataNode: React.ReactNode;
          if (selectedModifierData && selectedModifierData.name) {
            selectedModifierDataNode = (
              <div className="ct-infusions__infusion-item">
                {selectedModifierData.name}
              </div>
            );
          }

          let infusionName = InfusionUtils.getName(simulatedInfusion);
          let infusionNameExtraNode: React.ReactNode;
          if (infusionType === Constants.InfusionTypeEnum.REPLICATE) {
            let itemName = KnownInfusionUtils.getItemName(knownInfusion);
            if (itemName) {
              infusionNameExtraNode = `: ${itemName}`;
            }
          }

          const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);
          return (
            <div
              className="ct-infusions__infusion"
              key={choiceKey === null ? "" : choiceKey}
              onClick={this.handleInfusionClick.bind(this, infusionChoice)}
            >
              <div className="ct-infusions__infusion-header">
                {infusionName}
                {infusionNameExtraNode}
              </div>
              <div className="ct-infusions__infusion-content">
                <div className="ct-infusions__infusion-description">
                  {this.renderDescription(
                    simulatedInfusion,
                    infusionChoice,
                    selectedModifierData
                  )}
                </div>
                <div className="ct-infusions__infusion-items">
                  {itemNode}
                  {creatureNode}
                  {selectedModifierDataNode}
                </div>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  render() {
    const { infusionChoices } = this.props;

    let contentNode: React.ReactNode = (
      <div className="ct-infusions__empty">
        No infusions choices have been made for this character
      </div>
    );
    if (infusionChoices.length > 0) {
      contentNode = this.renderInfusions();
    }

    return <div className="ct-infusions">{contentNode}</div>;
  }
}

export default Infusions;
