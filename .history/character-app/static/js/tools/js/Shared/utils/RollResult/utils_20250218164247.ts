import { groupBy, keyBy } from "lodash";

import {
  HelperUtils,
  RollGroupContract,
  RollResultContract,
} from "../../character-rules-engine/es";

import { RollResultGroupsLookup } from "./typings";

/**
 *
 * @param componentKey
 * @param rollResultGroupsLookup
 */
export function getGroupsByComponentKey(
  componentKey: string,
  rollResultGroupsLookup: RollResultGroupsLookup
): Array<RollGroupContract> {
  return HelperUtils.lookupDataOrFallback(
    rollResultGroupsLookup,
    componentKey,
    []
  );
}

/**
 *
 * @param componentKey
 * @param rollResultGroupsLookup
 */
export function getComponentOrderedGroups(
  componentKey: string,
  rollResultGroupsLookup: RollResultGroupsLookup
): Array<RollGroupContract> {
  return getOrderedLinkedEntries(
    getGroupsByComponentKey(componentKey, rollResultGroupsLookup)
  );
}

/**
 *
 * @param rollResults
 */
export function getGroupOrderedRollResults(
  rollResults: Array<RollResultContract>
): Array<RollResultContract> {
  return getOrderedLinkedEntries(rollResults);
}

/**
 *
 * @param linkedEntries
 */
export function getOrderedLinkedEntries<T extends RollGroupContract>(
  linkedEntries: Array<T>
): Array<T>;
export function getOrderedLinkedEntries<T extends RollResultContract>(
  linkedEntries: Array<T>
): Array<T>;
export function getOrderedLinkedEntries<T extends any>(
  linkedEntries: Array<T>
) {
  // @ts-ignore
  return helper__getOrderedLinkedEntries(
    linkedEntries,
    getLinkedEntryKey as (entry: T) => string | null,
    getLinkedEntryNextKey as (entry: T) => string | null
  );
}

//probs in HelperUtils
export function helper__getOrderedLinkedEntries<T extends any>(
  linkedEntries: Array<T>,
  getLinkedEntryKey: (entry: T) => string | null,
  getLinkedEntryNextKey: (entry: T) => string | null
): Array<T> {
  const entryByNextKeyLookup = keyBy(
    linkedEntries,
    (entry) => getLinkedEntryNextKey(entry) ?? "null"
  );

  let orderedEntries: Array<T> = [];

  let currentEntry: T | null = HelperUtils.lookupDataOrFallback(
    entryByNextKeyLookup,
    "null"
  );

  // Ordering fallback if no current entry is found
  if (!currentEntry) {
    // Find entry by nextKey not being included in list of current keys
    const includedKeys = linkedEntries.map(
      (entry) => getLinkedEntryKey(entry) ?? "null"
    );
    currentEntry =
      linkedEntries.find(
        (entry) =>
          !includedKeys.includes(getLinkedEntryNextKey(entry) ?? "null")
      ) ?? null;
  }

  let counter: number = 0;
  while (counter <= linkedEntries.length && currentEntry) {
    orderedEntries.push(currentEntry);

    const nextEntryKey = getLinkedEntryKey(currentEntry);

    currentEntry = null;

    if (nextEntryKey) {
      const nextEntry = HelperUtils.lookupDataOrFallback(
        entryByNextKeyLookup,
        nextEntryKey
      );
      if (nextEntry) {
        currentEntry = nextEntry;
      }
    }
    counter++;
  }

  return orderedEntries.reverse();
}

/**
 *
 * @param linkedEntry
 */
export function getLinkedEntryNextKey(
  linkedEntry: RollResultContract | RollGroupContract
): string | null {
  if (isLinkedEntryRollGroupContract(linkedEntry)) {
    return linkedEntry.nextGroupKey;
  } else if (isLinkedEntryRollResultContract(linkedEntry)) {
    return linkedEntry.nextRollKey;
  } else {
    return null;
  }
}

/**
 *
 * @param linkedEntry
 */
export function getLinkedEntryKey(
  linkedEntry: RollResultContract | RollGroupContract
): string | null {
  if (isLinkedEntryRollGroupContract(linkedEntry)) {
    return linkedEntry.groupKey;
  } else if (isLinkedEntryRollResultContract(linkedEntry)) {
    return linkedEntry.rollKey;
  } else {
    return null;
  }
}

/**
 *
 * @param linkedEntry
 */
export function isLinkedEntryRollGroupContract(
  linkedEntry: RollResultContract | RollGroupContract
): linkedEntry is RollGroupContract {
  return (linkedEntry as RollGroupContract).groupKey !== undefined;
}

/**
 *
 * @param linkedEntry
 */
export function isLinkedEntryRollResultContract(
  linkedEntry: RollResultContract | RollGroupContract
): linkedEntry is RollResultContract {
  return (linkedEntry as RollResultContract).rollKey !== undefined;
}

/**
 *
 * @param componentKey
 * @param rollResultGroupsLookup
 */
export function generateComponentOrderedGroups(
  componentKey: string,
  rollResultGroupsLookup: RollResultGroupsLookup
): Array<RollGroupContract> {
  const groups = getGroupsByComponentKey(componentKey, rollResultGroupsLookup);
  const groupByGroupKeyLookup = keyBy(groups, (group) => group.groupKey);
  const nextGroupKeyGroupsLookup = groupBy(
    groups,
    (group) => group.nextGroupKey
  );

  let orderedGroups: Array<RollGroupContract> = [];

  //process any groups with nextGroupKey pointing to non-existent group
  groups.forEach((group) => {
    if (group.nextGroupKey) {
      const nextGroup = HelperUtils.lookupDataOrFallback(
        groupByGroupKeyLookup,
        group.nextGroupKey
      );
      if (!nextGroup) {
        orderedGroups.push(
          ...getOrderedGroupsByEndKey(
            group.nextGroupKey,
            groups,
            groupByGroupKeyLookup,
            nextGroupKeyGroupsLookup
          )
        );
      }
    }
  });

  //process any groups with  null nextGroupKey
  const nullTierGroups = getOrderedGroupsByEndKey(
    "null",
    groups,
    groupByGroupKeyLookup,
    nextGroupKeyGroupsLookup
  );

  return [...orderedGroups, ...nullTierGroups];
}

/**
 *
 * @param endKey
 * @param groups
 * @param groupByGroupKeyLookup
 * @param nextGroupKeyGroupsLookup
 */
function getOrderedGroupsByEndKey(
  endKey: string,
  groups: Array<RollGroupContract>,
  groupByGroupKeyLookup: Record<
    RollGroupContract["groupKey"],
    RollGroupContract
  >,
  nextGroupKeyGroupsLookup: Record<string, Array<RollGroupContract>>
): Array<RollGroupContract> {
  const orderedGroups: Array<RollGroupContract> = [];

  let currentTierGroups: Array<RollGroupContract> = [];
  const endTierGroups = HelperUtils.lookupDataOrFallback(
    nextGroupKeyGroupsLookup,
    endKey
  );
  if (endTierGroups) {
    currentTierGroups.push(...endTierGroups);
  }

  //find each tier of groups by nextGroupKey
  let counter: number = 0;
  while (
    counter <= groups.length &&
    currentTierGroups &&
    currentTierGroups.length > 0
  ) {
    const nextTierGroups: Array<RollGroupContract> = [];
    currentTierGroups.forEach((group) => {
      const foundGroups = HelperUtils.lookupDataOrFallback(
        nextGroupKeyGroupsLookup,
        group.groupKey
      );
      if (foundGroups) {
        nextTierGroups.push(...foundGroups);
      }
    });

    orderedGroups.push(...currentTierGroups);

    currentTierGroups = nextTierGroups;
    counter++;
  }
  return orderedGroups.reverse();
}
