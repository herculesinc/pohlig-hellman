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

// create a cipher with a 2048-bit prime and a 256-bit random key
const cipher = await ph.createCipher();

const encrypted = cipher.encrypt(data);
const decrypted = cipher.decrypt(encrypted).toString();

console.log(data === decrypted); // true
```

# API
Full API defintions are available in the [pohlig-hellman.d.ts](https://github.com/herculesinc/pohlig-hellman/blob/master/pohlig-hellman.d.ts) file available.

## Creating a Cipher
If you have a prime and an encryption key you'd like to create a cipher with, you can use the cipher constructor directly.
```TypeScript
constructor(prime: Buffer, enkey: Buffer);
```
As shown above, both parameters must be in Buffer form.

To initialize the cipher with a random key, `createCipher()` function can be used. This function has the following signatures:
```TypeScript
createCipher()                      : Promise<Cipher>;
createCipher(prime: Buffer)         : Promise<Cipher>;
createCipher(modpGroup: string)     : Promise<Cipher>;
createCipher(primeLength: number)   : Promise<Cipher>;
```
The method works as follows:
* If no parameters are provided, the cipher is initialized with a 2048-bit prime from [RFC 3526](https://tools.ietf.org/html/rfc3526) and a random 256-bit encryption key.
* If a buffer is provide it is assumed to be a prime, and and the cipher is initialized with that prime and a random key appropriate for the specified prime.
* If a string is provided, it is assumed to be a name of a group from [RFC 3526](https://tools.ietf.org/html/rfc3526). The valid group names are: `modp2048`, `modp3072`, `modp4096`, `modp6144`, `modp8192`. The cipher is initialized with the specified prime and a random 256-bit key
* If a number is provided, it is assumed to be the length of a desired prime in bits. The cipher is initialized with a random prime of the specified length and a random key appropriate for that prime.

Because prime and key generation are done asynchronously, the function returns a promise for the cipher.

## Encrypting and Decrypting
Once a cipher is created you can use it to encrypt and decrypt data using the following methods:

```TypeScript
// encrypting the data
encrypt(data: Buffer): Buffer;
encrypt(data: string, encoding = 'utf8'): Buffer; // encoding can also be 'hex' or 'base64'

// derypting the data
decrypt(data: Buffer): Buffer;
decrypt(data: string, encoding = 'hex'): Buffer; // encoding can also be 'base64'
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