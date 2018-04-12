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
// INTERFACES
// ================================================================================================
const ph = require("./../index");
// TEST RUNNER
// ================================================================================================
test().then(() => { console.log('done!'); });
// TEST FUNCTION
// ================================================================================================
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('-'.repeat(100));
            let start = Date.now();
            const c1 = yield ph.createCipher();
            console.log(`Created cipher in ${Date.now() - start} ms`);
            console.log(`Prime size: ${c1.prime.length * 8}, encryption key size: ${c1.enkey.length * 8}, decryption key size: ${c1.dekey.length * 8}`);
            // encrypt: data -> e1
            const data = 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. ';
            start = Date.now();
            const e1 = c1.encrypt(Buffer.from(data));
            console.log('-'.repeat(100));
            console.log(`Encrypted data in ${Date.now() - start} ms; e1 size is ${e1.length * 8} bits`);
            console.log('-'.repeat(100));
            // make sure e1 decrypts back to data
            start = Date.now();
            const d1 = c1.decrypt(e1);
            console.log(`Decrypted data in ${Date.now() - start} ms; success: ${d1.toString() === data}`);
            // encrypted: e1 -> e2
            const c2 = yield c1.clone();
            start = Date.now();
            const e2 = c2.encrypt(e1);
            console.log(`Encrypted data in ${Date.now() - start} ms; e2 size is ${e2.length * 8} bits`);
            console.log('-'.repeat(100));
            // make sure e1 decypts back into e2
            start = Date.now();
            const d2 = c2.decrypt(e2);
            console.log(`Decrypted data in ${Date.now() - start} ms; success: ${d2.toString('hex') === e1.toString('hex')}`);
            console.log('-'.repeat(100));
            // create a cipher that has a merged key of first and second encryption
            const key12 = ph.mergeKeys(c1.enkey, c2.enkey);
            const c3 = new ph.Cipher(c1.prime, key12);
            console.log(`Prime size: ${c3.prime.length * 8}, encryption key size: ${c3.enkey.length * 8}, decryption key size: ${c3.dekey.length * 8}`);
            // decrypt e2 directly into data using the mereged key
            start = Date.now();
            const d12 = c3.decrypt(e2);
            console.log(`Decrypted data in ${Date.now() - start} ms; success: ${d12.toString() === data}`);
        }
        catch (e) {
            console.log(e);
        }
    });
}
//# sourceMappingURL=run.js.map