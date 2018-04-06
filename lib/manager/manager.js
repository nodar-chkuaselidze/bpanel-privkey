import bdb from "bdb";
import EventEmitter from "events";
import assert from "assert";

import { hd } from "bcoin";

import NetworkTypes from "./networks";
import layout from "./layout";
import Key from "./key";
import { NONE } from "./status";

const { Mnemonic } = hd;

let manager = null;

export class KeyManager extends EventEmitter {
  constructor(options) {
    super();

    this.depth = 1;
    this.network = NetworkTypes.defaultNetwork;
    this.db = bdb.create(options);
    this.loadedKeys = new Map();
  }

  async open() {
    await this.db.open();
    this.emit("open");

    await this.init();
  }

  async close() {
    await this.db.close();
  }

  async init() {
    // Create one default key
    const items = await this.getExistingKeys();

    if (items.length === 0)
      await this.importMnemonic("default", new Mnemonic());
  }

  async getDepth() {
    const raw = await this.db.get(layout.C.build());

    if (!raw) return 0;

    assert(raw.length === 4);

    return raw.readUInt32BE(0, true);
  }

  async increment(b) {
    KeyManager.increment(b, this.depth);
    this.depth += 1;
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
    if (typeof id === "number") {
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

    this.emit("list", items);

    return items;
  }

  /**
   * Import HDPrivateKey
   * @param {String} name
   * @param {Mnemonic} mnemonic
   * @param {Buffer|String} passphrase
   * @param {String} networkName
   * @return {Promise}
   */

  async importMnemonic(name, mnemonic, passphrase, network) {
    const key = new Key().fromOptions({
      index: 1,
      name: name,
      network: network ? network : this.network,
      mnemonic: mnemonic,
      passphrase: passphrase
    });

    await this.saveKey(key);
  }

  /**
   * Save key
   * @private
   * @param {String} name
   * @param {MasterKey} master
   */

  async saveKey(key) {
    const b = this.db.batch();
    Key.saveKey(b, key);
    this.increment(b);
    await b.write();

    this.emit("saved key", {
      name: key.name,
      status: KeyStatus.NONE
    });
  }

  async removeKey(key) {
    const b = this.db.batch();
    Key.removeKey(key);
    await b.write();
    await key.destroy();

    this.emit("removed key", {
      name: key.name
    });
  }
}

export default function getKeyManager() {
  if (!manager) {
    manager = new KeyManager({
      location: "keymanagement"
    });
  }

  return manager;
}

function toU32BE(num) {
  const data = Buffer.alloc(4);
  data.writeUInt32BE(num, 0, true);
  return data;
}
