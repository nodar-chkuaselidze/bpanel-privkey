import { key } from "bdb";

/*
 * Keys layout
 * k[name] -> encryptedKey
 */

export default {
  k: key("k", ["ascii"])
};
