import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  AnySimpleDataType,
  Hack__BaseCharClass,
  rulesEngineSelectors,
  characterActions,
  ClassUtils,
  DataOriginRefData,
  EntityUtils,
  EntityValueLookup,
  FormatUtils,
  RuleData,
  Spell,
  SpellCasterInfo,
  SpellUtils,
  ValueUtils,
  CharacterTheme,
} from "../../rules-engine/es";

import { EditableName } from "~/components/EditableName";
import { SpellName } from "~/components/SpellName";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  getDataOriginComponentInfo,
  getDataOriginRefComponentInfo,
} from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import {
  PaneComponentEnum,
  PaneIdentifiersClassSpell,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import SpellDetail from "../../../components/SpellDetail";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";

interface Props extends DispatchProp {
  spells: Array<Spell>;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  entityValueLookup: EntityValueLookup;
  dataOriginRefData: DataOriginRefData;
  identifiers: PaneIdentifiersClassSpell | null;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  spell: Spell | null;
  isCustomizeClosed: boolean;
}
class ClassSpellPane extends React.PureComponent<Props, State> {
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
        (spell) =>
          identifiers.spellId === SpellUtils.getMappingId(spell) &&
          identifiers.classId ===
            ClassUtils.getMappingId(
              SpellUtils.getDataOrigin(spell).primary as Hack__BaseCharClass
            )
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

  handleCustomDataUpdate = (
    key: number,
    value: AnySimpleDataType,
    source: string | null
  ): void => {
    const { spell } = this.state;
    const { dispatch } = this.props;

    if (spell === null) {
      return;
    }

    let mappingId = SpellUtils.getMappingId(spell);
    let mappingEntityTypeId = SpellUtils.getMappingEntityTypeId(spell);
    let [contextId, contextTypeId] = SpellUtils.deriveExpandedContextIds(spell);

    dispatch(
      characterActions.valueSet(
        key,
        value,
        source,
        ValueUtils.hack__toString(mappingId),
        ValueUtils.hack__toString(mappingEntityTypeId),
        ValueUtils.hack__toString(contextId),
        ValueUtils.hack__toString(contextTypeId)
      )
    );
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
    const { paneHistoryPush, dataOriginRefData } = this.props;

    if (spell === null) {
      return;
    }

    let dataOrigin = SpellUtils.getDataOrigin(spell);
    let component = getDataOriginComponentInfo(dataOrigin);

    let expandedDataOriginRef = SpellUtils.getExpandedDataOriginRef(spell);
    if (expandedDataOriginRef !== null) {
      component = getDataOriginRefComponentInfo(
        expandedDataOriginRef,
        dataOriginRefData
      );
    }

    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  render() {
    const { spell, isCustomizeClosed } = this.state;
    const {
      spellCasterInfo,
      identifiers,
      ruleData,
      entityValueLookup,
      dataOriginRefData,
      isReadonly,
      proficiencyBonus,
      theme,
    } = this.props;

    if (spell === null) {
      return <PaneInitFailureContent />;
    }

    let school = SpellUtils.getSchool(spell);
    let schoolSlug = FormatUtils.slugify(school);

    const spellDataOrigin = SpellUtils.getDataOrigin(spell);

    let parentNode: React.ReactNode =
      EntityUtils.getDataOriginName(spellDataOrigin);
    let expandedDataOriginRef = SpellUtils.getExpandedDataOriginRef(spell);
    if (expandedDataOriginRef !== null) {
      parentNode = (
        <React.Fragment>
          {parentNode} &bull;{" "}
          {EntityUtils.getDataOriginRefName(
            expandedDataOriginRef,
            dataOriginRefData
          )}
        </React.Fragment>
      );
    }

    return (
      <div className="ct-spell-pane">
        <Header
          parent={parentNode}
          onClick={
            expandedDataOriginRef !== null ? this.handleParentClick : undefined
          }
          preview={
            <Preview>
              <div
                className={`ct-spell-pane__heading-preview ct-spell-pane__heading-preview--school-${schoolSlug}`}
              />
            </Preview>
          }
        >
          <EditableName onClick={this.handleOpenCustomize}>
            <SpellName
              spell={spell}
              showSpellLevel={false}
              dataOriginRefData={dataOriginRefData}
            />
          </EditableName>
        </Header>
        <SpellDetail
          theme={theme}
          key={SpellUtils.getUniqueKey(spell)}
          spell={spell}
          spellCasterInfo={spellCasterInfo}
          ruleData={ruleData}
          initialCastLevel={identifiers?.castLevel}
          showActions={false}
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
    spells: rulesEngineSelectors.getClassSpells(state),
    spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    entityValueLookup:
      rulesEngineSelectors.getCharacterValueLookupByEntity(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const ClassSpellPaneContainer = (props) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return <ClassSpellPane paneHistoryPush={paneHistoryPush} {...props} />;
};

export default connect(mapStateToProps)(ClassSpellPaneContainer);
