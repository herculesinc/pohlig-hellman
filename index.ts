// IMPORTS
// ================================================================================================
import { BigInteger } from 'jsbn';
import * as util from './util';

// MODULE VARIABLES
// ================================================================================================
const SECURE_PRIME_LENGTH = 2048;
const MIN_PRIME_LENGTH = 4;     // min allowed bit length for the prime

// INTERFACES
// ================================================================================================
type ModpGroup = util.ModpGroup;
type PlaintextEncoding = 'hex' | 'base64' | 'utf8';
type CiphertextEncoding = 'hex' | 'base64';

// PUBLIC FUNCTIONS
// ================================================================================================
export async function createCipher(): Promise<Cipher>;
export async function createCipher(buffer: Buffer): Promise<Cipher>;
export async function createCipher(primeLength: number): Promise<Cipher>;
export async function createCipher(modpGroup: ModpGroup): Promise<Cipher>;
export async function createCipher(groupPrimeOrLength?: ModpGroup | Buffer | number): Promise<Cipher> {

    let prime: Buffer;
    if (Buffer.isBuffer(groupPrimeOrLength)) {
        prime = groupPrimeOrLength;
    }
    else if (typeof groupPrimeOrLength === 'number') {
        if (groupPrimeOrLength < MIN_PRIME_LENGTH) {
            throw new TypeError('Cannot create cipher: prime length is too small');
        }
        prime = await util.generateSafePrime(groupPrimeOrLength);
    }
    else if (typeof groupPrimeOrLength === 'string') {
        prime = util.getPrime(groupPrimeOrLength);
    }
    else if (groupPrimeOrLength === null || groupPrimeOrLength === undefined) {
        prime = util.getPrime('modp2048');
    }
    else {
        throw new TypeError('Cannot create cipher: prime is invalid');
    }

    const key = await util.generateKey(prime);

    return new Cipher(prime, key);
}

export function mergeKeys(key1: Buffer, key2: Buffer): Buffer {
    // validate key1
    if (key1 === undefined || key1 === null) {
        throw new TypeError(`Cannot merge keys: key1 is ${key1}`);
    }
    else if (!Buffer.isBuffer(key1)) {
        throw new TypeError('Cannot merge keys: key1 is invalid');
    }
    else if (key1.byteLength === 0) {
        throw new TypeError('Cannot merge keys: key1 is invalid');
    }

    // validate key2
    if (key2 === undefined || key2 === null) {
        throw new TypeError(`Cannot merge keys: key2 is ${key2}`);
    }
    else if (!Buffer.isBuffer(key2)) {
        throw new TypeError('Cannot merge keys: key2 is invalid');
    }
    else if (key2.byteLength === 0) {
        throw new TypeError('Cannot merge keys: key2 is invalid');
    }

    // convert keys to BigInts
    const k1 = util.bufferToBigInt(key1);
    const k2 = util.bufferToBigInt(key2);

    // multiply and return
    const k12 = k1.multiply(k2);
    return util.bigIntToBuffer(k12);
}

// CIPHER DEFINITION
// ================================================================================================
export class Cipher {

    readonly prime: Buffer; // prime (Buffer)
    readonly enkey: Buffer; // encryption key (Buffer)
    readonly dekey: Buffer; // decryption key (Buffer)

    private p: BigInteger;  // prime (BigInt)
    private e: BigInteger;  // encryption key (BigInt)
    private d: BigInteger;  // decryption key (BigInt)

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(prime: Buffer, enkey: Buffer) {
        // validate prime parameter
        if (prime === undefined || prime === null) {
            throw new TypeError(`Cannot create cipher: prime is ${prime}`);
        }
        else if (!Buffer.isBuffer(prime)) {
            throw new TypeError('Cannot create cipher: prime is invalid');
        }

        // validate enkey parameter
        if (enkey === undefined || enkey === null) {
            throw new TypeError(`Cannot create cipher: enkey is ${enkey}`);
        }
        else if (!Buffer.isBuffer(enkey)) {
            throw new TypeError('Cannot create cipher: enkey is invalid');
        }

        // set prime
        this.prime = prime;
        this.p = util.checkPrime(this.prime);
        if (!this.p) {
            throw new TypeError('Cannot create cipher: prime is not a prime');
        }
        else if (this.p.bitLength() < SECURE_PRIME_LENGTH) {
            if (this.p.bitLength() < MIN_PRIME_LENGTH) {
                throw new TypeError('Cannot create cipher: prime is too small');
            }
            console.warn('The prime you are using is too small for secure encryption');
        }

        // set encryption key
        this.enkey = enkey;
        this.e = util.bufferToBigInt(enkey);
        if (!util.isValidKey(this.p, this.e)) {
            throw new Error('Cannot create cipher: the encryption key is invalid');
        }

        // calculate and set decryption key
        this.d = this.e.modInverse(this.p.subtract(BigInteger.ONE));
        this.dekey = util.bigIntToBuffer(this.d);
    }

    // PUBLIC FUNCTIONS
    // --------------------------------------------------------------------------------------------
    encrypt(data: Buffer | string, encoding?: PlaintextEncoding): Buffer {
        if (data === undefined || data === null) {
            throw new TypeError(`Cannot encrypt: data is ${data}`);
        }
        else if (data === '') {
            throw new TypeError(`Cannot encrypt: data is an empty string`);
        }

        // prepare the data
        let buf: Buffer;
        if (Buffer.isBuffer(data)) {
            buf = data;
        }
        else if (typeof data === 'string') {
            if (encoding === undefined) {
                encoding = 'utf8';
            }
            
            if (encoding !== 'utf8' && encoding !== 'hex' && encoding !== 'base64') {
                throw new TypeError('Cannot encrypt: encoding is invalid');
            }
            buf = Buffer.from(data, encoding);
        }
        else {
            throw new TypeError('Cannot encrypt: data is invalid');
        }

        // convert data to numeric representation and make sure it is not bigger than prime
        const m = util.bufferToBigInt(buf);
        if (m.compareTo(this.p) >= 0) {
            throw new TypeError('Cannot encrypt: data is too large');
        }

        // encrypt and return buffer
        const c = m.modPow(this.e, this.p);
        return util.bigIntToBuffer(c);
    }

    decrypt(data: Buffer | string, encoding?: CiphertextEncoding): Buffer {
        if (data === undefined || data === null) {
            throw new TypeError(`Cannot decrypt: data is ${data}`);
        }

        // prepare the data
        let buf: Buffer;
        if (Buffer.isBuffer(data)) {
            buf = data;
        }
        else if (typeof data === 'string') {
            if (data === '') {
                throw new TypeError(`Cannot decrypt: data is an empty string`);
            }

            if (encoding === undefined) {
                encoding = 'hex';
            }
            
            if (encoding !== 'hex' && encoding !== 'base64') {
                throw new TypeError('Cannot decrypt: encoding is invalid');
            }
            buf = Buffer.from(data, encoding);
        }
        else {
            throw new TypeError('Cannot decrypt: data is invalid');
        }

        // convert buffer to bigint and check the size
        const c = util.bufferToBigInt(buf);
        if (c.bitLength() > this.p.bitLength()) {
            throw new TypeError('Cannot decrypt: data is too large');
        }

        // decrypt and return the buffer
        const m = c.modPow(this.d, this.p);
        return util.bigIntToBuffer(m);
    }
}
