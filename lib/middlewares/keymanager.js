import { OPEN_MANAGER, CLOSE_MANAGER } from "../constants";
import {
  managerOpened,
  managerClosed,
  keysLoaded,
  keyAdded
} from "../actions.js";

import getKeyManager from "../manager/manager";

const manager = getKeyManager();

let loaded = false;
const middleware = store => next => action => {
  const { dispatch } = store;

  switch (action.type) {
    case OPEN_MANAGER:
      if (loaded) break;

      manager.on("list", keys => {
        dispatch(keysLoaded(keys));
      });

      manager.on("saved key", key => {
        dispatch(keyAdded(key));
      });

      manager.on("open", () => {
        dispatch(managerOpened());
      });

      manager.open();

      loaded = true;
      break;

    case CLOSE_MANAGER:
      if (!loaded) break;

      manager.close().then(() => {
        dispatch(managerClosed(0));
      });

      loaded = false;
      break;

    default:
      next(action);
  }
};

export default middleware;
