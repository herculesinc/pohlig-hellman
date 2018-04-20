'use strict';
import {describe, it, before, beforeEach} from 'mocha';
import {expect} from 'chai';

import {Cipher, mergeKeys, createCipher} from '../index';
import * as util from '../util';

const DATA = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const DATA_BUFFER = Buffer.from(DATA);

let prime, key1, key2, key12;
let c1, c2, c3, e1, e2, d1, d2, d12;
let undef;

describe('tests;', () => {
    describe('encrypt - decrypt;', () => {
        before(async () => {
            prime = util.getPrime('modp2048');
            key1 = await util.generateKey(prime);
            key2 = await util.generateKey(prime);
            key12 = mergeKeys(key1, key2);

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

    describe('input validation;', () => {
        beforeEach(async () => {
            prime = util.getPrime('modp2048');
            key1 = await util.generateKey(prime);
            c1 = new Cipher(prime, key1);
        });

        describe('prime;', () => {
            [
                {prime: null, error: 'prime is null'},
                {prime: undef, error: 'prime is undefined'},
                {prime: 0},
                {prime: 100},
                {prime: '', type: 'emptyString'},
                {prime: 'abcde', type: 'String'},
                {prime: [prime], type: 'Array'},
                {prime: {prime}, type: 'Object'},
            ].forEach(({prime, type, error = 'prime is invalid'}) => {
                it(`new Cipher(${type || prime}, key);`, () => {
                    expect(() => new Cipher(prime, key1)).to.throw(TypeError, `Cannot create cipher: ${error}`);
                });
            });

            it(`new Cipher(wrongPrime, key);`, () => {
                expect(() => new Cipher(Buffer.from([]), key1)).to.throw(TypeError, 'Cannot create cipher: prime is not a prime');
            });
        });

        describe('enkey;', () => {
            [
                {key: null, error: 'enkey is null'},
                {key: undef, error: 'enkey is undefined'},
                {key: 0},
                {key: 100},
                {key: '', type: 'emptyString'},
                {key: 'string', type: 'String'},
                {key: [prime], type: 'Array'},
                {key: {prime}, type: 'Object'},
            ].forEach(({key, type, error = 'enkey is invalid'}) => {
                it(`new Cipher(prime, ${type || key});`, () => {
                    expect(() => new Cipher(prime, key)).to.throw(TypeError, `Cannot create cipher: ${error}`);
                });
            });

            it(`new Cipher(prime, invalidKey);`, () => {
                expect(() => new Cipher(prime, Buffer.from([]))).to.throw(Error, 'Cannot create cipher: the encryption key is invalid');
            });

            it(`new Cipher(prime, longKey);`, () => {
                expect(() => new Cipher(prime, prime)).to.throw(Error, 'Cannot create cipher: the encryption key is invalid');
            });
        });

        describe('encrypt;', () => {
            [
                {data: null, error: 'data is null'},
                {data: undef, error: 'data is undefined'},
                {data: 100},
                {data: '', type: 'emptyString'},
                {data: [prime], type: 'Array'},
                {data: {prime}, type: 'Object'},
                {data: formBufferWithBitLength(3000), type: 'largeBufferData', error: 'data is too large'},
                {data: formStringWithBitLength(3000), type: 'largeStringData', error: 'data is too large'}
            ].forEach(({data, type, error = 'data is invalid'}) => {
                it(`Cipher.encrypt(${type || data});`, () => {
                    expect(() => c1.encrypt(data)).to.throw(TypeError, `Cannot encrypt: ${error}`);
                });
            });

            describe('encrypt encoding;', () => {
                [
                    {encoding: null},
                    {encoding: '', type: 'emptyString'},
                    {encoding: ['utf8'], type: 'Array'},
                    {encoding: Buffer.from('string'), type: 'Buffer'}
                ].forEach(({encoding, type}) => {
                    it(`Cipher.encrypt(data, ${type || encoding});`, () => {
                        expect(() => c1.encrypt('data', encoding)).to.throw(TypeError, 'Cannot encrypt: encoding is invalid');
                    });
                });
            });
        });

        describe('decrypt;', () => {
            [
                {data: null, error: 'data is null'},
                {data: undef, error: 'data is undefined'},
                {data: 100},
                {data: '', type: 'emptyString'},
                {data: [prime], type: 'Array'},
                {data: {prime}, type: 'Object'},
                {data: formBufferWithBitLength(3000), type: 'largeBufferData', error: 'data is too large'},
                {data: formStringWithBitLength(3000), type: 'largeStringData', error: 'data is too large'}
            ].forEach(({data, type, error = 'data is invalid'}) => {
                it(`Cipher.decrypt(${type || data});`, () => {
                    expect(() => c1.decrypt(data)).to.throw(TypeError, `Cannot decrypt: ${error}`);
                });
            });

            describe('decrypt encoding;', () => {
                [
                    {encoding: null},
                    {encoding: '', type: 'emptyString'},
                    {encoding: 'utf8'},
                    {encoding: ['hex'], type: 'Array'},
                    {encoding: Buffer.from('string'), type: 'Buffer'}
                ].forEach(({encoding, type}) => {
                    it(`Cipher.decrypt(data, ${type || encoding});`, () => {
                        expect(() => c1.decrypt('data', encoding)).to.throw(TypeError, 'Cannot decrypt: encoding is invalid');
                    });
                });
            });
        });

        describe('mergeKeys;', () => {
            [
                {key: null, error: 'is null'},
                {key: undef, error: 'is undefined'},
                {key: 100},
                {key: '', type: 'emptyString'},
                {key: [prime], type: 'Array'},
                {key: {prime}, type: 'Object'},
                {key: Buffer.from(''), type: 'emptyBuffer'}
            ].forEach(({key, type, error = 'is invalid'}) => {
                it(`mergeKeys(${type || key}, ke2);`, () => {
                    expect(() => mergeKeys(key, key1)).to.throw(TypeError, `Cannot merge keys: key1 ${error}`);
                });

                it(`mergeKeys(key1, ${type || key});`, () => {
                    expect(() => mergeKeys(key1, key)).to.throw(TypeError, `Cannot merge keys: key2 ${error}`);
                });
            });
        });

        describe('createCipher;', () => {
            [
                {param: '', type: 'emptyString', error: 'Cannot get prime: modpGroup \'\' is invalid'},
                {param: 'abcde', error: 'Cannot get prime: modpGroup \'abcde\' is invalid'},
                {param: '2048', error: 'Cannot get prime: modpGroup \'2048\' is invalid'},
                {param: 0, error: 'todo'},
                {param: -1024, error: 'todo'},
                {param: [], type: 'Array', error: 'todo'},
                {param: {}, type: 'Object', error: 'todo'},
                {param: Buffer.from(''), type: 'emptyBuffer', error: 'Cannot generate key: key length is too small'}
            ].forEach(({param, type, error}) => {
                it(`createCipher(${type || param});`, done => {
                    createCipher(param as any)
                        .then(done)
                        .catch(e => {
                            try {
                                expect(e).to.be.an.instanceof(TypeError);
                                expect(e.message).to.equal(error);
                                done();
                            } catch (error) {
                                done(error);
                            }
                        });
                });
            });
        });
    });
});

// helpers
function formBufferWithBitLength(bitLength: number): Buffer {
    return Buffer.alloc(bitLength >> 3, 'a', 'utf8');
}

function formStringWithBitLength(bitLength: number): string {
    return formBufferWithBitLength(bitLength).toString();
}
