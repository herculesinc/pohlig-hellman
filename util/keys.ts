// IMPORTS
// ================================================================================================
import * as crypto from 'crypto';
import { BigInteger } from 'jsbn';
import {bigIntToBuffer, bufferToBigInt} from './converters';

// MODULE VARIABLES
// ================================================================================================
const MIN_KEY_LENGTH = 16;
const DEFAULT_KEY_LENGTH = 256;

// PUBLIC FUNCTION
// ================================================================================================
export function generateKey(prime: Buffer, bitLength?: number): Promise<Buffer> {
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

            let key = bufferToBigInt(buf);
            if (key.isEven()) {
                key = key.add(BigInteger.ONE);
            }

            resolve(bigIntToBuffer(key));
        });
    });
}

export function isValidKey(prime: BigInteger, key: BigInteger): boolean {
    const primeLength = prime.bitLength();
    const keyLength = key.bitLength();

    return (keyLength >= MIN_KEY_LENGTH && keyLength <= (primeLength / 4));
}