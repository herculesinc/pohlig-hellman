"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const crypto = require("crypto");
const jsbn_1 = require("jsbn");
// MODULE VARIABLES
// ================================================================================================
const ONE = new jsbn_1.BigInteger('1', 10);
// PUBLIC FUNCTION
// ================================================================================================
function generateKey(prime, bitLength = 256) {
    // TODO: validate parameters
    const byteLength = Math.floor(bitLength / 8);
    return new Promise((resolve, reject) => {
        crypto.randomBytes(byteLength, (error, buf) => {
            if (error) {
                return reject(error);
            }
            // TODO: make sure a valid key has been generated
            let key = new jsbn_1.BigInteger(buf.toString('hex'), 16);
            if (key.isEven()) {
                key = key.add(ONE);
            }
            resolve(key);
        });
    });
}
exports.generateKey = generateKey;
//# sourceMappingURL=keys.js.map