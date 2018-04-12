# pohlig-hellman

Pohlig-Hellman cipher for for node.js written in TypeScript.

## Install
```sh
$ npm install pohlig-hellman --save
```

## Example
```JavaScript
import * as ph from 'pohlig-hellman';

const data = 'something to encrypt';

// create a cipher with a random key
const cipher = ph.createCipher();

const encrypted = cipher.encrypt(data);
const decrypted = cipher.decrypt(encrypted).toString();

console.log(data === decrypted); // true
```

# API

## Creating a Cipher

## Encrypting and Decrypting
Once a cipher is created you can use it to encrypt and decrypt data using the following methods:

```TypeScript
// encrypting the data
encrypt(data: Buffer): Buffer;
encrypt(data: string, encoding = 'utf8'): Buffer;
// encoding can also be 'hex' or 'base64'

// derypting the data
decrypt(data: Buffer): Buffer;
decrypt(data: string, encoding = 'hex'): Buffer;
// encoding can also be 'base64'
```

## Merging Keys
One of the nice properties of Pohlig-Hellman chiper is that it allows key merging. This can be accomplished using `mergeKeys()` function. For example:

```TypeScript
import * as ph from 'pohlig-hellman';

const data = 'something to encrypt';

// create a cipher and encrypt the data with a random key
const cipher1 = await ph.createCipher();
const encrypted1 = cipher1.encrypt(data);

// encrypt the data with a different random key
const cipher2 = await ph.createCipher(cipher1.prime);
const encrypted2 = cipher2.encrypt(encrypted1);

// merge the keys from the 2 ciphers, and decrypt with it
const mergedKey = ph.mergeKeys(cipher1.enkey, cipher2.enkey);
const cipher3 = new ph.Cipher(cipher1.prime, mergedKey);
const decrypted = cipher3.decrypt(encrypted2).toString();

console.log(data === decrypted);

```