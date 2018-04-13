"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const jsbn_1 = require("jsbn");
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
//# sourceMappingURL=converters.js.map