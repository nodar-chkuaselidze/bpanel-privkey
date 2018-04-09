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

const middleware = store => next => action => {
  const { dispatch } = store;

  switch (action.type) {
    case OPEN_KEYDB:
      if (keydb.opened) break;

      keydb.on('list', keys => {
        dispatch(keysLoaded(keys));
      });

      keydb.on('created key', key => {
        dispatch(keyAdded(key));
      });

      keydb.on('removed key', key => {
        dispatch(keyRemoved(key));
      });

      keydb.on('open', async () => {
        dispatch(keyDBOpened());

        const list = await keydb.getExistingKeys();
        dispatch(keysLoaded(list));
      });

      keydb.on('close', () => {
        dispatch(keyDBClosed());
      });

      // reset database
      keydb.on('destroy', () => {
        keydb = new KeyDB({
          location: DB_NAME
        });

        dispatch(keyDBReset());
        dispatch(openKeyDB());
      });

      keydb.open();
      break;

    case CLOSE_KEYDB:
      if (!keydb.opened) break;

      keydb.close().catch(e => {
        throw e;
      });

      break;

    case RESET_KEYDB:
      keydb.destroy().catch(e => {
        throw e;
      });
      break;

    case 'DEBUG_KEYDB_DUMP':
      keydb
        .dumpAscii()
        .then(r => {
          console.log(r); // eslint-disable-line
        })
        .catch(() => {});
      break;

    default:
      next(action);
  }
};

export default middleware;
