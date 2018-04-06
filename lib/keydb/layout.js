import { key } from 'bdb';

/*
 * Keys layout
 * C -> number of keys
 * k[index] -> key
 * i[name] -> index by name
 * 
 */

export default {
  C: key('C'),
  k: key('k', ['uint32']),
  i: key('i', ['ascii'])
};
