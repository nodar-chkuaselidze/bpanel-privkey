import {
  OPEN_MANAGER,
  CLOSE_MANAGER,
  MANAGER_OPENED,
  MANAGER_CLOSED
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
