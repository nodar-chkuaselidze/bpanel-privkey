import { OPEN_KEYDB, CLOSE_KEYDB, RESET_KEYDB } from '../constants';
import {
  keyDBOpened,
  keyDBClosed,
  keyDBReset,
  openKeyDB,
  keysLoaded,
  keyAdded,
  keyRemoved
} from '../actions.js';

import KeyDB from '../keydb/keydb';

const DB_NAME = 'keydb';

let keydb = new KeyDB({
  location: DB_NAME
});

let loaded = false;

const middleware = store => next => action => {
  const { dispatch } = store;

  switch (action.type) {
    case OPEN_KEYDB:
      if (loaded) break;

      keydb.on('list', keys => {
        dispatch(keysLoaded(keys));
      });

      keydb.on('saved key', key => {
        dispatch(keyAdded(key));
      });

      keydb.on('removed key', key => {
        dispatch(keyRemoved(key));
      });

      keydb.on('open', () => {
        dispatch(keyDBOpened());
      });

      keydb.on('close', () => {
        dispatch(keyDBClosed());
      });

      // reset database
      keydb.on('destroy', () => {
        loaded = false;
        keydb = new KeyDB({
          location: DB_NAME
        });

        dispatch(keyDBReset());
        dispatch(openKeyDB());
      });

      keydb.open();

      loaded = true;
      break;

    case CLOSE_KEYDB:
      if (!loaded) break;

      keydb.close().catch(e => {
        throw e;
      });

      loaded = false;
      break;

    case RESET_KEYDB:
      keydb.destroy().catch(e => {
        throw e;
      });
      break;

    default:
      next(action);
  }
};

export default middleware;
