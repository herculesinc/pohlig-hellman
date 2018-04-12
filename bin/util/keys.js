"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const forge = require("node-forge");
const biUtil_1 = require("./biUtil");
// PUBLIC FUNCTION
// ================================================================================================
function generateKey(prime, bitLength = 256) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: validate parameters
        const randomBytes = Buffer.from(forge.random.getBytesSync(bitLength >> 3));
        let key = biUtil_1.bufferToBigInt(randomBytes);
        if (key.isEven()) {
            key = key.add(biUtil_1.BIG_INT_ONE);
        }
        return biUtil_1.bigIntToBuffer(key);
        // return new Promise((resolve, reject) => {
        //     crypto.randomBytes(byteLength, (error, buf) => {
        //         if (error) {
        //             return reject(error);
        //         }
        //
        //         console.log( 'key', buf.toString('hex') )
        //
        //         // TODO: make sure a valid key has been generated
        //
        //         let key = new BigInteger(buf.toString('hex'), 16);
        //         if (key.isEven()) {
        //             key = key.add(ONE);
        //         }
        //
        //         resolve(key);
        //     });
        // });
    });
}
exports.generateKey = generateKey;
function isValidKey(prime) {
    // TODO: implement
    return true;
}
exports.isValidKey = isValidKey;
//# sourceMappingURL=keys.js.map