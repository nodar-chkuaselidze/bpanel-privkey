import { OPEN_MANAGER, CLOSE_MANAGER } from "../constants";
import { managerOpened, managerClosed } from "../actions.js";

import getKeyManager from "../manager/manager";

const manager = getKeyManager();

const middleware = store => next => action => {
  const { dispatch } = store;

  switch (action.type) {
    case OPEN_MANAGER:
      manager.open().then(() => {
        dispatch(managerOpened());
      });
      break;

    case CLOSE_MANAGER:
      manager.close().then(() => {
        dispatch(managerClosed(0));
      });
      break;

    default:
      next(action);
  }
};

export default middleware;
