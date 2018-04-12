'use strict';
import {describe, it, before, beforeEach} from 'mocha';
import {expect} from 'chai';

import * as ph from '../index';
import {Cipher} from '../index';
import * as util from '../util';

const DATA = 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.';
const DATA_BUFFER = Buffer.from(DATA);

let prime, key1, key2, key12;
let c1, c2, c3, e1, e2, d1, d2, d12;

describe('tests;', done => {

    before(async () => {
        prime = util.getPrime('modp2048');
        key1  = await util.generateKey(prime);
        key2  = await util.generateKey(prime);
        key12 = ph.mergeKeys(key1, key2);

        expect(prime).to.be.an.instanceof(Buffer);

        expect(key1).to.be.an.instanceof(Buffer);
        expect(key2).to.be.an.instanceof(Buffer);
        expect(key12).to.be.an.instanceof(Buffer);

        expect(key1.toString()).to.not.equal(key2.toString());
        expect(key1.toString()).to.not.equal(key12.toString());
        expect(key2.toString()).to.not.equal(key12.toString());
    });

    beforeEach(() => {
        c1 = new Cipher(prime, key1);
        c2 = new Cipher(prime, key2);
        c3 = new Cipher(prime, key12);
    });

    it('encrypt: data -> e1', () => {
        e1 = c1.encrypt(DATA_BUFFER);

        expect(e1).to.be.an.instanceof(Buffer);
        expect(e1).to.not.equal(DATA_BUFFER);
        expect(e1.toString()).to.not.equal(DATA);
    });

    it('make sure e1 decrypts back to data', () => {
        d1 = c1.decrypt(e1);

        expect(d1).to.be.an.instanceof(Buffer);
        expect(d1.toString()).to.equal(DATA);
    });

    it('encrypted: e1 -> e2', () => {
        e2 = c2.encrypt(e1);

        expect(e2).to.be.an.instanceof(Buffer);

        expect(e2).to.not.equal(DATA_BUFFER);
        expect(e2).to.not.equal(e1);

        expect(e2.toString()).to.not.equal(DATA);
        expect(e2.toString()).to.not.equal(e1.toString());
    });

    it('make sure e1 decrypts back into e2', () => {
        d2 = c2.decrypt(e2);

        expect(d2).to.be.an.instanceof(Buffer);
        expect(d2.toString()).to.equal(e1.toString());
        expect(d2.toString()).to.not.equal(DATA);
    });

    it('decrypt e2 directly into data using the merged key', () => {
        d12 = c3.decrypt(e2);

        expect(d12).to.be.an.instanceof(Buffer);
        expect(d12.toString()).to.equal(DATA);
    });
});
