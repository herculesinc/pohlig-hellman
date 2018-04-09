"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsbn_1 = require("jsbn");
exports.BIG_INT_ONE = new jsbn_1.BigInteger('1', 10);
exports.BIG_INT_TWO = new jsbn_1.BigInteger('2', 10);
function bufferToBigInt(buffer) {
    return new jsbn_1.BigInteger(buffer.toString('hex'), 16);
}
exports.bufferToBigInt = bufferToBigInt;
function bigIntToBuffer(bi) {
    let result;
    try {
        result = Buffer.from(bi.toString(16).toUpperCase(), 'hex');
    }
    catch (e) {
        console.log(bi.toString(16));
        console.log(e);
    }
    return result;
}
exports.bigIntToBuffer = bigIntToBuffer;
//# sourceMappingURL=biUtil.js.map