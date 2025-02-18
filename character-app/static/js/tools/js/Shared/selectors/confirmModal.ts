import { createSelector } from "reselect";

import { SharedAppState } from "../stores/typings";

export const getModals = (state: SharedAppState) => state.confirmModal.modals;

export const getActiveConfirmModal = createSelector([getModals], (modals) =>
  modals.length ? modals[0] : null
);
