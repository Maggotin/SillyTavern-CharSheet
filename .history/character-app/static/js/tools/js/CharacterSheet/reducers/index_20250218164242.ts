import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { defaultReducers } from "../../character-rules-engine/es";

import builder from "../../CharacterBuilder/reducers/builder";
import appEnv from "../../Shared/reducers/appEnv";
import appInfo from "../../Shared/reducers/appInfo";
import confirmModal from "../../Shared/reducers/confirmModal";
import modal from "../../Shared/reducers/modal";
import rollResult from "../../Shared/reducers/rollResult";
import toastMessage from "../../Shared/reducers/toastMessage";
import sheet from "./sheet";

const initialRouteControls = {
  currentPath: "",
  navigate: (route) => {
    console.log("navigate not setup failed to go to", route);
  },
};
const rootReducer = combineReducers({
  ...defaultReducers,
  appEnv,
  appInfo,
  sheet,
  builder,
  modal,
  confirmModal,
  toastMessage,
  rollResult,
  router: routerReducer,
  routeControls: (state = initialRouteControls, action) => {
    switch (action.type) {
      case "SET_ROUTE_CONTROLS":
        return action.payload;
      default:
        break;
    }

    return state;
  },
});

export default rootReducer;
