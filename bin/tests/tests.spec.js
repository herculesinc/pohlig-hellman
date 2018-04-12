'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const ph = require("../index");
const index_1 = require("../index");
const util = require("../util");
const DATA = 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.';
const DATA_BUFFER = Buffer.from(DATA);
let prime, key1, key2, key12;
let c1, c2, c3, e1, e2, d1, d2, d12;
mocha_1.describe('tests;', done => {
    mocha_1.before(() => __awaiter(this, void 0, void 0, function* () {
        prime = util.getPrime('modp2048');
        key1 = yield util.generateKey(prime);
        key2 = yield util.generateKey(prime);
        key12 = ph.mergeKeys(key1, key2);
        chai_1.expect(prime).to.be.an.instanceof(Buffer);
        chai_1.expect(key1).to.be.an.instanceof(Buffer);
        chai_1.expect(key2).to.be.an.instanceof(Buffer);
        chai_1.expect(key12).to.be.an.instanceof(Buffer);
        chai_1.expect(key1.toString()).to.not.equal(key2.toString());
        chai_1.expect(key1.toString()).to.not.equal(key12.toString());
        chai_1.expect(key2.toString()).to.not.equal(key12.toString());
    }));
    mocha_1.beforeEach(() => {
        c1 = new index_1.Cipher(prime, key1);
        c2 = new index_1.Cipher(prime, key2);
        c3 = new index_1.Cipher(prime, key12);
    });
    mocha_1.it('encrypt: data -> e1', () => {
        e1 = c1.encrypt(DATA_BUFFER);
        chai_1.expect(e1).to.be.an.instanceof(Buffer);
        chai_1.expect(e1).to.not.equal(DATA_BUFFER);
        chai_1.expect(e1.toString()).to.not.equal(DATA);
    });
    mocha_1.it('make sure e1 decrypts back to data', () => {
        d1 = c1.decrypt(e1);
        chai_1.expect(d1).to.be.an.instanceof(Buffer);
        chai_1.expect(d1.toString()).to.equal(DATA);
    });
    mocha_1.it('encrypted: e1 -> e2', () => {
        e2 = c2.encrypt(e1);
        chai_1.expect(e2).to.be.an.instanceof(Buffer);
        chai_1.expect(e2).to.not.equal(DATA_BUFFER);
        chai_1.expect(e2).to.not.equal(e1);
        chai_1.expect(e2.toString()).to.not.equal(DATA);
        chai_1.expect(e2.toString()).to.not.equal(e1.toString());
    });
    mocha_1.it('make sure e1 decrypts back into e2', () => {
        d2 = c2.decrypt(e2);
        chai_1.expect(d2).to.be.an.instanceof(Buffer);
        chai_1.expect(d2.toString()).to.equal(e1.toString());
        chai_1.expect(d2.toString()).to.not.equal(DATA);
    });
    mocha_1.it('decrypt e2 directly into data using the merged key', () => {
        d12 = c3.decrypt(e2);
        chai_1.expect(d12).to.be.an.instanceof(Buffer);
        chai_1.expect(d12.toString()).to.equal(DATA);
    });
});
//# sourceMappingURL=tests.spec.js.map