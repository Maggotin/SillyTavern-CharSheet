import { SharedAppState } from "../stores/typings";

export function getOpenStatus(state: SharedAppState, key) {
  return !!state.modal.open[key];
}
