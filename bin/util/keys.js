"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const crypto = require("crypto");
const jsbn_1 = require("jsbn");
const converters_1 = require("./converters");
// MODULE VARIABLES
// ================================================================================================
const MIN_KEY_LENGTH = 16;
const DEFAULT_KEY_LENGTH = 256;
// PUBLIC FUNCTION
// ================================================================================================
function generateKey(prime, bitLength) {
    if (prime === null || prime === undefined) {
        throw new TypeError('Cannot generate key: prime is undefined');
    }
    const primeLength = prime.length * 8;
    // if key length was not provided, figure out what is appropriate
    if (bitLength === null || bitLength === undefined) {
        bitLength = Math.min(DEFAULT_KEY_LENGTH, primeLength / 4);
    }
    // validate key length
    if (typeof bitLength !== 'number') {
        throw new TypeError('Cannot generate key: bit length is invalid');
    }
    else if (bitLength < MIN_KEY_LENGTH) {
        throw new TypeError('Cannot generate key: key length is too small');
    }
    else if (bitLength > (primeLength / 4)) {
        throw new TypeError('Cannot generate key: key length is too big');
    }
    // generate and return the key
    return new Promise((resolve, reject) => {
        const byteLength = Math.floor(bitLength / 8);
        crypto.randomBytes(byteLength, (error, buf) => {
            if (error) {
                return reject(error);
            }
            let key = converters_1.bufferToBigInt(buf);
            if (key.isEven()) {
                key = key.add(jsbn_1.BigInteger.ONE);
            }
            resolve(converters_1.bigIntToBuffer(key));
        });
    });
}
exports.generateKey = generateKey;
function isValidKey(prime, key) {
    const primeLength = prime.bitLength();
    const keyLength = key.bitLength();
    return (keyLength >= MIN_KEY_LENGTH && keyLength <= (primeLength / 4));
}
exports.isValidKey = isValidKey;
//# sourceMappingURL=keys.js.map