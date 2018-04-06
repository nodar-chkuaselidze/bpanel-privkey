import {
  OPEN_MANAGER,
  CLOSE_MANAGER,
  MANAGER_OPENED,
  MANAGER_CLOSED,
  KEYS_LOADED,
  KEY_ADDED
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

function list(state = [], action) {
  switch (action.type) {
    case KEYS_LOADED:
      return action.keys;

    case KEY_ADDED:
      return [...state, action.key];

    default:
      return state;
  }
}

const mainReducer = combineReducers({
  manager,
  list
});

export default mainReducer;
