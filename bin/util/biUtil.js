"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const jsbn_1 = require("jsbn");
// MODULE VARIABLES
// ================================================================================================
exports.BIG_INT_ONE = new jsbn_1.BigInteger('1', 10);
exports.BIG_INT_TWO = new jsbn_1.BigInteger('2', 10);
// PUBLIC FUNCTIONS
// ================================================================================================
function bufferToBigInt(buffer) {
    return new jsbn_1.BigInteger(buffer.toString('hex'), 16);
}
exports.bufferToBigInt = bufferToBigInt;
function bigIntToBuffer(bi) {
    let hex = bi.toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    return Buffer.from(hex, 'hex');
}
exports.bigIntToBuffer = bigIntToBuffer;
//# sourceMappingURL=biUtil.js.map