import {
  OPEN_KEYDB,
  CLOSE_KEYDB,
  KEYDB_OPENED,
  KEYDB_CLOSED,
  KEYS_LOADED,
  KEY_ADDED
} from './constants';

import { combineReducers } from 'redux';

const keydbInitialState = {
  open: false,
  opening: false,
  closing: false
};

function keydb(state = keydbInitialState, action) {
  switch (action.type) {
    case OPEN_KEYDB:
      return Object.assign({}, state, {
        open: false,
        opening: true
      });

    case KEYDB_OPENED:
      return Object.assign({}, state, {
        open: true,
        opening: false
      });

    case CLOSE_KEYDB:
      return Object.assign({}, state, {
        closing: true
      });

    case KEYDB_CLOSED:
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
  keydb,
  list
});

export default mainReducer;
