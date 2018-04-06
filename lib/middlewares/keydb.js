import { OPEN_KEYDB, CLOSE_KEYDB } from "../constants";
import { keyDBOpened, keyDBClosed, keysLoaded, keyAdded } from "../actions.js";

import getKeyDB from "../keydb/keydb";

const keydb = getKeyDB();

let loaded = false;
const middleware = store => next => action => {
  const { dispatch } = store;

  switch (action.type) {
    case OPEN_KEYDB:
      if (loaded) break;

      keydb.on("list", keys => {
        dispatch(keysLoaded(keys));
      });

      keydb.on("saved key", key => {
        dispatch(keyAdded(key));
      });

      keydb.on("open", () => {
        dispatch(keyDBOpened());
      });

      keydb.open();

      loaded = true;
      break;

    case CLOSE_KEYDB:
      if (!loaded) break;

      keydb.close().then(() => {
        dispatch(keyDBClosed(0));
      });

      loaded = false;
      break;

    default:
      next(action);
  }
};

export default middleware;
