// IMPORTS
// ================================================================================================
import * as crypto from 'crypto';
import { BigInteger } from 'jsbn';

// MODULE VARIABLES
// ================================================================================================
const ONE = new BigInteger('1', 10);

// PUBLIC FUNCTION
// ================================================================================================
export function generateKey(prime: BigInteger, bitLength = 256): Promise<BigInteger> {
    // TODO: validate parameters

    const byteLength = Math.floor(bitLength / 8);
    return new Promise((resolve, reject) => {
        crypto.randomBytes(byteLength, (error, buf) => {
            if (error) {
                return reject(error);
            }

            // TODO: make sure a valid key has been generated

            let key = new BigInteger(buf.toString('hex'), 16);
            if (key.isEven()) {
                key = key.add(ONE);
            }

            resolve(key);
        });
    });
}