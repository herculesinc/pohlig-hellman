// IMPORTS
// ================================================================================================
import {BigInteger} from 'jsbn';
import * as util from './util';
import {ModpGroup, PrimeLength, bigIntToBuffer, bufferToBigInt, BIG_INT_ONE} from './util';

// PUBLIC FUNCTIONS
// ================================================================================================
export async function createCipher(): Promise<Cipher>;
export async function createCipher(primeLength: PrimeLength): Promise<Cipher>;
export async function createCipher(modpGroup: ModpGroup): Promise<Cipher>;
export async function createCipher(lengthOrGroup?: PrimeLength | ModpGroup): Promise<Cipher> {

    let prime: Buffer;
    if (typeof lengthOrGroup === 'number') {
        prime = await util.generateSafePrime(lengthOrGroup);
    }
    else if (typeof lengthOrGroup === 'string') {
        prime = util.getPrime(lengthOrGroup);
    }
    else if (lengthOrGroup === null || lengthOrGroup === undefined) {
        prime = util.getPrime('modp2048');
    }

    const key = await util.generateKey(prime);

    return new Cipher(prime, key);
}

export function mergeKeys(key1: Buffer, key2: Buffer): Buffer {
    // TODO: validate parameters
    const k1 = bufferToBigInt(key1);
    const k2 = bufferToBigInt(key2);
    const k12 = k1.multiply(k2);
    return bigIntToBuffer(k12);
}

// CIPHER DEFINITION
// ================================================================================================
export class Cipher {

    private p: Buffer;  // prime
    private e: Buffer;  // encryption key
    private d: Buffer;  // decryption key

    private biP: BigInteger;  // prime
    private biE: BigInteger;  // encryption key
    private biD: BigInteger;  // decryption key

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(prime: Buffer, enkey: Buffer) {
        // TODO: validate parameters
        this.p   = prime;
        this.biP = bufferToBigInt(prime);

        this.e   = enkey;
        this.biE = bufferToBigInt(enkey);

        this.biD = this.biE.modInverse(this.biP.subtract(BIG_INT_ONE));
        this.d   = bigIntToBuffer(this.biD);
        // TODO: implement validity checking for p, e, and d
    }

    // PUBLIC FUNCTIONS
    // --------------------------------------------------------------------------------------------
    encrypt(data: Buffer): Buffer {
        // TODO: validate parameters
        const m = bufferToBigInt(data);
        const c = m.modPow(this.biE, this.biP);
        return bigIntToBuffer(c);
    }

    decrypt(data: Buffer): Buffer {
        // TODO: validate parameters
        const c = bufferToBigInt(data);
        const m = c.modPow(this.biD, this.biP);
        return bigIntToBuffer(m);
    }

    async clone(keyBitLength?: number): Promise<Cipher> {
        const key = await util.generateKey(this.p, keyBitLength);
        return new Cipher(this.p, key);
    }

    // PUBLIC MEMBERS
    // --------------------------------------------------------------------------------------------
    get prime(): Buffer {
        return this.p;
    }

    get enkey(): Buffer {
        return this.e;
    }

    get dekey(): Buffer {
        return this.d;
    }
}
