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
// IMPORTS
// ================================================================================================
const jsbn_1 = require("jsbn");
const util = require("./util");
// MODULE VARIABLES
// ================================================================================================
const ONE = new jsbn_1.BigInteger('1', 10);
function createCipher(lengthOrGroup) {
    return __awaiter(this, void 0, void 0, function* () {
        let prime;
        if (typeof lengthOrGroup === 'number') {
            prime = util.generateSafePrime(lengthOrGroup);
        }
        else if (typeof lengthOrGroup === 'string') {
            prime = util.getPrime(lengthOrGroup);
        }
        else if (lengthOrGroup === null || lengthOrGroup === undefined) {
            prime = util.getPrime('modp2048');
        }
        const key = yield util.generateKey(prime);
        return new Cipher(Buffer.from(prime.toString(16), 'hex'), Buffer.from(key.toString(16), 'hex'));
    });
}
exports.createCipher = createCipher;
function mergeKeys(key1, key2) {
    // TODO: validate parameters
    const k1 = new jsbn_1.BigInteger(key1.toString('hex'), 16);
    const k2 = new jsbn_1.BigInteger(key2.toString('hex'), 16);
    const k12 = k1.multiply(k2);
    return Buffer.from(k12.toString(16), 'hex');
}
exports.mergeKeys = mergeKeys;
// CIPHER DEFINITION
// ================================================================================================
class Cipher {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(prime, enkey) {
        // TODO: validate parameters
        this.p = new jsbn_1.BigInteger(prime.toString('hex'), 16);
        this.e = new jsbn_1.BigInteger(enkey.toString('hex'), 16);
        this.d = this.e.modInverse(this.p.subtract(ONE));
        // TODO: implement validity checking for p, e, and d
    }
    // PUBLIC FUNCTIONS
    // --------------------------------------------------------------------------------------------
    encrypt(data) {
        // TODO: validate parameters
        const m = new jsbn_1.BigInteger(data.toString('hex'), 16);
        const c = m.modPow(this.e, this.p);
        return Buffer.from(c.toString(16), 'hex');
    }
    decrypt(data) {
        // TODO: validate parameters
        const c = new jsbn_1.BigInteger(data.toString('hex'), 16);
        const m = c.modPow(this.d, this.p);
        return Buffer.from(m.toString(16), 'hex');
    }
    clone(keyBitLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield util.generateKey(this.p, keyBitLength);
            return new Cipher(this.prime, Buffer.from(key.toString(16), 'hex'));
        });
    }
    // PUBLIC MEMBERS
    // --------------------------------------------------------------------------------------------
    get prime() {
        return Buffer.from(this.p.toString(16), 'hex');
    }
    get enkey() {
        return Buffer.from(this.e.toString(16), 'hex');
    }
    get dekey() {
        return Buffer.from(this.d.toString(16), 'hex');
    }
}
exports.Cipher = Cipher;
//# sourceMappingURL=index.js.map