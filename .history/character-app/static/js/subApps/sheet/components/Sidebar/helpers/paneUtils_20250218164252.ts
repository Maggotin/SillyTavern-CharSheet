import {
  BaseInventoryContract,
  Hack__BaseCharClass,
  FeatDetailsContract,
  RacialTraitContract,
  ClassFeatureUtils,
  ClassUtils,
  Constants,
  DataOriginRef,
  DataOriginRefData,
  DataOriginUtils,
  FeatUtils,
  ItemUtils,
  RacialTraitUtils,
  DataOrigin,
  Spell,
  SpellUtils,
  ClassFeatureContract,
} from "../../character-rules-engine/es";

import { PaneIdentifierUtils } from "~/tools/js/Shared/utils";

import {
  PaneComponentEnum,
  PaneComponentInfo,
  PaneComponentProperties,
  PaneIdentifiers,
} from "../types";

// List any full width panes
const fullWidthPanes = [PaneComponentEnum.CHARACTER_MANAGE];

// Check to see if pane is in the list
const isFullWidthPane = (activeEntry: PaneComponentInfo | null) =>
  activeEntry?.type && fullWidthPanes.includes(activeEntry.type);

// List any forced dark mode panes
const darkModePanes = [PaneComponentEnum.CHARACTER_MANAGE];

// Check to see if pane is in the list
const forceDarkMode = (activeEntry: PaneComponentInfo | null) =>
  activeEntry?.type && darkModePanes.includes(activeEntry.type);

// Return optional pane props
export const getPaneProperties = (
  activeEntry: PaneComponentInfo | null
): PaneComponentProperties => {
  const props: PaneComponentProperties = {
    isFullWidth: isFullWidthPane(activeEntry) ?? false,
    forceDarkMode: forceDarkMode(activeEntry) ?? false,
  };

  return { ...props };
};

export function getSpellComponentInfo(spell: Spell): PaneComponentInfo {
  let dataOrigin = SpellUtils.getDataOrigin(spell);
  let dataOriginType = SpellUtils.getDataOriginType(spell);

  let type: PaneComponentEnum = PaneComponentEnum.CHARACTER_SPELL_DETAIL;
  let identifiers: PaneIdentifiers | null = null;

  const mappingId = SpellUtils.getMappingId(spell);
  if (mappingId !== null) {
    if (dataOriginType === Constants.DataOriginTypeEnum.CLASS) {
      type = PaneComponentEnum.CLASS_SPELL_DETAIL;
      identifiers = PaneIdentifierUtils.generateClassSpell(
        ClassUtils.getMappingId(dataOrigin.primary as Hack__BaseCharClass),
        mappingId
      );
    } else {
      identifiers = PaneIdentifierUtils.generateCharacterSpell(mappingId);
    }
  }

  return {
    type,
    identifiers,
  };
}

export function getDataOriginComponentInfo(
  dataOrigin: DataOrigin
): PaneComponentInfo {
  let type: PaneComponentEnum = PaneComponentEnum.ERROR_404;
  let identifiers: PaneIdentifiers | null = null;
  switch (dataOrigin.type) {
    case Constants.DataOriginTypeEnum.ITEM:
      type = PaneComponentEnum.ITEM_DETAIL;
      identifiers = PaneIdentifierUtils.generateItem(
        ItemUtils.getMappingId(dataOrigin.primary as BaseInventoryContract)
      );
      break;

    case Constants.DataOriginTypeEnum.CLASS_FEATURE:
      type = PaneComponentEnum.CLASS_FEATURE_DETAIL;
      identifiers = PaneIdentifierUtils.generateClassFeature(
        ClassFeatureUtils.getId(dataOrigin.primary as ClassFeatureContract),
        ClassUtils.getMappingId(dataOrigin.parent as Hack__BaseCharClass)
      );
      break;

    case Constants.DataOriginTypeEnum.RACE:
      type = PaneComponentEnum.SPECIES_TRAIT_DETAIL;
      identifiers = PaneIdentifierUtils.generateRacialTrait(
        RacialTraitUtils.getId(dataOrigin.primary as RacialTraitContract)
      );
      break;

    case Constants.DataOriginTypeEnum.FEAT:
      type = PaneComponentEnum.FEAT_DETAIL;
      identifiers = PaneIdentifierUtils.generateFeat(
        FeatUtils.getId(dataOrigin.primary as FeatDetailsContract)
      );
      break;

    case Constants.DataOriginTypeEnum.BACKGROUND:
      type = PaneComponentEnum.BACKGROUND;
      break;

    case Constants.DataOriginTypeEnum.FEAT_LIST:
      if (dataOrigin.parentType === Constants.DataOriginTypeEnum.BACKGROUND) {
        type = PaneComponentEnum.BACKGROUND;
      }
      break;

    default:
    // Not implemented
  }

  return {
    type,
    identifiers,
  };
}

export function getDataOriginRefComponentInfo(
  ref: DataOriginRef,
  refData: DataOriginRefData
): PaneComponentInfo {
  let type: PaneComponentEnum = PaneComponentEnum.ERROR_404;
  let identifiers: PaneIdentifiers | null = null;

  switch (ref.type) {
    case Constants.DataOriginTypeEnum.ITEM: {
      const primary = DataOriginUtils.getRefPrimary(ref, refData);
      if (primary !== null) {
        type = PaneComponentEnum.ITEM_DETAIL;
        identifiers = PaneIdentifierUtils.generateItem(
          ItemUtils.getMappingId(primary)
        );
      }
      break;
    }

    case Constants.DataOriginTypeEnum.CLASS_FEATURE: {
      const primary = DataOriginUtils.getRefPrimary(ref, refData);
      const parent = DataOriginUtils.getRefParent(ref, refData);
      if (primary !== null && parent !== null) {
        type = PaneComponentEnum.CLASS_FEATURE_DETAIL;
        identifiers = PaneIdentifierUtils.generateClassFeature(
          ClassFeatureUtils.getId(primary),
          ClassUtils.getMappingId(parent)
        );
      }
      break;
    }

    case Constants.DataOriginTypeEnum.RACE: {
      const primary = DataOriginUtils.getRefPrimary(ref, refData);
      if (primary !== null) {
        type = PaneComponentEnum.SPECIES_TRAIT_DETAIL;
        identifiers = PaneIdentifierUtils.generateRacialTrait(
          RacialTraitUtils.getId(primary)
        );
      }
      break;
    }

    case Constants.DataOriginTypeEnum.FEAT: {
      const primary = DataOriginUtils.getRefPrimary(ref, refData);
      if (primary !== null) {
        type = PaneComponentEnum.FEAT_DETAIL;
        identifiers = PaneIdentifierUtils.generateFeat(
          FeatUtils.getId(primary)
        );
      }
      break;
    }

    case Constants.DataOriginTypeEnum.BACKGROUND:
      type = PaneComponentEnum.BACKGROUND;
      break;

    default:
    // Not implemented
  }

  return {
    type,
    identifiers,
  };
}
