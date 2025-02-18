import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  BaseInventoryContract,
  rulesEngineSelectors,
  characterActions,
  ClassFeatureContract,
  ClassFeatureUtils,
  ClassUtils,
  Constants,
  DataOriginRefData,
  EntityUtils,
  EntityValueLookup,
  FeatDetailsContract,
  FeatUtils,
  FormatUtils,
  Hack__BaseCharClass,
  HelperUtils,
  ItemUtils,
  InventoryLookup,
  RacialTraitContract,
  RacialTraitUtils,
  Spell,
  SpellCasterInfo,
  SpellUtils,
  ValueUtils,
  AnySimpleDataType,
  RuleData,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { EditableName } from "~/components/EditableName";
import { ItemName } from "~/components/ItemName";
import { SpellName } from "~/components/SpellName";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  PaneComponentEnum,
  PaneIdentifiers,
  PaneIdentifiersCharacterSpell,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import SpellDetail from "../../../components/SpellDetail";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";

interface Props extends DispatchProp {
  spells: Array<Spell>;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  entityValueLookup: EntityValueLookup;
  inventoryLookup: InventoryLookup;
  dataOriginRefData: DataOriginRefData;
  identifiers: PaneIdentifiersCharacterSpell | null;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  spell: Spell | null;
  isCustomizeClosed: boolean;
}
class CharacterSpellPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props, true);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { spells, identifiers } = this.props;

    if (spells !== prevProps.spells || identifiers !== prevProps.identifiers) {
      this.setState(
        this.generateStateData(this.props, prevState.isCustomizeClosed)
      );
    }
  }

  generateStateData = (props: Props, isCustomizeClosed: boolean): State => {
    const { spells, identifiers } = props;

    let foundSpell: Spell | null | undefined = null;
    if (identifiers !== null) {
      foundSpell = spells.find(
        (spell) => identifiers.id === SpellUtils.getMappingId(spell)
      );
    }
    return {
      spell: foundSpell ? foundSpell : null,
      isCustomizeClosed,
    };
  };

  handleOpenCustomize = () => {
    this.setState({ isCustomizeClosed: !this.state.isCustomizeClosed });
  };

  handleItemShow = (): void => {
    const { spell } = this.state;
    const { paneHistoryPush } = this.props;

    if (spell) {
      const dataOrigin = SpellUtils.getDataOrigin(spell);

      paneHistoryPush(
        PaneComponentEnum.ITEM_DETAIL,
        PaneIdentifierUtils.generateItem(
          ItemUtils.getMappingId(dataOrigin.primary as BaseInventoryContract)
        )
      );
    }
  };

  handleCustomDataUpdate = (
    key: number,
    value: AnySimpleDataType,
    source: string | null
  ): void => {
    const { spell } = this.state;
    const { dispatch } = this.props;

    if (spell) {
      dispatch(
        characterActions.valueSet(
          key,
          value,
          source,
          ValueUtils.hack__toString(SpellUtils.getMappingId(spell)),
          ValueUtils.hack__toString(SpellUtils.getMappingEntityTypeId(spell))
        )
      );
    }
  };

  handleRemoveCustomizations = (): void => {
    const { spell } = this.state;
    const { dispatch } = this.props;

    if (spell) {
      let mappingId = SpellUtils.getMappingId(spell);
      let mappingEntityTypeId = SpellUtils.getMappingEntityTypeId(spell);
      if (mappingId !== null && mappingEntityTypeId !== null) {
        let [contextId, contextTypeId] =
          SpellUtils.deriveExpandedContextIds(spell);

        dispatch(
          characterActions.spellCustomizationsDelete(
            mappingId,
            mappingEntityTypeId,
            contextId,
            contextTypeId
          )
        );
      }
    }
  };

  handleParentClick = (): void => {
    const { spell } = this.state;
    const { paneHistoryPush } = this.props;

    if (spell === null) {
      return;
    }

    let componentType: PaneComponentEnum | null = null;
    let componentIds: PaneIdentifiers | null = null;

    const spellDataOrigin = SpellUtils.getDataOrigin(spell);
    const spellDataOriginType = SpellUtils.getDataOriginType(spell);
    switch (spellDataOriginType) {
      case Constants.DataOriginTypeEnum.CLASS_FEATURE:
        componentType = PaneComponentEnum.CLASS_FEATURE_DETAIL;
        componentIds = PaneIdentifierUtils.generateClassFeature(
          ClassFeatureUtils.getId(
            spellDataOrigin.primary as ClassFeatureContract
          ),
          ClassUtils.getMappingId(spellDataOrigin.parent as Hack__BaseCharClass)
        );
        break;

      case Constants.DataOriginTypeEnum.RACE:
        componentType = PaneComponentEnum.SPECIES_TRAIT_DETAIL;
        componentIds = PaneIdentifierUtils.generateRacialTrait(
          RacialTraitUtils.getId(spellDataOrigin.primary as RacialTraitContract)
        );
        break;

      case Constants.DataOriginTypeEnum.FEAT:
        componentType = PaneComponentEnum.FEAT_DETAIL;
        componentIds = PaneIdentifierUtils.generateFeat(
          FeatUtils.getId(spellDataOrigin.primary as FeatDetailsContract)
        );
        break;

      default:
      // not implemented
    }

    if (componentType !== null && componentIds !== null) {
      paneHistoryPush(componentType, componentIds);
    }
  };

  render() {
    const { spell, isCustomizeClosed } = this.state;
    const {
      spellCasterInfo,
      identifiers,
      ruleData,
      entityValueLookup,
      inventoryLookup,
      dataOriginRefData,
      isReadonly,
      proficiencyBonus,
      theme,
    } = this.props;

    if (spell === null) {
      return <PaneInitFailureContent />;
    }

    let parentNode: React.ReactNode;
    const spellDataOrigin = SpellUtils.getDataOrigin(spell);
    const spellDataOriginType = SpellUtils.getDataOriginType(spell);

    switch (spellDataOriginType) {
      case Constants.DataOriginTypeEnum.ITEM:
        const mappingId = ItemUtils.getMappingId(
          spellDataOrigin.primary as BaseInventoryContract
        );
        const item = HelperUtils.lookupDataOrFallback(
          inventoryLookup,
          mappingId
        );
        if (item !== null) {
          parentNode = <ItemName item={item} onClick={this.handleItemShow} />;
        }
        break;

      default:
        if (spellDataOrigin.primary !== null) {
          parentNode = (
            <div onClick={this.handleParentClick}>
              {EntityUtils.getDataOriginName(spellDataOrigin)}
            </div>
          );
        }
        break;
    }

    let school = SpellUtils.getSchool(spell);
    let schoolSlug = FormatUtils.slugify(school);
    const dataOrigin = SpellUtils.getDataOrigin(spell);
    const dataOriginType = SpellUtils.getDataOriginType(spell);
    return (
      <div className="ct-spell-pane">
        <Header
          parent={parentNode}
          preview={
            <Preview>
              <div
                className={`ct-spell-pane__heading-preview ct-spell-pane__heading-preview--school-${schoolSlug}`}
              />
            </Preview>
          }
        >
          {
            //If the spell is coming from a magic item we should not show the Edit button
            !dataOrigin ||
            (dataOrigin &&
              dataOriginType === Constants.DataOriginTypeEnum.ITEM) ? (
              <SpellName
                spell={spell}
                showSpellLevel={false}
                dataOriginRefData={dataOriginRefData}
              />
            ) : (
              <EditableName onClick={this.handleOpenCustomize}>
                <SpellName
                  spell={spell}
                  showSpellLevel={false}
                  dataOriginRefData={dataOriginRefData}
                />
              </EditableName>
            )
          }
        </Header>
        <SpellDetail
          theme={theme}
          key={SpellUtils.getUniqueKey(spell)}
          spell={spell}
          spellCasterInfo={spellCasterInfo}
          initialCastLevel={identifiers?.castLevel}
          ruleData={ruleData}
          onCustomDataUpdate={this.handleCustomDataUpdate}
          onCustomizationsRemove={this.handleRemoveCustomizations}
          entityValueLookup={entityValueLookup}
          isReadonly={isReadonly}
          proficiencyBonus={proficiencyBonus}
          isCustomizeClosed={isCustomizeClosed}
          onCustomizeClick={this.handleOpenCustomize}
        />
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    spells: rulesEngineSelectors.getCharacterSpells(state),
    spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    entityValueLookup:
      rulesEngineSelectors.getCharacterValueLookupByEntity(state),
    inventoryLookup: rulesEngineSelectors.getInventoryLookup(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const CharacterSpellPaneContainer = (props) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return <CharacterSpellPane paneHistoryPush={paneHistoryPush} {...props} />;
};

export default connect(mapStateToProps)(CharacterSpellPaneContainer);
