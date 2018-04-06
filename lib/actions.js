import {
  OPEN_MANAGER,
  CLOSE_MANAGER,
  MANAGER_OPENED,
  MANAGER_CLOSED,
  KEYS_LOADED,
  KEY_ADDED
} from "./constants";

export function openManager() {
  return {
    type: OPEN_MANAGER
  };
}

export function closeManager() {
  return {
    type: CLOSE_MANAGER
  };
}

export function managerOpened() {
  return {
    type: MANAGER_OPENED
  };
}

export function managerClosed() {
  return {
    type: MANAGER_CLOSED
  };
}

export function openIfNotOpen(manager) {
  return dispatch => {
    if (!manager.open) dispatch(openManager());
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
