import bdb from 'bdb';
import EventEmitter from 'events';
import assert from 'assert';

import { hd } from 'bcoin';
import { Lock } from 'bmutex';

import NetworkTypes from './networks';
import layout from './layout';
import Key from './key';
import { NONE } from './status';

const { HD } = hd;

export default class KeyDB extends EventEmitter {
  constructor(options) {
    super();

    this.lock = new Lock();
    this.depth = 1;
    this.network = NetworkTypes.defaultNetwork;
    this.db = bdb.create(options);
    this.loadedKeys = new Map();
    this.opened = false;
  }

  async open() {
    await this.db.open();

    await this.init();
    this.opened = true;

    this.emit('open');
  }

  async close() {
    await this.db.close();
    this.opened = false;
    this.emit('close');
  }

  async init() {
    this.depth = await this.getDepth();

    if (this.depth === 0) {
      await this.createKey(
        new Key({
          name: 'default',
          key: HD.generate()
        })
      );
    }
  }

  async getDepth() {
    const raw = await this.db.get(layout.C.build());

    if (!raw) return 0;

    assert(raw.length === 4);

    return raw.readUInt32BE(0, true);
  }

  async increment(b) {
    KeyDB.increment(b, this.depth);
    this.depth += 1;
  }

  dump() {
    return this.db.dump();
  }

  async dumpAscii() {
    const items = await this.db.range();
    const records = Object.create(null);

    for (const item of items) {
      const key = decodeAscii(item.key);
      const value = decodeAscii(item.value);
      records[key] = value;
    }

    return records;
  }

  static increment(b, depth) {
    b.put(layout.C.build(), toU32BE(depth + 1));
  }

  /**
   * Get KeyID
   * @param {String|Number} id
   * @returns {Promise<Number>}
   */

  async ensureKID(id) {
    if (typeof id === 'number') {
      if (await Key.has(this.db, id)) return id;

      return -1;
    }

    return Key.getKID(this.db, id);
  }

  async changeNetwork(network) {
    this.network = network;
  }

  async getExistingKeys() {
    const rawitems = await Key.getKeyNames(this.db);
    const items = rawitems.map(item => {
      return {
        name: item[0],
        index: item[1],
        status: NONE
      };
    });

    return items;
  }

  /**
   * Import HDPrivateKey
   * @param {Object} options
   * @param {String} options.name
   * @param {String} options.mnemonic
   * @param {Buffer|String} options.passphrase - mnemonic passphrase
   * @param {Enum} options.network
   * @param {Buffer|String} lockphrase
   * @return {Promise}
   */

  async importMnemonic(options, lockphrase) {
    const network = options.network || this.network;
    const key = new Key({
      name: options.name,
      network: network,
      mnemonic: options.mnemonic,
      passphrase: options.passphrase
    });

    await this.createKey(key, lockphrase);
  }

  /**
   * Create key
   * @param {Key} key
   * @param {Buffer|String} lockphrase - used for locking key
   */

  async createKey(key, lockphrase) {
    const unlock = await this.lock.lock();

    try {
      this._createKey(key, lockphrase);
    } finally {
      unlock();
    }
  }

  async _createKey(key, lockphrase) {
    if (lockphrase) await key.lock(lockphrase);

    const b = this.db.batch();

    key.setIndex(this.depth);

    Key.saveKey(b, key);
    this.increment(b);

    await b.write();

    this.emit('created key', {
      index: key.index,
      name: key.name,
      status: NONE
    });
  }

  async removeKey(key) {
    const b = this.db.batch();
    Key.removeKey(key);
    await b.write();
    await key.destroy();

    this.emit('removed key', {
      name: key.name
    });
  }

  async destroy() {
    this.depth = 0;
    this.network = NetworkTypes.defaultNetwork;
    this.loadedKeys = new Map();
    await this.close();
    await this.db.destroy();

    this.emit('destroy');
  }
}

function toU32BE(num) {
  const data = Buffer.alloc(4);
  data.writeUInt32BE(num, 0, true);
  return data;
}

// naive
function decodeAscii(buff) {
  const from = 32; // 0x20 - space
  const to = 126; // 0x7E - ~

  let string = '';

  for (let i = 0; i < buff.length; i++) {
    if (buff[i] >= from && buff[i] <= to)
      string += String.fromCharCode(buff[i]);
    else
      string +=
        '\\x' +
        Buffer.from([buff[i]])
          .toString('hex')
          .toUpperCase();
  }

  return string;
}
