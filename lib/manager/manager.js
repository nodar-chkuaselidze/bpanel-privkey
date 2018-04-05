import bdb from "bdb";
import EventEmitter from "events";

let manager = null;

export class KeyManager extends EventEmitter {
  constructor(options) {
    super();

    this.db = bdb.create(options);
    this.loadedKeys = new Map();
  }

  async open() {
    await this.db.open();
  }

  async close() {
    await this.db.close();
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
