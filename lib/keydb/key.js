import { BufferReader, BufferWriter, StaticWriter } from 'bufio';
import { hd, wallet } from 'bcoin';

import layout from './layout';
import networkTypes from './networks';

import assert from 'assert';

const { HD, Mnemonic } = hd;
const { MasterKey } = wallet;

export default class Key {
  constructor(options) {
    this.name = '';
    this.index = 0;

    // import network
    this.network = 'main';

    this.key = new MasterKey();

    if (options) return this.fromOptions(options);
  }

  fromOptions(options) {
    if (!options) return this;

    if (options.name) {
      assert(typeof options.name === 'string', 'Name must be a string.');
      assert(options.name.length < 40, 'Name must not be longer than 40.');
      this.name = options.name;
    }

    if (options.index) {
      assert(isU32(options.index), 'Index must be an u32.');
      this.index = options.index;
    }

    if (options.network) {
      assert(
        networkTypes.indexOf(options.network) > -1,
        'Could not find correct network.'
      );

      this.network = options.network;
    }

    let key = options.key;
    let mnemonic;

    if (key && typeof key === 'string') {
      key = HD.PrivateKey.fromBase58(key, this.network);
    } else {
      mnemonic = new Mnemonic(options.mnemonic);
      key = HD.fromMnemonic(mnemonic, options.passphrase);
    }

    assert(HD.isPrivate(key), 'Could not create private key.');
    this.key.fromKey(key, mnemonic);

    return this;
  }

  static fromOptions(options) {
    return new this().fromOptions(options);
  }

  static fromRaw(raw) {
    return new this().fromRaw(raw);
  }

  getSize() {
    let size = 1; // name size
    size += this.name.length;
    size += 1; // index
    size += 1; // network id
    size += this.key.getSize();

    return size;
  }

  write(bw) {
    bw.writeU8(this.name.length);
    bw.writeBytes(Buffer.from(this.name, 'utf8'));
    bw.writeU8(this.index);
    bw.writeU8(networkTypes.indexOf(this.network));
    this.key.toWriter(bw);
  }

  read(br) {
    const length = br.readU8();
    this.name = this.readBytes(length);
    this.index = this.readU8();
    this.network = networkTypes[this.readU8()];
    this.key.fromReader(br);
  }

  toWriter(bw) {
    return this.write(bw);
  }

  fromReader(br) {
    return this.read(br);
  }

  toRaw() {
    return this.encode();
  }

  fromRaw(data) {
    return this.decode(data);
  }

  encode() {
    const size = this.getSize();
    const bw = size === -1 ? new BufferWriter() : new StaticWriter(size);
    this.write(bw);
    return bw.render();
  }

  decode(data) {
    const br = new BufferReader(data);
    this.read(br);
    return this;
  }

  async destroy() {
    await this.key.destroy();
    this.index = -1;
    this.name = '';
    this.network = 'main';
  }

  static async getKID(db, name) {
    const pid = await db.get(layout.i.build(name));

    if (!pid) return -1;

    assert(pid.length === 4);
    return pid.readUInt32BE(0, true);
  }

  static hasName(db, name) {
    return db.has(layout.i.build(name));
  }

  static has(db, id) {
    return db.has(layout.k.build(id));
  }

  static getKeyNames(db) {
    return db.range({
      gte: layout.i.min(),
      lte: layout.i.max(),
      parse: (key, value) => {
        const name = layout.i.parse(key);
        return [name, fromU32BE(value)];
      }
    });
  }

  static saveKey(b, key) {
    b.put(layout.k.build(key.index), key.toRaw());
    b.put(layout.i.build(key.name), toU32BE(key.index));
  }

  static removeKey(b, key) {
    b.del(layout.k.build(key.index));
    b.del(layout.i.build(key.name));
  }
}

function isU32(num) {
  return num >>> 0 === num;
}

function toU32BE(num) {
  const data = Buffer.alloc(4);
  data.writeUInt32BE(num, 0, true);
  return data;
}

function fromU32BE(buf) {
  return buf.readUInt32BE(0, true);
}
