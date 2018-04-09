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
const util = require("./util");
const util_1 = require("./util");
function createCipher(lengthOrGroup) {
    return __awaiter(this, void 0, void 0, function* () {
        let prime;
        if (typeof lengthOrGroup === 'number') {
            prime = yield util.generateSafePrime(lengthOrGroup);
        }
        else if (typeof lengthOrGroup === 'string') {
            prime = util.getPrime(lengthOrGroup);
        }
        else if (lengthOrGroup === null || lengthOrGroup === undefined) {
            prime = util.getPrime('modp2048');
        }
        const key = yield util.generateKey(prime);
        return new Cipher(prime, key);
    });
}
exports.createCipher = createCipher;
function mergeKeys(key1, key2) {
    // TODO: validate parameters
    const k1 = util_1.bufferToBigInt(key1);
    const k2 = util_1.bufferToBigInt(key2);
    const k12 = k1.multiply(k2);
    return util_1.bigIntToBuffer(k12);
}
exports.mergeKeys = mergeKeys;
// CIPHER DEFINITION
// ================================================================================================
class Cipher {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(prime, enkey) {
        // TODO: validate parameters
        this.p = prime;
        this.e = enkey;
        const dKey = this.biEnkey.modInverse(this.biPrime.subtract(util_1.BIG_INT_ONE));
        this.d = util_1.bigIntToBuffer(dKey);
        // TODO: implement validity checking for p, e, and d
    }
    // PUBLIC FUNCTIONS
    // --------------------------------------------------------------------------------------------
    encrypt(data) {
        // TODO: validate parameters
        const m = util_1.bufferToBigInt(data);
        const c = m.modPow(this.biEnkey, this.biPrime);
        return util_1.bigIntToBuffer(c);
    }
    decrypt(data) {
        // TODO: validate parameters
        const c = util_1.bufferToBigInt(data);
        const m = c.modPow(this.biDekey, this.biPrime);
        return util_1.bigIntToBuffer(m);
    }
    clone(keyBitLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield util.generateKey(this.p, keyBitLength);
            return new Cipher(this.p, key);
        });
    }
    // PUBLIC MEMBERS
    // --------------------------------------------------------------------------------------------
    get prime() {
        return this.p;
    }
    get enkey() {
        return this.e;
    }
    get dekey() {
        return this.d;
    }
    get biPrime() {
        return util_1.bufferToBigInt(this.p);
    }
    get biEnkey() {
        return util_1.bufferToBigInt(this.e);
    }
    get biDekey() {
        return util_1.bufferToBigInt(this.d);
    }
}
exports.Cipher = Cipher;
//# sourceMappingURL=index.js.map