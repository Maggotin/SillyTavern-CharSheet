// GA Docs for using multiple accounts on the same page
// https://developers.google.com/analytics/devguides/collection/analyticsjs/creating-trackers#working_with_multiple_trackers
import debounce from "debounce";

import config from "../../config";
import {
  SessionTrackingIdByName,
  SessionNames,
  EventCategories,
  EventActions,
  EventLabels,
} from "../../constants";
import {
  getSearchableTerms,
  getSearchableTermsAnalyticsLabel,
} from "../../state/selectors/characterUtils";
import { CharacterData, LogEventOptions } from "../../types";

let { debug } = config;

const tryGa = (...params) => {
  if (typeof window.ga === "function") {
    window.ga(...params);

    return true;
  }

  return false;
};

// eslint-disable-next-line max-params
const logGa = (sessionName: string, eventName: string, ...rest: any) =>
  tryGa(`${sessionName}.send`, eventName, ...rest);

export const logEvent = (
  sessionName: string,
  { category, action, label, value }: LogEventOptions
) => {
  const success = logGa(sessionName, "event", category, action, label, value);

  if (success && debug) {
    // eslint-disable-next-line no-console
    console.log(
      "Logged analytics event:",
      "\nsession:",
      sessionName,
      "\ncategory:",
      category,
      "\naction:",
      action,
      "\nlabel:",
      label,
      "\nvalue:",
      value
    );
  }
};

// eslint-disable-next-line max-params
export const logPageView = (sessionName, pageName, ...rest) => {
  tryGa(`${sessionName}.set`, "page", pageName, ...rest);
  const success = tryGa(`${sessionName}.send`, "pageview");

  if (success && debug) {
    // eslint-disable-next-line no-console
    console.log(
      "Logged page view:",
      "\nsession:",
      sessionName,
      "\npage:",
      pageName,
      "\nrest:",
      ...rest
    );
  }
};

export const initAnalytics = (sessionName: string, forceDebug?: boolean) => {
  /* eslint-disable @typescript-eslint/no-unused-expressions, no-sequences */
  (function (
    i: Window,
    s: Document,
    o: string,
    g: string,
    r: string,
    a?: HTMLScriptElement,
    m?: Element
  ) {
    i["GoogleAnalyticsObject"] = r;
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * (new Date() as any));
    (a = s.createElement(o) as HTMLScriptElement),
      (m = s.getElementsByTagName(o)[0]);
    a.async = true;
    a.src = g;
    m.parentNode?.insertBefore(a, m);
  })(
    window,
    document,
    "script",
    "https://www.google-analytics.com/analytics.js",
    "ga"
  );
  /* eslint-enable */

  tryGa("create", SessionTrackingIdByName[sessionName], "auto", sessionName);

  if (forceDebug) {
    debug = forceDebug;
  }
};

/**
 * Converts an array to a string that can be used for an event label
 * @param {array} array The array to convert
 * @param {object} valueToLabelMap An optional value to label mapping object
 * @returns {string} A string representation of the array
 */
export const arrayToLabel = (array, valueToLabelMap = {}) =>
  array
    .sort()
    .map((value) => valueToLabelMap[value] || value)
    .join(", ");

/**
 * Reduces an array of filter options ({ label, value }) to a lookup object of value to label
 * @param {array} filterOptions The list of options to reduce
 * @returns {object} A lookup object with filter values as the keys and filter labels as the values
 */
export const filterOptionsToLookup = (filterOptions = []) =>
  filterOptions.reduce((lookup, { label, value }) => {
    lookup[value] = label;

    return lookup;
  }, {});

export const logCharacterCampaignClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Campaign,
    label: EventLabels.Clicked,
  });
};

export const logCharacterCopyCancelled = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Copy,
    label: EventLabels.Cancelled,
  });
};

export const logCharacterCopyClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Copy,
    label: EventLabels.Clicked,
  });
};

export const logCharacterCopyConfirmed = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Copy,
    label: EventLabels.Confirmed,
  });
};

export const logCharacterDeleteCancelled = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Delete,
    label: EventLabels.Cancelled,
  });
};

export const logCharacterDeleteClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Delete,
    label: EventLabels.Clicked,
  });
};

export const logCharacterDeleteConfirmed = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Delete,
    label: EventLabels.Confirmed,
  });
};

export const logCharacterEditClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_Edit,
    label: EventLabels.Clicked,
  });
};

export const logCharacterLeaveCampaignCancelled = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_LeaveCampaign,
    label: EventLabels.Cancelled,
  });
};

export const logCharacterLeaveCampaignClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_LeaveCampaign,
    label: EventLabels.Clicked,
  });
};

export const logCharacterLeaveCampaignConfirmed = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_LeaveCampaign,
    label: EventLabels.Confirmed,
  });
};

export const logCharacterViewClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Character,
    action: EventActions.DDB_Character_View,
    label: EventLabels.Clicked,
  });
};

export const logListingSearchChanged = debounce(
  (characters: Array<CharacterData>, matchesSearch: () => any) => {
    const matchedLabels = characters
      .map(
        (character) =>
          getSearchableTermsAnalyticsLabel(character)[
            getSearchableTerms(character).findIndex(matchesSearch)
          ]
      )
      .filter(Boolean)
      .filter(
        (character, index, characters) =>
          characters.indexOf(character) === index
      );

    logEvent(SessionNames.DDB, {
      category: EventCategories.DDB_ListingFilter,
      action: EventActions.DDB_ListingFilter_SearchChanged,
      label: arrayToLabel(matchedLabels) || "no match",
    });
  },
  500
);

export const logListingSearchCleared = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_ListingFilter,
    action: EventActions.DDB_ListingFilter_SearchCleared,
  });
};

export const logListingSortChanged = (label) => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_ListingSort,
    action: EventActions.DDB_ListingSort_Changed,
    label,
  });
};

export const logPlayerAppBannerDismissed = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_PlayerAppBanner,
    action: EventActions.DDB_PlayerAppBanner_Dismissed,
  });
};

export const logPlayerAppBannerClickedCta = (label) => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_PlayerAppBanner,
    action: EventActions.DDB_PlayerAppBanner_ClickedCta,
    label,
  });
};

export const logUnlockCharacterLocked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Unlock,
    action: EventActions.DDB_Unlock_CharacterLocked,
  });
};

export const logUnlockCharacterUnlocked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Unlock,
    action: EventActions.DDB_Unlock_CharacterUnlocked,
  });
};

export const logUnlockFinishUnlockingClicked = (
  unlockedCharacterCount,
  maxSlots
) => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Unlock,
    action: EventActions.DDB_Unlock_FinishUnlockingClicked,
    label: `Unlocked Characters: ${unlockedCharacterCount} / ${maxSlots}`,
  });
};

export const logUnlockFinishUnlockingCancelled = (
  unlockedCharacterCount,
  maxSlots
) => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Unlock,
    action: EventActions.DDB_Unlock_FinishUnlockingCancelled,
    label: `Unlocked Characters: ${unlockedCharacterCount} / ${maxSlots}`,
  });
};

export const logUnlockFinishUnlockingConfirmed = (
  unlockedCharacterCount,
  maxSlots
) => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Unlock,
    action: EventActions.DDB_Unlock_FinishUnlockingConfirmed,
    label: `Unlocked Characters: ${unlockedCharacterCount} / ${maxSlots}`,
  });
};

export const logUnlockSubscribeClicked = () => {
  logEvent(SessionNames.DDB, {
    category: EventCategories.DDB_Unlock,
    action: EventActions.DDB_Unlock_SubscribeClicked,
  });
};
