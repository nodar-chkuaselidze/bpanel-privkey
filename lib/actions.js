import {
  OPEN_KEYDB,
  CLOSE_KEYDB,
  KEYDB_OPENED,
  KEYDB_CLOSED,
  KEYS_LOADED,
  KEY_ADDED
} from "./constants";

export function openKeyDB() {
  return {
    type: OPEN_KEYDB
  };
}

export function closeKeyDB() {
  return {
    type: CLOSE_KEYDB
  };
}

export function keyDBOpened() {
  return {
    type: KEYDB_OPENED
  };
}

export function keyDBClosed() {
  return {
    type: KEYDB_CLOSED
  };
}

export function openIfNotOpen(keydb) {
  return dispatch => {
    if (!keydb.open) dispatch(openKeyDB());
  };
}

export function keysLoaded(keys) {
  return {
    type: KEYS_LOADED,
    keys: keys
  };
}

export function keyAdded(key) {
  return {
    type: KEY_ADDED,
    key: key
  };
}
