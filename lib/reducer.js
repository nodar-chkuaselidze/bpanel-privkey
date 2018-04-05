import {
  OPEN_MANAGER,
  CLOSE_MANAGER,
  MANAGER_OPENED,
  MANAGER_CLOSED
} from "./constants";

import { combineReducers } from "redux";

const managerInitialState = {
  open: false,
  opening: false,
  closing: false
};

function manager(state = managerInitialState, action) {
  switch (action.type) {
    case OPEN_MANAGER:
      return Object.assign({}, state, {
        open: false,
        opening: true
      });

    case MANAGER_OPENED:
      return Object.assign({}, state, {
        open: true,
        opening: false
      });

    case CLOSE_MANAGER:
      return Object.assign({}, state, {
        closing: true
      });

    case MANAGER_CLOSED:
      return Object.assign({}, state, {
        open: false,
        closing: false
      });
    default:
      return state;
  }
}

const mainReducer = combineReducers({
  manager
});

export default mainReducer;
